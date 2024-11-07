
import { create } from 'zustand'

interface Exercise {
    title: string
    description: string
    instruction: string
    order: number
  exercise_type: string
  exercise_content: object[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  correct_answers: any
  is_instant_scored: boolean
  max_score: number
  varients: unknown[]
}

interface ExerciseState {
  exercise: Exercise | null
  submitted: boolean
  firstSubmission: boolean
  answersString: string
  score: number | null
  scorePercentage: number | null
  showConfetti: boolean
  setExercise: (exercise: Exercise | null) => void
  setSubmitted: (submitted: boolean) => void
  setAnswersString: (answersString: string) => void
  handleComplete: (correctCount: number, totalQuestions: number) => void
  reset: () => void
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercise: null,
  submitted: false,
  firstSubmission: true,
  answersString: "",
  score: null,
  scorePercentage: null,
  showConfetti: false,

  setExercise: (exercise) => {
    set({
      exercise,
      submitted: false,
      firstSubmission: true,
      answersString: "",
      score: null,
      scorePercentage: null,
      showConfetti: false,
    })
  },

  setSubmitted: (submitted) => set({ submitted }),
  
  setAnswersString: (answersString) => set({ answersString }),

  handleComplete: () => {
    
  },

  reset: () => set({
    submitted: false,
    score: null,
    scorePercentage: null,
  }),
}))