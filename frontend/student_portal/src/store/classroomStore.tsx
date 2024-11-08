import {create} from "zustand";
import { Classroom } from "@/types/dbTypes";
import useAuthStore, { BACKEND_API_URL } from "./authStore";

interface ClassroomStore {
    classroom: Classroom | null;
    classroomLoading: boolean;
    classroomError: string | null;
    fetchClassroom: (classroomCode: string) => Promise<void>;
}

export const useClassroomStore = create<ClassroomStore>((set) => ({
    classroom: null,
    classroomLoading: false,
    classroomError: null,

    // Fetch classroom details
    fetchClassroom: async (classroomCode: string) => {
        set({ classroomLoading: true, classroomError: null });
        const token = useAuthStore.getState().accessToken;
        try {
            const response = await fetch(BACKEND_API_URL + `/classroom/classroomsProgress/${classroomCode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": `${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch classroom");
            const data = await response.json();
            set({ classroom: data });
        } catch (error) {
            set({ classroomError: (error as Error).message });
        } finally {
            set({ classroomLoading: false });
        }
    },

}));
