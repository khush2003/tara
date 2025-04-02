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
import { generateRecommendations } from "../generateRecommendations.ts";
import { cors } from "hono/cors";
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
    .get("/get_opponent_data/opponent", async (c) => {
        const payload:{
            id: string,
            exp: number
        } = await c.get('jwtPayload')
        const level = c.req.query("level");
        console.log(level);
        const users = await User.find({ "game_profile.level": level }).select("game_profile").lean();
        if (!users) {
            return c.text("No users for this level", 500);
        }
        
        const newUsers = users.filter((u) =>{ 
            console.log(u._id.toString(), payload.id)
            return u._id.toString() !== payload.id
        });

        if (!newUsers) {
            return c.text("No user for this level", 500);``
        }
        const randomIndex = Math.floor(Math.random() * newUsers.length);
        const user = newUsers[randomIndex];
        return c.json(user?.game_profile);
    })

    .put("/setGameProfile", validateJsonMiddleware(z.object({
            game_points: z.number().optional(),
            game_minutes_left: z.number().optional(),
            name: z.string().optional(),
            hp: z.number().optional(),
            maxHp: z.number().optional(),
            energy: z.number().optional(),
            maxEnergy: z.number().optional(),
            pointsLeft: z.number().optional(),
            strength: z.number().optional(),
            extraStrength: z.number().optional(),
            defense: z.number().optional(),
            extraDefense: z.number().optional(),
            speed: z.number().optional(),
            extraSpeed: z.number().optional(),
            class: z.number().optional(),
            level: z.number().optional(),
            hasIce: z.boolean().optional(),
            hasSword: z.boolean().optional(),
            hasWings: z.boolean().optional(),
            bHasItem: z.boolean().optional(),
        })),
    async (c) => {
        const payload: {
            id: string,
            exp: number
        } = await c.get('jwtPayload')
        const user = await User.findById(payload.id);
        if (!user) {
            return c.text("Invalid user", 400);
        }

        const {
            game_points,
            game_minutes_left,
            name,
            hp,
            maxHp,
            energy,
            maxEnergy,
            pointsLeft,
            strength,
            extraStrength,
            defense,
            extraDefense,
            speed,
            extraSpeed,
            class: userClass,
            level,
            hasIce,
            hasSword,
            hasWings,
            bHasItem,
        }: IGameProfile = await c.req.valid("json");
        console.log(game_points, game_minutes_left, name, hp, maxHp, energy, maxEnergy, pointsLeft, strength, extraStrength, defense, extraDefense, speed, extraSpeed, userClass, level)
        
        let pointsLog = null;
        if (game_points !== undefined) {
            pointsLog = new PointsLog({
                user: payload.id,
                is_add: user.game_profile.game_points < game_points,
                amount: game_points,
                type: PointsLogType.GAME_SPENDING,
                details: "Game points update",
                classroom: user?.classroom[0],
            });
            user.game_profile.game_points = game_points;
        }
        if (game_minutes_left !== undefined) user.game_profile.game_minutes_left = game_minutes_left;
        if (name !== undefined) user.game_profile.name = name;
        if (hp !== undefined) user.game_profile.hp = hp;
        if (maxHp !== undefined) user.game_profile.maxHp = maxHp;
        if (energy !== undefined) user.game_profile.energy = energy;
        if (maxEnergy !== undefined) user.game_profile.maxEnergy = maxEnergy;
        if (pointsLeft !== undefined) user.game_profile.pointsLeft = pointsLeft;
        if (strength !== undefined) user.game_profile.strength = strength;
        if (extraStrength !== undefined) user.game_profile.extraStrength = extraStrength;
        if (defense !== undefined) user.game_profile.defense = defense;
        if (extraDefense !== undefined) user.game_profile.extraDefense = extraDefense;
        if (speed !== undefined) user.game_profile.speed = speed;
        if (extraSpeed !== undefined) user.game_profile.extraSpeed = extraSpeed;
        if (userClass !== undefined) user.game_profile.class = userClass;
        if (level !== undefined) user.game_profile.level = level;
        if (hasIce !== undefined) user.game_profile.hasIce = hasIce;
        if (hasSword !== undefined) user.game_profile.hasSword = hasSword;
        if (hasWings !== undefined) user.game_profile.hasWings = hasWings;
        if (bHasItem !== undefined) user.game_profile.bHasItem = bHasItem;
        // console.log(user.game_profile)
        await Promise.all([user.save(), pointsLog && pointsLog.save()]);
        return c.json(user);
    })
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

        const user = await User.findById(payload.id);
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
            const num_exercise_without_varients = unitInfo.exercises.filter((ex) => {
                if (ex.varients?.length != 0){
                    if (ex._id.toString() == ex.varients[0].id.toString()){
                        return true;
                    } else {
                        return false;
                    }
                }
                return true;
            }).length;
            const num_lessons = unitInfo.lessons.length;
            const unit_name = unitInfo.name;

            // Create a new classProgressInfo
            user.class_progress_info.push({
                lessons_completed: [lessonId as unknown as mongoose.Schema.Types.ObjectId],
                progress_percent: (1 / (num_lessons + num_exercise_without_varients)) * 100,
                unit: {
                    id: unitId as unknown as mongoose.Schema.Types.ObjectId,
                    name: unit_name,
                },
                num_lessons: num_lessons,
                num_exercises: num_exercise_without_varients,
                class: classId as unknown as mongoose.Schema.Types.ObjectId,
            });


            if (user && user.recommended?.lessons?.some((lesson) => lesson.id.toString() === lessonId)) {
                const recommendedLesson = user.recommended.lessons.find((lesson) => lesson.id.toString() === lessonId)
                const points = recommendedLesson?.extra_points || 0;
                user.game_profile.game_points += points;
                if (recommendedLesson){
                    if (!user.already_complete_recommendations?.lessons.some((lesson) => lesson.id.toString() === recommendedLesson.id.toString())) {
                        if (!user.already_complete_recommendations){
                            user.already_complete_recommendations = {
                                lessons: [recommendedLesson],
                                exercises: [],
                            };
                        }
                        else{
                            user.already_complete_recommendations?.lessons.push(recommendedLesson);
                        }
                    }
                }
                await PointsLog.create({
                    user: user._id,
                    classroom: classId,
                    is_add: true,
                    amount: points,
                    details: "Completed recommended lesson",
                    type: PointsLogType.RECOMMENDED_LESSON,
                });
            }

            await user.save();
            
            await generateRecommendations(payload.id);
            return c.json(user);
        }

        if (classProgressInfo.lessons_completed) {
            if (classProgressInfo.lessons_completed.includes(lessonId as unknown as mongoose.Schema.Types.ObjectId)) {
                if (user && user.recommended?.lessons?.some((lesson) => lesson.id.toString() === lessonId)) {
                    const recommendedLesson = user.recommended.lessons.find((lesson) => lesson.id.toString() === lessonId)
                    const points = recommendedLesson?.extra_points || 0;
                    user.game_profile.game_points += points;
                    if (recommendedLesson){
                        if (!user.already_complete_recommendations?.lessons.some((lesson) => lesson.id.toString() === recommendedLesson.id.toString())) {
                            if (!user.already_complete_recommendations){
                                user.already_complete_recommendations = {
                                    lessons: [recommendedLesson],
                                    exercises: [],
                                };
                            }
                            else{
                                user.already_complete_recommendations?.lessons.push(recommendedLesson);
                            }
                        }
                    }
                    await PointsLog.create({
                        user: user._id,
                        classroom: classId,
                        is_add: true,
                        amount: points,
                        details: "Completed recommended lesson",
                        type: PointsLogType.RECOMMENDED_LESSON,
                    });
                }
                await user.save();
                await generateRecommendations(payload.id);
                return c.json(user);
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
        
        if (user && user.recommended?.lessons?.some((lesson) => lesson.id.toString() === lessonId)) {
                const recommendedLesson = user.recommended.lessons.find((lesson) => lesson.id.toString() === lessonId)
                const points = recommendedLesson?.extra_points || 0;
                user.game_profile.game_points += points;
                if (recommendedLesson){
                    if (!user.already_complete_recommendations?.lessons.some((lesson) => lesson.id.toString() === recommendedLesson.id.toString())) {
                        if (!user.already_complete_recommendations){
                            user.already_complete_recommendations = {
                                lessons: [recommendedLesson],
                                exercises: [],
                            };
                        }
                        else{
                            user.already_complete_recommendations?.lessons.push(recommendedLesson);
                        }
                    }
                }
                await PointsLog.create({
                    user: user._id,
                    classroom: classId,
                    is_add: true,
                    amount: points,
                    details: "Completed recommended lesson",
                    type: PointsLogType.RECOMMENDED_LESSON,
                });
            }
        await user.save();
        await generateRecommendations(payload.id);
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

        const user = await User.findById(payload.id);
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
            const num_exercise_without_varients = unitInfo.exercises.filter((ex) => {
                if (ex.varients?.length != 0){
                    if (ex._id.toString() == ex.varients[0].id.toString()){
                        return true;
                    } else {
                        return false;
                    }
                }
                return true;
            }).length;
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
                progress_percent: (1 / (num_lessons + num_exercise_without_varients)) * 100,
                unit: {
                    id: unitId as unknown as mongoose.Schema.Types.ObjectId,
                    name: unit_name,
                },
                num_lessons: num_lessons,
                num_exercises: num_exercise_without_varients,
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
            if (user && user.recommended?.exercises?.some((exercise) => exercise.id.toString() === exerciseId)) {
                const recommendedExercise = user.recommended.exercises.find((exercise) => exercise.id.toString() === exerciseId)
                const points = recommendedExercise?.extra_points || 0;
                user.game_profile.game_points += points;
                if (recommendedExercise){
                    if (!user.already_complete_recommendations?.exercises.some((exercise) => exercise.id.toString() === recommendedExercise.id.toString())) {
                        if (!user.already_complete_recommendations){
                            user.already_complete_recommendations = {
                                lessons: [],
                                exercises: [recommendedExercise],
                            };
                        }
                        else{
                            user.already_complete_recommendations?.exercises.push(recommendedExercise);
                        }
                    }
                }
                await PointsLog.create({
                    user: user._id,
                    classroom: classId,
                    is_add: true,
                    amount: points,
                    details: "Completed recommended lesson",
                    type: PointsLogType.RECOMMENDED_EXERCISE,
                });
            }
            await Promise.all([user.save(), classroom.save(),  newPointsLog && newPointsLog.save()]);
            await generateRecommendations(payload.id);
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
                    if (user && user.recommended?.exercises?.some((exercise) => exercise.id.toString() === exerciseId)) {
                        const recommendedExercise = user.recommended.exercises.find((exercise) => exercise.id.toString() === exerciseId)
                        const points = recommendedExercise?.extra_points || 0;
                        user.game_profile.game_points += points;
                        if (recommendedExercise){
                            if (!user.already_complete_recommendations?.exercises.some((exercise) => exercise.id.toString() === recommendedExercise.id.toString())) {
                                if (!user.already_complete_recommendations){
                                    user.already_complete_recommendations = {
                                        lessons: [],
                                        exercises: [recommendedExercise],
                                    };
                                }
                                else{
                                    user.already_complete_recommendations?.exercises.push(recommendedExercise);
                                }
                            }
                        }
                        await PointsLog.create({
                            user: user._id,
                            classroom: classId,
                            is_add: true,
                            amount: points,
                            details: "Completed recommended lesson",
                            type: PointsLogType.RECOMMENDED_EXERCISE,
                        });
                    }
                    await Promise.all([user.save(), classroom.save()]);
                    await generateRecommendations(payload.id);
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
            if (user && user.recommended?.exercises?.some((exercise) => exercise.id.toString() === exerciseId)) {
                const recommendedExercise = user.recommended.exercises.find((exercise) => exercise.id.toString() === exerciseId)
                const points = recommendedExercise?.extra_points || 0;
                user.game_profile.game_points += points;
                if (recommendedExercise){
                    if (!user.already_complete_recommendations?.exercises.some((exercise) => exercise.id.toString() === recommendedExercise.id.toString())) {
                        if (!user.already_complete_recommendations){
                            user.already_complete_recommendations = {
                                lessons: [],
                                exercises: [recommendedExercise],
                            };
                        }
                        else{
                            user.already_complete_recommendations?.exercises.push(recommendedExercise);
                        }
                    }
                }
                await PointsLog.create({
                    user: user._id,
                    classroom: classId,
                    is_add: true,
                    amount: points,
                    details: "Completed recommended lesson",
                    type: PointsLogType.RECOMMENDED_EXERCISE,
                });
            }
            await Promise.all([user.save(), classroom.save()]);
            await generateRecommendations(payload.id);
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
        await generateRecommendations(user_id);
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

export default userRoutes;
