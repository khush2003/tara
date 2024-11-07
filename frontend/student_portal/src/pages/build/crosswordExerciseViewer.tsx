/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Confetti } from "./confetti"
import Crossword from "@jaredreisinger/react-crossword"
import { Toaster } from '@/components/ui/toaster'
import { CrosswordProviderImperative } from "@jaredreisinger/react-crossword"
import { useExerciseStore } from '@/store/exerciseStore'

interface CrosswordData {
  across: {
    [key: string]: {
      clue: string
      answer: string
      row: number
      col: number
    }
  }
  down: {
    [key: string]: {
      clue: string
      answer: string
      row: number
      col: number
    }
  }
}

const springTransition = { type: "spring", stiffness: 300, damping: 30 }

export default function CrosswordPuzzleViewer() {

   const {
      exercise,
      score,
      showConfetti,
      crosswordData,
      setCrosswordData,
      setScore,
      setSubmitted,
      unitId,
      setExercise,
      handleComplete,
      setFirstSubmission,
      submitted,
      currentGridData,
      setCurrentGridData,
  } = useExerciseStore()

  const [jsonInput, setJsonInput] = useState('')
  
  const crosswordRef = useRef<CrosswordProviderImperative | null>(null)


  const handleJsonSubmit = () => {
    try {
      const parsedExercise = JSON.parse(jsonInput)
      setExercise(parsedExercise)
      const data: CrosswordData = {
        across: {},
        down: {}
      }
      parsedExercise.exercise_content.forEach((clue: { direction: string | number; number: string | number; clue: any; row: any; col: any }) => {
        data[clue.direction as 'across' | 'down'][clue.number as number] = {
          clue: clue.clue,
          answer: parsedExercise.correct_answers[clue.number].toUpperCase(),
          row: clue.row,
          col: clue.col
        }
      })
      setCrosswordData(data)
      setScore(null)
      setSubmitted(false)
      setFirstSubmission(true)
    } catch (error) {
      console.error("Invalid JSON:", error)
      alert("Invalid JSON. Please check your input.")
    }
  }

  const handleReset = () => {
    setCurrentGridData({});
    
    // Reset crossword component
    if (crosswordRef.current) {
      crosswordRef.current.reset();
    }
    
    // Reset states
    setSubmitted(false);
    setScore(null);
  }

  // Replace handleCorrect with handleCellChange
  const handleCellChange = (row: number, col: number, value: string) => {
    setCurrentGridData(({
      ...currentGridData,
      [`${row}-${col}`]: value.toUpperCase()
    }));
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransition}
      className=""
    >
      {!exercise && <Card className="w-full  mx-auto mb-8 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
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
      </Card>}
      <Toaster />

      <AnimatePresence>
        {exercise && crosswordData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={springTransition}
          >
            <div>
              <CardContent className="p-6">
               
                <div className="bg-white dark:bg-gray-800 p-4 flex flex-row rounded-lg shadow-md">
                  <Crossword
                    ref={crosswordRef}
                    data={crosswordData}
                    onCellChange={handleCellChange}
                    theme={{
                      gridBackground: '#f0f0f0',
                      cellBackground: '#ffffff',
                      cellBorder: '#333333',
                      textColor: '#333333',
                      numberColor: '#333333',
                      focusBackground: '#ffe4b5',
                      highlightBackground: '#fff9c4',
                      columnBreakpoint: '0px'
                    }}
                  />
                </div>
                <div className="mt-6 flex space-x-4">
                  <Button onClick={handleReset} className="flex-1 bg-yellow-500 hover:bg-yellow-600">
                    Reset
                  </Button>
                 {!unitId && <Button onClick={handleComplete} className="flex-1 bg-blue-500 hover:bg-blue-600">
                    {submitted ? "Resubmit Answers" : "Submit Answers"}
                  </Button>}
                </div>
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
              </CardContent>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
      {showConfetti && <Confetti />}
    </motion.div>
  )
}