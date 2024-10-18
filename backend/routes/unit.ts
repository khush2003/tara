import { Hono } from "@hono/hono"
import type { HydratedDocument } from "mongoose";
import { LessonSchema, Unit, UnitSchema } from "../models/unit.model.ts";
import type { ILesson } from "../models/unit.model.ts";
import { schemaValidatorFromMongoose } from "../utils/customFunction.ts";


export const unitRoutes = new Hono()
.post("/create", schemaValidatorFromMongoose(UnitSchema), async (c) => {
    const {name, description, difficulty, skills, related_units, prerequisites} = c.req.valid("json");
    const unit = new Unit({ name, description, difficulty, skills, related_units, prerequisites });
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



