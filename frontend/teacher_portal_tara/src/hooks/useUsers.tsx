import useAuthStore, { client } from "@/stores/authStore";
import useSWR from 'swr';

const usersFetcher = async (_url: string, ids: string[]) => {
    const token = useAuthStore.getState().accessToken;

    if (!token) {
        useAuthStore.getState().logout();
        throw new Error('No access token');
    }

    const response = await client.api.v1.user.multiple.$post(
        {
            json: { ids }
        },
        { headers: { "Authorization": `Bearer ${token}` }}
    );

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData ? JSON.stringify(errorData) : "Failed to fetch users");
    }

    return response.json()
};

export const usersKey = '/api/users';

export const useUsers = (ids: string[] | undefined) => {
    const shouldFetch = Boolean(ids?.length);
    const { data, error, isLoading, isValidating, mutate } = useSWR(
        shouldFetch ? [usersKey, ids] : null,
        ([url, ids]) => usersFetcher(url, ids!),
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