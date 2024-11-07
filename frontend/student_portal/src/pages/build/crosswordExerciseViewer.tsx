/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Confetti } from "./confetti"
import Crossword from "@jaredreisinger/react-crossword"
import { Toaster } from '@/components/ui/toaster'
import { CrosswordProviderImperative } from "@jaredreisinger/react-crossword"

interface ExerciseContent {
  clue: string
  direction: 'across' | 'down'
  number: number
  row: number
  col: number
}

interface Exercise {
  title: string
  description: string
  instruction: string
  exercise_content: ExerciseContent[]
  correct_answers: { [key: number]: string }
  is_instant_scored: boolean
  max_score: number
}

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
  const [jsonInput, setJsonInput] = useState('')
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [firstSubmission, setFirstSubmission] = useState(true)
  const { toast } = useToast()
  
  
  const crosswordRef = useRef<CrosswordProviderImperative | null>(null)
  const [currentGridData, setCurrentGridData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (score !== null && score === exercise?.max_score) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [score, exercise?.max_score])

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
  setCurrentGridData(prev => ({
    ...prev,
    [`${row}-${col}`]: value.toUpperCase()
  }));
}

// Add helper to get complete word from grid
const getWordFromGrid = (row: number, col: number, direction: 'across' | 'down', length: number): string => {
  let word = '';
  for (let i = 0; i < length; i++) {
    if (direction === 'across') {
      word += currentGridData[`${row}-${col + i}`] || '';
    } else {
      word += currentGridData[`${row + i}-${col}`] || '';
    }
  }
  return word.toUpperCase();
};

  

// Update handleSubmit to use currentGridData
const handleSubmit = () => {
  if (crosswordData) {
    let correctCount = 0;
    let totalQuestions = 0;
    let answersString = "";

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
        const userAnswer = getWordFromGrid(typedClue.row, typedClue.col, direction as 'across' | 'down', wordLength);
        const correctAnswer = typedClue.answer.toUpperCase();
        const isClueCorrect = userAnswer === correctAnswer;
        
        if (isClueCorrect) correctCount++;
        totalQuestions++;

        answersString += `${direction.charAt(0).toUpperCase() + direction.slice(1)} ${number}:
      Clue: ${typedClue.clue}
Correct Answer: ${correctAnswer}
User Answer: ${userAnswer}
Is Correct: ${isClueCorrect}

`;
      });
    });

    // Rest of the submit logic remains the same
    console.log("Student's Answers:\n", answersString);
    setSubmitted(true);
    if (exercise && exercise.is_instant_scored) {
      const scorePercentage = (correctCount / totalQuestions) * 100;
      const finalScore = Math.round((scorePercentage / 100) * exercise.max_score);
      setScore(finalScore);
      
      if (firstSubmission) {
        toast({
          title: "Answers Submitted!",
          description: `You've earned ${finalScore} out of ${exercise.max_score} points (${scorePercentage.toFixed(2)}%)!`,
          duration: 3000,
        });
        setFirstSubmission(false);
      }
    }
    
  }
};

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
                  <Button onClick={handleSubmit} className="flex-1 bg-blue-500 hover:bg-blue-600">
                    {submitted ? "Resubmit Answers" : "Submit Answers"}
                  </Button>
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