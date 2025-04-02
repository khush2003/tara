
export interface User {
    name: string;
    email: string;
    profilePicture: string;
    student_details: {
        game_points: number;
        classroom_code: string;
        game_hours_left: number;
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
        id: string;
        type: string;
    }[]
    max_score: number;
    order: number;
    _id: string;
}

export interface Classroom {
    classroom_code: string;
    classroom_name: string;
    createdAt: string;
    extra_points_award: ExtraPointsAward[];
    announcement: string;
    is_game_active: boolean;
    learning_modules: LearningModule[];
    performance_records: (string | PerformanceRecord)[]; // Array of performance record IDs or performance records
    students_enrolled: string[];
    teacher_id: string;
    today_lesson: LearningModule;
    updatedAt: string;
    progress: ProgressRecord[]
    __v: number;
    _id: string;
}
// Exmaple ProgressRecord
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


export interface ProgressRecord {
    totalTasks: number;
    completedTasks: number;
    completedLessons: string[];
    completedExercises: string[];
    moduleCode: string;
    progressPercentage: number;
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