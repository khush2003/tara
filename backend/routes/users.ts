import { Hono } from "@hono/hono"
import { User } from "../models/user.model.ts";
import { jwt, type JwtVariables } from '@hono/hono/jwt'

export const jwtMiddleware = jwt({
    secret: Deno.env.get('JWT_SECRET') || 'secret',
})

const userRoutes = new Hono<{ Variables: JwtVariables }>()
    .get("/", jwtMiddleware, async (c) => {
        const payload = c.get('jwtPayload')
        console.log(payload)
        const users = await User.find();
        return c.json(users);
    });

export default userRoutes;

