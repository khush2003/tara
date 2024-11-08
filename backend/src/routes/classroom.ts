import { Hono } from "hono";
import {  schemaValidatorFromMongoose, validateJsonMiddleware } from "../utils/validators.ts";
import { Classroom, ClassroomSchema, type IClassroom } from "../models/classroom.model.ts";
import { User } from "../models/user.model.ts";
import type { JwtVariables } from "hono/jwt";
import type { ObjectId } from "mongoose";
import { Unit } from "../models/unit.model.ts";

import { z } from "zod";

const createUniqueClassroomCode = async () => {
    const classroomCode = Math.floor(100000 + Math.random() * 900000);
    // Check if the classroom code is unique
    const existing = await Classroom.findOne({ class_join_code: classroomCode });
    if (!existing) {
        return classroomCode;
    }
    return createUniqueClassroomCode();
};

// All routes in classroomRoutes have jwtMiddleware applied

// Generally speaking, there should be a check in all put ans post routes to ensure that the user is a teacher, however, this is not required here as admins should also be allowed to do all those actions and student portal does not have access to these routes

export const classroomRoutes = new Hono<{ Variables: JwtVariables }>()
    .post("/create", schemaValidatorFromMongoose(ClassroomSchema, "classroom"), async (c) => {
        const {
            classroom,
        }: {
            classroom: IClassroom;
        } = c.req.valid("json");

        const payload: {
            id: string;
            exp: number;
        } = await c.get("jwtPayload");

        if (!payload.id) {
            return c.text("Invalid user", 400);
        }

        const user = await User.findById(payload.id).select(["role", "classroom", "name"]);
        if (!user) {
            return c.text("Invalid user", 400);
        }

        if (user.role !== "teacher") {
            return c.text("Only teachers can create classrooms", 403);
        }

        const classroomCode = await createUniqueClassroomCode();
        classroom.class_join_code = classroomCode;
        classroom.teachers_joined = [{ teacher: user.id, name: user.name }];
        classroom.creator = user.id;
        const new_classroom = new Classroom(classroom);


        user.classroom.push(new_classroom.id);

        try {
            await Promise.all([new_classroom.save(), user.save()]);
            return c.json(new_classroom);
        } catch (error) {
            return c.text("Error: " + error, 400);
        }
    })
    .post("/join/:code", async (c) => {
        const payload: {
            id: string;
            exp: number;
        } = await c.get("jwtPayload");

        const code = c.req.param("code");
        const classroom = await Classroom.findOne({ class_join_code: code }).select(["id", "students_enrolled"]);
        if (!classroom) {
            return c.text("Invalid classroom code", 400);
        }

        const db_user = await User.findById(payload.id).select(["id", "classroom"]);
        if (!db_user) {
            return c.text("Invalid user", 400);
        }

        const existing = classroom.students_enrolled.find((student) => student.student.toString() === db_user._id.toString());
        if (existing) {
            return c.text("You are already enrolled in this classroom", 400);
        }
        classroom.students_enrolled.push({ student: db_user.id, is_new_exercise_submission: false });
        db_user.classroom.push(classroom.id);

        // Parallel save for performance
        await Promise.all([classroom.save(), db_user.save()]);
        return c.json({classroom, user: db_user});
    })

    .get("/:id", async (c) => {
        const id = c.req.param("id");
        try {
            const classroom = await Classroom.findById(id);
            return c.json(classroom);
        } catch (error) {
            const e = error as Error;
            if (e.name === "CastError") {
                return c.text("Invalid ID", 400);
            }
            throw error;
        }
    })

    .post("/multiple", validateJsonMiddleware(z.object({
        ids: z.array(z.string()),
    })), async (c) => {
        const { ids } = await c.req.valid("json");
        try {
            const classrooms = await Classroom.find({ _id: { $in: ids } });
            return c.json(classrooms);
        } catch {
            return c.text("Invalid IDs", 400);
        }
    })

    .put(
        "/setTodayUnit/:id",
        validateJsonMiddleware(
            z.object({
                title: z.string(),
                unit: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
                    message: "Unit must be a string representing unit id",
                }),
            })
        ),
        async (c) => {
            const id = c.req.param("id");

            const { title, unit } = await c.req.valid("json");

            const classroom = await Classroom.findById(id).select(["id", "today_unit"]);
            if (!classroom) {
                return c.text("Invalid ID", 400);
            }
            classroom.today_unit = { title, unit };
            await classroom.save();
            return c.json(classroom);
        }
    )

    .put("/setAnnoucement/:id", validateJsonMiddleware(z.object({
        announcement: z.string(),
    })), async (c) => {
        const id = c.req.param("id");
        const { announcement } = await c.req.valid("json");
        
        const classroom = await Classroom.findById(id).select(["id", "announcement", "is_recently_updated_announcement"]);
        if (!classroom) {
            return c.text("Invalid ID", 400);
        }
        classroom.announcement = announcement;
        classroom.is_recently_updated_announcement = true;
        await classroom.save();
        return c.json(classroom);
    })

    .put("/setGameBlock/:id", validateJsonMiddleware(z.object({
        is_game_blocked: z.boolean(),
    })) , async (c) => {
        const id = c.req.param("id");
        const { is_game_blocked } = await c.req.valid("json");

        const classroom = await Classroom.findById(id).select(["id", "is_game_blocked"]);
        if (!classroom) {
            return c.text("Invalid ID", 400);
        }
        classroom.is_game_blocked = is_game_blocked;
        await classroom.save();
        return c.json(classroom);
    })

    .put("/setGameRestrictionPeriod/:id", validateJsonMiddleware(z.object({
        // TODO: Future: Handle different time zones
        start: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
            message: "Invalid date format",
        }),
        end: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
            message: "Invalid date format",
        }),
    })) , async (c) => {
        const id = c.req.param("id");
        const { start, end } = await c.req.json();

        const classroom = await Classroom.findById(id).select(["id", "game_restriction_period"]);
        if (!classroom) {
            return c.text("Invalid ID", 400);
        }

        const startDate = new Date(start);
        const endDate = new Date(end);

        classroom.game_restriction_period = { start: startDate, end: endDate };
        await classroom.save();
        return c.json(classroom);
    })

    .put("/updateChosenUnits/:id", 
        validateJsonMiddleware(
            z.object({
                chosen_units: z.array(z.object({
                    name: z.string(),
                    description: z.string(),
                    difficulty: z.string(),
                    skills: z.array(z.string()),
                    unit: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
                        message: "Unit must be a string representing unit id",
                    }),
                })),
            })
        )
        ,async (c) => {
        const id = c.req.param("id");
        const { chosen_units } = await c.req.valid("json");
        const classroom = await Classroom.findById(id).select(["id", "chosen_units"]);

        if (!classroom) {
            return c.text("Invalid Classroom ID", 400);
        }

        const newUnits = [];
        for (const unit of chosen_units) {
            // Ensure unit is valid and exists
            const existingUnit = await Unit.exists({ _id: unit.unit }).lean();
            if (!existingUnit) {
                return c.text("Invalid unit id", 400);
            }
            newUnits.push(unit);
        }

        classroom.chosen_units = newUnits as [
            {
                name: string;
                description: string;
                difficulty: string;
                skills: string[];
                unit: ObjectId;
            }
        ];

        await classroom.save();
        return c.json(classroom);
    });
