import useAuthStore, { client } from "@/stores/authStore";
import useSWR from 'swr';

export const userFetcher = async (url: string) => {
    if (url === "/user") {
        const token = useAuthStore.getState().accessToken;

    if (!token) {
        useAuthStore.getState().logout();
        throw new Error('No access token');
    }

    const response = await client.api.v1.auth.profile.$get({}, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData ? JSON.stringify(errorData) : "Failed to fetch user");
    }

    return response.json();
    } else {
        const userId = url.replace(userKey, '');

        const token = useAuthStore.getState().accessToken;

        if (!token) {
            useAuthStore.getState().logout();
            throw new Error('No access token');
        }

        const response = await client.api.v1.user[":id"].$get({
            param: { id: userId }
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData ? JSON.stringify(errorData) : "Failed to fetch user");
        }

        return response.json();
    }
    
};

export const userKey = '/api/user';

export const useUser = (userId?: string | undefined) => {
    const shouldFetch = Boolean(userId);
    const { data, error, isLoading, isValidating, mutate } = useSWR(shouldFetch ? userKey + userId : "/user", userFetcher, { refreshInterval: 10000 });
    return {
        data,
        isLoading,
        error,
        isValidating,
        mutate,
    };
};