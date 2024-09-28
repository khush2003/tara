import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import verify from './verifyToken';
import { AuthenticatedRequest } from './auth.routes';
import PerformanceRecord from '../models/performance_record.model';
import Classroom from '../models/classroom.model';

const router = express.Router();

// Create a performance record
router.post('/createRecord', verify, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { moduleCode, lessonDetails, exerciseDetails } = req.body;
        const performanceRecord = new PerformanceRecord({
            user_id: (req.user as jwt.JwtPayload)._id,
            moduleCode,
            lessonDetails,
            exerciseDetails
        });

        await performanceRecord.save();
        return res.status(201).json(performanceRecord);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error creating performance record' });
    }
});

// Get all performance records of a classroom
router.get('/classroom/:classroomId/performanceRecords', verify, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { classroomId } = req.params;
        const classroom = await Classroom.findById(classroomId).populate('performance_records');

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        return res.status(200).json(classroom.performance_records);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error fetching performance records' });
    }
});

// Get all performance records of a student
router.get('/performanceRecords', verify, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const performanceRecords = await PerformanceRecord.find({ user_id: (req.user as jwt.JwtPayload)._id });
        return res.status(200).json(performanceRecords);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error fetching performance records' });
    }
});

// Get a performance record by record id
router.get('/performanceRecords/:recordId', verify, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const performanceRecord = await PerformanceRecord.findById(req.params.recordId);

        if (!performanceRecord) {
            return res.status(404).json({ error: 'Performance record not found' });
        }

        return res.status(200).json(performanceRecord);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error fetching performance record' });
    }
});

// Add feedback to an excercise of performance record
router.put('/performanceRecords/:recordId/addFeedback', verify, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {feedback } = req.body;
        const performanceRecord = await PerformanceRecord.findById(req.params.recordId);

        if (!performanceRecord) {
            return res.status(404).json({ error: 'Performance record not found' });
        }

        if (performanceRecord.exerciseDetails) {
            performanceRecord.exerciseDetails.feedback = feedback;
        } else {
            return res.status(400).json({ error: 'Feedback can only be added to an exercise! Make sure the records on excercise exist!' });
        }
        
        await performanceRecord.save();
        return res.status(200).json(performanceRecord);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error adding feedback to performance record' });
    }
});

// Update a performance record
router.put('/performanceRecords/:recordId', verify, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const performanceRecord = await PerformanceRecord.findByIdAndUpdate(req.params.recordId, req.body, { new: true });

        if (!performanceRecord) {
            return res.status(404).json({ error: 'Performance record not found' });
        }

        return res.status(200).json(performanceRecord);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error updating performance record' });
    }
});

// Add lesson details to a performance record
router.put('/performanceRecords/:recordId/addLessonDetails', verify, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { lessonCode, is_complete } = req.body;
        const performanceRecord = await PerformanceRecord.findById(req.params.recordId);

        if (!performanceRecord) {
            return res.status(404).json({ error: 'Performance record not found' });
        }

        performanceRecord.lessonDetails = {
            lessonCode,
            is_complete
        }
        await performanceRecord.save();
        return res.status(200).json(performanceRecord);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error adding lesson details to performance record' });
    }
});

// Add exercise details to a performance record
router.put('/performanceRecords/:recordId/addExerciseDetails', verify, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { excerciseCode, score, answers, feedback } = req.body;
        const performanceRecord = await PerformanceRecord.findById(req.params.recordId);

        if (!performanceRecord) {
            return res.status(404).json({ error: 'Performance record not found' });
        }


        const attempt = performanceRecord.exerciseDetails ? performanceRecord.exerciseDetails.attempt? performanceRecord.exerciseDetails.attempt + 1 : 1: 1;
        performanceRecord.exerciseDetails = {
            excerciseCode,
            attempt,
            score,
            answers,
            feedback
        }
        await performanceRecord.save();
        return res.status(200).json(performanceRecord);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error adding exercise details to performance record' });
    }
});

// Delete a performance record
router.delete('/performanceRecords/:recordId', verify, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const performanceRecord = await PerformanceRecord.findByIdAndDelete(req.params.recordId);

        if (!performanceRecord) {
            return res.status(404).json({ error: 'Performance record not found' });
        }

        return res.status(200).json(performanceRecord);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error deleting performance record' });
    }
});

export default router;


