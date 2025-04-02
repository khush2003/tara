import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Trash2 } from "lucide-react"

export default function TextWithInputBuilder() {
  const [exercise, setExercise] = useState({
    title: '',
    description: '',
    instruction: '',
    order: 0,
    exercise_type: 'text_with_input',
    exercise_content: [{ context: '', question: '', answerType: 'input' }],
    correct_answers: [''],
    is_instant_scored: true,
    max_score: 0,
    variants: [],
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setExercise(prev => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (index: number, field: string, value: string) => {
    setExercise(prev => {
      const newContent = [...prev.exercise_content]
      newContent[index] = { ...newContent[index], [field]: value }
      return { ...prev, exercise_content: newContent }
    })
  }

  const handleCorrectAnswerChange = (index: number, value: string) => {
    setExercise(prev => {
      const newCorrectAnswers = [...prev.correct_answers]
      newCorrectAnswers[index] = value
      return { ...prev, correct_answers: newCorrectAnswers }
    })
  }

  const addTextContainer = () => {
    setExercise(prev => ({
      ...prev,
      exercise_content: [...prev.exercise_content, { context: '', question: '', answerType: 'input' }],
      correct_answers: [...prev.correct_answers, '']
    }))
  }

  const removeTextContainer = (index: number) => {
    setExercise(prev => ({
      ...prev,
      exercise_content: prev.exercise_content.filter((_, i) => i !== index),
      correct_answers: prev.correct_answers.filter((_, i) => i !== index)
    }))
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
          <CardTitle className="text-3xl font-bold text-center text-primary">Text with Input Builder</CardTitle>
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
              <Button type="button" onClick={addTextContainer} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Text Container
              </Button>
              {exercise.exercise_content.map((content, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor={`context-${index}`}>Context</Label>
                    <Textarea
                      id={`context-${index}`}
                      value={content.context}
                      onChange={(e) => handleContentChange(index, 'context', e.target.value)}
                      required
                    />
                    <Label htmlFor={`question-${index}`}>Question (Optional)</Label>
                    <Input
                      id={`question-${index}`}
                      value={content.question}
                      onChange={(e) => handleContentChange(index, 'question', e.target.value)}
                    />
                    <Label htmlFor={`answerType-${index}`}>Answer Type</Label>
                    <select
                      id={`answerType-${index}`}
                      value={content.answerType}
                      onChange={(e) => handleContentChange(index, 'answerType', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="input">Input</option>
                      <option value="textarea">Textarea</option>
                      <option value="none">None</option>
                    </select>
                    {content.answerType !== 'none' && (
                      <>
                        <Label htmlFor={`correctAnswer-${index}`}>Correct Answer (Will check for exact match to the string you provide, if there is no correct answer please toggle instant scored off above)</Label>
                        <Input
                          id={`correctAnswer-${index}`}
                          value={exercise.correct_answers[index] || ''}
                          onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                        />
                      </>
                    )}
                    <Button type="button" onClick={() => removeTextContainer(index)} variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Text Container
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