import { Hono } from "@hono/hono"
import { User, type IUser } from "../models/user.model.ts";
import { jwt, type JwtVariables, sign } from '@hono/hono/jwt'
import type { JWTPayload } from "@hono/hono/utils/jwt/types";
import { hash, verify } from "@felix/bcrypt";
import { HTTPException } from "@hono/hono/http-exception";
import type { HydratedDocument } from "mongoose";

export const jwtMiddleware = jwt({
    secret: Deno.env.get('JWT_SECRET') || 'secret',
})

const authRoutes = new Hono<{ Variables: JwtVariables }>()
    .post("/registerStudent", async (c) => {
        const {email, password, name, school} = await c.req.json();
        if (!email || !password || !name) {
            return c.text('Email, password and name are required', 400);
        }

        const existing = await User.findOne({ email });
        if (existing) {
            throw new HTTPException(409, {message: 'This email is already registered! Please login or use a different email.'});
        }
        const user = new User({ email, password: await hash(password), name, role: 'student', school: school, game_profile: {
            game_points: 0,
            game_minutes_left: 60
        } });
        
        await user.save()
        return c.json(user);
    })

    .post("/login", async (c) => {

        const {email, password} = await c.req.json();
        if (!email || !password) {
            return c.text('Email and password are required', 400);
        }
        
        const user = await User.findOne({email});
        
        if (!user) {
            return c.text('Invalid email', 401);
        }
        const correctPassword = await verify(password, user.password);
        if (!correctPassword) {
            return c.text('Invalid password', 401);
        }

        const secret = Deno.env.get("JWT_SECRET");
        if (!secret) {
            return c.text('Internal Error: JWT_SECRET is not defined in environment variables', 500);
        }

        const payload: JWTPayload = {
            user: user,
            exp: Date.now() + 1000 * 60 * 60 * 24 // 1 day
        }

        console.log(secret);
        const token = await sign(payload, secret);
        return c.json({token});
    })

    .post("/registerTeacher", async (c) => {
        const {email, password, name, school} = await c.req.json();
        if (!email || !password || !name) {
            return c.text('Email, password and name are required', 400);
        }

        const existing = await User.findOne({ email });
        if (existing) {
            throw new HTTPException(409, {message: 'This email is already registered! Please login or use a different email.'});
        }
        const user = new User({ email, password: await hash(password), name, role: 'teacher', school: school, game_profile: {
            game_points: 0,
            game_minutes_left: 60
        } });
        
        await user.save()
        return c.json(user);
    })

    .get("/profile", jwtMiddleware, async (c) => {
        const payload: {
            user: IUser,
            exp: number
        } = await c.get('jwtPayload')
        if (!payload.user) {
            return c.text('Invalid token', 401);
        }
        return c.json(payload.user);
    })

    .put("/updatePassword", jwtMiddleware, async (c) => {
        const payload: {
            user: HydratedDocument<IUser>,
            exp: number
        } = await c.get('jwtPayload')
        if (!payload.user) {
            return c.text('Unauthorized', 401);
        }
        
        const user = await User.findById(payload.user._id);
        if (!user) {
            return c.text('User does not exist', 401);
        }

        const { oldPassword, password} = await c.req.json();
        if (!password || !oldPassword) {
            return c.text('Please enter your old and new passwords!', 400);
        }

        const correctPassword = await verify(oldPassword, user.password);
        if (!correctPassword) {
            return c.text('Invalid old password!', 401);
        }
        
        user.password = await hash(password);
        await user.save();
        return c.json(user);
    })


export default authRoutes;

// TODO: Block all unauthorized routes

