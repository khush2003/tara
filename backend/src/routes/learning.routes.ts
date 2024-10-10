import express from 'express';
import { Exercise, LearningModule, Lesson } from '../models/learning_module.model';
import  Classroom from '../models/classroom.model';

const router = express.Router();

// Create a learning module
router.post('/createLearningModule', async (req, res) => {
    try {
        const {
            name,
            description,
            difficulty,
            skills,
            related_modules,
            prerequisites,
            lessons,
            exercises,
            isPremium,
            moduleCode
        } = req.body;

        const learningModule = new LearningModule({
            name,
            description,
            difficulty,
            skills,
            related_modules,
            prerequisites,
            lessons,
            exercises,
            isPremium,
            moduleCode
        });

        await learningModule.save();
        return res.status(201).json(learningModule);
    } catch (error) {
        return res.status(500).json({ error: 'Error creating learning module' });
    }
});
// Request
// POST http://localhost:3000/createLearningModule
// Request body
// {
//     "name": "Introduction to Python",
//     "description": "Learn the basics of Python programming language",
//     "difficulty": "easy",
//     "skills": ["programming", "python"],
//     "related_modules": [],
//     "prerequisites": [],
//     "lessons": [],
//     "exercises": [],
//     "isPremium": false,
//     "moduleCode": "PY101"
// }


// Get all learning modules
router.get('/learning-modules', async (req, res) => {
    try {
        const learningModules = await LearningModule.find();
        return res.status(200).json(learningModules);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching learning modules' });
    }
});

// Get all learning module with lessons and exercises
router.get('/learning-modules-full', async (req, res) => {
    try {
        const learningModules = await LearningModule.find();

        // Manually populate the lessons and exercises by lessonCode and exerciseCode
        for (let i = 0; i < learningModules.length; i++) {
            learningModules[i].lessons = await Lesson.find({
                lessonCode: { $in: learningModules[i].lessons } // Match lessonCode
            });
            learningModules[i].exercises = await Exercise.find({
                exerciseCode: { $in: learningModules[i].exercises } // Match exerciseCode
            });
        }

        return res.status(200).json(learningModules);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching learning modules' });
    }
});

// Get a learning module by module code
router.get('/learning-modules/:moduleCode', async (req, res) => {
    try {
        const learningModule = await LearningModule.findOne({ moduleCode: req.params.moduleCode });

        // If the learning module exists, manually populate the lessons and exercises by lessonCode and exerciseCode
        if (learningModule) {
            learningModule.lessons = await Lesson.find({
                lessonCode: { $in: learningModule.lessons } // Match lessonCode
            });
            learningModule.exercises = await Exercise.find({
                exerciseCode: { $in: learningModule.exercises } // Match exerciseCode
            });
        }

        if (!learningModule) {
            return res.status(404).json({ error: 'Learning module not found' });
        }

        return res.status(200).json(learningModule);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching learning module' });
    }
});

// Update a learning module by module code
router.put('/learning-modules/:moduleCode', async (req, res) => {
    try {
        const learningModule = await LearningModule.findOneAndUpdate({ moduleCode: req.params.moduleCode }, req.body, { new: true });
        return res.status(200).json(learningModule);
    } catch (error) {
        return res.status(500).json({ error: 'Error updating learning module' });
    }
});

// Create a lesson
router.post('/createLesson', async (req, res) => {
    try {
        const { title, description, lessonCode } = req.body;

        const lesson = new Lesson({
            title,
            description,
            lessonCode
        });

        await lesson.save();
        return res.status(201).json(lesson);
    } catch (error) {
        return res.status(500).json({ error: 'Error creating lesson' });
    }
});

// Create an exercise
router.post('/createExercise', async (req, res) => {
    try {
        const { title, description, exerciseCode, maxScore } = req.body;

        const exercise = new Exercise({
            title,
            description,
            exerciseCode,
            maxScore
        });

        await exercise.save();
        return res.status(201).json(exercise);
    } catch (error) {
        return res.status(500).json({ error: 'Error creating exercise' });
    }
});

// Get all lessons in a learning module
router.get('/lessons/:moduleCode', async (req, res) => {
    try {
        const learningModule = await LearningModule.findOne({ moduleCode: req.params.moduleCode });

        if (!learningModule) {
            return res.status(404).json({ error: 'Learning module not found' });
        }

        const lessons = await Lesson.find({ _id: { $in: learningModule.lessons } });
        return res.status(200).json(lessons);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching lessons' });
    }
});

// Get all exercises in a learning module
router.get('/exercises/:moduleCode', async (req, res) => {
    try {
        const learningModule = await LearningModule.findOne({ moduleCode: req.params.moduleCode });

        if (!learningModule) {
            return res.status(404).json({ error: 'Learning module not found' });
        }

        const exercises = await Exercise.find({ _id: { $in: learningModule.exercises } });
        return res.status(200).json(exercises);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching exercises' });
    }
});


export default router;