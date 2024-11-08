// src/store/authStore.ts
import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import {ApiRoutes} from "../../../../backend/src/app";
import { hc } from "hono/client";
import { mutate } from "swr";
import { userKey } from "@/hooks/useUser";
import { unitsKey } from "@/hooks/useUnit";
import useClassStore from "./classStore";

export const client = hc<ApiRoutes>("/");

// Define the shape of the state
interface AuthState {
    accessToken: string | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<string | void>;
    register: (
        name: string,
        email: string,
        password: string,
        school: string
    ) => Promise<string | void>;
    logout: () => void;
    autoLogin: () => void;
    updatePassword: (
        oldPassword: string,
        newPassword: string
    ) => Promise<string | void>;
}

type AuthPersist = (
    config: StateCreator<AuthState>,
    options: PersistOptions<AuthState>
) => StateCreator<AuthState>;

// Create Zustand store with persistent middleware
const useAuthStore = create<AuthState>(
    (persist as AuthPersist)(
        (set, get) => ({
            accessToken: null,
            isLoggedIn: false,

            // Login action
            login: async (email, password) => {
                try {
                    const response = await client.api.v1.auth["login"].$post({ json: {email, password}});

                    if (!response.ok){
                        return await response.text();
                    }
                    const data = await response.json();
                    console.log("Data: " + data.token);
                    set({
                        accessToken: data.token,
                        isLoggedIn: true,
                    });

                    get().autoLogin();
                } catch (error) {
                    return (error as Error).message || "An error occurred";
                }
            },

            // Register action
            register: async (name, email, password, school) => {
                try {
                    const response = await client.api.v1.auth.registerStudent.$post({ json: {
                        name,
                        email,
                        password,
                        school
                    }})

                    if (!response.ok) {
                        return await response.text();
                    }

                    const data = await response.json();
                    console.log("Data: " + data.token);
                    // Set user data

                    set({
                        accessToken: data.token,
                        isLoggedIn: true,
                    });

                    get().autoLogin();

                } catch (error) {
                    return (error as Error).message || "An error occurred";
                }
            },

            // Logout action
            logout: () => {
                set({
                    accessToken: null,
                    isLoggedIn: false,
                });

                // Clear out everything else
                const classId = useClassStore.getState().classroomId;
                if (classId) {
                    mutate('/classroom/' + classId, null, { revalidate: false });
                    mutate(unitsKey + classId, null, { revalidate: false });
                }
                mutate(userKey, null, { revalidate: false });
                
            },

            // Auto-login if token is found in localStorage
            autoLogin: async () => {
                const token = get().accessToken;
                console.log("Token: " + token);
                if (token) {
                    // Verify token
                    const response = await client.api.v1.auth.profile.$get({},
                        {
                            headers: {
                                "Authorization" : `Bearer ${token}`
                            }
                        }
                    );

                    if (!response.ok) {
                        set({
                            accessToken: null,
                            isLoggedIn: false,
                        })
                        return await response.text();
                    }
                    if (response.ok) {
                        const user = await response.json();
                        mutate(userKey, (currentData) => ({
                            ...currentData,
                            ...user
                        }), {
                            revalidate: false,
                        });
                        set({
                            accessToken: token,
                            isLoggedIn: true,
                        });
                    } else {
                        set({
                            accessToken: null,
                            isLoggedIn: false,
                        });
                    }
                }
            },

            // Update password action
            updatePassword: async (oldPassword, newPassword) => {
                try {
                    const token = get().accessToken;
                    if (!token) {
                        return "User not logged in. Please log in again.";
                    }
                    const response = await client.api.v1.auth.updatePassword.$put(
                        {
                            json: {
                                oldPassword,
                                password: newPassword
                            }
                        },
                        {
                            headers: {
                                "Authorization" : `Bearer ${token}`
                            }
                        }
                    )

                    if (!response.ok) {
                        return await response.text();
                    }

                    return;
                } catch (error) {
                    return (error as Error).message || "An error occurred";
                }
            },
        }),
        {
            name: "auth-storage", // Key for localStorage
        }
    )
);

export default useAuthStore;
