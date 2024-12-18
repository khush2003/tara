import express from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import verify from "./verifyToken";
import { AuthenticatedRequest } from "./auth.routes";
import PerformanceRecord from "../models/performance_record.model";
import Classroom from "../models/classroom.model";
import { Exercise, LearningModule, Lesson } from "../models/learning_module.model";
import User from "../models/user.model";

const router = express.Router();

// Create a performance record
router.post(
  "/createRecord",
  verify,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { moduleCode, lessonDetails, exerciseDetails } = req.body;
      const performanceRecord = new PerformanceRecord({
        user_id: (req.user as jwt.JwtPayload)._id,
        moduleCode,
        lessonDetails,
        exerciseDetails,
      });

      await performanceRecord.save();

      // If it has exercise details, update the student points in user collection
      if (exerciseDetails) {
        const user = await User.findById((req.user as jwt.JwtPayload)._id);

        if (user && user.student_details && exerciseDetails.attempt === 1) {
          user.student_details.game_points = (user.student_details.game_points || 0) + (exerciseDetails.score || 0);
          await user.save();
        }
      }



      return res.status(201).json(performanceRecord);
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "Error creating performance record" });
    }
  }
);

router.get("/performanceRecordFromExcerciseDetails/:exerciseCode", verify, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const exerciseCode = req.params.exerciseCode;
    console.log(req.params.exerciseCode);
    const { _id } = req.user as jwt.JwtPayload;
    const performanceRecord = await PerformanceRecord.findOne({"exerciseDetails.exerciseCode": exerciseCode, user_id: _id});
    return res.status(200).json(performanceRecord);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error fetching performance record" });
  }
});

// Get all performance records of a classroom
router.get(
  "/classroom/:classroomId/performanceRecords",
  verify,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { classroomId } = req.params;
      const classroom = await Classroom.findById(classroomId).populate(
        "performance_records"
      );

      if (!classroom) {
        return res.status(404).json({ error: "Classroom not found" });
      }

      return res.status(200).json(classroom.performance_records);
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "Error fetching performance records" });
    }
  }
);

// Get all performance records of a student
router.get(
  "/performanceRecords",
  verify,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const performanceRecords = await PerformanceRecord.find({
        user_id: (req.user as jwt.JwtPayload)._id,
      });
      return res.status(200).json(performanceRecords);
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "Error fetching performance records" });
    }
  }
);

// Get a performance record by record id
router.get(
  "/performanceRecords/:recordId",
  verify,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const performanceRecord = await PerformanceRecord.findById(
        req.params.recordId
      );

      if (!performanceRecord) {
        return res.status(404).json({ error: "Performance record not found" });
      }

      return res.status(200).json(performanceRecord);
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "Error fetching performance record" });
    }
  }
);

// Add feedback to an excercise of performance record
router.put(
  "/performanceRecords/:recordId/addFeedback",
  verify,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { feedback, score } = req.body;
      const performanceRecord = await PerformanceRecord.findById(
        req.params.recordId
      );

      if (!performanceRecord) {
        return res.status(404).json({ error: "Performance record not found" });
      }

      if (performanceRecord.exerciseDetails) {
        performanceRecord.exerciseDetails.feedback = feedback;
        performanceRecord.exerciseDetails.score = score;
      } else {
        return res.status(400).json({
          error:
            "Feedback can only be added to an exercise! Make sure the records on excercise exist!",
        });
      }

      await performanceRecord.save();
      return res.status(200).json(performanceRecord);
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "Error adding feedback to performance record" });
    }
  }
);

// Update a performance record
router.put(
  "/performanceRecords/:recordId",
  verify,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const performanceRecord = await PerformanceRecord.findByIdAndUpdate(
        req.params.recordId,
        req.body,
        { new: true }
      );

      if (!performanceRecord) {
        return res.status(404).json({ error: "Performance record not found" });
      }

      return res.status(200).json(performanceRecord);
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "Error updating performance record" });
    }
  }
);

// Add lesson details to a performance record
router.put(
  "/performanceRecords/:recordId/addLessonDetails",
  verify,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { lessonCode, is_complete } = req.body;
      const performanceRecord = await PerformanceRecord.findById(
        req.params.recordId
      );

      if (!performanceRecord) {
        return res.status(404).json({ error: "Performance record not found" });
      }

      performanceRecord.lessonDetails = {
        lessonCode,
        is_complete,
      };
      await performanceRecord.save();
      return res.status(200).json(performanceRecord);
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "Error adding lesson details to performance record" });
    }
  }
);

