import type { Mixed, ObjectId } from "mongoose";
import mongoose, { Schema } from 'mongoose';


interface ILesson {
    title: string;
    description: string;
    instruction: string;
    lesson_type: string;
    lesson_content: Mixed[];
    varients: ObjectId[];
}

interface IExercise {
    title: string;
    description: string;
    instruction: string;
    exercise_type: string;
    exercise_content: Mixed[];
    is_instant_scored: boolean;
    correct_answers: Mixed;
    varients: ObjectId[];
}

interface IUnit {
    name: string;
    description: string;
    difficulity: string;
    skills: string[];
    related_units: ObjectId[];
    prerequisites: ObjectId[];
    lessons: ILesson[];
    exercises: IExercise[];
}



const LessonSchema = new Schema<ILesson>({
    title: { type: String, required: true },
    description: { type: String },
    instruction: { type: String },
    lesson_type: { type: String, enum: ["flashcards", "text", "image"] },
    lesson_content: { type: [Schema.Types.Mixed] },
    varients: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }]
}, { _id: true });

const ExerciseSchema = new Schema<IExercise>({
    title: { type: String, required: true },
    description: { type: String },
    instruction: { type: String },
    exercise_type: { type: String, enum: ["blanks", "drag_drop", "mcq", "true_false"] },
    exercise_content: { type: [Schema.Types.Mixed] },
    is_instant_scored: { type: Boolean, default: false },
    correct_answers: { type: Schema.Types.Mixed },
    varients: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }]
}, { _id: true });

const UnitSchema = new Schema<IUnit>({
    name: { type: String, required: true },
    description: { type: String },
    difficulity: { type: String },
    skills: { type: [String] },
    related_units: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
    prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
    lessons: [LessonSchema],
    exercises: [ExerciseSchema]
});

export const Unit = mongoose.model<IUnit>('Unit', UnitSchema);
export type { IExercise, ILesson, IUnit };