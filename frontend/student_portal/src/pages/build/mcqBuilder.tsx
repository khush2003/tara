/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"

export default function MCQBuilder() {
  interface Exercise {
    title: string;
    description: string;
    instruction: string;
    order: number;
    exercise_type: string;
    exercise_content: { question: string; options: string[] }[];
    is_instant_scored: boolean;
    max_score: number;
    varients: {
      id: string
      type: string
  }[]
    correct_answers: { [key: number]: string };
  }
  
  const [exercise, setExercise] = useState<Exercise>({
    title: '',
    description: '',
    instruction: '',
    order: 0,
    exercise_type: '',
    exercise_content: [],
    is_instant_scored: true,
    max_score: 0,
    varients: [],
    correct_answers: {}
  })

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setExercise(prev => ({ ...prev, [name]: value }))
  }

  const handleExerciseTypeChange = (value: any) => {
    setExercise(prev => ({ ...prev, exercise_type: value, exercise_content: [], correct_answers: {} }))
  }

  const addQuestion = () => {
    setExercise(prev => ({
      ...prev,
      exercise_content: [...prev.exercise_content, { question: '', options: ['', '', '', ''] }],
      correct_answers: { ...prev.correct_answers, [prev.exercise_content.length]: '' }
    }))
  }

  const updateQuestion = (index: number, field: string, value: string) => {
    setExercise(prev => {
      const newContent = [...prev.exercise_content]
      newContent[index] = { ...newContent[index], [field]: value }
      return { ...prev, exercise_content: newContent }
    })
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setExercise(prev => {
      const newContent = [...prev.exercise_content]
      newContent[questionIndex].options[optionIndex] = value
      return { ...prev, exercise_content: newContent }
    })
  }

  const updateCorrectAnswer = (questionIndex: number, value: string) => {
    setExercise(prev => ({
      ...prev,
      correct_answers: { ...prev.correct_answers, [questionIndex]: value }
    }))
  }

  const removeQuestion = (index: number) => {
    setExercise(prev => {
      const newContent = prev.exercise_content.filter((_, i) => i !== index)
      const newCorrectAnswers = { ...prev.correct_answers }
      delete newCorrectAnswers[index]
      const reindexedCorrectAnswers = Object.fromEntries(
        Object.entries(newCorrectAnswers).map(([, value], i) => [i, value])
      )
      return {
        ...prev,
        exercise_content: newContent,
        correct_answers: reindexedCorrectAnswers,
        max_score: newContent.length
      }
    })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log(JSON.stringify(exercise, null, 2))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">Content Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={exercise.title} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={exercise.description} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instruction">Instruction</Label>
              <Textarea id="instruction" name="instruction" value={exercise.instruction} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input id="order" name="order" type="number" value={exercise.order} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_score">Max Score</Label>
              <Input
                id="max_score"
                name="max_score"
                type="number"
                value={exercise.max_score}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exercise_type">Exercise Type</Label>
              <Select onValueChange={handleExerciseTypeChange} value={exercise.exercise_type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exercise type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_instant_scored"
                checked={exercise.is_instant_scored}
                onCheckedChange={(checked) => setExercise(prev => ({ ...prev, is_instant_scored: checked }))}
              />
              <Label htmlFor="is_instant_scored">Instant Scoring</Label>
            </div>

            {exercise.exercise_type === 'multiple_choice' && (
              <div className="space-y-4">
                <Button type="button" onClick={addQuestion} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                </Button>
                {exercise.exercise_content.map((question, questionIndex) => (
                  <Card key={questionIndex} className="p-4">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${questionIndex}`}>Question {questionIndex + 1}</Label>
                      <Input
                        id={`question-${questionIndex}`}
                        value={question.question}
                        onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                        required
                      />
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex space-x-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                      <Select
                        onValueChange={(value) => updateCorrectAnswer(questionIndex, value)}
                        value={exercise.correct_answers[questionIndex] || ''}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options.map((option, optionIndex) => (
                            <SelectItem key={optionIndex} value={option || `option_${optionIndex + 1}`}>
                              {option || `Option ${optionIndex + 1}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={() => removeQuestion(questionIndex)} variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Remove Question
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <Button type="submit" className="w-full">Generate Exercise JSON</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">Generated JSON</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            {JSON.stringify(exercise, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </motion.div>
  )
}