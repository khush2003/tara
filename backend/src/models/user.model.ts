import mongoose, { Document, Schema, model, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';
import { StudentDetailsSchema } from './student.model';
import { TeacherDetailsSchema } from './teacher.model';


// User schema definition
const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true,
    validate: {
      validator: function (email: string) {
        // Simple regex for basic email validation
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  password: { type: String, required: [true, 'Password is required'], minlength: 6 },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  profile_picture: { type: String, default: 'https://via.placeholder.com/150' },
  student_details: StudentDetailsSchema,
  teacher_details: TeacherDetailsSchema,
}, { timestamps: true });


export default mongoose.model('User', UserSchema);;
