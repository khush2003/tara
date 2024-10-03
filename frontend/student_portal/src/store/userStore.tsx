import {create} from "zustand";
import { User } from "@/types/dbTypes"; // Assuming you have defined your user types
import useAuthStore, { BACKEND_API_URL } from "./authStore";
import { useClassroomStore } from "./classroomStore";

interface UserStore {
    user: User | null;
    userLoading: boolean;
    userError: string | null;
    classroomJoined: boolean | null;
    addCurrentUserToClassroom: (classroomId: string) => Promise<void>;
    fetchCurrentUser: (fetchClassroom?: boolean) => Promise<void>;
}

/**
 * Custom hook to manage user state and actions.
 * 
 * @returns {UserStore} The user store state and actions.
 * 
 * @property {User | null} user - The current user object.
 * @property {boolean} userLoading - Indicates if the user data is being loaded.
 * @property {string | null} userError - Error message if user data fetching fails.
 * @property {boolean | null} classroomJoined - Indicates if the user has joined a classroom.
 * 
 * @method fetchCurrentUser - Fetches the current user details from the backend.
 * @param {boolean} fetchClassroom - Optional parameter to fetch classroom details if true.
 * 
 * @method addCurrentUserToClassroom - Adds the current user to a specified classroom.
 * @param {string} classroomId - The ID of the classroom to add the user to.
 */
export const useUserStore = create<UserStore>((set) => ({
    user: null,
    userLoading: false,
    userError: null,
    classroomJoined: null,

    // Fetch user details
    fetchCurrentUser: async (fetchClassroom) => {
        const token = useAuthStore.getState().accessToken;
        set({ userLoading: true, userError: null });
        try {
            const response = await fetch(BACKEND_API_URL + `/auth/profile`, {
                headers: { "auth-token": `${token}`, },
            });  
            if (!response.ok) throw new Error("Failed to fetch user");
            const data = await response.json() as User;
            set({ user: data });
            if (fetchClassroom) {
                const classroomCode = data?.student_details.classroom_code;
                if (classroomCode) {
                    useClassroomStore.getState().fetchClassroom(classroomCode);
                    if (useClassroomStore.getState().classroomError) {
                        set({ classroomJoined: false });
                    } else {
                        set({ classroomJoined: true });
                    }
                } else {
                    set({ classroomJoined: false });
                }
        }
        } catch (error) {
            set({ userError: (error as Error).message });
            
        } finally {
            set({ userLoading: false });
        }
    },


    // Add user to a classroom
    addCurrentUserToClassroom: async (classroomId: string) => {
        const userId = useAuthStore.getState().user?.user_id;
        try {
            const response = await fetch(BACKEND_API_URL + `/classroom/addStudentToClassroom`, {
                method: "PUT",
                body: JSON.stringify({ classroom_code: classroomId, student_id: userId } ),
            });
            if (!response.ok) throw new Error("Failed to add user to classroom");
            const updatedUser = await response.json();
            set({ user: updatedUser });
        } catch (error) {
            set({ userError: (error as Error).message });
        }
    },
}));
