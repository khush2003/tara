import { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Confetti } from "./confetti";
import { useExerciseStore } from "@/store/exerciseStore";

const springTransition = { type: "spring", stiffness: 300, damping: 30 };

export default function FillInTheBlanksViewer() {
    const {
        exercise,
        score,
        showConfetti,
        userAnswers,
        setUserAnswers,
        setScore,
        setSubmitted,
        unitId,
        setExercise,
        handleComplete,
        setFirstSubmission,
        submitted,
    } = useExerciseStore();
    const [jsonInput, setJsonInput] = useState<string>("");

    const handleJsonSubmit = () => {
        try {
            const parsedExercise = JSON.parse(jsonInput);
            setExercise(parsedExercise);
            setUserAnswers({});
            setScore(null);
            setSubmitted(false);
            setFirstSubmission(true);
        } catch (error) {
            console.error("Invalid JSON:", error);
            alert("Invalid JSON. Please check your input.");
        }
    };

    const handleAnswerChange = (contentIndex: number, blankIndex: number, value: string) => {
        setUserAnswers(({
            ...userAnswers,
            [`${contentIndex}-${blankIndex}`]: value,
        }));
        if (submitted) {
            setSubmitted(false);
        }
    };

    const renderExerciseContent = () => {
        return (
            <div className="space-y-6">
                {exercise?.exercise_content.map((content, contentIndex) => {
                    const textParts = content.text?.split(/\[blank\]/g);
                    return (
                        <Card key={contentIndex} className="rounded-xl overflow-hidden">
                            <CardContent className="p-6 bg-green-50">
                                <div className="mb-4 whitespace-pre-wrap">
                                    {textParts?.map((part: string, index: number) => (
                                        <span key={index}>
                                            {part.split("\n").map((line, lineIndex) => (
                                                <span key={lineIndex}>
                                                    {lineIndex > 0 && <br />}
                                                    {line}
                                                </span>
                                            ))}
                                            {index < textParts.length - 1 && content.blanks[index] && (
                                                <Input
                                                    value={userAnswers[`${contentIndex}-${index}`] || ""}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                        handleAnswerChange(contentIndex, index, e.target.value)
                                                    }
                                                    className="w-32 inline-block bg-white dark:bg-gray-800"
                                                    placeholder={content.blanks[index]?.hint || "Fill in the blank"}
                                                />
                                            )}
                                        </span>
                                    ))}
                                </div>
                                {submitted && exercise.is_instant_scored && content.blanks.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={springTransition}
                                        className="mt-4"
                                    >
                                        <Alert className="bg-blue-100 border-blue-500 text-blue-800">
                                            <AlertTitle>Answers Submitted</AlertTitle>
                                            <AlertDescription>
                                                {content.blanks.map((_: unknown, blankIndex: number) => {
                                                    const userAnswer = userAnswers[`${contentIndex}-${blankIndex}`] || "";
                                                    const correctAnswer = exercise.correct_answers[contentIndex][blankIndex] || "";
                                                    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
                                                    return (
                                                        <div key={blankIndex} className={`mt-2 ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                                                            Blank {blankIndex + 1}: {isCorrect ? "Correct" : "Incorrect"}
                                                        </div>
                                                    );
                                                })}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        );
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={springTransition} className="">
            {!exercise && (
                <Card className="w-full max-w-4xl mx-auto mb-8 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                    <CardContent className="p-6">
                        <Textarea
                            placeholder="Paste your exercise JSON here"
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="min-h-[200px] mb-4 bg-white dark:bg-gray-800 rounded-lg"
                        />
                        <Button
                            onClick={handleJsonSubmit}
                            className="w-full text-lg py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 rounded-lg"
                        >
                            Start the Exercise
                        </Button>
                    </CardContent>
                </Card>
            )}
            <AnimatePresence>
                {exercise && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={springTransition}
                    >
                        <div>
                            <div className="pt-8">
                                {renderExerciseContent()}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={springTransition}
                                    className="mt-6"
                                >
                                    {!unitId && <Button
                                        onClick={handleComplete}
                                        className="w-full text-lg py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 rounded-lg"
                                    >
                                        {submitted ? "Resubmit Answers" : "Submit Answers"}
                                    </Button>}
                                </motion.div>
                                {submitted && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={springTransition}
                                        className="mt-4"
                                    >
                                        <Alert className="bg-blue-100 border-blue-500 text-blue-800 rounded-lg">
                                            <AlertTitle className="text-xl font-bold">
                                                {exercise.is_instant_scored ? "Your Score" : "Answers Submitted"}
                                            </AlertTitle>
                                            <AlertDescription className="text-lg">
                                                {exercise.is_instant_scored
                                                    ? `You scored ${score} out of ${exercise.max_score} (${(
                                                          (score! / exercise.max_score) *
                                                          100
                                                      ).toFixed(2)}%)`
                                                    : "Your answers have been recorded. Your teacher will review and score them."}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {showConfetti && <Confetti />}
        </motion.div>
    );
}
