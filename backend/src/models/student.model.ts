import mongoose, { Document, Schema } from 'mongoose';


export const StudentDetailsSchema: Schema = new Schema({
  game_points: { type: Number, required: true, default: 0 },
  classroom_id: { type: mongoose.Types.ObjectId, required: false, ref: 'Classroom' },
  // game_profile: { type: Object, required: false },
  game_hours_left: { type: Number, required: true, default: 60 },
});

const model = mongoose.model('StudentDetails', StudentDetailsSchema);
export default model;