
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
    exercises: any[];
    lessons: any[];
    __v: number;
}

export interface Classroom {
    classroom_code: string;
    classroom_name: string;
    createdAt: string;
    extra_points_award: any[];
    announcement: string;
    is_game_active: boolean;
    learning_modules: LearningModule[];
    performance_records: any[];
    students_enrolled: string[];
    teacher_id: string;
    today_lesson: LearningModule;
    updatedAt: string;
    __v: number;
    _id: string;
}