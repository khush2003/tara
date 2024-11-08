import useAuthStore, { client } from "@/stores/authStore";
import { Classroom } from "@/types/dbTypes";
import { mutate } from "swr";

//TODO: Ensure to call the mutate function for classrooms or users after a successful API call

export const setTodayUnit = async (unitId: string, classroomId: string) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.classroom.setTodayUnit[":id"].$put(
            {
                param: {
                    id: classroomId
                },
                json: {
                    title: "Today's Lesson",
                    unit: unitId
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            return await response.text();
        }
        
    } catch (error) {
        return (error as Error).message;
    }
};

export const setAnnoucementAPI = async (classroomId: string, announcement: string) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.classroom.setAnnoucement[":id"].$put(
            {
                param: {
                    id: classroomId
                },
                json: {
                    announcement
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            return await response.text();
        }


    } catch (error) {
        return (error as Error).message;
    }
};

export const setIsGameActive = async (classroomId: string, isGameActive: boolean) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.classroom.setGameBlock[":id"].$put(
            {
                param: {
                    id: classroomId
                },
                json: {
                    is_game_blocked: !isGameActive
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            return await response.text();
        }


    } catch (error) {
        return (error as Error).message;
    }
};

export type ChosenUnitsType = Array<{
    name: string,
    description: string,
    difficulty: string,
    skills: string[],
    unit: string
}>

export const updateChosenUnits = async (classroomId: string, units: ChosenUnitsType) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.classroom.updateChosenUnits[":id"].$put(
            {
                param: {
                    id: classroomId
                },
                json: {
                    chosen_units: units
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            return await response.text();
        }


    } catch (error) {
        return (error as Error).message;
    }
};

export enum PointsLogType {
    EXTRA_POINTS = 'extra_points',
    GAME_SPENDING = 'game_spending',
    INSTANT_EXERCISE = 'instant_exercise',
    TEACHER_SCORED = 'teacher_scored',
}

export const awardPoints = async (classroomId: string, studentId: string, amount: number, details: string, giver: string, type: PointsLogType) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.user.addPoints[":id"].$post(
            {
                param: {
                    id: studentId
                },
                json: {
                    amount,
                    classroom: classroomId,
                    giver: giver,
                    type: type,
                    details: details
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            return await response.text();
        }


    } catch (error) {
        return (error as Error).message;
    }
};

export const setFeedbackAPI = async (exercise_submission_id: string, class_progress_info_id: string, feedback: string, userId: string) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.user.setFeedback.$put(
            {
            json: {
                exercise_submission_id,
                class_progress_info_id,
                feedback,
                userId: userId
            }
            },
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        )

        if (!response.ok) {
            return await response.text();
        }

        

    } catch (error) {
        return (error as Error).message;
    }
};

export const updateUserProfile = async (name?: string, email?: string, school?: string, profilePicture?: string) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.user.$put(
            {
                json: {
                    name,
                    email,
                    school,
                    profile_picture: profilePicture
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,

                },
            }
        );

        if (!response.ok) {
            return await response.text();
        }

        const user = await response.json() as object | null;

        if (!user){
            return "User not found";
        }

        mutate("/user", (currentData) => ({
            ...currentData,
            ...user,
        }), {
            revalidate: false,
        });
    } catch (error) {
        return (error as Error).message;
    }
}

export const changePassword = async (oldPassword: string, newPassword: string) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.auth.updatePassword.$put(
            {
                json: {
                    oldPassword: oldPassword,
                    password: newPassword,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            return await response.text();
        }

        return null;
    } catch (error) {
        return (error as Error).message;
    }
};

export const scoreExerciseSubmissionAPI = async (exercise_submission_id: string, class_progress_info_id: string, score: number, userId: string) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.user.scoreExerciseSubmission.$put(
            {
            json: {
                exercise_submission_id,
                class_progress_info_id,
                score,
                user_id: userId
            }
            },
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        );

        if (!response.ok) {
            return await response.text();
        }

    } catch (error) {
        return (error as Error).message;
    }
}

export const createClassroom = async (name: string, chosen_units?: ChosenUnitsType) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.classroom.create.$post(
            {
                json: {
                    classroom: {
                        name,
                        chosen_units
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const classroom = await response.json() as unknown as Classroom;
        return classroom.class_join_code;
    } catch (error) {
        return {
            error: (error as Error).message
        }
    }
}

export const setGameRestrictionPeriodAPI = async (classroomId: string, startDate: string, endDate: string) => {
    // TODO: Testing required
    // startDate and endDate should be in the RFC3339 format, section 5.6
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.classroom.setGameRestrictionPeriod[":id"].$put(
            {
                param: {
                    id: classroomId
                },
                json: {
                    start: startDate,
                    end: endDate
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            return await response.text();
        }


    } catch (error) {
        return (error as Error).message;
    }
}

export const resetNewExerciseSubmission = async (userId: string) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.user.resetNewExerciseSubmission[":id"].$put(
            {
                param: {
                    id: userId
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            return await response.text();
        }


    } catch (error) {
        return (error as Error).message;
    }
}


export const getExtraPoints = async (userId: string, classroomId: string) => {
    const token = useAuthStore.getState().accessToken;

    const response = await client.api.v1.pointslog.all[":userId"][":classroomId"].$get(
        {
            param: {
                userId,
                classroomId
            }
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const pointslog = await response.json();
    return pointslog.filter((log) => log.type === PointsLogType.EXTRA_POINTS);
    
}
