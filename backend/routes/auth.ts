import { Hono } from "@hono/hono"
import { User } from "../models/user.model.ts";

const authRoutes = new Hono()
    .get("/login", async (c) => {
        const users = await User.find();
        return c.json(users);
    });

export default authRoutes;

