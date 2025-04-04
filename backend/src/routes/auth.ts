import { Hono } from "hono";
import { User} from "../models/user.model.ts";
import { type JwtVariables, sign } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";
import { HTTPException } from "hono/http-exception";
import { validateJsonMiddleware } from "../utils/validators.ts";
import { z } from "zod";
import { jwtMiddleware } from "../middleware/jwtMiddleware.ts";



async function hash(password: string) {
    return Bun.password.hash(password);
}

async function verify(password: string, hashed: string) {
    return Bun.password.verify(password, hashed);
}

const authRoutes = new Hono<{ Variables: JwtVariables }>()
    .post(
        "/registerStudent",
        validateJsonMiddleware(
            z.object({
                email: z.string().email(),
                password: z.string().min(6),
                name: z.string().min(2),
                school: z.string().min(2),
            })
        ),
        async (c) => {
            const { email, password, name, school } = c.req.valid("json");

            const existing = await User.exists({ email }).lean();
            if (existing) {
                throw new HTTPException(409, { message: "This email is already registered! Please login or use a different email." });
            }
            
            try {
                const user = await User.create({
                    email,
                    password: await hash(password),
                    name,
                    role: "student",
                    school: school,
                    game_profile: {
                        game_points: 0,
                        game_minutes_left: 60,
                    },
                });

                const [token, error] = await getNewToken(user._id.toString());
                if (error) {
                    throw error;
                }

                return c.json({ token });
            } catch (error) {
                return c.text("Error: " + error, 400);
            }
        }
    )

    .post(
        "/registerAdmin",
        validateJsonMiddleware(
            z.object({
                email: z.string().email(),
                password: z.string().min(6),
                name: z.string().min(2),
                registerCode: z.string(),
                school: z.string().min(2).optional(),
            })
        ),
        async (c) => {
            const { email, password, name, registerCode, school } = await c.req.valid("json");

            const correctRegisterCode = await verify(registerCode, "$2b$12$AeoDtQlMHZiDRCWfdOpLTeCogW8hWetKmuaS6.sf1/1tGkra/I2AC");
            if (!correctRegisterCode) {
                return c.text("Invalid register code, please contact staff if you want to make an admin account!", 401);
            }

            const existing = await User.exists({ email }).lean();
            if (existing) {
                throw new HTTPException(409, { message: "This email is already registered! Please login or use a different email." });
            }
           
            try {
                const user = await User.create({
                    email,
                    password: await hash(password),
                    name,
                    role: "admin",
                    school: school,
                    game_profile: {
                        game_points: 0,
                        game_minutes_left: 60,
                    },
                    class_progress_info: []
                });
                console.log(user);

                const [token, error] = await getNewToken(user._id.toString());
                if (error) {
                    throw error;
                }

                return c.json({ token });
            } catch (error) {
                return c.text("Error: " + error, 400);
            }
        }
    )

    .post("/registerTeacher", async (c) => {
        const { email, password, name, school } = await c.req.json();
        if (!email || !password || !name) {
            return c.text("Email, password and name are required", 400);
        }

        const existing = await User.exists({ email }).lean();
        if (existing) {
            throw new HTTPException(409, { message: "This email is already registered! Please login or use a different email." });
        }
       
        try {
            const user = await User.create({
                email,
                password: await hash(password),
                name,
                role: "teacher",
                school,
                game_profile: {
                    game_points: 0,
                    game_minutes_left: 60,
                },
            });

            const [token, error] = await getNewToken(user._id.toString());
            if (error) {
                throw error;
            }

            return c.json({ token });
        } catch (error) {
            return c.text("Error: " + error, 400);
        }
    })

    .post(
        "/login",
        validateJsonMiddleware(
            z.object({
                email: z.string().email(),
                password: z.string(), // Purposefully not validating password length here
            })
        ),
        async (c) => {
            const { email, password } = await c.req.json();
            if (!email || !password) {
                return c.text("Email and password are required", 400);
            }

            const user = await User.findOne({ email }).lean();

            if (!user) {
                return c.text("Invalid email", 401);
            }
            const correctPassword = await verify(password, user.password);
            if (!correctPassword) {
                return c.text("Invalid password", 401);
            }

            const [token, error] = await getNewToken(user._id.toString());

            if (error) {
                throw error;
            } else {
                return c.json({ token });
            }
        }
    )

    .get("/profile", jwtMiddleware, async (c) => {
        const payload: {
            id: string;
            exp: number;
        } = await c.get("jwtPayload");
        if (!payload.id) {
            return c.text("Invalid token", 401);
        }

        const user = await User.findById(payload.id).lean();
        if (!user) {
            return c.text("User does not exist", 401);
        }
        
        const { password:_, ...userWithoutPassword } = user;
        return c.json(userWithoutPassword);
    })

    .put("/updatePassword", jwtMiddleware, validateJsonMiddleware(z.object({
        oldPassword: z.string().min(6),
        password: z.string().min(6),
    })), async (c) => {
        const payload: {
            id: string;
            exp: number;
        } = await c.get("jwtPayload");

        if (!payload.id) {
            return c.text("Unauthorized", 401);
        }

        const user = await User.findById(payload.id).select("password");
        if (!user) {
            return c.text("User does not exist", 401);
        }

        const { oldPassword, password } = await c.req.valid("json");

        const correctPassword = await verify(oldPassword, user.password);
        if (!correctPassword) {
            return c.text("Invalid old password!", 401);
        }

        user.password = await hash(password);
        await user.save();
        return c.text("Password updated successfully");
    })


export default authRoutes;


export async function getNewToken(userId: string): Promise<[string | undefined, HTTPException | undefined]> {
    const secret = Bun.env.JWT_SECRET;
    if (!secret) {
        return [undefined, new HTTPException(500, { message: "Internal Error: JWT_SECRET is not defined in environment variables" })];
    }

    const payload: JWTPayload = {
        id: userId,
        exp: Date.now() + 1000 * 60 * 60 * 24, // 1 day
    };

    const token = await sign(payload, secret);
    return [token, undefined];
}
