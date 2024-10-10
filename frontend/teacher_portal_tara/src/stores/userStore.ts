import { create } from "zustand";
import { User } from "@/types/dbTypes"; // Assuming you have defined your user types
import useAuthStore, { BACKEND_API_URL } from "./authStore";

interface TeacherStore {
    user: User | null;
    userLoading: boolean;
    userError: string | null;
    fetchCurrentUser: (fetchClassroom?: boolean) => Promise<void>;
}


export const useTeacherStore = create<TeacherStore>((set) => ({
    user: null,
    userLoading: false,
    userError: null,

    // Fetch teacher details
    fetchCurrentUser: async () => {
        const token = useAuthStore.getState().accessToken;
        set({ userLoading: true, userError: null });
        try {
            const response = await fetch(BACKEND_API_URL + `/auth/profile`, {
                headers: { "auth-token": `${token}`, },
            });  
            if (!response.ok) throw new Error("Failed to fetch user");
            const data = await response.json() as User;
            set({ user: data });
        } catch (error) {
            set({ userError: (error as Error).message });
        } finally {
            set({ userLoading: false });
        }
    },


}));