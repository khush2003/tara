/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Trash2 } from "lucide-react"

export default function TextWithQuestionsBuilder() {
  const [exercise, setExercise] = useState({
    title: '',
    description: '',
    instruction: '',
    order: 0,
    exercise_type: 'text_with_questions',
    exercise_content: [{
      context: '',
      questions: [{ question: '', answerType: 'input' }]
    }],
    correct_answers: [['']],
    is_instant_scored: true,
    max_score: 0,
    variants: [],
  })

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

  const handleQuestionChange = (contentIndex: number, questionIndex: number, field: string, value: string) => {
    setExercise(prev => {
      const newContent = [...prev.exercise_content]
      newContent[contentIndex].questions[questionIndex] = {
        ...newContent[contentIndex].questions[questionIndex],
        [field]: value
      }
      return { ...prev, exercise_content: newContent }
    })
  }

  const handleCorrectAnswerChange = (contentIndex: number, questionIndex: number, value: string) => {
    setExercise(prev => {
      const newCorrectAnswers = [...prev.correct_answers]
      if (!newCorrectAnswers[contentIndex]) {
        newCorrectAnswers[contentIndex] = []
      }
      newCorrectAnswers[contentIndex][questionIndex] = value
      return { ...prev, correct_answers: newCorrectAnswers }
    })
  }

  const addTextContainer = () => {
    setExercise(prev => ({
      ...prev,
      exercise_content: [...prev.exercise_content, {
        context: '',
        questions: [{ question: '', answerType: 'input' }]
      }],
      correct_answers: [...prev.correct_answers, ['']]
    }))
  }

  const removeTextContainer = (index: number) => {
    setExercise(prev => ({
      ...prev,
      exercise_content: prev.exercise_content.filter((_, i) => i !== index),
      correct_answers: prev.correct_answers.filter((_, i) => i !== index)
    }))
  }

  const addQuestion = (contentIndex: number) => {
    setExercise(prev => {
      const newContent = [...prev.exercise_content]
      newContent[contentIndex].questions.push({ question: '', answerType: 'input' })
      const newCorrectAnswers = [...prev.correct_answers]
      newCorrectAnswers[contentIndex].push('')
      return { ...prev, exercise_content: newContent, correct_answers: newCorrectAnswers }
    })
  }

  const removeQuestion = (contentIndex: number, questionIndex: number) => {
    setExercise(prev => {
      const newContent = [...prev.exercise_content]
      newContent[contentIndex].questions = newContent[contentIndex].questions.filter((_, i) => i !== questionIndex)
      const newCorrectAnswers = [...prev.correct_answers]
      newCorrectAnswers[contentIndex] = newCorrectAnswers[contentIndex].filter((_, i) => i !== questionIndex)
      return { ...prev, exercise_content: newContent, correct_answers: newCorrectAnswers }
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
          <CardTitle className="text-3xl font-bold text-center text-primary">Text with Questions Builder</CardTitle>
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
              {exercise.exercise_content.map((content, contentIndex) => (
                <Card key={contentIndex} className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor={`context-${contentIndex}`}>Context</Label>
                    <Textarea
                      id={`context-${contentIndex}`}
                      value={content.context}
                      onChange={(e) => handleContentChange(contentIndex, 'context', e.target.value)}
                      required
                    />
                    <div className="space-y-4">
                      {content.questions.map((question, questionIndex) => (
                        <Card key={questionIndex} className="p-4">
                          <div className="space-y-2">
                            <Label htmlFor={`question-${contentIndex}-${questionIndex}`}>Question</Label>
                            <Textarea
                              id={`question-${contentIndex}-${questionIndex}`}
                              value={question.question}
                              onChange={(e) => handleQuestionChange(contentIndex, questionIndex, 'question', e.target.value)}
                              required
                            />
                            <Label htmlFor={`answerType-${contentIndex}-${questionIndex}`}>Answer Type</Label>
                            <select
                              id={`answerType-${contentIndex}-${questionIndex}`}
                              value={question.answerType}
                              onChange={(e) => handleQuestionChange(contentIndex, questionIndex, 'answerType', e.target.value)}
                              className="w-full p-2 border rounded"
                            >
                              <option value="input">Input</option>
                              <option value="textarea">Textarea</option>
                            </select>
                            <Label htmlFor={`correctAnswer-${contentIndex}-${questionIndex}`}>Correct Answer (Optional)</Label>
                            <Input
                              id={`correctAnswer-${contentIndex}-${questionIndex}`}
                              value={exercise.correct_answers[contentIndex]?.[questionIndex] || ''}
                              onChange={(e) => handleCorrectAnswerChange(contentIndex, questionIndex, e.target.value)}
                            />
                            <Button type="button" onClick={() => removeQuestion(contentIndex, questionIndex)} variant="destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Remove Question
                            </Button>
                          </div>
                        </Card>
                      ))}
                      <Button type="button" onClick={() => addQuestion(contentIndex)} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                      </Button>
                    </div>
                    <Button type="button" onClick={() => removeTextContainer(contentIndex)} variant="destructive">
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