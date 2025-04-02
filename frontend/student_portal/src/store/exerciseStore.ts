import { create } from "zustand";
import { completeLesson, submitExercise } from "@/api/userApi";
import { Lesson } from "@/types/dbTypes";
import { mutate } from "swr";
import { userKey } from "@/hooks/useUser";


interface Exercise {
    dropItems?: { id: string; content: string; type: string; alt?: string }[];
    title: string;
    description: string;
    instruction: string;
    order: number;
    exercise_type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exercise_content: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    correct_answers: any;
    is_instant_scored: boolean;
    max_score: number;
    varients: unknown[];
}

interface ExerciseState {
    exercise: Exercise | null;
    lesson: Lesson | null;
    submitted: boolean;
    firstSubmission: boolean;
    answersString: string;
    score: number | null;
    showConfetti: boolean;
    contentId: string;
    unitId: string | null;
    classId: string;
    userAnswers: { [key: number | string]: string };
    currentGridData: { [key: string]: string };
    crosswordData: {
        across: { [key: string]: { clue: string; answer: string; row: number; col: number } };
        down: { [key: string]: { clue: string; answer: string; row: number; col: number } };
    } | null;
    dropAreas: { id: string; type: "single" | "multiple"; items: { id: string; content: string; type: string; alt?: string }[]; }[];
    setDropAreas: (updater: (dropAreas: { id: string; type: "single" | "multiple"; items: { id: string; content: string; type: string; alt?: string }[]; }[]) => { id: string; type: "single" | "multiple"; items: { id: string; content: string; type: string; alt?: string }[]; }[]) => void;
    dropItems: { id: string; content: string; type: string; alt?: string }[];
    setDropItems: (updater: (dropItems: { id: string; content: string; type: string; alt?: string }[]) => { id: string; content: string; type: string; alt?: string }[]) => void;
    setCrosswordData: (
        crosswordData: {
            across: { [key: string]: { clue: string; answer: string; row: number; col: number } };
            down: { [key: string]: { clue: string; answer: string; row: number; col: number } };
        } | null
    ) => void;
    setCurrentGridData: (currentGridData: { [key: string]: string }) => void;
    setUserAnswers: (userAnswers: { [key: number | string]: string }) => void;
    setExercise: (exercise: Exercise | null) => void;
    setSubmitted: (submitted: boolean) => void;
    setAnswersString: (answersString: string) => void;
    setFirstSubmission: (firstSubmission: boolean) => void;
    setScore: (score: number | null) => void;
    setShowConfetti: (showConfetti: boolean) => void;
    setContentId: (contentId: string) => void;
    setUnitId: (unitId: string) => void;
    setClassId: (classId: string) => void;
    handleComplete: () => void;
    setLesson: (lesson: Lesson) => void;
    error: string | undefined;
    reset: () => void;
}

// Add helper to get complete word from grid
const getWordFromGrid = (
    row: number,
    col: number,
    direction: "across" | "down",
    length: number,
    currentGridData: { [key: string]: string }
): string => {
    let word = "";
    for (let i = 0; i < length; i++) {
        if (direction === "across") {
            word += currentGridData[`${row}-${col + i}`] || "";
        } else {
            word += currentGridData[`${row + i}-${col}`] || "";
        }
    }
    return word.toUpperCase();
};

