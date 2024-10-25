import { Hono } from "@hono/hono"
// import type { HydratedDocument } from "mongoose";
import { schemaValidatorFromMongoose } from "../utils/customFunction.ts";
import { PointsLog, PointsLogSchema, type IPointsLog } from "../models/pointslog.model.ts";
import { User } from "../models/user.model.ts";
import type { JwtVariables } from "@hono/hono/jwt";

// All routes in pointslogRoutes have jwtMiddleware applied, to ensure that only authenticated users can access them

// TODO: Future, add checks on each endpoint to ensure that only the appropriate users can access them, so that no other authenticated user can alter another user's information

export const pointslogRoutes = new Hono<{ Variables: JwtVariables }>()
    .post("/create", schemaValidatorFromMongoose(PointsLogSchema, "pointslog"), async (c) => {
        const { pointslog }: {
            pointslog: IPointsLog
        } = c.req.valid("json");

        const userId = pointslog.user;
        const user = await User.findById(userId).select('game_profile');
        if (!user) {
            return c.text('User does not exist', 400);
        }
        
        if (pointslog.is_add){
            user.game_profile.game_points += pointslog.amount;
        }
        else {
            user.game_profile.game_points -= pointslog.amount;
        }
        const new_pointslog = new PointsLog(pointslog);

        try {
            await Promise.all([new_pointslog.save(), user.save()]);

            return c.json({pointslog: new_pointslog, user: user, message: 'Pointslog created successfully!', instruction:"Update user's token"});
        }
        catch (error) {
            return c.text('Error: ' + error, 400);
        }
    })
    .get("/all/:userId/:classroomId", async (c) => {
        const userId = c.req.param('userId');
        const classroomId = c.req.param('classroomId');
        try {
            const pointslogs = await PointsLog.find({ user: userId, classroom: classroomId }).lean();
            return c.json(pointslogs);
        } catch (error) {
            return c.text('Error: ' + error, 400);
        }
    })
    .get("/all/:userId", async (c) => {
        const userId = c.req.param('userId');
        try {
            const pointslogs = await PointsLog.find({ user: userId }).lean();
            return c.json(pointslogs);
        } catch (error) {
            return c.text('Error: ' + error, 400);
        }
    })
    .get("/all/classroom/:classroomId", async (c) => {
        const classroomId = c.req.param('classroomId');
        try {
            const pointslogs = await PointsLog.find({ classroom: classroomId }).lean();
            return c.json(pointslogs);
        } catch (error) {
            return c.text('Error: ' + error, 400);
        }
    })
    .get("/all/classroom/extra_points/:classroomId", async (c) => {
        const classroomId = c.req.param('classroomId');
        try {
            const pointslogs = await PointsLog.find({ classroom: classroomId, type: 'extra_points' }).lean();
            return c.json(pointslogs);
        } catch (error) {
            return c.text('Error: ' + error, 400);
        }
    })
    .get("/all", async (c) => {
        try {
            const pointslogs = await PointsLog.find().lean();
            return c.json(pointslogs);
        } catch (error) {
            return c.text('Error: ' + error, 400);
        }
    })
    .get("/single/:id", async (c) => {
        const id = c.req.param('id');
        try {
            const pointslog = await PointsLog.findById(id).lean();
            return c.json(pointslog);
        } catch (error) {
            return c.text('Error: ' + error, 400);
        }
    })
    .put("/:id", schemaValidatorFromMongoose(PointsLogSchema, "pointslog"), async (c) => {
        const id = c.req.param('id');
        const { pointslog }: {
            pointslog: IPointsLog
        } = c.req.valid("json");
        try {
            await PointsLog.findByIdAndUpdate(id, pointslog, {new: true}).lean();
            return c.text('Pointslog updated successfully');
        } catch (error) {
            return c.text('Error: ' + error, 400);
        }
    })
    .delete("/:id", async (c) => {
        const id = c.req.param('id');
        try {
            await PointsLog.findByIdAndDelete(id).lean();
            return c.text('Pointslog deleted successfully');
        } catch (error) {
            return c.text('Error: ' + error, 400);
        }
    });

