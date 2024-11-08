import useAuthStore, { client } from "@/store/authStore";
import useSWR from 'swr';

export const classFetcher = async (url: string) => {
  const token = useAuthStore.getState().accessToken;
  const classroomId = url.replace(classKey, '');

  if (!token) {
    useAuthStore.getState().logout();
    throw new Error('No access token');
  }

  const response = await client.api.v1.classroom[":id"].$get(
    { param: { id: classroomId } },
    { headers: { "Authorization": `Bearer ${token}` } }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData ? JSON.stringify(errorData) : "Failed to fetch classroom");
  }

  return response.json() as object as 
Promise<{
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
    name: string
		description: string
		difficulty: string
		skills: string[]
		unit: string
  }[];
  __v: number;
}>;
};

export const classKey = '/api/classroom';
export const useClassroom = (classroomId: string | undefined) => {
  const shouldFetch = Boolean(classroomId);
  const { data, error, isLoading, isValidating, mutate } = useSWR(shouldFetch ? classKey + classroomId : null, classFetcher, { refreshInterval: 10000 });
  return {
    data,
    isLoading,
    error,
    isValidating,
    mutate,
  };
};