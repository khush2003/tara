import { create } from 'zustand';
import { Classroom } from '@/types/dbTypes';
import useAuthStore, { BACKEND_API_URL } from './authStore';

interface ClassroomStore {
    classrooms: Classroom[] | null;
    classroomLoading: boolean;
    classroomError: string | null;
    createClassroom: (classroomName: string, learningModules: string[]) => Promise<string | void>;
    setTodayLesson: (lessonCode: string, classroomCode: string, callFunction?: () => void) => void;
    postAnnouncement: (classroomCode: string, announcement: string, callFunction?: () => void) => void;
    setIsGameActive: (classroomCode: string, isGameActive: boolean, callFunction?: () => void) => void;
    updateLearningModules: (classroomCode: string, learningModules: string[], callFunction?: () => void) => void;
    awardExtraPoints: (classroomCode: string, studentId: string, points: number, reason: string, callFunction?: () => void) => void;
    addFeedback: (performanceRecordId: string, feedback: string, score:number, callFunction?: () => void) => void;
    fetchAllClassrooms: () => Promise<void>;
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


    fetchAllClassrooms: async () => {
        set({ classroomLoading: true, classroomError: null });
        const token = useAuthStore.getState().accessToken;
        try {
            const response = await fetch(BACKEND_API_URL + `/classroom/classroomsTeacher`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch classroom');
            const data: Classroom[] = await response.json();
            set({ classrooms: data, classroomLoading: false });
        } catch (error) {
            set({ classroomError: 'Error fetching classroom: ' + (error as Error).message, classroomLoading: false });
        }
    },

    setTodayLesson: (lessonCode: string, classroomCode: string, callFunction?: () => void) => {
        const token = useAuthStore.getState().accessToken;

        fetch(BACKEND_API_URL + `/classroom/setTodaysLesson`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `${token}`,
            },
            body: JSON.stringify({ classroom_code: classroomCode, module_code: lessonCode }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Failed to set today\'s lesson');
                }
                const data = await response.json();
                console.log(data);
                set((state) => {
                    if (!state.classrooms) return state;
                    const updatedClassrooms = state.classrooms.map((classroom) => {
                        if (classroom.classroom_code === classroomCode) {
                            return {
                                ...classroom,
                                today_lesson: data.today_lesson,
                            };
                        }
                        return classroom;
                    });
                    if (callFunction) callFunction();
                    return { ...state, classrooms: updatedClassrooms };
                });
            })
            .catch((error) => {
                set({ classroomError: 'Error setting today\'s lesson: ' + error.message });
            });
    },
    postAnnouncement: (classroomCode: string, announcement: string, callFunction?: () => void) => {
        const token = useAuthStore.getState().accessToken;

        fetch(BACKEND_API_URL + `/classroom/updateClassAnnouncement`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `${token}`,
            },
            body: JSON.stringify({ classroom_code: classroomCode, announcement }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Failed to post announcement');
                }
                const data = await response.json();
                set((state) => {
                    if (!state.classrooms) return state;
                    const updatedClassrooms = state.classrooms.map((classroom) => {
                        if (classroom.classroom_code === classroomCode) {
                            return {
                                ...classroom,
                                announcement: data.announcement,
                            };
                        }
                        return classroom;
                    });
                    if (callFunction) callFunction();
                    return { ...state, classrooms: updatedClassrooms };
                });
            })
            .catch((error) => {
                set({ classroomError: 'Error posting announcement: ' + error.message });
            });
    },

    setIsGameActive: (classroomCode: string, isGameActive: boolean, callFunction?: () => void) => {
        const token = useAuthStore.getState().accessToken;

        fetch(BACKEND_API_URL + `/classroom/setGameActivity`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `${token}`,
            },
            body: JSON.stringify({ classroom_code: classroomCode, is_game_active: isGameActive }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Failed to set game activity');
                }
                const data = await response.json();
                set((state) => {
                    if (!state.classrooms) return state;
                    const updatedClassrooms = state.classrooms.map((classroom) => {
                        if (classroom.classroom_code === classroomCode) {
                            return {
                                ...classroom,
                                is_game_active: data.is_game_active,
                            };
                        }
                        return classroom;
                    });
                    if (callFunction) callFunction();
                    return { ...state, classrooms: updatedClassrooms };
                });
            })
            .catch((error) => {
                set({ classroomError: 'Error setting game activity: ' + error.message });
            });
    },

    updateLearningModules: (classroomCode: string, learningModules: string[], callFunction?: () => void) => {
        const token = useAuthStore.getState().accessToken;

        fetch(BACKEND_API_URL + `/classroom/updateLearningModules`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `${token}`,
            },
            body: JSON.stringify({ classroom_code: classroomCode, learning_modules: learningModules }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Failed to update learning modules');
                }
                const data = await response.json();
                set((state) => {
                    if (!state.classrooms) return state;
                    const updatedClassrooms = state.classrooms.map((classroom) => {
                        if (classroom.classroom_code === classroomCode) {
                            return {
                                ...classroom,
                                learning_modules: data.learning_modules,
                            };
                        }
                        return classroom;
                    });
                    if (callFunction) callFunction();
                    return { ...state, classrooms: updatedClassrooms };
                });
            })
            .catch((error) => {
                set({ classroomError: 'Error updating learning modules: ' + error.message });
            });
    },

    awardExtraPoints: (classroomCode: string, studentId: string, points: number, reason: string, callFunction?: () => void) => {
        const token = useAuthStore.getState().accessToken;

        fetch(BACKEND_API_URL + `/classroom/awardExtraPoints`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `${token}`,
            },
            body: JSON.stringify({ classroom_code: classroomCode, student_id: studentId, points, reason }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Failed to award extra points');
                }
                const data = await response.json();
                set((state) => {
                    if (!state.classrooms) return state;
                    const updatedClassrooms = state.classrooms.map((classroom) => {
                        if (classroom.classroom_code === classroomCode) {
                            return {
                                ...classroom,
                                extra_points_award: data.extra_points_award,
                            };
                        }
                        return classroom;
                    });
                    if (callFunction) callFunction();
                    return { ...state, classrooms: updatedClassrooms };
                });
            })
            .catch((error) => {
                set({ classroomError: 'Error awarding extra points: ' + error.message });
            });
    },
    addFeedback: (performanceRecordId: string, feedback: string, score: number,  callFunction?: () => void) => {
        const token = useAuthStore.getState().accessToken;

        fetch(BACKEND_API_URL + `/performance/performanceRecords/` + performanceRecordId +  '/addFeedback', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `${token}`,
            },
            body: JSON.stringify({  feedback, score }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error('Failed to add feedback');
                }
                const data = await response.json();
                set((state) => {
                    if (!state.classrooms) return state;
                    const updatedClassrooms = state.classrooms.map((classroom) => {
                        const updatedPerformanceRecords = classroom.performance_records.map((performanceRecord) => {
                            if (typeof performanceRecord === 'string') {
                                return performanceRecord;
                            }
                            if (performanceRecord._id === performanceRecordId) {
                                return {
                                    ...performanceRecord,
                                    feedback: data.feedback,
                                };
                            }
                            return performanceRecord;
                        });
                        return {
                            ...classroom,
                            performance_records: updatedPerformanceRecords,
                        };
                    });
                    if (callFunction) callFunction();
                    return { ...state, classrooms: updatedClassrooms };
                });
            })
            .catch((error) => {
                set({ classroomError: 'Error adding feedback: ' + error.message });
            });
    }
}));

export default useClassroomStore;