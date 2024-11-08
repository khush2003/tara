import mongoose, { Schema, Document } from 'mongoose';

// Table PerformanceRecord {
//     id integer [primary key]
//     user_id ObjectId          // Reference to the user (student)
//     module_id ObjectId        // Reference to the learning module
//     lessonDetails { //Optional
//               lesson_id ObjectId        // Reference to the lesson 
//               is_complete boolean          // Lesson completion status
//  }
//    exerciseDetails { //Optional
//              exercise_id ObjectId      // Reference to the exercise 
//              attempt integer          // Attempt number
//              score integer            // Score obtained
//              answers String           // .MD String with answers
//              feedback String          // .MD String with feedback   
// }
//     created_at Date
//     updated_at Date
//   }


const PerformanceRecordSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    moduleCode: { type: String, ref: 'LearningModule', required: true },
    lessonDetails: {
        lessonCode: { type: String, ref: 'Lesson' },
        is_complete: { type: Boolean, default: false }
    },
    exerciseDetails: {
        exerciseCode: { type: String, ref: 'Exercise' },
        attempt: { type: Number },
        score: { type: Number },
        answers: { type: String },
        feedback: { type: String }
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('PerformanceRecord', PerformanceRecordSchema);