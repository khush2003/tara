import mongoose, { Schema, Document } from 'mongoose';

// Table guest_session {
//     session_id String [primary key]  // Temporary session ID for the anonymous user
//     selected_modules ObjectId[]      // Reference to learning modules accessed by the guest
//     performanceRecords Object[]      // Track progress on exercises or lessons
//     created_at timestamp
//     expires_at timestamp             // Session expiration time
//   }

//   Table guest_performance_record {
//     id integer [primary key]
//     session_id String             // Reference to the guest session
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

const GuestPerformanceRecordSchema = new Schema({
    session_id: { type: String, required: true },
    module_id: { type: Schema.Types.ObjectId, ref: 'LearningModule', required: true },
    lessonDetails: {
        lesson_id: { type: Schema.Types.ObjectId, ref: 'Lesson' },
        is_complete: { type: Boolean, default: false }
    },
    exerciseDetails: {
        exercise_id: { type: Schema.Types.ObjectId, ref: 'Exercise' },
        attempt: { type: Number },
        score: { type: Number },
        answers: { type: String },
        feedback: { type: String }
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { timestamps: true });

const GuestSessionSchema = new Schema({
    session_id: { type: String, required: true, unique: true },
    selected_modules: [{ type: Schema.Types.ObjectId, ref: 'LearningModule' }],
    performanceRecords: [GuestPerformanceRecordSchema],
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('GuestSession', GuestSessionSchema);