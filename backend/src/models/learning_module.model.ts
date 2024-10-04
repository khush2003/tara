import mongoose, { Schema, Document, model } from 'mongoose';

// Table learning_module {
//     id integer [primary key]
//     name String
//     description String
//     difficulty String          // 'easy', 'medium', 'hard'
//     skills String[]            // Array of skills - Index for skill-based queries
//     related_modules ObjectId[]  // Array of references to related modules
//     prerequisites ObjectId[]    // Array of prerequisite modules
//     lessons ObjectId[]          // Array of references to lessons
//     exercises ObjectId[]        // Array of references to exercises
//     isPremium boolean           // to differentiate globally accessible modules
// moduleCode: { type: String, required: true, trim: true, unique: true },
//   }

//   Table lesson {
//     id integer [primary key]
//     title String
//     description String
//     lessonCode String
//     type String // 'text', 'flashcards', 'image'
//     content Json // Content of the lesson
//   }
  
//   Table exercise {
//     id integer [primary key]
//     title String
//     description String
//     exerciseCode String
//     maxScore integer // Max score possible for the exercise
//     type String // 'translate', 'fill_in_the_blanks', 'coding'
//   }


const LearningModuleSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    difficulty: { type: String, required: true, trim: true },
    skills: { type: [String], required: true },
    related_modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LearningModule' }],
    prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LearningModule' }],
    lessons: [{ type: String, ref: 'Lesson' }],
    exercises: [{ type: String, ref: 'Exercise' }],
    isPremium: { type: Boolean, default: false },
    moduleCode: { type: String, required: true, trim: true, unique: true },
}, { timestamps: true });

const LessonSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    lessonCode: { type: String, required: true, trim: true },
}, { timestamps: true });

const ExerciseSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    exerciseCode: { type: String, required: true, trim: true },
    maxScore: { type: Number, required: true },
}, { timestamps: true });

const LearningModule = model('LearningModule', LearningModuleSchema);
const Lesson = model('Lesson', LessonSchema);
const Exercise = model('Exercise', ExerciseSchema);

export { LearningModule, Lesson, Exercise };