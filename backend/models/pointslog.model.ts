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
}

const PointsLogSchema: Schema = new Schema<IPointsLog>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    giver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    is_add: { type: Boolean, required: true },
    amount: { type: Number, required: true },
    details: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['extra_points', 'game_spending', 'instant_exercise', 'teacher_scored'], 
        required: true 
    },
}, { timestamps: true });

export const PointsLog = mongoose.model<IPointsLog>('PointsLog', PointsLogSchema);
export type { IPointsLog };