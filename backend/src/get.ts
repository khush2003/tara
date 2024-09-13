import express from "express";
const getRoutes = express()
getRoutes.use(express.json())

// src/controllers/studentController.ts
import { Request, Response } from 'express';
import Student from './models/student.ts';
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

export default getRoutes