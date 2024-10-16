import { Hono } from "@hono/hono"
import { User, type IUser } from "../models/user.model.ts";
import { jwt, type JwtVariables } from '@hono/hono/jwt'
import type { HydratedDocument } from "mongoose";

export const jwtMiddleware = jwt({
    secret: Deno.env.get('JWT_SECRET') || 'secret',
})

const userRoutes = new Hono<{ Variables: JwtVariables }>()
    .get("/:id", async (c) => {
        const id = c.req.param('id');
        try {
            const user = await User.findById(id);
            return c.json(user);
        } catch (error) { 
            const e = error as Error;
            if (e.name === 'CastError') { 
                return c.text('Invalid ID', 400); 
            }
            throw error; 
        }
    });

export default userRoutes;

