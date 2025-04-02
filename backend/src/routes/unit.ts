import { Hono } from "hono";
// import type { HydratedDocument } from "mongoose";
import { ExerciseSchema, LessonSchema, Unit, UnitSchema, VARIENT_TYPE } from "../models/unit.model.ts";
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
        
        if (!user.classroom.find((classroomId) => classroomId.toString() === c.req.param("id"))) {
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
                    correct_answers: z.any(),
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
                    lesson_type: z.enum(["flashcard", "image", "text"]).optional(),
                    lesson_content: z.array(z.any()).optional(),
                    order: z.union([z.number(), z.string()]).transform((val) => parseInt(val.toString())).optional(),
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
            
            
            Object.keys(lesson).forEach((key) => {
                if (lesson[key] !== undefined) {
                    (unit.lessons[lessonIndex] as any)[key as keyof ILesson] = lesson[key as keyof ILesson];
                }
            });
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
                    ]).optional(),
                    exercise_content: z.array(z.any()).optional(),
                    is_instant_scored: z.boolean().optional(),
                    correct_answers: z.array(z.any()).optional(),
                    varients: z.array(z.string()).optional(),
                    max_score: z.union([z.number(), z.string()]).transform((val) => parseInt(val.toString())).optional(),
                    order: z.union([z.number(), z.string()]).transform((val) => parseInt(val.toString())).optional(),
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
            Object.keys(exercise).forEach((key) => {
                if (exercise[key] !== undefined) {
                    (unit.exercises[exerciseIndex] as any)[key as keyof typeof exercise] = exercise[key as keyof typeof exercise];
                }
            });
            await unit.save();
            return c.json(unit);
        }
    )
    .put("/assignVarients", jwtMiddleware, validateJsonMiddleware(z.object({
        exerciseId: z.string(),
        varients: z.array(z.string()),
        unitId: z.string()
    }))  ,async (c) => {
        const { exerciseId, varients, unitId } = await c.req.valid("json");

        const payload: {
            id: string;
            exp: number;
        } = await c.get("jwtPayload");

        const user = await User.findById(payload.id).select("role").lean();
        if (!user) {
            return c.text("Invalid user", 400);
        }

        if (user.role !== "admin") {
            return c.text("Only admins can assign varients", 403);
        }

        const unit = await Unit.findById(unitId);
        if (!unit) {
            return c.text("Invalid unit ID", 400);
        }

        const exerciseIndex = unit.exercises.findIndex((exercise) => exercise._id.toString() === exerciseId);
        if (exerciseIndex === -1) {
            return c.text("Invalid exercise ID", 400);
        }

        
        const createdVarients = [
            {
                id: exerciseId,
                type: VARIENT_TYPE.Base
            },
            ...varients.map((varient: string, index: number) => ({
                id: varient,
                type: [VARIENT_TYPE.Adventure, VARIENT_TYPE.Sports, VARIENT_TYPE.Science][index]
            })).filter((_varient: string, index: number) => varients[index])
        ];

        unit.exercises[exerciseIndex].varients = createdVarients;

        // get all varient exercises in the unit and assign the varients
        const varientExercises = unit.exercises.filter((exercise) => varients.includes(exercise._id.toString()));
        varientExercises.forEach((exercise) => {
            exercise.varients = createdVarients;
        }); 
        await unit.save();
        return c.json(unit);
    });
