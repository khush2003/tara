import React, { useState } from "react";
import LessonContainer from "@/components/LessonContainer";
import camp from "../../assets/camp.png";
import zoo from "../../assets/zoo.png";
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle } from "lucide-react"

interface Question {
  id: number
  text: string
  isTrue: boolean
}

interface Exercise {
  id: number
  passage: string
  questions: Question[]
  image: string
}

const exercises: Exercise[] = [
  {
    id: 1,
    passage: "Last summer, Emily and her friends were on a camping trip. The weather was hot, and the lake was perfect for swimming. The tents were set up quickly, and everyone was excited.",
    questions: [
      { id: 1, text: "The weather was chilly.", isTrue: false },
      { id: 2, text: "The lake was great for swimming.", isTrue: true },
      { id: 3, text: "The tents were set up slowly.", isTrue: false },
    ],
    image: camp,
  },
  {
    id: 2,
    passage: "Last Friday, Alex and his family were at the zoo. The animals were active, and the weather was sunny. The lions were roaring loudly, and the penguins were swimming in the water. Alex's favorite part was watching the elephants play with water.",
    questions: [
      { id: 1, text: "The lions were sleeping quietly.", isTrue: false },
      { id: 2, text: "Alex's favorite part was watching the elephants.", isTrue: true },
      { id: 3, text: "The penguins were swimming in the water.", isTrue: true },
    ],
    image: zoo,
  },
]

const Exercise2_0002: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswerChange = (exerciseId: number, questionId: number, value: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [`${exerciseId}-${questionId}`]: value,
    }))
    

  }

  const handleComplete = () => {
    setShowResults(true)
    let score = 0
    let total = 0
    let answersMarkdown = ""

    exercises.forEach((exercise) => {
      exercise.questions.forEach((question) => {
        total += 1
        const isCorrect = answers[`${exercise.id}-${question.id}`] === question.isTrue
        if (isCorrect) {
          score += 1
        }
        answersMarkdown += `- ${question.text} - ${isCorrect ? "Correct" : "Incorrect"}\n`
      })
    })
    const scorePercent = (score / total) * 100
    console.log(answersMarkdown, scorePercent)

    return { answers: answersMarkdown, scorePercent }
  }

  return (
    <LessonContainer title="Exercise: True or False" overrideClass="max-w-6xl" isInstantScoredExercise onSubmit={handleComplete}>
            <div className="container mx-auto p-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {exercises.map((exercise) => (
          <Card key={exercise.id} className="p-6 space-y-4">
            <p className="text-lg font-medium mb-4">{exercise.passage}</p>
            {exercise.questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{question.id}.</span>
                  <span>{question.text}</span>
                  {showResults && (
                    answers[`${exercise.id}-${question.id}`] === question.isTrue ? (
                      <CheckCircle className="text-green-500 ml-2" />
                    ) : (
                      <XCircle className="text-red-500 ml-2" />
                    )
                  )}
                </div>
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(exercise.id, question.id, value === "true")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id={`${exercise.id}-${question.id}-true`} />
                    <Label htmlFor={`${exercise.id}-${question.id}-true`}>True</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id={`${exercise.id}-${question.id}-false`} />
                    <Label htmlFor={`${exercise.id}-${question.id}-false`}>False</Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
            <img src={exercise.image} alt="Exercise illustration" className="mt-4 mx-auto" />
          </Card>
        ))}
      </div>
    </div>
    </LessonContainer>
  );
}

export default Exercise2_0002;
