import express from "express";
const getRoutes = express()
getRoutes.use(express.json())

// src/controllers/studentController.ts
import { Request, Response } from 'express';
import Student from './models/student';
import exp from "constants";

// GET all students
getRoutes.get("/getStudents" , async (req: Request, res: Response) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
})

// GET a student by ID
getRoutes.get("/getStudentsByID" , async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
})

// GET students by name
getRoutes.get("/getStudentsByName" , async (req: Request, res: Response) => {
    try {
        const name = req.query.name as string;
        const students = await Student.find({ name });
        res.json(students);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

// GET students by age range
getRoutes.get("/getStudentsByAgeRange" , async (req: Request, res: Response) => {
    try {
        const minAge = parseInt(req.query.minAge as string);
        const maxAge = parseInt(req.query.maxAge as string);
        const students = await Student.find({ age: { $gte: minAge, $lte: maxAge } });
        res.json(students);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})
// GET students by grade
getRoutes.get("/getStudentsByGrade" , async (req: Request, res: Response) => {
    try {
        const grade = req.query.grade as string;
        const students = await Student.find({ grade });
        res.json(students);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})
export default getRoutes