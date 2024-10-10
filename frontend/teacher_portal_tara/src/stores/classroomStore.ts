import { create } from 'zustand';
import { Classroom } from '@/types/dbTypes';
import useAuthStore, { BACKEND_API_URL } from './authStore';

interface ClassroomStore {
    classrooms: Classroom[] | null;
    classroomLoading: boolean;
    classroomError: string | null;
    createClassroom: (classroomName: string, learningModules: string[]) => Promise<string | void>;
    // fetchClassrooms: (classroomCode: string) => Promise<void>;
}

const useClassroomStore = create<ClassroomStore>((set) => ({
    classrooms: null,
    classroomLoading: false,
    classroomError: null,
    createClassroom: async (classroomName: string, learningModules: string[]) => {
        set({ classroomLoading: true, classroomError: null });
        const token = useAuthStore.getState().accessToken;
        const user_id = useAuthStore.getState().user?.user_id;
        try {
            const response = await fetch(BACKEND_API_URL + `/classroom/createClassroom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${token}`,
                },
                body: JSON.stringify({ classroom_name: classroomName, learning_modules: learningModules, teacher_id: user_id }),
            });

            if (!response.ok) {
                set({ classroomError: 'Failed to create classroom' });
                throw new Error('Failed to create classroom')
            };

            const data = await response.json();

            // add this classroom (data) to the list of classrooms
            set((state) => ({
                classrooms: state.classrooms ? [...state.classrooms, data] : [data],
                classroomLoading: false,
                classroomError: null,
            }));
            return data.classroom_code;
        
        } catch (error) {
            set({ classroomError: 'Error creating classroom: ' + (error as Error).message, classroomLoading: false });
        }
    },


    // fetchClassrooms: async (classroomCode: string) => {
    //     set({ classroomLoading: true, classroomError: null });
    //     const token = useAuthStore.getState().accessToken;
    //     try {
    //         const response = await fetch(BACKEND_API_URL + `/classroom/classroomsProgress/${classroomCode}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'auth-token': `${token}`,
    //             },
    //         });
    //         if (!response.ok) throw new Error('Failed to fetch classroom');
    //         const data = await response.json();
    //         set({ classroom: data, classroomLoading: false });
    //     } catch (error) {
    //         set({ classroomError: 'Error fetching classroom: ' + (error as Error).message, classroomLoading: false });
    //     }
    // },
}));

export default useClassroomStore;