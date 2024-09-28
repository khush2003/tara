import express, { Request, Response } from 'express';

import { Types } from 'mongoose';
import { GuestPerformanceRecord, GuestPerformanceRecordSchema ,GuestSession } from '../models/guest.model';

const router = express.Router();

router.post('/createSession', async (req, res) => {
    try {
        const {expires_at } = req.body;

        const session = new GuestSession({
            session_id: new Types.ObjectId().toString(),  // Generate a new session ID
            expires_at: new Date(expires_at) 
        });

        await session.save();
        return res.status(201).json(session);
    } catch (error) {
        return res.status(500).json({ error: 'Error creating guest session' });
    }
});

// Request Body
// {
//     "expires_at": "2024-01-01T00:00:00Z"
//   }

// Response (201)
// {
//     "session_id": "66f6d2b4e0ad97cd4ea06abf",
//     "performanceRecords": [],
//     "expires_at": "2024-12-12T00:00:00.000Z",
//     "guest_game_points": 0,
//     "game_hours_left": 60,
//     "_id": "66f6d2b4e0ad97cd4ea06ac0",
//     "created_at": "2024-09-27T15:43:48.905Z",
//     "createdAt": "2024-09-27T15:43:48.909Z",
//     "updatedAt": "2024-09-27T15:43:48.909Z",
//     "__v": 0
// }

// Get guest session by session ID
router.get('/guest-sessions/:sessionId', async (req, res) => {
    try {
        const session = await GuestSession.findOne({ session_id: req.params.sessionId });

        if (!session) {
            return res.status(404).json({ error: 'Guest session not found' });
        }

        return res.status(200).json(session);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching guest session' });
    }
});

// Response (200)
// {
//     "_id": "66f6d2b4e0ad97cd4ea06ac0",
//     "session_id": "66f6d2b4e0ad97cd4ea06abf",
//     "performanceRecords": [],
//     "expires_at": "2024-12-12T00:00:00.000Z",
//     "guest_game_points": 0,
//     "game_hours_left": 60,
//     "created_at": "2024-09-27T15:43:48.905Z",
//     "createdAt": "2024-09-27T15:43:48.909Z",
//     "updatedAt": "2024-09-27T15:43:48.909Z",
//     "__v": 0
// }

// Delete a guest session
router.delete('/guest-sessions/:sessionId', async (req, res) => {
    try {
        const session = await GuestSession.findOneAndDelete({ session_id: req.params.sessionId });

        if (!session) {
            return res.status(404).json({ error: 'Guest session not found' });
        }

        return res.status(200).json({ message: 'Guest session deleted' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting guest session' });
    }
});

// Response (200)
// {
//     "message": "Guest session deleted"
// }

// Add or update performance record for a guest session
router.post('/guest-sessions/:sessionId/performance', async (req, res) => {
    try {
        const { moduleCode, lessonDetails, exerciseDetails } = req.body;
        const session = await GuestSession.findOne({ session_id: req.params.sessionId });

        if (!session) {
            return res.status(404).json({ error: 'Guest session not found' });
        }

        // Check if the performance record already exists
        let performanceRecord = await GuestPerformanceRecord.findOne({
            session_id: req.params.sessionId,
            moduleCode
        });

        if (!performanceRecord) {
            performanceRecord = new GuestPerformanceRecord({
            session_id: req.params.sessionId,
            moduleCode,
            lessonDetails,
            exerciseDetails
            });
            
        } else{
            // Update existing performance record
            performanceRecord.lessonDetails = lessonDetails || performanceRecord.lessonDetails;
            performanceRecord.exerciseDetails = exerciseDetails || performanceRecord.exerciseDetails;
            performanceRecord.updated_at = new Date();
        }
        await performanceRecord.save();
        session.performanceRecords.push(performanceRecord._id);
        await session.save();

        return res.status(200).json(performanceRecord);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error updating performance record' });
    }
});


// Request Body
//   {
//     "moduleCode": "0001",
//     "lessonDetails": {
//       "lessonCode": "0001L0001",
//       "is_complete": true
//     },
//     "exerciseDetails": {
//       "exerciseCode": "0001E002",
//       "attempt": 1,
//       "score": 80,
//       "answers": "User's answers here",
//       "feedback": "Feedback here"
//     }
//   }

// Response (200)
// {
//     "session_id": "66f6d627dfa4e0867ae3e758",
//     "moduleCode": "0001",
//     "lessonDetails": {
//         "lessonCode": "0001L0001",
//         "is_complete": true
//     },
//     "exerciseDetails": {
//         "exerciseCode": "0001E002",
//         "attempt": 1,
//         "score": 80,
//         "answers": "User's answers here",
//         "feedback": "Feedback here"
//     },
//     "_id": "66f6d6db7694029441edc362",
//     "created_at": "2024-09-27T16:01:31.913Z",
//     "updated_at": "2024-09-27T16:01:31.913Z",
//     "createdAt": "2024-09-27T16:01:31.914Z",
//     "updatedAt": "2024-09-27T16:01:31.914Z",
//     "__v": 0
// }


// Get performance record for a guest session
router.get('/guest-sessions/:sessionId/performance', async (req, res) => {
    try {
        const session = await GuestSession.findOne({ session_id: req.params.sessionId });

        if (!session) {
            return res.status(404).json({ error: 'Guest session not found' });
        }

        const performanceRecords = await GuestPerformanceRecord.find({ session_id: req.params.sessionId });

        return res.status(200).json(performanceRecords);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching performance records' });
    }
});

// Response (200)
// {
//     "session_id": "66f6d627dfa4e0867ae3e758",
//     "moduleCode": "0001",
//     "lessonDetails": {
//         "lessonCode": "0001L0001",
//         "is_complete": true
//     },
//     "exerciseDetails": {
//         "exerciseCode": "0001E002",
//         "attempt": 1,
//         "score": 80,
//         "answers": "User's answers here",
//         "feedback": "Feedback here"
//     },
//     "_id": "66f6d6db7694029441edc362",
//     "created_at": "2024-09-27T16:01:31.913Z",
//     "updated_at": "2024-09-27T16:01:31.913Z",
//     "createdAt": "2024-09-27T16:01:31.914Z",
//     "updatedAt": "2024-09-27T16:01:31.914Z",
//     "__v": 0
// }


// Delete performance record for a guest session
router.delete('/guest-sessions/:sessionId/performance/:recordId', async (req, res) => {
    try {
        const session = await GuestSession.findOne({ session_id: req.params.sessionId });

        if (!session) {
            return res.status(404).json({ error: 'Guest session not found' });
        }

        const performanceRecord = await GuestPerformanceRecord.findOneAndDelete({
            _id: req.params.recordId,
            session_id: req.params.sessionId
        });

        if (!performanceRecord) {
            return res.status(404).json({ error: 'Performance record not found' });
        }

        return res.status(200).json({ message: 'Performance record deleted' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting performance record' });
    }
});


// Response (200)
// {
//     "message": "Performance record deleted"
// }

export default router;