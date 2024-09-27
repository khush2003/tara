import mongoose, { Document, Schema } from 'mongoose';

export const TeacherDetailsSchema: Schema = new Schema({
    school: { type: String, required: true },
    classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }],
    extra_points_award: [{
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        points: { type: Number, required: true },
        reason: { type: String, required: true },
        date_awarded: { type: Date, default: Date.now }
    }]
});

const model = mongoose.model('TeacherDetails', TeacherDetailsSchema);

export default model;