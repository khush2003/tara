import { Hono } from "hono";
import {  User, type IClassProgressInfo, type IExerciseSubmission, type IGameProfile } from "../models/user.model.ts";
import { type JwtVariables } from "hono/jwt";
import type { HydratedDocument } from "mongoose";
import {validateJsonMiddleware } from "../utils/validators.ts";
import mongoose from "mongoose";
import { Unit, type IExercise, type ILesson } from "../models/unit.model.ts";
import { Classroom } from "../models/classroom.model.ts";
import { PointsLog, PointsLogType } from "../models/pointslog.model.ts";
import { z } from "zod";
import type { FlattenMaps } from "mongoose";
// import type { HydratedDocument } from "mongoose";

// All routes in userRoutes have jwtMiddleware applied
// TODO: Future, add checks on each endpoint to ensure that only the appropriate users can access them, so that no other authenticated user can alter another user's information, for example accessing user information by ID should only be allowed for the user themselves or admins or teachers of the user's classroom

const userRoutes = new Hono<{ Variables: JwtVariables }>()
    .get("/:id", async (c) => {
        const id = c.req.param("id");
        try {
            const user = await User.findById(id);
            if (!user) {
                return c.text("Invalid ID", 400);
            }
            const { password: _, ...userWithoutPassword } = user.toObject() || {};
            return c.json(userWithoutPassword);
        } catch (error) {
            const e = error as Error;
            if (e.name === "CastError") {
                return c.text("Invalid ID", 400);
            }
            throw error;
        }
    })
    .post(
        "/multiple",
        validateJsonMiddleware(
            z.object({
                ids: z.array(z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" })),
            })
        ),
        async (c) => {
            const { ids } = await c.req.valid("json");
            try {
                const users = await User.find({ _id: { $in: ids } });
                const usersWithoutPasswords = users.map((user) => {
                    const { password: _, ...userWithoutPassword } = user.toObject();
                    return userWithoutPassword;
                });
                return c.json(usersWithoutPasswords);
            } catch (error) {
                const e = error as Error;
                if (e.name === "CastError") {
                    return c.text("Invalid IDs", 400);
                }
                throw error;
            }
        }
    )
    .put(
        "/setProfilePicture",
        validateJsonMiddleware(
            z.object({
                profile_picture: z.string().url(),
            })
        ),
        async (c) => {
            const payload: {
                id: string,
                exp: number
            } = await c.get('jwtPayload')
    
            const user = await User.findById(payload.id).select('profile_picture');
            if (!user) {
                return c.text('Invalid user', 400);
            }

            const {
                profile_picture,
            }: {
                profile_picture: string;
            } = await c.req.valid("json");


            user.profile_picture = profile_picture;
            await user.save();
            return c.json(user);
        }
    )

    .put(
        "/setSchool",
        validateJsonMiddleware(
            z.object({
                school: z.string(),
            })
        ),
        async (c) => {
            const payload: {
                id: string,
                exp: number
            } = await c.get('jwtPayload')
    
            const user = await User.findById(payload.id).select('school')
            if (!user) {
                return c.text('Invalid user', 400);
            }

            const {
                school,
            }: {
                school: string;
            } = await c.req.json();

            user.school = school;
            await user.save();
            return c.json(user);
        }
    )

    .put(
        "/",
        validateJsonMiddleware(
            z.object({
                name: z.string().optional(),
                email: z.string().email().optional(),
                profile_picture: z.string().url().optional(),
                school: z.string().optional(),
                game_profile: z
                    .object({
                        game_points: z.number().optional(),
                        game_minutes_left: z.number().optional(),
                    })
                    .optional(),
                is_feedback_available: z.boolean().optional(),
                learning_preferences: z.array(z.string()).optional(),
            })
        ),
        async (c) => {
            const payload: {
                id: string,
                exp: number
            } = await c.get('jwtPayload')
    
            const {
                name,
                email,
                profile_picture,
                school,
                game_profile,
                is_feedback_available,
                learning_preferences,
            }: {
                name: string;
                email: string;
                profile_picture: string;
                school: string;
                game_profile: IGameProfile;
                is_feedback_available: boolean;
                learning_preferences: string[];
            } = await c.req.valid("json");

            const user = await User.findById(payload.id).select(["classroom", "role", "name"]).lean();
            if (!user) {
                return c.text("Invalid ID", 400);
            }

            try {
                if (name != user.name && user.role == "teacher") {
                    // for all classrooms that the teacher is in, update the teacher joined name
                    const userClassrooms = user.classroom;
                    const [updatedUser, _classroom] = await Promise.all([
                        User.findByIdAndUpdate(payload.id, {
                            name,
                            email,
                            profile_picture,
                            school,
                            game_profile,
                            is_feedback_available,
                            learning_preferences,
                        }, {new: true}),
                        Classroom.updateMany(
                            { _id: { $in: userClassrooms } },
                            { "teachers_joined.$[elem].name": name },
                            { arrayFilters: [{ "elem.teacher": payload.id }] }
                        ),
                    ]);
                    return c.json(updatedUser);
                }

                const updatedUser = await User.findByIdAndUpdate(payload.id, {
                    name,
                    email,
                    profile_picture,
                    school,
                    game_profile,
                    is_feedback_available,
                    learning_preferences,
                }, {new: true});
                return c.json(updatedUser);
            } catch (error) {
                return c.text("Error: " + error, 400);
            }
        }
    )

    .post("/addPoints/:id", validateJsonMiddleware(z.object({
        amount: z.number(),
        classroom: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }),
        giver: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }).optional(),
        type: z.enum(Object.values(PointsLogType) as [string, ...string[]]),
        details: z.string().optional(),
    })), async (c) => {
        const {
            amount,
            classroom,
            giver,
            type,
            details,
        }: {
            amount: number;
            classroom: string;
            giver: string;
            type: PointsLogType;
            details: string;
        } = await c.req.valid("json");

        const id = c.req.param("id");

        try {
            const user = await User.findById(id).select("game_profile.game_points");
            if (!user) {
                return c.text("Invalid ID", 400);
            }

            user.game_profile.game_points += amount;
            const pointsLog = new PointsLog({
                user: id,
                classroom,
                is_add: true,
                amount,
                giver,
                type,
                details,
            });
            await Promise.all([user.save(), pointsLog.save()]);
            return c.json({user, pointsLog});
        } catch (error) {
            return c.text("Error: " + error, 400);
        }
    })

    .post("/substractPoints/:id", validateJsonMiddleware(z.object({
        amount: z.number(),
        classroom: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }),
        type: z.enum(Object.values(PointsLogType) as [string, ...string[]]),
        details: z.string().optional(),
    })), async (c) => {
        const {
            amount,
            classroom,
            type,
            details,
        }: {
            amount: number;
            classroom: string;
            type: PointsLogType;
            details: string;
        } = await c.req.valid("json");
        const id = c.req.param("id");
        try {
            const user = await User.findById(id).select("game_profile.game_points");
            if (!user) {
                return c.text("Invalid ID", 400);
            }
            
            user.game_profile.game_points -= amount;
            const pointsLog = new PointsLog({
                user: id,
                classroom,
                is_add: false,
                amount,
                type,
                details,
            });
            await Promise.all([user.save(), pointsLog.save()]);
            return c.json({user, pointsLog});
        } catch (error) {
            return c.text("Error: " + error, 400);
        }
    })

    .put("/setLearningPreferences", validateJsonMiddleware(z.object({
        learning_preferences: z.array(z.string()),
    })), async (c) => {
        const payload: {
            id: string,
            exp: number
        } = await c.get('jwtPayload')

        const {
            learning_preferences,
        }: {
            learning_preferences: string[];
        } = await c.req.valid("json");

        const user = await User.findById(payload.id).select("learning_preferences");
        if (!user) {
            return c.text("Invalid ID", 400);
        }
        user.learning_preferences = learning_preferences;
        await user.save();
        return c.json(user);
    })

    .put("/completeLesson", validateJsonMiddleware(z.object({
        lessonId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }),
        classId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }),
        unitId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }),
    })), async (c) => {
       const {
            lessonId,
            classId,
            unitId,
        }: {
            lessonId: string;
            classId: string;
            unitId: string;
        } = await c.req.valid("json");
       
        const payload: {
            id: string,
            exp: number
        } = await c.get('jwtPayload')

        const user = await User.findById(payload.id).select(["class_progress_info", "classroom"]);
        if (!user) {
            return c.text("Invalid ID", 400);
        }

        if (!user.classroom || !user.classroom.includes(classId as unknown as mongoose.Schema.Types.ObjectId)) {
            return c.text("User is not enrolled in this class", 400);
        }

        const classProgressInfo = user.class_progress_info.find((info) => info.class.toString() === classId && info.unit.id.toString() === unitId);

        if (!classProgressInfo) {
            const unitInfo = await Unit.findById(unitId).select(["name", "lessons", "exercises"]).lean();
            if (!unitInfo) {
                return c.text("Invalid unit ID", 400);
            }

            if (!unitInfo.lessons.some((lesson) => (lesson as FlattenMaps<HydratedDocument<ILesson>>)._id.toString() === lessonId)) {
                return c.text("Invalid lesson ID or Lesson is not in the Provided Unit", 400);
            }
            
            const num_exercises = unitInfo.exercises.length;
            const num_lessons = unitInfo.lessons.length;
            const unit_name = unitInfo.name;

            // Create a new classProgressInfo
            user.class_progress_info.push({
                lessons_completed: [lessonId as unknown as mongoose.Schema.Types.ObjectId],
                progress_percent: (1 / (num_lessons + num_exercises)) * 100,
                unit: {
                    id: unitId as unknown as mongoose.Schema.Types.ObjectId,
                    name: unit_name,
                },
                num_lessons: num_lessons,
                num_exercises: num_exercises,
                class: classId as unknown as mongoose.Schema.Types.ObjectId,
            });

            await user.save();
            return c.json(user);
        }

        if (classProgressInfo.lessons_completed) {
            if (classProgressInfo.lessons_completed.includes(lessonId as unknown as mongoose.Schema.Types.ObjectId)) {
                return c.text("Lesson already completed", 400);
            } else {
                classProgressInfo.lessons_completed.push(lessonId as unknown as mongoose.Schema.Types.ObjectId);
            }
        } else {
            classProgressInfo.lessons_completed = [lessonId as unknown as mongoose.Schema.Types.ObjectId];
        }

        classProgressInfo.progress_percent =
            ((classProgressInfo.lessons_completed.length + (classProgressInfo.exercises?.length || 0)) /
                (classProgressInfo.num_exercises + classProgressInfo.num_lessons)) *
            100;

        await user.save();
        return c.json(user);
    })

    .post("/submitExercise", validateJsonMiddleware(z.object({
        exerciseId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }),
        attempt: z.object({
            score: z.number().optional(),
            answers: z.string(),
        }), 
        unitId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }),
        classId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }),
    })), async (c) => {
        const {
            exerciseId,
            attempt,
            unitId,
            classId,
        }: {
            exerciseId: string;
            attempt: {
                score?: number;
                answers: string;
            };
            unitId: string;
            classId: string;
        } = await c.req.valid("json");

        const payload: {
            id: string,
            exp: number
        } = await c.get('jwtPayload')

        // TODO: Future, Exercise or lesson and unit must be in classroom.chosen_unit

        const user = await User.findById(payload.id).select(["class_progress_info", "game_profile.game_points", "new_exercise_submission", "classroom"]);
        if (!user) return c.text("Invalid user ID", 400);

        const classroom = await Classroom.findById(classId).select("students_enrolled");
        if (!classroom) return c.text("Invalid class ID", 400);

        const unitInfo = await Unit.findById(unitId).select(["name", "lessons", "exercises"]).lean();
        if (!unitInfo) {
            return c.text("Invalid unit ID", 400);
        }

        if (!unitInfo.exercises.some((exercise) => (exercise as FlattenMaps<HydratedDocument<IExercise>>)._id.toString() === exerciseId)) {
            return c.text("Invalid Exercise ID or Exercise is not in the Provided Unit", 400);
        }
      
        if (!user.classroom || !user.classroom.includes(classId as unknown as mongoose.Schema.Types.ObjectId)) {
            return c.text("User is not enrolled in this class", 400);
        }

        const classProgressInfo = user.class_progress_info.find((info) => info.class.toString() === classId && info.unit.id.toString() === unitId);
        if (!classProgressInfo) {
            const num_exercises = unitInfo.exercises.length;
            const num_lessons = unitInfo.lessons.length;
            const unit_name = unitInfo.name;

            user.class_progress_info.push({
                exercises: [
                    {
                        exercise: exerciseId as unknown as mongoose.Schema.Types.ObjectId,
                        attempts: [
                            {
                                attempt_number: 1,
                                score: attempt.score, // Can be undefined if score is undefined
                                answers: attempt.answers,
                            },
                        ],
                        coins_earned: attempt.score ,  // Can be undefined if score is undefined 
                        best_score: attempt.score, // Can be undefined if score is undefined
                        last_attempt_at: new Date(),
                        max_score:
                            unitInfo.exercises.find(
                                (exercise) => (exercise as HydratedDocument<IExercise>)._id.toString() === exerciseId
                            )?.max_score || 0,
                    },
                ],
                progress_percent: (1 / (num_lessons + num_exercises)) * 100,
                unit: {
                    id: unitId as unknown as mongoose.Schema.Types.ObjectId,
                    name: unit_name,
                },
                num_lessons: num_lessons,
                num_exercises: num_exercises,
                class: classId as unknown as mongoose.Schema.Types.ObjectId,
            });
            
            if (!user.new_exercise_submission.some(submission => submission.exercise.toString() === exerciseId && submission.class.toString() === classId)) {
                user.new_exercise_submission.push({
                    exercise: exerciseId as unknown as mongoose.Schema.Types.ObjectId,
                    class: classId as unknown as mongoose.Schema.Types.ObjectId,
                });
            }

            let newPointsLog;
            if (attempt.score && attempt.score > 0) {
                user.game_profile.game_points += attempt.score;
                newPointsLog = new PointsLog({
                    user: user._id,
                    classroom: classId,
                    is_add: true,
                    amount: attempt.score,
                    details: "Exercise submission",
                    type: "instant_exercise",
                });
            }

            const student = classroom.students_enrolled.find((student) => student.student.toString() === payload.id.toString());
            if (student) {
                student.is_new_exercise_submission = true;
            }
            await Promise.all([user.save(), classroom.save(),  newPointsLog && newPointsLog.save()]);
            return c.json({user, classroom});
        } else {
            if (classProgressInfo.exercises) {
                const ex = classProgressInfo.exercises.find((exercise) => exercise.exercise.toString() === exerciseId);
                if (ex) {
                    ex.attempts.push({
                        attempt_number: ex.attempts.length + 1,
                        score: attempt.score,
                        answers: attempt.answers,
                    });

                    if (ex.best_score){
                        if (attempt.score && attempt.score > ex.best_score){
                            ex.best_score = attempt.score;
                        }
                    } else if (attempt.score) {
                          ex.best_score = attempt.score
                    } 
                        
                    ex.last_attempt_at = new Date();

                    if (!user.new_exercise_submission.some(submission => submission.exercise.toString() === exerciseId && submission.class.toString() === classId)) {
                        user.new_exercise_submission.push({
                            exercise: exerciseId as unknown as mongoose.Schema.Types.ObjectId,
                            class: classId as unknown as mongoose.Schema.Types.ObjectId,
                        });
                    }

                    const student = classroom.students_enrolled.find((student) => student.student.toString() === payload.id.toString());
                    if (student) {
                        student.is_new_exercise_submission = true;
                    }
                    await Promise.all([user.save(), classroom.save()]);
                    return c.json({user, classroom});
                } else {
                    classProgressInfo.exercises.push({
                        exercise: exerciseId as unknown as mongoose.Schema.Types.ObjectId,
                        attempts: [
                            {
                                attempt_number: 1,
                                score: attempt.score, // Can be undefined if score is undefined
                                answers: attempt.answers,
                            },
                        ],
                        coins_earned: attempt.score, // Can be undefined if score is undefined
                        best_score: attempt.score, // Can be undefined if score is undefined
                        last_attempt_at: new Date(),
                        max_score:
                            unitInfo.exercises.find(
                                (exercise) => (exercise as HydratedDocument<IExercise>)._id.toString() === exerciseId
                            )?.max_score || 0,
                    });
                }
            } else {
                classProgressInfo.exercises = [
                    {
                        exercise: exerciseId as unknown as mongoose.Schema.Types.ObjectId,
                        attempts: [
                            {
                                attempt_number: 1,
                                score: attempt.score, // Can be undefined if score is undefined
                                answers: attempt.answers,
                            },
                        ],
                        coins_earned: attempt.score, // Can be undefined if score is undefined
                        best_score: attempt.score, // Can be undefined if score is undefined
                        last_attempt_at: new Date(),
                        max_score:
                            unitInfo.exercises.find(
                                (exercise) => (exercise as HydratedDocument<IExercise>)._id.toString() === exerciseId
                            )?.max_score || 0,
                    },
                ];
            }

            if (attempt.score &&  attempt.score > 0) {
                user.game_profile.game_points += attempt.score;
                await PointsLog.create({
                    user: user._id,
                    classroom: classId,
                    is_add: true,
                    amount: attempt.score,
                    details: "Exercise submission",
                    type: "instant_exercise",
                });
            }

            classProgressInfo.progress_percent =
                (((classProgressInfo.lessons_completed?.length || 0) + (classProgressInfo.exercises?.length || 0)) /
                    (classProgressInfo.num_exercises + classProgressInfo.num_lessons)) *
                100;
            

            if (!user.new_exercise_submission.some(submission => submission.exercise.toString() === exerciseId && submission.class.toString() === classId)) {
                user.new_exercise_submission.push({
                    exercise: exerciseId as unknown as mongoose.Schema.Types.ObjectId,
                    class: classId as unknown as mongoose.Schema.Types.ObjectId,
                });
            }

            const student = classroom.students_enrolled.find((student) => student.student.toString() === payload.id.toString());
            if (student) {
                student.is_new_exercise_submission = true;
            }
            await Promise.all([user.save(), classroom.save()]);
            return c.json({user, classroom});
        }
    })

    .put("/setFeedback", validateJsonMiddleware(z.object({
        exercise_submission_id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }),
        class_progress_info_id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }),
        feedback: z.string(),
        userId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid User ID" }),
    })), async (c) => {
        const {
            exercise_submission_id,
            class_progress_info_id,
            feedback,
            userId,
        }: {
            exercise_submission_id: string;
            class_progress_info_id: string;
            feedback: string;
            userId: string;
        } = await c.req.valid("json");


        // Fetch the user and ensure class_progress_info is retrieved
        const user = await User.findById(userId).select(["class_progress_info"]);
        if (!user) {
            return c.text("Invalid ID", 400);
        }

        // Find the correct exercise submission from the user's class_progress_info
        
        const class_progress = user.class_progress_info.find((info) => (info as HydratedDocument<IClassProgressInfo>)._id.toString() === class_progress_info_id);
        if (!class_progress) {
            return c.text("Invalid class progress ID", 400);
        }
        const exerciseSubmission = class_progress.exercises?.find((exercise) => (exercise as HydratedDocument<IExerciseSubmission>)._id.toString() === exercise_submission_id);

        if (!exerciseSubmission) {
            return c.text("Invalid submission ID", 400);
        }

        // Update feedback and mark feedback as available
        exerciseSubmission.feedback = feedback;
        user.is_feedback_available = true;

        await user.save();

        return c.json(user);
    })

    .put("/scoreExerciseSubmission", validateJsonMiddleware(z.object({
        exercise_submission_id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }),
        class_progress_info_id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid ID" }),
        score: z.number(),
        user_id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid User ID" }),
    })), async (c) => {
        const {
            exercise_submission_id,
            class_progress_info_id,
            score,
            user_id,
        }: {
            exercise_submission_id: string;
            class_progress_info_id: string;
            score: number;
            user_id: string;
        } = await c.req.valid("json");

        // Fetch the user and ensure class_progress_info is retrieved
        const user = await User.findById(user_id).select(["class_progress_info", "game_profile"]);
        if (!user) {
            return c.text("Invalid ID", 400);
        }

        const class_progress = user.class_progress_info.find((info) => (info as HydratedDocument<IClassProgressInfo>)._id.toString() === class_progress_info_id);
        if (!class_progress) {
            return c.text("Invalid class progress ID", 400);
        }

        const exerciseSubmission = class_progress.exercises?.find((exercise) => (exercise as HydratedDocument<IExerciseSubmission>)._id.toString() === exercise_submission_id);
        if (!exerciseSubmission) {
            return c.text("Invalid submission ID", 400);
        }
        if (score > exerciseSubmission.max_score) {
            return c.text("Score is greater than the max score", 400);
        }
        
        const lastAttempt = exerciseSubmission.attempts.at(-1);

        const coinsEarned = exerciseSubmission.coins_earned;
        let newPointsLog;
        if (coinsEarned && score > coinsEarned) {
            const difference = score - coinsEarned;
            user.game_profile.game_points += difference;
            exerciseSubmission.coins_earned = score;
            if (exerciseSubmission.best_score){
                if (score > exerciseSubmission.best_score) exerciseSubmission.best_score = score;
            } else {
                exerciseSubmission.best_score = score;
            }
            

            newPointsLog =  new PointsLog({
                user: user._id,
                classroom: class_progress.class,
                is_add: true,
                amount: difference,
                details: "Exercise rescored",
                type: PointsLogType.TEACHER_SCORED,
            });
        } else if (!coinsEarned) {
            user.game_profile.game_points += score;
            exerciseSubmission.coins_earned = score;
            if (exerciseSubmission.best_score){
                if (score > exerciseSubmission.best_score) exerciseSubmission.best_score = score;
            } else {
                exerciseSubmission.best_score = score;
            }
        }

        if (lastAttempt) {
            lastAttempt.score = score;
        }

        
        // Save the updated user document
        await Promise.all([user.save(), newPointsLog && newPointsLog.save()]);

        return c.json(user);
    })

    .put("/resetNewExerciseSubmission/:id", async (c) => { 
        // Checked
        
        const id = c.req.param("id");

        const user = await User.findById(id).select("new_exercise_submission");
        if (!user) {
            return c.text("Invalid ID", 400);
        }

        user.new_exercise_submission = [];
        await user.save();
        return c.json(user);
    });

// TODO: Frontend: Reset has_new_exercise_submission after teacher has seen it
// TODO: Frontend + Backend: Offload password hashing to the frontend so that there is no security risk
// TODO: Future: Recommendation system

export default userRoutes;
