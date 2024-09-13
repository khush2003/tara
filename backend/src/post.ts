import express from "express";
import Student from "./models/student.ts";
const postRoutes = express()
postRoutes.use(express.json())
import { Request, Response } from 'express';


// POST a new student
export const createStudent = async (req: Request, res: Response) => {
    try {
      const { name, email, age } = req.body;
      const newStudent = new Student({ name, email, age });
      await newStudent.save();
      res.status(201).json(newStudent);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
  
  export const updateStudent = async (req: Request, res: Response) => {
    try {
      const { name, email, age, points } = req.body;
      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        { name, email, age, points },
        { new: true }
      );
  
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(updatedStudent);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
  
  


export default postRoutes