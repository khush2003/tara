/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Trash2 } from "lucide-react"

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
  order: number
  exercise_type: string
  exercise_content: ExerciseContent[]
  correct_answers: { [key: number]: string }
  is_instant_scored: boolean
  max_score: number
  variants: any[]
}

export default function CrosswordPuzzleBuilder() {
  const [exercise, setExercise] = useState<Exercise>({
    title: '',
    description: '',
    instruction: '',
    order: 0,
    exercise_type: 'crossword_puzzle',
    exercise_content: [],
    correct_answers: {},
    is_instant_scored: true,
    max_score: 0,
    variants: [],
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setExercise(prev => ({ ...prev, [name]: name === 'max_score' ? parseInt(value) || 0 : value }))
  }

  const addClue = () => {
    const newClueNumber = exercise.exercise_content.length + 1
    setExercise(prev => ({
      ...prev,
      exercise_content: [
        ...prev.exercise_content,
        { clue: '', direction: 'across', number: newClueNumber, row: 0, col: 0 }
      ],
      correct_answers: {
        ...prev.correct_answers,
        [newClueNumber]: ''
      }
    }))
  }

  const removeClue = (index: number) => {
    setExercise(prev => ({
      ...prev,
      exercise_content: prev.exercise_content.filter((_, i) => i !== index),
      correct_answers: Object.fromEntries(
        Object.entries(prev.correct_answers).filter(([key]) => parseInt(key) !== prev.exercise_content[index].number)
      )
    }))
  }

  const handleClueChange = (index: number, field: string, value: string | number) => {
    setExercise(prev => {
      const newContent = [...prev.exercise_content]
      newContent[index] = { ...newContent[index], [field]: field === 'row' || field === 'col' ? parseInt(String(value)) : value }
      const newCorrectAnswers = { ...prev.correct_answers }
      
      if (field === 'number') {
        const oldNumber = newContent[index].number
        newCorrectAnswers[value as number] = newCorrectAnswers[oldNumber] as string
        delete newCorrectAnswers[oldNumber]
      }
      
      return { 
        ...prev, 
        exercise_content: newContent,
        correct_answers: field === 'answer' 
          ? { ...newCorrectAnswers, [newContent[index].number]: value as string }
          : newCorrectAnswers
      }
    })
  }

  const handleSubmit = (e: FormEvent) => {
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
          <CardTitle className="text-3xl font-bold text-center text-primary">Crossword Puzzle Builder</CardTitle>
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
            <div className="flex items-center space-x-2">
              <Switch
                id="is_instant_scored"
                checked={exercise.is_instant_scored}
                onCheckedChange={(checked) => setExercise(prev => ({ ...prev, is_instant_scored: checked }))}
              />
              <Label htmlFor="is_instant_scored">Instant Scoring</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_score">Max Score</Label>
              <Input id="max_score" name="max_score" type="number" value={exercise.max_score} onChange={handleInputChange} required />
            </div>

            <div className="space-y-4">
              <Button type="button" onClick={addClue} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Clue
              </Button>
              {exercise.exercise_content.map((clue, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor={`clue-${index}`}>Clue</Label>
                    <Input
                      id={`clue-${index}`}
                      value={clue.clue}
                      onChange={(e) => handleClueChange(index, 'clue', e.target.value)}
                      required
                    />
                    <Label htmlFor={`answer-${index}`}>Answer</Label>
                    <Input
                      id={`answer-${index}`}
                      value={exercise.correct_answers[clue.number] || ''}
                      onChange={(e) => handleClueChange(index, 'answer', e.target.value)}
                      required
                    />
                    <Label htmlFor={`direction-${index}`}>Direction</Label>
                    <select
                      id={`direction-${index}`}
                      value={clue.direction}
                      onChange={(e) => handleClueChange(index, 'direction', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="across">Across</option>
                      <option value="down">Down</option>
                    </select>
                    <Label htmlFor={`number-${index}`}>Number</Label>
                    <Input
                      id={`number-${index}`}
                      type="number"
                      value={clue.number}
                      onChange={(e) => handleClueChange(index, 'number', parseInt(e.target.value))}
                      required
                    />
                    <Label htmlFor={`row-${index}`}>Row</Label>
                    <Input
                      id={`row-${index}`}
                      type="number"
                      value={clue.row}
                      onChange={(e) => handleClueChange(index, 'row', e.target.value)}
                      required
                    />
                    <Label htmlFor={`col-${index}`}>Column</Label>
                    <Input
                      id={`col-${index}`}
                      type="number"
                      value={clue.col}
                      onChange={(e) => handleClueChange(index, 'col', e.target.value)}
                      required
                    />
                    <Button type="button" onClick={() => removeClue(index)} variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Clue
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

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