import mongoose, { Schema, type ObjectId } from 'mongoose';


interface IGameProfile {
    game_points: number;
    game_minutes_left: number;
}

interface IRecommendations {
    lessons: {
        name: string;
        id: string;
        extra_points: number;
    }[];
    exercises: {
        name: string;
        id: string;
        extra_points: number;
    }[];
}

interface IExerciseSubmission {
    exercise: ObjectId;
    max_score: number;
    coins_earned?: number;
    best_score?: number;
    feedback?: string;
    attempts: {
        attempt_number: number;
        score?: number;
        answers: string;
    }[];
    last_attempt_at: Date;
}

interface IClassProgressInfo {
    lessons_completed?: ObjectId[];
    exercises?: IExerciseSubmission[];
    unit: {
        id: ObjectId;
        name: string; // Duplicate of unit name 
    };
    num_lessons: number; // Duplicate of lessons_completed.length
    num_exercises: number; //  Duplicate of exercises.length
    progress_percent: number;
    class: ObjectId;
}

interface IUser {
    name: string;
    email: string;
    password: string;
    role: string;
    profile_picture: string;
    school: string;
    classroom: ObjectId[];
    game_profile: IGameProfile;
    is_feedback_available: boolean;
    recommended: IRecommendations;
    new_exercise_submission: Array<{
        exercise: ObjectId;
        class: ObjectId;
    }>;
    learning_preferences: string[];
    class_progress_info: IClassProgressInfo[];
}


const GameProfileSchema = new Schema<IGameProfile>({
    game_points: { type: Number, default: 0 },
    game_minutes_left: { type: Number, default: 0 }
}, { _id: true});

const RecommendationsSchema = new Schema<IRecommendations>({
    lessons: [{
        name: { type: String },
        id: { type: Schema.Types.ObjectId, ref: 'Lesson' },
        extra_points: { type: Number, default: 0 }
    }],
    exercises: [{
        name: { type: String },
        id: { type: Schema.Types.ObjectId, ref: 'Exercise' },
        extra_points: { type: Number, default: 0 }
    }]
}, { _id: true });


const ExerciseSubmissionSchema = new Schema<IExerciseSubmission>({
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    max_score: { type: Number, default: 0, required: true }, //  Duplicate of exercse max score
    coins_earned: { type: Number },
    best_score: { type: Number },
    feedback: { type: String },
    attempts: [{
        attempt_number: { type: Number, required: true },
        score: { type: Number },
        answers: { type: String, required: true }
    }],
    last_attempt_at: { type: Date }
}, { _id: true });


const ClassProgressInfoSchema = new Schema<IClassProgressInfo>({
    lessons_completed: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    exercises: [{ type: ExerciseSubmissionSchema }],
    unit: {
        id: { type: Schema.Types.ObjectId, ref: 'Unit' },
        name: { type: String }
    },
    num_lessons: { type: Number, default: 0 },
    num_exercises: { type: Number, default: 0 },
    progress_percent: { type: Number, default: 0 },
    class: { type: Schema.Types.ObjectId, ref: 'Classroom' }
}, { _id: true });


const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["teacher", "student", "admin"], required: true },
    profile_picture: { type: String,
        default: ''
     },
    school: { type: String, required: true },
    classroom: [{ type: Schema.Types.ObjectId, ref: 'Classroom' }],
    game_profile: { type: GameProfileSchema},
    is_feedback_available: { type: Boolean, default: false },
    recommended: {type: RecommendationsSchema},
    new_exercise_submission: [{
        exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
        class: { type: Schema.Types.ObjectId, ref: 'Classroom' }
    }],
    learning_preferences: [{ type: String }],
    class_progress_info: [{ type: ClassProgressInfoSchema }]
});

export const User =  mongoose.model<IUser>('User', UserSchema);
export type { IUser, IGameProfile, IRecommendations, IExerciseSubmission, IClassProgressInfo };
export { UserSchema, GameProfileSchema, RecommendationsSchema, ExerciseSubmissionSchema, ClassProgressInfoSchema };

