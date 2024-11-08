import { Hono } from "hono";
// import type { HydratedDocument } from "mongoose";
import { ExerciseSchema, LessonSchema, Unit, UnitSchema } from "../models/unit.model.ts";
import type { ILesson } from "../models/unit.model.ts";
import { schemaValidatorFromMongoose, validateJsonMiddleware } from "../utils/validators.ts";
import { jwtMiddleware } from "../middleware/jwtMiddleware.ts";
import type { JwtVariables } from "hono/jwt";
import { User } from "../models/user.model.ts";
import { Classroom } from "../models/classroom.model.ts";
import { z } from "zod";

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
        const unit = await Unit.findById(c.req.param("id")).lean();
        return c.json(unit);
    })
    .get("all/nonPremium", async (c) => {
        const units = await Unit.find({ is_premium: false }).lean();
        return c.json(units);
    })
    .get("/all/classroom/:id", jwtMiddleware, async (c) => {
        const payload: {
            id: string;
            exp: number;
        } = await c.get("jwtPayload");

        const user = await User.findById(payload.id).select(["classroom"]).lean();
        if (!user) {
            return c.text("Invalid user", 400);
        }

        if (!user.classroom) {
            return c.text("User is not in a classroom", 400);
        }

        if (user.classroom.toString() !== c.req.param("id")) {
            return c.text("User is not in this classroom", 403);
        }

        const classroom = await Classroom.findById(c.req.param("id")).select(["chosen_units"]).lean();
        if (!classroom) {
            return c.text("Invalid classroom ID", 400);
        }
        console.log(classroom.chosen_units);
        const unitIds = classroom.chosen_units.map((chosenUnit) => chosenUnit.unit);
        const units = await Unit.find({ _id: { $in: unitIds } }).lean();
        return c.json(units);
    })

    .post("/create", jwtMiddleware, schemaValidatorFromMongoose(UnitSchema), async (c) => {
        const { name, description, difficulty, skills, related_units, prerequisites, is_premium } = c.req.valid("json");

        const payload: {
            id: string;
            exp: number;
        } = await c.get("jwtPayload");

        const user = await User.findById(payload.id).select("role").lean();
        if (!user) {
            return c.text("Invalid user", 400);
        }

        if (user.role !== "admin") {
            return c.text("Only admins can create units", 403);
        }

        const unit = new Unit({ name, description, difficulty, skills, related_units, prerequisites, is_premium });
        await unit.save();
        return c.json(unit);
    })
    .post("/lesson/create", jwtMiddleware, schemaValidatorFromMongoose(LessonSchema, "lesson"), async (c) => {
        const {
            unit_id,
            lesson,
        }: {
            unit_id: string;
            lesson: ILesson;
        } = await c.req.json().catch(() => c.text("Invalid JSON", 400));

        const payload: {
            id: string;
            exp: number;
        } = await c.get("jwtPayload");

        const user = await User.findById(payload.id).select("role").lean();
        if (!user) {
            return c.text("Invalid user", 400);
        }

        if (user.role !== "admin") {
            return c.text("Only admins can create lessons", 403);
        }

        const unit = await Unit.findById(unit_id);
        if (!unit) {
            return c.text("Invalid unit ID", 400);
        }

        unit.lessons.push(lesson);
        await unit.save();
        return c.json(unit);
    })
    .post(
        "/exercise/create",
        jwtMiddleware,
        validateJsonMiddleware(
            z.object({
                unit_id: z.string(),
                exercise: z.object({
                    title: z.string(),
                    description: z.string(),
                    instruction: z.string(),
                    exercise_type: z.enum([
                        "multiple_choice",
                        "crossword_puzzle",
                        "drag_and_drop",
                        "fill_in_the_blanks",
                        "images_with_input",
                        "text_with_input",
                        "text_with_questions",
                    ]),
                    exercise_content: z.array(z.any()),
                    is_instant_scored: z.boolean().optional(),
                    correct_answers: z.array(z.any()),
                    varients: z
                        .array(
                            z.object({
                                id: z.string(),
                                type: z.string(),
                            })
                        )
                        .optional(),
                    max_score: z.union([z.number(), z.string()]).transform((val) => parseInt(val.toString())),
                    order: z.union([z.number(), z.string()]).transform((val) => parseInt(val.toString())),
                    dropItems: z.array(z.any()).optional(),
                    image: z.string().optional(),
                    tags: z.array(z.string()).optional(),
                }),
            })
        ),
        async (c) => {
            const { unit_id, exercise } = await c.req.json().catch(() => c.text("Invalid JSON", 400));

            const payload: {
                id: string;
                exp: number;
            } = await c.get("jwtPayload");

            const user = await User.findById(payload.id).select("role").lean();
            if (!user) {
                return c.text("Invalid user", 400);
            }

            if (user.role !== "admin") {
                return c.text("Only admins can create exercises", 403);
            }

            const unit = await Unit.findById(unit_id);
            if (!unit) {
                return c.text("Invalid unit ID", 400);
            }

            unit.exercises.push(exercise);
            await unit.save();
            return c.json(unit);
        }
    )
    .put(
        "/lesson/update",
        jwtMiddleware,
        validateJsonMiddleware(
            z.object({
                unit_id: z.string(),
                lesson_id: z.string(),
                lesson: z.object({
                    title: z.string().optional(),
                    description: z.string().optional(),
                    instruction: z.string().optional(),
                    lesson_type: z.enum(["flashcard", "image", "text"]),
                    lesson_content: z.array(z.any()),
                    order: z.union([z.number(), z.string()]).transform((val) => parseInt(val.toString())),
                    image: z.string().optional(),
                    tags: z.array(z.string()).optional(),
                }),
            })
        ),
        async (c) => {
            const { unit_id, lesson_id, lesson } = await c.req.json().catch(() => c.text("Invalid JSON", 400));

            const payload: {
                id: string;
                exp: number;
            } = await c.get("jwtPayload");

            const user = await User.findById(payload.id).select("role").lean();
            if (!user) {
                return c.text("Invalid user", 400);
            }

            if (user.role !== "admin") {
                return c.text("Only admins can update lessons", 403);
            }

            const unit = await Unit.findById(unit_id);
            if (!unit) {
                return c.text("Invalid unit ID", 400);
            }

            const lessonIndex = unit.lessons.findIndex((lesson) => lesson._id.toString() === lesson_id);
            if (lessonIndex === -1) {
                return c.text("Invalid lesson ID", 400);
            }

            unit.lessons[lessonIndex] = lesson;
            await unit.save();
            return c.json(unit);
        }
    )
    .put(
        "/exercise/update",
        jwtMiddleware,
        validateJsonMiddleware(
            z.object({
                unit_id: z.string(),
                exercise_id: z.string(),
                exercise: z.object({
                    title: z.string().optional(),
                    description: z.string().optional(),
                    instruction: z.string().optional(),
                    exercise_type: z.enum([
                        "multiple_choice",
                        "crossword_puzzle",
                        "drag_and_drop",
                        "fill_in_the_blanks",
                        "images_with_input",
                        "text_with_input",
                        "text_with_questions",
                    ]),
                    exercise_content: z.array(z.any()),
                    is_instant_scored: z.boolean().optional(),
                    correct_answers: z.array(z.any()),
                    varients: z.array(z.string()).optional(),
                    max_score: z.union([z.number(), z.string()]).transform((val) => parseInt(val.toString())),
                    order: z.union([z.number(), z.string()]).transform((val) => parseInt(val.toString())),
                    dropItems: z.array(z.any()).optional(),
                    image: z.string().optional(),
                    tags: z.array(z.string()).optional(),
                }),
            })
        ),
        async (c) => {
            const { unit_id, exercise_id, exercise } = await c.req.json().catch(() => c.text("Invalid JSON", 400));

            const payload: {
                id: string;
                exp: number;
            } = await c.get("jwtPayload");

            const user = await User.findById(payload.id).select("role").lean();
            if (!user) {
                return c.text("Invalid user", 400);
            }

            if (user.role !== "admin") {
                return c.text("Only admins can update exercises", 403);
            }

            const unit = await Unit.findById(unit_id);
            if (!unit) {
                return c.text("Invalid unit ID", 400);
            }

            const exerciseIndex = unit.exercises.findIndex((exercise) => exercise._id.toString() === exercise_id);
            if (exerciseIndex === -1) {
                return c.text("Invalid exercise ID", 400);
            }

            unit.exercises[exerciseIndex] = exercise;
            await unit.save();
            return c.json(unit);
        }
    );
