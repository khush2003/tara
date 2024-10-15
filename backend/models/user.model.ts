import mongoose, { Schema } from 'mongoose';


const GameProfileSchema = new Schema({
    game_points: { type: Number, default: 0 },
    game_minutes_left: { type: Number, default: 0 }
}, { _id: true});

const RecommendationsSchema = new Schema({
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


const ExerciseSubmissionSchema = new Schema({
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
    max_score: { type: Number, default: 0 },
    coins_earned: { type: Number, default: 0 },
    best_score: { type: Number, default: 0 },
    feedback: { type: String },
    attempts: [{
        attempt_number: { type: Number },
        score: { type: Number },
        answers: { type: String }
    }],
    last_attempt_at: { type: Date }
}, { _id: true });


const ClassProgressInfoSchema = new Schema({
    lessons_completed: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    exercises: [{ type: ExerciseSubmissionSchema }],
    unit: {
        id: { type: Schema.Types.ObjectId, ref: 'Unit' },
        name: { type: String }
    },
    progress_percent: { type: Number, default: 0 },
    class: { type: Schema.Types.ObjectId, ref: 'Classroom' }
}, { _id: true });


const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["teacher", "student", "admin"], required: true },
    profile_picture: { type: String },
    school: { type: String },
    classroom: [{ type: Schema.Types.ObjectId, ref: 'Classroom' }],
    game_profile: { type: GameProfileSchema },
    is_feedback_available: { type: Boolean, default: false },
    recommended: {type: RecommendationsSchema},
    new_exercise_submission: {
        exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' },
        submission: { type: Schema.Types.ObjectId, ref: 'Exercise_Submission' }
    },
    learning_preferences: [{ type: String }],
    class_progress_info: [{ type: ClassProgressInfoSchema }]
});

export const User =  mongoose.model('User', UserSchema);
export { UserSchema, GameProfileSchema, RecommendationsSchema, ExerciseSubmissionSchema, ClassProgressInfoSchema };

