
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
    lessonCode: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Exercise {
    title: string;
    description: string;
    exerciseCode: string;
    maxScore: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Classroom {
    classroom_code: string;
    classroom_name: string;
    createdAt: string;
    extra_points_award: ExtraPointsAward[];
    announcement: string;
    is_game_active: boolean;
    learning_modules: LearningModule[];
    performance_records: PerformanceRecord[]; // Array of performance record IDs or performance records
    students_enrolled: string[];
    teacher_id: string;
    today_lesson?: LearningModule;
    updatedAt: string;
    progress: ProgressRecord[],
    game_restriction_period: {
        start: Date;
        end: Date;
    }
    __v: number;
    _id: string;
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