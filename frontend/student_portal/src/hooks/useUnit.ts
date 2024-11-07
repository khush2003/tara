import useSWR from 'swr';
import useAuthStore, { client } from '@/store/authStore';

export const unitsKey = '/api/units/';

export const unitFetcher = async (url: string) => {
  const token = useAuthStore.getState().accessToken;

  const classroomId = url.replace(unitsKey, '');

  if (!token) {
    useAuthStore.getState().logout();
    throw new Error('No access token');
  }

  const response = await client.api.v1.unit.all.classroom[":id"].$get({
    param: { id: classroomId },
  }, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData ? JSON.stringify(errorData) : "Failed to fetch classroom");
  }

  return response.json();
};

export const useUnits = (classroomId: string | undefined) => {
  const shouldFetch = Boolean(classroomId);
  const { data, error, isLoading, isValidating, mutate } = useSWR(shouldFetch ? unitsKey + classroomId : null, unitFetcher);
  return {
    data,
    isLoading,
    error,
    isValidating,
    mutate,
  };
};