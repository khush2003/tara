import { Hono } from "@hono/hono"
import { User } from "../models/user.model.ts";

const userRoutes = new Hono()
    .get("/", async (c) => {
        const users = await User.find();
        return c.json(users);
    });

export default userRoutes;