export const useExerciseStore = create<ExerciseState>((set, get) => ({
    exercise: null,
    submitted: false,
    firstSubmission: true,
    answersString: "",
    score: null,
    showConfetti: false,
    contentId: "",
    unitId: null,
    classId: "",
    error: undefined,
    userAnswers: {},
    crosswordData: null,
    currentGridData: {},
    dropAreas: [],
    dropItems: [],
    lesson: null,

    setLesson: (lesson) => set({ lesson }),
    setDropAreas: (updater) => set((state) => ({ dropAreas: typeof updater === 'function' ? updater(state.dropAreas) : state.dropAreas })),
    setDropItems: (updater) => set((state) => ({ dropItems: typeof updater === 'function' ? updater(state.dropItems) : state.dropItems })),
    setCurrentGridData: (currentGridData) => set({ currentGridData }),
    setCrosswordData: (crosswordData) => set({ crosswordData }),
    setUserAnswers: (userAnswers) => set({ userAnswers }),

    setExercise: (exercise) => {
        set({
            exercise,
        });
    },

    setSubmitted: (submitted) => set({ submitted }),
    setAnswersString: (answersString) => set({ answersString }),
    setFirstSubmission: (firstSubmission) => set({ firstSubmission }),
    setScore: (score) => set({ score }),
    setShowConfetti: (showConfetti) => set({ showConfetti }),
    setContentId: (contentId) => set({ contentId }),
    setUnitId: (unitId) => set({ unitId }),
    setClassId: (classId) => set({ classId }),

    handleComplete: async () => {
        console.log("Handling complete");

        const { exercise, crosswordData, dropAreas, setSubmitted, setScore, setAnswersString, contentId, unitId, userAnswers, classId, score } =
            get();
        console.log("Score:" + score);

        let gScore = 0;
        let gAnswersString = "";

        if (exercise?.exercise_type === "multiple_choice") {
            console.log("Handling multiple choice");
            const totalQuestions = exercise.exercise_content.length;
            const correctAnswers = exercise.correct_answers;
            let correctCount = 0;
            let answersString = "";

            Object.entries(userAnswers).forEach(([indexString, answer]) => {
                const index = parseInt(indexString, 10);
                const question = exercise.exercise_content[index];
                
                const isCorrect = correctAnswers[0][index] === answer;
                if (isCorrect) correctCount++;

                answersString += `**Question:** ${question.question}\n`;
                answersString += `**Student's Answer:** ${answer}\n`;
                answersString += `**Is Correct:** ${isCorrect}\n\n`;
            });
            

            const scorePercentage = (correctCount / totalQuestions) * 100;
            set({ score: (scorePercentage / 100) * exercise.max_score, submitted: true, answersString });

            gScore = (scorePercentage / 100) * exercise.max_score;
            gAnswersString = answersString;

            setAnswersString(answersString);
            if (scorePercentage == 100) {
                set({ showConfetti: true });
                setTimeout(() => set({ showConfetti: false }), 5000);
            }
        }
        if (exercise?.exercise_type === "crossword_puzzle" && crosswordData) {
            let correctCount = 0;
            let totalQuestions = 0;
            let localanswersString = "";

            Object.entries(crosswordData).forEach(([direction, clues]) => {
                Object.entries(clues).forEach(([number, clue]) => {
                    // Get user answer from grid position
                    const wordLength = (clue as { answer: string }).answer.length;
                    const typedClue = clue as {
                        answer: string;
                        clue: string;
                        row: number;
                        col: number;
                    };
                    const userAnswer = getWordFromGrid(
                        typedClue.row,
                        typedClue.col,
                        direction as "across" | "down",
                        wordLength,
                        get().currentGridData
                    );
                    const correctAnswer = typedClue.answer.toUpperCase();
                    const isClueCorrect = userAnswer === correctAnswer;

                    if (isClueCorrect) correctCount++;
                    totalQuestions++;

                    localanswersString += `${direction.charAt(0).toUpperCase() + direction.slice(1)} ${number}:
              Clue: ${typedClue.clue}
                Correct Answer: ${correctAnswer}
                User Answer: ${userAnswer}
                Is Correct: ${isClueCorrect}
                `;
                });
            });

            gAnswersString = localanswersString;
            // Rest of the submit logic remains the same
            setAnswersString(localanswersString);
            setSubmitted(true);
            if (exercise && exercise.is_instant_scored) {
                const scorePercentage = (correctCount / totalQuestions) * 100;
                const finalScore = Math.round((scorePercentage / 100) * exercise.max_score);
                setScore(finalScore);
                gScore = finalScore;
                if (scorePercentage == 100) {
                    set({ showConfetti: true });
                    setTimeout(() => set({ showConfetti: false }), 5000);

                }
            }
        }
        if (exercise?.exercise_type === "drag_and_drop" && exercise.dropItems) {
            let correctCount = 0;
            let totalQuestions = 0;
            let localAnswersString = "";

            dropAreas.forEach((area, index) => {
                const correctAnswers = exercise.correct_answers[index] || [];
                const userAnswers = area.items.map((item) => item.id);

                localAnswersString += `**Group** ${index + 1}:\n`;
                localAnswersString += `**Correct Answers**: \n`;

                correctAnswers.forEach((answerId: string) => {
                    const item = exercise.dropItems?.find((i) => i.id === answerId);
                    if (item) {
                        if (item.type === "image") {
                            localAnswersString += `- Image: ${item.content} (Alt: ${item.alt || "No alt text"})\n`;
                        } else {
                            localAnswersString += `- Text: ${item.content}\n`;
                        }
                    }
                });
                localAnswersString += `**User Answers**: \n`;
                userAnswers.forEach((answerId) => {
                    const item = exercise.dropItems?.find((i) => i.id === answerId);
                    if (item) {
                        if (item.type === "image") {
                            localAnswersString += `- Image: ${item.content} (Alt: ${item.alt || "No alt text"})\n`;
                        } else {
                            localAnswersString += `- Text: ${item.content}\n`;
                        }
                    }
                });

                if (area.type === "single") {
                    if (userAnswers.length === 1 && correctAnswers.includes(userAnswers[0])) {
                        correctCount++;
                    }
                    totalQuestions++;
                } else {
                    const correctSet = new Set(correctAnswers);
                    const userSet = new Set(userAnswers);
                    if (correctSet.size === userSet.size && [...correctSet].every((answer) => userSet.has(answer as string))) {
                        correctCount++;
                    }
                    totalQuestions++;
                }

                localAnswersString += `Is Correct: ${correctCount === totalQuestions}\n\n`;
            });

            gAnswersString = localAnswersString;
            setAnswersString(localAnswersString);

            if (exercise.is_instant_scored) {
                const scorePercentage = (correctCount / totalQuestions) * 100;
                const finalScore = Math.round((scorePercentage / 100) * exercise.max_score);
                setScore(finalScore);
                gScore = finalScore;
                if (scorePercentage == 100) {
                    set({ showConfetti: true });
                    setTimeout(() => set({ showConfetti: false }), 5000);

                }
            }
        }
        if (exercise?.exercise_type === "fill_in_the_blanks") {
            let correctCount = 0;
            let totalBlanks = 0;
            let answersString = "";

            exercise.exercise_content.forEach((content, contentIndex) => {
                answersString += `Text: ${content.text}\n\n`;
                content.blanks.forEach((_blank: unknown, blankIndex: number) => {
                    const userAnswer = userAnswers[`${contentIndex}-${blankIndex}`] || "";
                    const correctAnswer = exercise.correct_answers[contentIndex][blankIndex] || "";
                    const isCorrect = userAnswer.trim().toLowerCase().replace(/\.$/, '') === correctAnswer.trim().toLowerCase().replace(/\.$/, '');

                    if (isCorrect) correctCount++;
                    totalBlanks++;

                    answersString += `**Blank ${blankIndex + 1}:**\n`;
                    answersString += `**Student's Answer:** ${userAnswer}\n`;
                    if (exercise.is_instant_scored) answersString += `**Correct Answer:** ${correctAnswer}\n`;
                    if (exercise.is_instant_scored) {
                        answersString += `**Is Correct:** ${isCorrect}\n`;
                    }
                    answersString += "\n";
                });
            });

            setAnswersString(answersString);
            gAnswersString = answersString;

            setSubmitted(true);
            if (exercise.is_instant_scored) {
                const scorePercentage = totalBlanks > 0 ? (correctCount / totalBlanks) * 100 : 100;
                const finalScore = Math.round((scorePercentage / 100) * exercise.max_score);
                setScore(finalScore);
                gScore = finalScore;
                if (scorePercentage == 100) {
                    set({ showConfetti: true });
                    setTimeout(() => set({ showConfetti: false }), 5000);

                }
            }
        }
        if (exercise?.exercise_type === "images_with_input") {
            let correctCount = 0;
            let totalQuestions = 0;
            let answersString = "";

            exercise.exercise_content.slice(1).forEach((content, index) => {


                const userAnswer = userAnswers[index] || "";
                const isCorrect = exercise.correct_answers[index]
                    ? userAnswer.trim().toLowerCase() === exercise.correct_answers[index].trim().toLowerCase()
                    : true;

                if (isCorrect) correctCount++;
                totalQuestions++;

                if (content.image_url) answersString += `Image URL: ${content.image_url}\n`;
                answersString += `Question: ${content.question || "No question provided"}\n`;
                answersString += `Student's Answer: ${userAnswer}\n`;
                if (exercise.is_instant_scored) answersString += `Correct Answer: ${exercise.correct_answers[index]}\n`;
                if (exercise.is_instant_scored) answersString += `Is Correct: ${isCorrect}\n`;
                answersString += "\n";
                
            });

            console.log("Answers String: " + answersString);

            setAnswersString(answersString);
            gAnswersString = answersString;
            setSubmitted(true);
            if (exercise.is_instant_scored) {
                const scorePercentage = (correctCount / totalQuestions) * 100;
                const finalScore = Math.round((scorePercentage / 100) * exercise.max_score);
                setScore(finalScore);
                gScore = finalScore;

                if (scorePercentage == 100) {
                    set({ showConfetti: true });
                    setTimeout(() => set({ showConfetti: false }), 5000);

                }
            }
        }
        if (exercise && exercise.exercise_type === "text_with_input") {
            let correctCount = 0;
            let answersString = "";

            exercise.exercise_content.forEach((content, index) => {
                const userAnswer = userAnswers[index] || "";
                const isCorrect = exercise.correct_answers[index]
                    ? userAnswer.trim().toLowerCase() === exercise.correct_answers[index].trim().toLowerCase()
                    : true;

                if (isCorrect) correctCount++;

                if (content.question) answersString += `**Question**: ${content.question} \n`;
                if (content.context) answersString += `**Context**: ${content.context}\n`;
                if (content.answerType != "none") answersString += `**Student's Answer**: ${userAnswer}\n`;
                if (exercise.is_instant_scored && content.answerType != "none") answersString += `**Is Correct**: ${isCorrect}\n`;
                answersString += "\n";
            });

            setAnswersString(answersString);
            gAnswersString = answersString;
            setSubmitted(true);
            if (exercise.is_instant_scored) {
                const scorePercentage = (correctCount / exercise.exercise_content.length) * 100;
                const finalScore = Math.round((scorePercentage / 100) * exercise.max_score);
                setScore(finalScore);
                gScore = finalScore;

                if (scorePercentage == 100) {
                    set({ showConfetti: true });
                    setTimeout(() => set({ showConfetti: false }), 5000);

                }
            }
        }
        if (exercise && exercise.exercise_type === "text_with_questions") {
            let correctCount = 0;
            let totalQuestions = 0;
            let answersString = "";

            exercise.exercise_content.forEach((content, contentIndex) => {
                answersString += `Context: ${content.context}\n\n`;
                content.questions.forEach((question: { question: unknown }, questionIndex: string | number) => {
                    const userAnswer = userAnswers[`${contentIndex}-${questionIndex}`] || "";
                    const isCorrect = exercise.correct_answers[contentIndex][questionIndex]
                        ? userAnswer.trim().toLowerCase() === exercise.correct_answers[contentIndex][questionIndex].trim().toLowerCase()
                        : true;

                    if (isCorrect) correctCount++;
                    totalQuestions++;

                    if (question.question) answersString += `**Question:** ${question.question}\n`;
                    answersString += `**Student's Answer**: ${userAnswer}\n`;
                    if (exercise.is_instant_scored) answersString += `**Is Correct**: ${isCorrect}\n`;
                    answersString += "\n";
                });
            });

            setAnswersString(answersString);
            gAnswersString = answersString;
            setSubmitted(true);
            if (exercise.is_instant_scored) {
                const scorePercentage = (correctCount / totalQuestions) * 100;
                const finalScore = Math.round((scorePercentage / 100) * exercise.max_score);
                setScore(finalScore);
                gScore = finalScore;

                if (scorePercentage == 100) {
                    set({ showConfetti: true });
                    setTimeout(() => set({ showConfetti: false }), 5000);

                }
            }
        }

        console.log("Submitting");
        set({ submitted: true, firstSubmission: false });
        if (exercise) {
            console.log("Submitting exercise");
            console.log(exercise);
            const error = await submitExercise(
                contentId,
                { score: gScore != null ? gScore : undefined, answers: gAnswersString },
                unitId || "",
                classId
            );
            mutate(userKey)
            set({ error });
        } else {
            const error = await completeLesson(contentId, classId, unitId || "");
            set({ error });
        }
    },
    reset: () =>
        set({
            submitted: false,
            score: null,
            exercise: null,
            error: undefined,
            lesson: null,
            answersString: "",
            showConfetti: false,
            userAnswers: {},
            currentGridData: {},
            dropAreas: [],
            dropItems: [],
            crosswordData: null,
        }),
}));
