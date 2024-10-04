import {create} from 'zustand';
import { LearningModule} from '@/types/dbTypes';
import { BACKEND_API_URL } from './authStore';

interface LearningStore {
    learningModule: LearningModule | null;
    moduleLoading: boolean;
    moduleError: string | null;
    fetchLearningModule: (moduleCode: string) => Promise<void>;
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
            console.log(data);
            set({ learningModule: data, moduleLoading: false });
        } catch (error) {
            set({ moduleError: 'Error fetching learning module' + (error as Error).message, moduleLoading: false });
        }
    },
}));

export default useLearningStore;
