import mongoose, { Schema } from 'mongoose';

const LessonSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    instruction: { type: String },
    lesson_type: { type: String, enum: ["flashcards", "text", "image"] },
    lesson_content: { type: [Schema.Types.Mixed] },
    varients: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }]
}, { _id: true });

const ExerciseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    instruction: { type: String },
    exercise_type: { type: String, enum: ["blanks", "drag_drop", "mcq", "true_false"] },
    exercise_content: { type: [Schema.Types.Mixed] },
    is_instant_scored: { type: Boolean, default: false },
    correct_answers: { type: Schema.Types.Mixed },
    varients: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }]
}, { _id: true });

const UnitSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    difficulity: { type: String },
    skills: { type: [String] },
    related_units: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
    prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
    lessons: [LessonSchema],
    exercises: [ExerciseSchema]
});

export const Unit = mongoose.model('Unit', UnitSchema);
export { UnitSchema, LessonSchema, ExerciseSchema };