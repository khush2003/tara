import express from 'express';
import { Exercise, LearningModule, Lesson } from '../models/learning_module.model';
import  Classroom from '../models/classroom.model';

const router = express.Router();


// Create a classroom
router.post('/createClassroom', async (req, res) => {
    try {
        const {
            teacher_id,
            learning_modules, // Array of learning module Codes
            classroom_name,
        } = req.body;

        // Making a 6 digit otp type classroom code, ensuring it is unique
        let classroom_code;
        let isUnique = false;

        while (!isUnique) {
            classroom_code = Math.floor(100000 + Math.random() * 900000);
            const existingClassroom = await Classroom.findOne({ classroom_code });
            if (!existingClassroom) {
            isUnique = true;
            }
        }
        
        const classroom = new Classroom({
            teacher_id,
            learning_modules,
            classroom_name,
            classroom_code,
        });

        await classroom.save();
        return res.status(201).json(classroom);
    } catch (error) {
        return res.status(500).json({ error: 'Error creating classroom' });
    }
});

// Get all classrooms
router.get('/classrooms', async (req, res) => {
    try {
        const classrooms = await Classroom.find();
        return res.status(200).json(classrooms);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching classrooms' });
    }
});

// Get a classroom by classroom code
router.get('/classrooms/:classroomCode', async (req, res) => {
    try {
        const classroom = await Classroom.findOne({ classroom_code: req.params.classroomCode });

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        return res.status(200).json(classroom);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching classroom' });
    }
});

// Add student to classroom
router.put('/addStudentToClassroom', async (req, res) => {
    try {
        const { classroom_code, student_id } = req.body;

        const classroom = await Classroom.findOne({ classroom_code });

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        classroom.students_enrolled.push(student_id);
        await classroom.save();
        return res.status(200).json(classroom);
    } catch (error) {
        return res.status(500).json({ error: 'Error adding student to classroom' });
    }
});

// Remove student from classroom
router.put('/removeStudentFromClassroom', async (req, res) => {
    try {
        const { classroom_code, student_id } = req.body;

        const classroom = await Classroom.findOne({ classroom_code });

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        classroom.students_enrolled = classroom.students_enrolled.filter((id) => id !== student_id);
        await classroom.save();
        return res.status(200).json(classroom);
    } catch (error) {
        return res.status(500).json({ error: 'Error removing student from classroom' });
    }
});

// Add learning module to classroom
router.put('/addLearningModuleToClassroom', async (req, res) => {
    try {
        const { classroom_code, moduleCode } = req.body;

        const classroom = await Classroom.findOne({ classroom_code });

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        classroom.learning_modules.push(moduleCode);
        await classroom.save();
        return res.status(200).json(classroom);
    } catch (error) {
        return res.status(500).json({ error: 'Error adding learning module to classroom' });
    }
});

// Remove learning module from classroom
router.put('/removeLearningModuleFromClassroom', async (req, res) => {
    try {
        const { classroom_code, moduleCode } = req.body;

        const classroom = await Classroom.findOne({ classroom_code });

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        classroom.learning_modules = classroom.learning_modules.filter((code) => code !== moduleCode);
        await classroom.save();
        return res.status(200).json(classroom);
    } catch (error) {
        return res.status(500).json({ error: 'Error removing learning module from classroom' });
    }
});

// Set today's lesson for classroom
router.put('/setTodaysLesson', async (req, res) => {
    try {
        const { classroom_code, moduleCode } = req.body;

        const classroom = await Classroom.findOne({ classroom_code });

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        classroom.today_lesson = moduleCode;
        await classroom.save();
        return res.status(200).json(classroom);
    } catch (error) {
        return res.status(500).json({ error: 'Error setting today\'s lesson for classroom' });
    }
});

// Set game restriction period for classroom
router.put('/setGameRestrictionPeriod', async (req, res) => {
    try {
        const { classroom_code, start, end } = req.body;

        const classroom = await Classroom.findOne({ classroom_code });

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        classroom.game_restriction_period = { start, end };
        await classroom.save();
        return res.status(200).json(classroom);
    } catch (error) {
        return res.status(500).json({ error: 'Error setting game restriction period for classroom' });
    }
});

// Activate or deactivate game for classroom
router.put('/setGameActivity', async (req, res) => {
    try {
        const { classroom_code, is_game_active } = req.body;

        const classroom = await Classroom.findOne({ classroom_code });

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        classroom.is_game_active = is_game_active;
        await classroom.save();
        return res.status(200).json(classroom);
    } catch (error) {
        return res.status(500).json({ error: 'Error setting game activity for classroom' });
    }
});

// Award extra points to student
router.put('/awardExtraPoints', async (req, res) => {
    try {
        const { classroom_code, student_id, points, reason } = req.body;

        const classroom = await Classroom.findOne({ classroom_code });

        if (!classroom) {
            return res.status(404).json({ error: 'Classroom not found' });
        }

        classroom.extra_points_award.push({ student_id, points, reason });
        await classroom.save();
        return res.status(200).json(classroom);
    } catch (error) {
        return res.status(500).json({ error: 'Error awarding extra points to student' });
    }
});

export default router;

