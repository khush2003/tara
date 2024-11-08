import mongoose, { Document, Schema } from 'mongoose';

export const TeacherDetailsSchema: Schema = new Schema({
    school: { type: String, required: true },
    classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }],
});

const model = mongoose.model('TeacherDetails', TeacherDetailsSchema);

export default model;