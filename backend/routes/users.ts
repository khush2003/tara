import { Hono } from "@hono/hono"


const expenseRoute = new Hono()
    .get("/", (c) => {
        return c.text("Welcome to user routes!")
    });

export default expenseRoute;

