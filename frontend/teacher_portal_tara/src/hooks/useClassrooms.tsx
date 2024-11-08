import useAuthStore, { client } from "@/stores/authStore";
import useSWR from 'swr';


const classroomsFetcher = async (_url: string, ids: string[]) => {
    const token = useAuthStore.getState().accessToken;

    if (!token) {
        useAuthStore.getState().logout();
        throw new Error('No access token');
    }

    const response = await client.api.v1.classroom.multiple.$post(
        {
            json: { ids }
        },
           { headers: { "Authorization": `Bearer ${token}` }}
        
    );

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData ? JSON.stringify(errorData) : "Failed to fetch classrooms");
    }

    return response.json() as Promise<Array<{
        _id: string;
        name: string;
        teachers_joined: {
            teacher: string;
            name: string;
            _id: string;
        }[];
        creator: string;
        class_join_code: number;
        is_game_blocked: boolean;
        is_recently_updated_announcement: boolean;
        game_restriction_period: {
            start: string;
            end: string;
        }
        announcement: string;
        today_unit: {
            title: string;
            unit: string;
        }
        students_enrolled: {
            student: string;
            is_new_exercise_submission: boolean;
            _id: string;
        }[];
        chosen_units: {
            name: string;
            description: string;
            difficulty: string;
            skills: string[];
            unit: string;
        }[];
        __v: number;
    }>>;
};

export const classroomsKey = '/api/classrooms';

export const useClassrooms = (ids: string[] | undefined) => {
    const shouldFetch = Boolean(ids?.length);
    const { data, error, isLoading, isValidating, mutate } = useSWR(
        shouldFetch ? [classroomsKey, ids] : null,
        ([url, ids]) => classroomsFetcher(url, ids!),
        { refreshInterval: 10000 }
    );

    return {
        data,
        isLoading,
        error,
        isValidating,
        mutate,
    };
};