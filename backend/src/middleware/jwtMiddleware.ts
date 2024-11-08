import { jwt } from 'hono/jwt';

export const jwtMiddleware = jwt({
    secret: Bun.env.JWT_SECRET || "secret",
});
