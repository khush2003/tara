import mongoose, { Schema, type ObjectId } from 'mongoose';


interface IClassroom {
    name: string;
    students_enrolled: [{
        student: ObjectId;
        is_new_exercise_submission: boolean; //  Duplicate derivative of new_exercise_submission
    }];
    teachers_joined: [{
        teacher: ObjectId;
        name: string; //  Duplicate of user name
    }];
    creator: ObjectId;
    class_join_code: number;
    is_game_blocked: boolean;
    game_restriction_period: {
        start: Date;
        end: Date;
    };
    is_recently_updated_announcement: boolean; // Duplicate derivative of is_recently_updated_announcement
    announcement: string;
    today_unit: {
        title: string; // Duplicate of unit name
        unit: ObjectId;
    };
    chosen_units: [{ // Duplicate of unit info
        name: string;
        description: string;
        difficulty: string;
        skills: string[];
        unit: ObjectId;
    }];
}

const ClassroomSchema = new Schema<IClassroom>({
    name: { type: String, required: true },
    students_enrolled: [
        {
            student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            is_new_exercise_submission: { type: Boolean, default: false, required: true }   
        }
    ],
    teachers_joined: [
        {
            teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            name: { type: String, required: true }
        }
    ],
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    class_join_code: { type: Number, unique: true },
    is_game_blocked: { type: Boolean, default: false },
    game_restriction_period: {
        start: { type: Date},
        end: { type: Date }
    },
    is_recently_updated_announcement: { type: Boolean, default: false },
    announcement: { type: String, default: '' },
    today_unit: {
        title: { type: String },
        unit: { type: Schema.Types.ObjectId, ref: 'Unit' }
    },
    chosen_units: [
        {
            name: { type: String, required: true },
            description: { type: String, required: true },
            difficulty: { type: String, required: true },
            skills: { type: [String], required: true },
            unit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true }
        }
    ]
});

export const Classroom = mongoose.model<IClassroom>('Classroom', ClassroomSchema);
export type { IClassroom };
export { ClassroomSchema };
