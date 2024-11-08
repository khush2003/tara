import mongoose, { Schema, Document } from 'mongoose';

// Table guest_session {
//     session_id String [primary key]  // Temporary session ID for the anonymous user
//     performanceRecords ObjectId[]    // Track progress on exercises or lessons
//     created_at timestamp
//     expires_at timestamp             // Session expiration time
//     guest_game_points integer        // Points earned by the guest
//     game_hours_left integer          // Hours left for the guest to play
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

const GuestSessionSchema = new Schema({
    session_id: { type: String, required: true, unique: true },
    performanceRecords: [{ type: Schema.Types.ObjectId, ref: 'GuestPerformanceRecord' }],
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, required: true },
    guest_game_points: { type: Number, required: true, default: 0 },
    game_hours_left: { type: Number, required: true, default: 60 },
}, { timestamps: true });

export { GuestPerformanceRecordSchema, GuestSessionSchema };

const GuestPerformanceRecord = mongoose.model('GuestPerformanceRecord', GuestPerformanceRecordSchema);
const GuestSession = mongoose.model('GuestSession', GuestSessionSchema);
export { GuestPerformanceRecord, GuestSession };