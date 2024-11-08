import { create } from 'zustand';
import { LearningModule } from '@/types/dbTypes';
import { BACKEND_API_URL } from './authStore';

interface LearningStore {
    learningModules: LearningModule[] | null;
    moduleLoading: boolean;
    moduleError: string | null;
    fetchLearningModules: () => Promise<void>;
}

const useLearningStore = create<LearningStore>((set) => ({
    learningModules: null,
    moduleLoading: false,
    moduleError: null,
    fetchLearningModules: async () => {
        set({ moduleLoading: true, moduleError: null });
        try {
            const response = await fetch(BACKEND_API_URL + `/learning/learning-modules-full`);
            const data = await response.json() as LearningModule[];
            set({ learningModules: data, moduleLoading: false });
        } catch (error) {
            set({ moduleError: 'Error fetching learning modules: ' + (error as Error).message, moduleLoading: false });
        }
    },
}));

export default useLearningStore;