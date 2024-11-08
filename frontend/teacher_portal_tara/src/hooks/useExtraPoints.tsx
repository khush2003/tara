import useSWR from 'swr';
import { getExtraPoints } from "@/api/useAPI";

export const extraPointsFetcher = async (url: string) => {
    const [, userId, classroomId] = url.split('/');
    return await getExtraPoints(userId, classroomId);
};

const extraPointsKey = 'apipointslog';

export const useExtraPoints = (userId: string | undefined, classroomId: string | undefined) => {
    const shouldFetch = Boolean(userId && classroomId);
    const { data, error, isLoading, isValidating, mutate } = useSWR(
        shouldFetch ? `${extraPointsKey}/${userId}/${classroomId}/extraPoints` : null,
        extraPointsFetcher,
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