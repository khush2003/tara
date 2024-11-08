/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Confetti } from "./confetti"
import Markdown from 'react-markdown'
import { Toaster } from '@/components/ui/toaster'
import { useExerciseStore } from '@/store/exerciseStore'

const springTransition = { type: "spring", stiffness: 300, damping: 30 }

export default function TextWithInputViewer() {
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
} = useExerciseStore()
  const [jsonInput, setJsonInput] = useState('')

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

  const handleAnswerChange = (index: any, value: string) => {
    setUserAnswers(({ ...userAnswers, [index]: value }))
    if (submitted) {
      setSubmitted(false)
    }
  }


  const renderExerciseContent = () => {
    return (
      <div className="space-y-6">
        {exercise && exercise.exercise_content.map((content, index) => (
          <Card key={index} className="rounded-xl overflow-hidden">
            <CardContent className="p-6 bg-green-50">
              <div className="mb-4">
                {content.context && <Markdown className="text-lg flex flex-col gap-3 mt-2">{content.context}</Markdown>}
                {content.question && <h3 className="text-lg font-semibold mt-4">{content.question}</h3>}
              </div>
              {content.answerType !== 'none' && (
                <div className="space-y-2">
                  <Label htmlFor={`answer-${index}`}>Your Answer</Label>
                  {content.answerType === 'textarea' ? (
                    <Textarea
                      id={`answer-${index}`}
                      value={userAnswers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="bg-white dark:bg-gray-800"
                    />
                  ) : (
                    <Input
                      id={`answer-${index}`}
                      value={userAnswers[index] || ''}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="bg-white dark:bg-gray-800"
                    />
                  )}
                </div>
              )}
              {submitted && exercise.is_instant_scored && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={springTransition}
                  className="mt-4"
                >
                  {exercise.correct_answers[index] && userAnswers[index]?.trim().toLowerCase() === exercise.correct_answers[index].trim().toLowerCase() ? (
                    <Alert className="bg-green-100 border-green-500 text-green-800">
                      <AlertTitle>Correct!</AlertTitle>
                      <AlertDescription>Great job!</AlertDescription>
                    </Alert>
                  ) : exercise.correct_answers[index] ? (
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
      className="container mx-auto p-4"
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
              <CardContent className="p-6">
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
                          ? `You scored ${score ?? 0} out of ${exercise.max_score} (${(((score ?? 0) / exercise.max_score) * 100).toFixed(2)}%)`
                          : "Your answers have been recorded. Your teacher will review and score them."}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </CardContent>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showConfetti && <Confetti />}
    </motion.div>
  )
}