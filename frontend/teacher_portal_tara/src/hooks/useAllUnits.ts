import useSWR from 'swr';
import useAuthStore, { client } from '@/stores/authStore';

export const allUnitsKey = '/api/all-units';

export const allUnitsFetcher = async () => {
    const token = useAuthStore.getState().accessToken;

    if (!token) {
        useAuthStore.getState().logout();
        throw new Error('No access token');
    }

    const response = await client.api.v1.unit.all.$get({},{
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData ? JSON.stringify(errorData) : "Failed to fetch units");
    }

    return response.json();
};

export const useAllUnits = () => {
    const { data, error, isLoading, isValidating, mutate } = useSWR(allUnitsKey, allUnitsFetcher);
    return {
        data,
        isLoading,
        error,
        isValidating,
        mutate,
    };
};