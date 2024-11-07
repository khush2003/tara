import useAuthStore, { client } from "../store/authStore";
import { mutate } from "swr";
import { userKey } from "@/hooks/useUser";

export const addCurrentUserToClassroom = async (code: string) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.classroom.join[":code"].$post(
            {
                param: {
                    code: code,
                },
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
            return await response.text();
        }
        
        const data:{
            classroom: object,
            user: object,
        } = await response.json();
        
        mutate(userKey, (currentData) => ({
            ...currentData,
            ...data.user
        }), {
            revalidate: false,
        });
        mutate(`/classroom/${code}`, (currentData) => ({
            ...currentData,
            ...data.classroom
        }), {
            revalidate: false,
        });
    } catch (error) {
        return (error as Error).message;
    }
}

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

        mutate(userKey, (currentData) => ({
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


export const setLearningPreferences = async (learningPreferences: string[]) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.user.setLearningPreferences.$put(
            {
                json: {
                    learning_preferences: learningPreferences,
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

        if (!user) {
            return "User not found";
        }

        mutate(userKey, (currentData) => ({
            ...currentData,
            ...user,
        }), {
            revalidate: false,
        });
    } catch (error) {
        return (error as Error).message;
    }
};

export const completeLesson = async (lessonId: string, classId: string, unitId: string) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.user.completeLesson.$put(
            {
                json: {
                    lessonId,
                    classId,
                    unitId,
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

        if (!user) {
            return "User not found";
        }

        mutate(userKey, (currentData) => ({
            ...currentData,
            ...user,
        }), {
            revalidate: false,
        });
    } catch (error) {
        return (error as Error).message;
    }
}

export const submitExercise = async (exerciseId: string, attempt: { score?: number, answers: string }, unitId: string, classId: string) => {
    const token = useAuthStore.getState().accessToken;

    try {
        const response = await client.api.v1.user.submitExercise.$post(
            {
                json: {
                    exerciseId,
                    attempt,
                    unitId,
                    classId,
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

        const data: {
            user: object,
            classroom: object,
        } = await response.json();

        mutate(userKey, (currentData) => ({
            ...currentData,
            ...data.user,
        }), {
            revalidate: false,
        });

        mutate(`/classroom/${classId}`, (currentData) => ({
            ...currentData,
            ...data.classroom,
        }), {
            revalidate: false,
        });

    } catch (error) {
        return (error as Error).message;
    }
}

