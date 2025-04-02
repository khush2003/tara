
export interface User {
    _id: string;
    name: string;
    email: string;
    profilePicture: string;
    student_details?: {
        game_points: number;
        classroom_code: string;
        game_hours_left: number;
    };
    teacher_details?: {
        school: string;
        classrooms: string[];
    };
    role: string;
}

export interface LearningModule {
    _id: string;
    name: string;
    description: string;
    difficulty: string;
    skills: string[];
    createdAt: string;
    updatedAt: string;
    isPremium: boolean;
    moduleCode: string;
    prerequisites: LearningModule[];
    related_modules: LearningModule[];
    exercises: Partial<Exercise>[];
    lessons: Partial<Lesson>[];
    __v: number;
}

export interface Lesson {
    title: string;
    description: string;
    instruction: string;
    lesson_type: "flashcard" | "image" | "text";
    lesson_content: object[];
    order: number;
    image?: string;
    _id: string;
}

export interface Exercise {
    title: string;
    description: string;
    instruction: string;
    exercise_type: string;
    exercise_content: object[];
    is_instant_scored: boolean;
    correct_answers: object;
    varients: {
        id: string
        type: string
    }[]
    max_score: number;
    order: number;
    image: string;
    _id: string;
}

export interface Classroom {
    name: string;
    class_join_code: number;
}



export interface ProgressRecord {
    totalTasks: number;
    completedTasks: number;
    completedLessons: string[];
    completedExercises: string[];
    moduleCode: string;
    progressPercentage: number;
    studentId: string;
    studentName: string;
}

export interface ExtraPointsAward {
    student_id: string;
    points: number;
    reason: string;
    date_awarded: string;
}


export interface LessonDetails {
    lessonCode: string;
    is_complete: boolean;
} 

export interface ExerciseDetails {
    exerciseCode: string;
    attempt: number;
    score: number;
    answers: string;
    feedback: string;
}

export interface PerformanceRecord {
    _id: string;
    user_id: string;
    moduleCode: string;
    lessonDetails?: Partial<LessonDetails>;
    exerciseDetails?: Partial<ExerciseDetails>;
    created_at: string;
    updated_at: string;
}