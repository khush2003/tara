// src/store/authStore.ts
import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

export const BACKEND_API_URL = "http://localhost:8080";

// Define the shape of the state
interface AuthState {
    accessToken: string | null;
    user: { user_id: string; name: string; email: string } | null;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<string | void>;
    register: (
        name: string,
        email: string,
        password: string,
        profilePicture?: string
    ) => Promise<string | void>;
    logout: () => void;
    autoLogin: () => void;
    updateProfile: (
        name: string,
        email: string,
        profilePicture?: string | undefined
    ) => Promise<string | void>;
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
            user: null,
            isLoggedIn: false,

            // Login action
            login: async (email, password) => {
                try {
                    const response = await fetch(
                        BACKEND_API_URL + "/auth/login",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ email, password }),
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        return errorData.message || "Login failed";
                    }

                    const data = await response.json();
                    set({
                        accessToken: data.token,
                        user: {
                            user_id: data.user_id,
                            name: data.name,
                            email: data.email,
                        },
                        isLoggedIn: true,
                    });
                } catch (error) {
                    return (error as Error).message || "An error occurred";
                }
            },

            // Register action
            register: async (name, email, password, profilePicture?) => {
                try {
                    const response = await fetch(
                        BACKEND_API_URL + "/auth/registerStudent",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                name,
                                email,
                                password,
                                profile_picture: profilePicture,
                            }),
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        return errorData.message || "Registration failed";
                    }

                    const data = await response.json();
                    set({
                        accessToken: data.token,
                        user: {
                            user_id: data.user_id,
                            name: data.name,
                            email: data.email,
                        },
                        isLoggedIn: true,
                    });
                } catch (error) {
                    return (error as Error).message || "An error occurred";
                }
            },

            // Logout action
            logout: () => {
                set({
                    accessToken: null,
                    user: null,
                    isLoggedIn: false,
                });
            },

            // Auto-login if token is found in localStorage
            autoLogin: async () => {
                const token = get().accessToken;
                // console.log("Token: " + token);
                if (token) {
                    // Verify token by calling the /me endpoint
                    const response = await fetch(BACKEND_API_URL + "/auth/me", {
                        method: "GET",
                        headers: {
                            "auth-token": token,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Invalid token");
                    }
                    if (response.ok) {
                        const user = await response.json();

                        set({
                            accessToken: token,
                            user: {
                                user_id: user._id,
                                name: user.name,
                                email: user.email,
                            },
                            isLoggedIn: true,
                        });
                    } else {
                        localStorage.removeItem("accessToken");
                    }
                }
            },

            // Update profile action
            updateProfile: async (name, email, profilePicture?) => {
                try {
                    const token = get().accessToken;
                    console.log("Token: " + token);
                    if (!token) {
                        return "User not logged in. Please log in again.";
                    }
                    const response = await fetch(BACKEND_API_URL + "/auth/me", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": token,
                        },
                        body: JSON.stringify({ name, email, profilePicture }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        return errorData.message || "Update failed";
                    }

                    if (response.ok) {
                        const user = await response.json();
                        set({
                            accessToken: token,
                            user: {
                                user_id: user._id,
                                name: user.name,
                                email: user.email,
                            },
                            isLoggedIn: true,
                        });
                    }

                    return;
                } catch (error) {
                    return (error as Error).message || "An error occurred";
                }
            },

            // Update password action
            updatePassword: async (oldPassword, newPassword) => {
                try {
                    const token = get().accessToken;
                    if (!token) {
                        return "User not logged in. Please log in again.";
                    }
                    const response = await fetch(
                        BACKEND_API_URL + "/auth/me/updatePassword",
                        {
                            method: "PUT",
                            headers: {
                                "auth-token": token,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                oldPassword,
                                password: newPassword,
                            }),
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        return errorData.message || "Update failed";
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
