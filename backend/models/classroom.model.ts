import mongoose, { Schema, type ObjectId } from 'mongoose';


interface IClassroom {
    name: string;
    students_enrolled: [{
        student: ObjectId;
        is_new_exercise_submission: boolean;
    }];
    teachers_joined: [{
        teacher: ObjectId;
        name: string;
    }];
    creator: ObjectId;
    class_join_code: number;
    is_game_blocked: boolean;
    game_restriction_period: {
        start: Date;
        end: Date;
    };
    is_recently_updated_announcement: boolean;
    announcement: string;
    today_unit: {
        title: string;
        unit: ObjectId;
    };
    chosen_units: [{
        name: string;
        description: string;
        difficulity: string;
        skills: string[];
        unit: ObjectId;
    }];
}

const ClassroomSchema = new Schema<IClassroom>({
    name: { type: String, required: true },
    students_enrolled: [
        {
            student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            is_new_exercise_submission: { type: Boolean, default: false }
        }
    ],
    teachers_joined: [
        {
            teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            name: { type: String, required: true }
        }
    ],
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    class_join_code: { type: Number, required: true, unique: true },
    is_game_blocked: { type: Boolean, default: false },
    game_restriction_period: {
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    },
    is_recently_updated_announcement: { type: Boolean, default: false },
    announcement: { type: String, default: '' },
    today_unit: {
        title: { type: String, required: true },
        unit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true }
    },
    chosen_units: [
        {
            name: { type: String, required: true },
            description: { type: String, required: true },
            difficulity: { type: String, required: true },
            skills: { type: [String], required: true },
            unit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true }
        }
    ]
});

export const Classroom = mongoose.model<IClassroom>('Classroom', ClassroomSchema);
export type { IClassroom };
