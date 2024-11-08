import type { ObjectId } from "mongoose";
import mongoose, { Schema } from 'mongoose';

// HydratedDocument adds all additional things like _id, __v, etc.
interface IPointsLog {
    user: ObjectId;
    classroom: ObjectId;
    giver: ObjectId;
    is_add: boolean;
    amount: number;
    details: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
}


export enum PointsLogType {
    EXTRA_POINTS = 'extra_points',
    GAME_SPENDING = 'game_spending',
    INSTANT_EXERCISE = 'instant_exercise',
    TEACHER_SCORED = 'teacher_scored',
    RECOMMENDED_LESSON = 'recommended_lesson',
    RECOMMENDED_EXERCISE = 'recommended_exercise',
}
// TODO: Switch Enums from string to enum definitions everywhere

const PointsLogSchema: Schema = new Schema<IPointsLog>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    giver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    is_add: { type: Boolean, required: true },
    amount: { type: Number, required: true },
    details: { type: String },
    type: { 
        type: String, 
        enum: PointsLogType,
        required: true 
    },
}, { timestamps: true });

PointsLogSchema.index({ user: 1, classroom: 1 });
PointsLogSchema.index({ user: 1 });
PointsLogSchema.index({ classroom: 1 });
PointsLogSchema.index({ classroom: 1, type: 1 });
PointsLogSchema.index({ user: 1, type: 1 });

export const PointsLog = mongoose.model<IPointsLog>('PointsLog', PointsLogSchema);
export type { IPointsLog };
export { PointsLogSchema };