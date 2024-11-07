import { useState, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Confetti } from "./confetti"
import { Toaster } from '@/components/ui/toaster'

const springTransition = { type: "spring", stiffness: 300, damping: 30 }

interface Blank {
    hint?: string;
}

interface Content {
    text: string;
    blanks: Blank[];
}

interface Exercise {
    exercise_type: string;
    exercise_content: Content[];
    correct_answers: string[][];
    is_instant_scored: boolean;
    max_score: number;
}

export default function FillInTheBlanksViewer() {
    const [jsonInput, setJsonInput] = useState<string>('')
    const [exercise, setExercise] = useState<Exercise | null>(null)
    const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({})
    const [score, setScore] = useState<number | null>(null)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [showConfetti, setShowConfetti] = useState<boolean>(false)
    const [firstSubmission, setFirstSubmission] = useState<boolean>(true)
    const { toast } = useToast()

    const handleJsonSubmit = () => {
        try {
            const parsedExercise: Exercise = JSON.parse(jsonInput)
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

    const handleAnswerChange = (contentIndex: number, blankIndex: number, value: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [`${contentIndex}-${blankIndex}`]: value
        }))
        if (submitted) {
            setSubmitted(false)
        }
    }

    const handleSubmit = () => {
        if (exercise?.exercise_type === 'fill_in_the_blanks') {
            let correctCount = 0
            let totalBlanks = 0
            let answersString = ""

            exercise.exercise_content.forEach((content, contentIndex) => {
                answersString += `Text: ${content.text}\n\n`
                content.blanks.forEach((_blank, blankIndex) => {
                    const userAnswer = userAnswers[`${contentIndex}-${blankIndex}`] || ''
                    const correctAnswer = exercise.correct_answers[contentIndex][blankIndex]
                    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()

                    if (isCorrect) correctCount++
                    totalBlanks++

                    answersString += `**Blank ${blankIndex + 1}:**\n`
                    answersString += `**Student's Answer:** ${userAnswer}\n`
                    if (exercise.is_instant_scored) answersString += `**Correct Answer:** ${correctAnswer}\n`
                    if (exercise.is_instant_scored) {
                        answersString += `**Is Correct:** ${isCorrect}\n`
                    }
                    answersString += "\n"
                })
            })

            console.log("Student's Answers:\n", answersString)
            
            setSubmitted(true)
            if (exercise.is_instant_scored) {
                const scorePercentage = totalBlanks > 0 ? (correctCount / totalBlanks) * 100 : 100
                const finalScore = Math.round((scorePercentage / 100) * exercise.max_score)
                setScore(finalScore)
                
                if (firstSubmission) {
                    toast({
                        title: "Answers Submitted!",
                        description: `You've earned ${finalScore} out of ${exercise.max_score} points (${scorePercentage.toFixed(2)}%)!`,
                        duration: 3000,
                    })
                    setFirstSubmission(false)
                }
         
                if (finalScore === exercise.max_score) {
                    setShowConfetti(true)
                    const timer = setTimeout(() => setShowConfetti(false), 5000)
                    return () => clearTimeout(timer)
                }
            }
        }
    }

    const renderExerciseContent = () => {
        return (
            <div className="space-y-6">
                {exercise?.exercise_content.map((content, contentIndex) => {
                    const textParts = content.text.split(/\[blank\]/g)
                    return (
                        <Card key={contentIndex} className="rounded-xl overflow-hidden">
                            <CardContent className="p-6 bg-green-50">
                                <div className="mb-4 whitespace-pre-wrap">
                                    {textParts.map((part, index) => (
                                        <span key={index}>
                                            {part.split('\n').map((line, lineIndex) => (
                                                <span key={lineIndex}>
                                                    {lineIndex > 0 && <br />}
                                                    {line}
                                                </span>
                                            ))}
                                            {index < textParts.length - 1 && content.blanks[index] && (
                                                <Input
                                                    value={userAnswers[`${contentIndex}-${index}`] || ''}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleAnswerChange(contentIndex, index, e.target.value)}
                                                    className="w-32 inline-block bg-white dark:bg-gray-800"
                                                    placeholder={content.blanks[index]?.hint || 'Fill in the blank'}
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
                                                {content.blanks.map((_, blankIndex) => {
                                                    const userAnswer = userAnswers[`${contentIndex}-${blankIndex}`] || ''
                                                    const correctAnswer = exercise.correct_answers[contentIndex][blankIndex]
                                                    const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
                                                    return (
                                                        <div key={blankIndex} className={`mt-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                            Blank {blankIndex + 1}: {isCorrect ? 'Correct' : 'Incorrect'}
                                                        </div>
                                                    )
                                                })}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
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
            {!exercise && (
                <Card className="w-full max-w-4xl mx-auto mb-8 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                    <CardContent className="p-6">
                        <Textarea
                            placeholder="Paste your exercise JSON here"
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="min-h-[200px] mb-4 bg-white dark:bg-gray-800 rounded-lg"
                        />
                        <Button onClick={handleJsonSubmit} className="w-full text-lg py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 rounded-lg">
                            Start the Exercise
                        </Button>
                    </CardContent>
                </Card>
            )}

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
                                    <Button onClick={handleSubmit} className="w-full text-lg py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 rounded-lg">
                                        {submitted ? "Resubmit Answers" : "Submit Answers"}
                                    </Button>
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