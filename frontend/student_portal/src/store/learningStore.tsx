import {create} from 'zustand';
import { ExerciseDetails, LearningModule, LessonDetails, PerformanceRecord} from '@/types/dbTypes';
import useAuthStore, { BACKEND_API_URL } from './authStore';
import { useClassroomStore } from './classroomStore';
import { useUserStore } from './userStore';

interface LearningStore {
    learningModule: LearningModule | null;
    moduleLoading: boolean;
    moduleError: string | null;
    performanceRecords: PerformanceRecord[] | null;
    fetchLearningModule: (moduleCode: string) => Promise<void>;
    createPerformanceRecord: (moduleCode: string, lessonDetails?: LessonDetails, exerciseDetails?: Partial<ExerciseDetails>) => Promise<void>;
    fetchPerformanceRecords: () => Promise<void>;
}

const useLearningStore = create<LearningStore>((set) => ({
    learningModule: null,
    moduleLoading: false,
    moduleError: null,
    performanceRecords: null,
    fetchLearningModule: async (moduleCode: string) => {
        set({ moduleLoading: true, moduleError: null });
        try {
            const response = await fetch(BACKEND_API_URL + `/learning/learning-modules/${moduleCode}`);
            const data = await response.json() as LearningModule;
            set({ learningModule: data, moduleLoading: false });
        } catch (error) {
            set({ moduleError: 'Error fetching learning module' + (error as Error).message, moduleLoading: false });
        }
    },
    createPerformanceRecord: async (moduleCode: string, lessonDetails?: LessonDetails, exerciseDetails?: Partial<ExerciseDetails>) => {
        const token = useAuthStore.getState().accessToken;
        try {
            if (exerciseDetails) {
                const response = await fetch(BACKEND_API_URL + `/performance/performanceRecordFromExcerciseDetails/` + exerciseDetails.exerciseCode, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': `${token}`,
                    },
                });

                const data1: PerformanceRecord | null = await response.json();
                if (data1){
                    if (data1?.exerciseDetails) {
                        exerciseDetails = {...data1.exerciseDetails, attempt: data1.exerciseDetails.attempt? data1.exerciseDetails.attempt+1 : 1, answers: data1.exerciseDetails.answers? data1.exerciseDetails.answers + "\n\n ## Next Attempt: \n\n" +  exerciseDetails.answers: exerciseDetails.answers, score: exerciseDetails.score};
                    }
                    if (!response.ok) throw new Error('Failed to get exercise record');
    
                    const response2 = await fetch(BACKEND_API_URL + `/performance/performanceRecords/` + data1?._id, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': `${token}`,
                        },
                        body: JSON.stringify({ exerciseDetails }),
                    });
                    set((state) => ({
                        performanceRecords: state.performanceRecords ? [...state.performanceRecords, data1] : [data1],
                    }));
                    console.log(response2);
                } else {
                    // First attempt
                    const response = await fetch(BACKEND_API_URL + `/performance/createRecord`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': `${token}`,
                        },
                        body: JSON.stringify({ moduleCode, lessonDetails, exerciseDetails: {...exerciseDetails, attempt: 1} }),
                    });
                    if (!response.ok) throw new Error('Failed to create performance record');
                    const data = await response.json();
                    set((state) => ({
                        performanceRecords: state.performanceRecords ? [...state.performanceRecords, data] : [data],
                    }));
                    // Set user score to the new score
                    const user = useUserStore.getState().user;
                    if (user) {
                        const updatedUser = {
                            ...user,
                            student_details: {...user.student_details, game_points: user.student_details.game_points ? user.student_details.game_points + (exerciseDetails.score || 0) : (exerciseDetails.score || 0)},
                        };
                        useUserStore.setState({ user: updatedUser });
                    }
                    console.log(data);
                }
            } else {
                // Lesson
                const response = await fetch(BACKEND_API_URL + `/performance/createRecord`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': `${token}`,
                    },
                    body: JSON.stringify({ moduleCode, lessonDetails, exerciseDetails }),
                });
                if (!response.ok) throw new Error('Failed to create performance record');
                const data = await response.json();
                console.log(data);
                set((state) => ({
                    performanceRecords: state.performanceRecords ? [...state.performanceRecords, data] : [data],
                }));
                await useLearningStore.getState().fetchLearningModule(moduleCode);
                const classroomCode = useClassroomStore.getState().classroom?.classroom_code;
                await useClassroomStore.getState().fetchClassroom(classroomCode || '');
            }
            
        } catch (error) {
            console.error('Error creating performance record', (error as Error).message);
        }
    },
    fetchPerformanceRecords: async () => {
        const token = useAuthStore.getState().accessToken;
        try {
            const response = await fetch(BACKEND_API_URL + `/performance/performanceRecords`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch performance records');
            const data = await response.json();
            set({ performanceRecords: data });
        } catch (error) {
            console.error('Error fetching performance records', (error as Error).message);
        }
    },
}));

export default useLearningStore;
