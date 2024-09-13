// src/models/Student.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IStudent extends Document {
  name: string;
  email: string;
  age: number;
  points: number;
}

const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  points: { type: Number, default: 0 },
});

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
