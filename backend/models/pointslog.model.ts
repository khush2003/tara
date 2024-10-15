import mongoose, { Schema } from 'mongoose';


const PointsLogSchema: Schema = new Schema({
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

const PointsLog = mongoose.model('PointsLog', PointsLogSchema);

export default PointsLog;