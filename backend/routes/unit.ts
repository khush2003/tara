import { Hono } from "@hono/hono"
// import type { HydratedDocument } from "mongoose";
import { ExerciseSchema, LessonSchema, Unit, UnitSchema } from "../models/unit.model.ts";
import type { ILesson } from "../models/unit.model.ts";
import { schemaValidatorFromMongoose } from "../utils/customFunction.ts";
import { jwtMiddleware } from "./user.ts";


export const unitRoutes = new Hono()
    .get("/:id", async (c) => {
        const unit = await Unit.findById(c.req.param("id"));
        if (unit?.is_premium) {
            return c.text("This unit is premium", 403);
        }
        return c.json(unit);
    })
    .get("/all/:id", jwtMiddleware, async (c) => {
        const unit = await Unit.findById(c.req.param("id"));
        return c.json(unit);
    })
    .get("/all/list", jwtMiddleware, async (c) => {
        const units = await Unit.find();
        return c.json(units);
    })
    // TODO: Add authentication middleware to create routes in production
.post("/create", schemaValidatorFromMongoose(UnitSchema), async (c) => {
    const {name, description, difficulty, skills, related_units, prerequisites, is_premium} = c.req.valid("json");
    const unit = new Unit({ name, description, difficulty, skills, related_units, prerequisites, is_premium });
    await unit.save();
    return c.json(unit);
})
.post("/lesson/create", schemaValidatorFromMongoose(LessonSchema, "lesson"),  async (c) => {
    const {unit_id, lesson}: {
        unit_id: string,
        lesson: ILesson
    } = await c.req.json().catch(() => (
        c.text('Invalid JSON', 400)
    ))
    const unit = await Unit.findById(unit_id);
    if (!unit) {
        return c.text('Invalid unit ID', 400);
    }
    
    unit.lessons.push(lesson);
    await unit.save();
    return c.json(unit);
})
.post("/exercise/create", schemaValidatorFromMongoose(ExerciseSchema, "exercise"), async (c) => {
    const {unit_id, exercise} = await c.req.json().catch(() => (
        c.text('Invalid JSON', 400)
    ))
    const unit = await Unit.findById(unit_id);
    if (!unit) {
        return c.text('Invalid unit ID', 400);
    }
    unit.exercises.push(exercise);
    await unit.save();
    return c.json(unit);
});