// Add exercise details to a performance record
router.put(
  "/performanceRecords/:recordId/addExerciseDetails",
  verify,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { exerciseCode, score, answers, feedback } = req.body;
      const performanceRecord = await PerformanceRecord.findById(
        req.params.recordId
      );

      if (!performanceRecord) {
        return res.status(404).json({ error: "Performance record not found" });
      }

      const attempt = performanceRecord.exerciseDetails
        ? performanceRecord.exerciseDetails.attempt
          ? performanceRecord.exerciseDetails.attempt + 1
          : 1
        : 1;
      performanceRecord.exerciseDetails = {
        exerciseCode,
        attempt,
        score,
        answers,
        feedback,
      };
      await performanceRecord.save();
      return res.status(200).json(performanceRecord);
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "Error adding exercise details to performance record" });
    }
  }
);

// Delete a performance record
router.delete(
  "/performanceRecords/:recordId",
  verify,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const performanceRecord = await PerformanceRecord.findByIdAndDelete(
        req.params.recordId
      );

      if (!performanceRecord) {
        return res.status(404).json({ error: "Performance record not found" });
      }

      return res.status(200).json(performanceRecord);
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "Error deleting performance record" });
    }
  }
);

export const calculateStudentProgress = async (
  studentId: string,
  moduleCode: String
) => {
    const learningModule = await LearningModule.findOne({ moduleCode: moduleCode });
    if (!learningModule) {
      return [];
    }
    const lessons = await Lesson.find({ lessonCode: { $in: learningModule.lessons } });
    const exercises = await Exercise.find({ exerciseCode: { $in: learningModule.exercises } });
    // Get all performance records of each module for a student and group them by moduleCode
    const performanceRecords = await PerformanceRecord.find({ user_id: studentId, moduleCode: moduleCode });

    const completedLessons = performanceRecords
        .filter(record => record.lessonDetails && record.lessonDetails.is_complete)
        .map(record => record.lessonDetails?.lessonCode);

    const completedExercises = performanceRecords
        .filter(record => record.exerciseDetails && record.exerciseDetails.score !== undefined)
        .map(record => record.exerciseDetails?.exerciseCode);

    const totalTasks = lessons.length + exercises.length;
    const completedTasks = completedLessons.length + completedExercises.length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const progress = [
        {
            totalTasks,
            completedTasks,
            completedLessons,
            completedExercises,
            moduleCode,
            progressPercentage,
        },
    ];
    

  return progress;
};

// Get student progress for a specific module
router.get(
  "/studentProgress/:moduleCode",
  verify,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const studentId = (req.user as jwt.JwtPayload)._id;
      const moduleCode = req.params.moduleCode;
      console.log(studentId, moduleCode);
      const progress = await calculateStudentProgress(studentId, moduleCode);

      return res.status(200).json(progress);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Error fetching student progress" });
    }
  }
);

// Example Response
// [
//     {
//         "totalTasks": 2,
//         "completedTasks": 2,
//         "completedLessons": [
//             "0001L0001",
//             "0001L0002"
//         ],
//         "completedExercises": [],
//         "moduleCode": "0001",
//         "progressPercentage": 100
//     }
// ]

// Get student progress for a specific classroom
router.get(
  "/classroom/:classroomCode/studentProgress",
  verify,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const studentId = (req.user as jwt.JwtPayload)._id;
      const { classroomCode } = req.params;
      const classroom = await Classroom.findOne({
        classroom_code: classroomCode,
      });

      if (!classroom) {
        return res.status(404).json({ error: "Classroom not found" });
      }

      const progress = await Promise.all(
        classroom.learning_modules.map(async (moduleCode: String) => {
          let prog = await calculateStudentProgress(studentId, moduleCode);
          if (prog.length == 0) {
            prog = [
              {
                totalTasks: 0,
                completedTasks: 0,
                progressPercentage: 0,
                completedLessons: [],
                completedExercises: [],
                moduleCode,
              },
            ];
          }
          return prog[0];
        })
      );

      return res.status(200).json(progress);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Error fetching student progress" });
    }
  }
);

// Example Response
// [
//     {
//         "totalTasks": 2,
//         "completedTasks": 2,
//         "completedLessons": [
//             "0001L0001",
//             "0001L0002"
//         ],
//         "completedExercises": [],
//         "moduleCode": "0001",
//         "progressPercentage": 100
//     },
//     {
//         "totalTasks": 0,
//         "completedTasks": 0,
//         "progressPercentage": 0,
//         "completedLessons": [],
//         "completedExercises": [],
//         "moduleCode": "0002"
//     },
//     {
//         "totalTasks": 0,
//         "completedTasks": 0,
//         "progressPercentage": 0,
//         "completedLessons": [],
//         "completedExercises": [],
//         "moduleCode": "0003"
//     }
// ]

export default router;
