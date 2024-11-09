import { Hono, type Env, type MiddlewareHandler } from 'hono';
import { secureHeaders } from 'hono/secure-headers';
import { apiReference } from '@scalar/hono-api-reference';
import openapi from './openapi.json' with { type: "json" };
import { connectMongoMiddleware } from './middleware/connectMongo.ts';
import { jwtMiddleware } from './middleware/jwtMiddleware.ts';
import userRoutes from './routes/user.ts';
import authRoutes from './routes/auth.ts';
import { unitRoutes } from './routes/unit.ts';
import { classroomRoutes } from './routes/classroom.ts';
import { pointslogRoutes } from './routes/pointslog.ts';
import { logger } from 'hono/logger';
import { imageRoutes } from './routes/image.ts';
import { cors } from 'hono/cors';

const app = new Hono();

// Middleware
app.use(logger());
app.use("/api/v1/user/setGameProfile", cors({
    origin: "*",
    allowMethods: ["PUT"],
    allowHeaders: ["Content-Type", "Authorization"],
}));
app.use("/api/v1/auth/profile", cors({
  origin: "*",
  allowMethods: ["GET"],
  allowHeaders: ["Content-Type", "Authorization"],
}));
app.use("/api/v1/user/get_opponent_data/opponent", cors({
  origin: "*",
  allowMethods: ["GET"],
  allowHeaders: ["Content-Type", "Authorization"],
}));
// app.use(secureHeaders());
app.use('*', connectMongoMiddleware);
app.use('/api/v1/user/*', jwtMiddleware);
app.use('/api/v1/classroom/*', jwtMiddleware);

// Routes
app.get('/api/v1', (c) => c.text('Welcome to the API of the Student Portal', 200));
app.get('/api/v1/reference', apiReference({ theme: 'saturn', spec: { url: 'openapi.json' } }) as unknown as MiddlewareHandler<Env>);
app.get('/openapi.json', (c) => c.json(openapi));
app.get('api/v1/openapi.json', (c) => c.json(openapi));
app.get('/reference', apiReference({ theme: 'alternate', spec: { url: 'openapi.json' } }) as unknown as MiddlewareHandler<Env>);
app.notFound((c) => c.text('404 Page or API Not Found', 404));

const apiRoutes = app.basePath('/api/v1')
  .route('/user', userRoutes)
  .route('/auth', authRoutes)
  .route('/unit', unitRoutes)
  .route('/classroom', classroomRoutes)
  .route('pointslog', pointslogRoutes)
  .route('/image', imageRoutes);

export { app, apiRoutes };
export type ApiRoutes  =  typeof apiRoutes;