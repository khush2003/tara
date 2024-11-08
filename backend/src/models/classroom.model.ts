import mongoose, { Schema, Document } from 'mongoose';

//   Table classroom {
//     id integer [primary key]
//     students_enrolled ObjectId[]  // Array of user IDs (students) - Index if querying on specific student
//     teacher_id ObjectId           // Reference to the teacher - Index for fast access to teacher's classrooms
//     learning_modules ObjectId[]   // Reference to learning modules - Index if filtering based on learning modules
//     today_lesson Object           // Reference to today's lesson a learning module
//     game_restriction_period Object  // Object with start and end times
//     is_game_active Boolean // Control game activity for teacher
//     performance_records ObjectId[] // Store references to performance records in a separate collection
//     classroom_name string
//     classroom_code string
//     extra_points_award: [{
//     student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
//     points: { type: Number, required: true },
//     reason: { type: String, required: true },
//     date_awarded: { type: Date, default: Date.now }
// }]
//   }



const ClassroomSchema = new Schema({
    students_enrolled: [{ type: Schema.Types.ObjectId, ref: 'User', index: true, unique: true }],
    teacher_id: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    learning_modules: [{ type: String, ref: 'LearningModule', index: true }],
    today_lesson: { type: String, ref: 'LearningModule' },
    game_restriction_period: {
        start: { type: Date },
        end: { type: Date }
    },
    is_game_active: { type: Boolean, default: true },
    performance_records: [{ type: Schema.Types.ObjectId, ref: 'PerformanceRecord' }],
    classroom_name: { type: String, required: true },
    classroom_code: { type: String, required: true, unique: true },
    announcement: { type: String },
    extra_points_award: [{
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        points: { type: Number, required: true },
        reason: { type: String, required: true },
        date_awarded: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

ClassroomSchema.index({ students_enrolled: 1 }, { unique: true });

export default mongoose.model('Classroom', ClassroomSchema);