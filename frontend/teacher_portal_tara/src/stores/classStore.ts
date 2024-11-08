import { create } from "zustand";

interface ClassState {
    classroomId: string | null;
    isClassroomJoined: boolean;
    setClassroomId: (id: string) => void;
    setClassroomJoined: (isJoined: boolean) => void;
}

const useClassStore = create<ClassState>((set) => ({
    classroomId: null,
    isClassroomJoined: false,

    setClassroomId: (id) => {
        set({ classroomId: id });
    },

    setClassroomJoined: (isJoined: boolean) => {
        set({ isClassroomJoined: isJoined });
    },

}));

export default useClassStore;