import { Hono } from "@hono/hono"
// import type { HydratedDocument } from "mongoose";
import { ExerciseSchema, LessonSchema, Unit, UnitSchema } from "../models/unit.model.ts";
import type { ILesson } from "../models/unit.model.ts";
import { schemaValidatorFromMongoose } from "../utils/customFunction.ts";
import { jwtMiddleware } from "./auth.ts";
import type { JwtVariables } from "@hono/hono/jwt";
import { User, type IUser } from "../models/user.model.ts";


// TODO: Future, make sure to update reduandent unit information on classroom and student when making changes to units


export const unitRoutes = new Hono<{ Variables: JwtVariables }>()
    .get("/single/nonPremium/:id", async (c) => {
        const unit = await Unit.findById(c.req.param("id")).lean();
        if (unit?.is_premium) {
            return c.text("This unit is premium", 403);
        }
        return c.json(unit);
    })
    .get("/all", jwtMiddleware, async (c) => {
        const units = await Unit.find().lean();
        return c.json(units);
    })
    .get("/single/:id", jwtMiddleware, async (c) => {
        console.log("Not this one")
        const unit = await Unit.findById(c.req.param("id")).lean();
        return c.json(unit);
    })
    .get("all/nonPremium", async (c) => {
        const units = await Unit.find({is_premium: false}).lean();
        return c.json(units);
    })
    
    .post("/create", jwtMiddleware, schemaValidatorFromMongoose(UnitSchema), async (c) => {
        const {name, description, difficulty, skills, related_units, prerequisites, is_premium} = c.req.valid("json");

        const payload: {
            id: string,
            exp: number
        } = await c.get('jwtPayload')

        const user = await User.findById(payload.id).select('role').lean();
        if (!user) {
            return c.text('Invalid user', 400);
        }

        if (user.role !== 'admin') {
            return c.text('Only admins can create units', 403);  
        }

        const unit = new Unit({ name, description, difficulty, skills, related_units, prerequisites, is_premium });
        await unit.save();
        return c.json(unit);
    })
    .post("/lesson/create", jwtMiddleware, schemaValidatorFromMongoose(LessonSchema, "lesson"),  async (c) => {
        const {unit_id, lesson}: {
            unit_id: string,
            lesson: ILesson
        } = await c.req.json().catch(() => (
            c.text('Invalid JSON', 400)
        ))

        const payload: {
            id: string,
            exp: number
        } = await c.get('jwtPayload')

        const user = await User.findById(payload.id).select('role').lean();
        if (!user) {
            return c.text('Invalid user', 400);
        }

        if (user.role !== 'admin') {
            return c.text('Only admins can create lessons', 403);  
        }

        const unit = await Unit.findById(unit_id);
        if (!unit) {
            return c.text('Invalid unit ID', 400);
        }
        
        unit.lessons.push(lesson);
        await unit.save();
        return c.json(unit);
    })
    .post("/exercise/create", jwtMiddleware, schemaValidatorFromMongoose(ExerciseSchema, "exercise"), async (c) => {
        const {unit_id, exercise} = await c.req.json().catch(() => (
            c.text('Invalid JSON', 400)
        ))

        const payload: {
            id: string,
            exp: number
        } = await c.get('jwtPayload')

        const user = await User.findById(payload.id).select('role').lean();
        if (!user) {
            return c.text('Invalid user', 400);
        }

        if (user.role !== 'admin') {
            return c.text('Only admins can create exercises', 403);
        }


        const unit = await Unit.findById(unit_id);
        if (!unit) {
            return c.text('Invalid unit ID', 400);
        }

        unit.exercises.push(exercise);
        await unit.save();
        return c.json(unit);
    });


