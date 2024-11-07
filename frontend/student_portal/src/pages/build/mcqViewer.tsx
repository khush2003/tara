/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Confetti } from "./confetti"
import { Star, Rocket, Book, PenTool } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from '@/components/ui/toaster'

const icons = [Star, Rocket, Book, PenTool]

const springTransition = { type: "spring", stiffness: 300, damping: 30 }

export default function MCQViewer() {
  const [jsonInput, setJsonInput] = useState('')
  interface Exercise {
    exercise_type: string;
    exercise_content: { question: string; options: string[] }[];
    correct_answers: string[];
    max_score: number;
  }
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({})
  const [score, setScore] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [firstSubmission, setFirstSubmission] = useState(true)
  const { toast } = useToast()

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

  const handleAnswerChange = (questionIndex: any, value: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: value }))
    if (submitted) {
      setSubmitted(false)
    }
  }

  const handleSubmit = () => {
    if (exercise?.exercise_type === 'multiple_choice') {
      const totalQuestions = exercise.exercise_content.length
      const correctAnswers = exercise.correct_answers
      let correctCount = 0
      let answersString = ""

      Object.entries(userAnswers).forEach(([indexString, answer]) => {
        const index = parseInt(indexString, 10);
        const question = exercise.exercise_content[index]
        const isCorrect = correctAnswers[index] === answer
        if (isCorrect) correctCount++

        answersString += `**Question:** ${question.question}\n`
        answersString += `**Student's Answer:** ${answer}\n`
        answersString += `**Is Correct:** ${isCorrect}\n\n`
      })

      const scorePercentage = (correctCount / totalQuestions) * 100
      setScore(scorePercentage)
      setSubmitted(true)

      console.log("Student's Answers:\n", answersString)

      if (firstSubmission) {
        toast({
          title: "Points Earned!",
          description: `You've earned ${Math.round(scorePercentage * exercise.max_score / 100)} points!`,
          duration: 3000,
        })
        setFirstSubmission(false)
      }

      if (scorePercentage == 100) {
        setShowConfetti(true)
        const timer = setTimeout(() => setShowConfetti(false), 5000)
        return () => clearTimeout(timer)
      }
    }
  }

  const renderExerciseContent = () => {
    switch (exercise?.exercise_type) {
      case 'multiple_choice':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exercise.exercise_content.map((question, index) => {
              const Icon = icons[index % icons.length]
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={springTransition}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="rounded-xl overflow-hidden">
                    <CardContent className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                      <div className="flex items-center mb-4">
                        <Icon className="w-6 h-6 mr-2 text-primary" />
                        <h3 className="text-lg font-semibold">{question.question}</h3>
                      </div>
                      <RadioGroup
                        onValueChange={(value) => handleAnswerChange(index, value)}
                        value={userAnswers[index] || ''}
                        className="space-y-2"
                      >
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={option || `option_${optionIndex + 1}`}
                              id={`q${index}-option${optionIndex}`}
                              className="border-2 border-primary"
                            />
                            <Label
                              htmlFor={`q${index}-option${optionIndex}`}
                              className="text-base cursor-pointer hover:text-primary transition-colors"
                            >
                              {option || `Option ${optionIndex + 1}`}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {submitted && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={springTransition}
                          className="mt-4"
                        >
                          {userAnswers[index] === exercise.correct_answers[index] ? (
                            <Alert className="bg-green-100 border-green-500 text-green-800">
                              <AlertTitle>Correct!</AlertTitle>
                              <AlertDescription>Great job!</AlertDescription>
                            </Alert>
                          ) : (
                            <Alert className="bg-red-100 border-red-500 text-red-800">
                              <AlertTitle>Incorrect</AlertTitle>
                              <AlertDescription>Try again!</AlertDescription>
                            </Alert>
                          )}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )
      default:
        return <div>Unsupported exercise type</div>
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className=""
    >
      <AnimatePresence>
        <Toaster />
        {exercise ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springTransition}
          >
            <div className="w-full max-w-6xl mx-auto">
              <CardContent className="p-6">
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
                {score !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={springTransition}
                    className="mt-4"
                  >
                    <Alert className="bg-blue-100 border-blue-500 text-blue-800 rounded-lg">
                      <AlertTitle className="text-xl font-bold">Your Score</AlertTitle>
                      <AlertDescription className="text-lg">
                        You scored {score.toFixed(2)}% ({Math.round(score * exercise.max_score / 100)} out of {exercise.max_score})
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </CardContent>
            </div>
          </motion.div>
        ) : <Card className="w-full max-w-6xl mx-auto mb-8 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
        <CardContent className="p-6">
          <Textarea
            placeholder="Paste your exercise JSON here"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="min-h-[200px] mb-4 bg-white dark:bg-gray-800 rounded-lg"
          />
          <Button onClick={handleJsonSubmit} className="w-full text-lg py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 rounded-lg">
            Start the Adventure!
          </Button>
        </CardContent>
      </Card>}
      </AnimatePresence>
      {showConfetti && <Confetti />}
    </motion.div>
  )
}