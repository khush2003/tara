import { useState, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Confetti } from "./confetti"
import { Toaster } from '@/components/ui/toaster'
import { useExerciseStore } from '@/store/exerciseStore'

const springTransition = { type: "spring", stiffness: 300, damping: 30 }
export default function ImagesWithInputViewer() {
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
            const parsedExercise = JSON.parse(jsonInput)
            setExercise(parsedExercise)
            setUserAnswers({})
            setScore(null)
            setSubmitted(false)
            setFirstSubmission(true)
        } catch (error) {
            console.error("Invalid JSON:", error)
            alert("Invalid JSON. Please check your input.")
        }
    }

    const handleAnswerChange = (index: number, value: string) => {
        setUserAnswers(({
            ...userAnswers,
            [index]: value
        }))
        if (submitted) {
            setSubmitted(false)
        }
    }


    const renderExerciseContent = () => {
        const gridTemplateColumns = `repeat(${exercise?.exercise_content[0]?.grid_columns || 1}, minmax(0, 1fr))`
        return (
            <div className="grid gap-6" style={{ gridTemplateColumns }}>
                {exercise?.exercise_content.slice(1).map((content, index) => (
                    <Card key={index} className="rounded-xl overflow-hidden">
                        <CardContent className="p-6 bg-white">
                            <div className="mb-4">
                                <img
                                    src={content.image_url || "/placeholder.svg?height=300&width=400"}
                                    alt={`Image ${index + 1}`}
                                    width={600}
                                    height={300}
                                    className="rounded-lg"
                                />
                            </div>
                            {content.question && (
                                <Label htmlFor={`answer-${index}`} className="block text-lg font-semibold mb-2">
                                    {content.question}
                                </Label>
                            )}
                            <div className="space-y-2">
                                {content.answerType === 'textarea' ? (
                                    <Textarea
                                        id={`answer-${index}`}
                                        value={userAnswers[index] || ''}
                                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleAnswerChange(index, e.target.value)}
                                        className="bg-white dark:bg-gray-800"
                                    />
                                ) : (
                                    <Input
                                        id={`answer-${index}`}
                                        value={userAnswers[index] || ''}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleAnswerChange(index, e.target.value)}
                                        className="bg-white dark:bg-gray-800"
                                    />
                                )}
                            </div>
                            {submitted && exercise.is_instant_scored && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={springTransition}
                                    className="mt-4"
                                >
                                    {exercise.correct_answers.slice(1)[index] && userAnswers[index]?.trim().toLowerCase() === exercise.correct_answers.slice(1)[index].trim().toLowerCase() ? (
                                        <Alert className="bg-green-100 border-green-500 text-green-800">
                                            <AlertTitle>Correct!</AlertTitle>
                                            <AlertDescription>Great job!</AlertDescription>
                                        </Alert>
                                    ) : exercise.correct_answers.slice(1)[index] ? (
                                        <Alert className="bg-red-100 border-red-500 text-red-800">
                                            <AlertTitle>Incorrect</AlertTitle>
                                            <AlertDescription>Try again!</AlertDescription>
                                        </Alert>
                                    ) : (
                                        <Alert className="bg-blue-100 border-blue-500 text-blue-800">
                                            <AlertTitle>Answer Submitted</AlertTitle>
                                            <AlertDescription>Your answer has been recorded.</AlertDescription>
                                        </Alert>
                                    )}
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springTransition}
            className=""
        >
            {!exercise && <Card className="w-full max-w-4xl mx-auto mb-8 rounded-xl bg-gradient-to-r from-blue-100  to-purple-100 dark:from-blue-900 dark:to-purple-900">
                <CardContent className="p-6">
                    <Textarea
                        placeholder="Paste your exercise JSON here"
                        value={jsonInput}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setJsonInput(e.target.value)}
                        className="min-h-[200px] mb-4 bg-white dark:bg-gray-800 rounded-lg"
                    />
                    <Button onClick={handleJsonSubmit} className="w-full text-lg py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 rounded-lg">
                        Start the Exercise
                    </Button>
                </CardContent>
            </Card>}

            <AnimatePresence>
                <Toaster />
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
                                    {!unitId && <Button onClick={handleComplete} className="w-full text-lg py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 rounded-lg">
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
                                                    ? `You scored ${score} out of ${exercise.max_score} (${((score! / exercise.max_score) * 100).toFixed(2)}%)`
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
    )
}
