import { useState, ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Trash2 } from "lucide-react"

interface Blank {
    hint: string
}

interface ExerciseContent {
    text: string
    blanks: Blank[]
}

interface Exercise {
    title: string
    description: string
    instruction: string
    order: number
    exercise_type: string
    exercise_content: ExerciseContent[]
    correct_answers: string[][]
    is_instant_scored: boolean
    max_score: number
    varients: {
        id: string
        type: string
    }[]
}

export default function FillInTheBlanksBuilder() {
    const [exercise, setExercise] = useState<Exercise>({
        title: '',
        description: '',
        instruction: '',
        order: 0,
        exercise_type: 'fill_in_the_blanks',
        exercise_content: [{
            text: '',
            blanks: []
        }],
        correct_answers: [[]],
        is_instant_scored: true,
        max_score: 0,
        varients: [],
    })

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setExercise(prev => ({ ...prev, [name]: value }))
    }

    const handleContentChange = (index: number, field: string, value: string) => {
        setExercise(prev => {
            const newContent = [...prev.exercise_content]
            newContent[index] = { ...newContent[index], [field]: value }

            if (field === 'text') {
                const blanks = (value.match(/\[blank\]/g) || []).map(() => ({ hint: '' }))
                newContent[index].blanks = blanks

                const newCorrectAnswers = [...prev.correct_answers]
                newCorrectAnswers[index] = blanks.map(() => '')
                return { ...prev, exercise_content: newContent, correct_answers: newCorrectAnswers }
            }

            return { ...prev, exercise_content: newContent }
        })
    }

    const handleBlankChange = (contentIndex: number, blankIndex: number, field: string, value: string) => {
        setExercise(prev => {
            const newContent = [...prev.exercise_content]
            newContent[contentIndex].blanks[blankIndex] = {
                ...newContent[contentIndex].blanks[blankIndex],
                [field]: value
            }
            return { ...prev, exercise_content: newContent }
        })
    }

    const handleCorrectAnswerChange = (contentIndex: number, blankIndex: number, value: string) => {
        setExercise(prev => {
            const newCorrectAnswers = [...prev.correct_answers]
            if (!newCorrectAnswers[contentIndex]) {
                newCorrectAnswers[contentIndex] = []
            }
            newCorrectAnswers[contentIndex][blankIndex] = value
            return { ...prev, correct_answers: newCorrectAnswers }
        })
    }

    const addTextContainer = () => {
        setExercise(prev => ({
            ...prev,
            exercise_content: [...prev.exercise_content, { text: '', blanks: [] }],
            correct_answers: [...prev.correct_answers, []]
        }))
    }

    const removeTextContainer = (index: number) => {
        setExercise(prev => ({
            ...prev,
            exercise_content: prev.exercise_content.filter((_, i) => i !== index),
            correct_answers: prev.correct_answers.filter((_, i) => i !== index)
        }))
    }

    const addBlank = (contentIndex: number) => {
        setExercise(prev => {
            const newContent = [...prev.exercise_content]
            newContent[contentIndex].blanks.push({ hint: '' })
            const newCorrectAnswers = [...prev.correct_answers]
            if (!newCorrectAnswers[contentIndex]) {
                newCorrectAnswers[contentIndex] = []
            }
            newCorrectAnswers[contentIndex].push('')
            return { ...prev, exercise_content: newContent, correct_answers: newCorrectAnswers }
        })
    }

    const removeBlank = (contentIndex: number, blankIndex: number) => {
        setExercise(prev => {
            const newContent = [...prev.exercise_content]
            newContent[contentIndex].blanks = newContent[contentIndex].blanks.filter((_, i) => i !== blankIndex)
            const newCorrectAnswers = [...prev.correct_answers]
            newCorrectAnswers[contentIndex] = newCorrectAnswers[contentIndex].filter((_, i) => i !== blankIndex)
            return { ...prev, exercise_content: newContent, correct_answers: newCorrectAnswers }
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
                    <CardTitle className="text-3xl font-bold text-center text-primary">Fill in the Blanks Builder</CardTitle>
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
                                        <Label htmlFor={`text-${contentIndex}`}>Text</Label>
                                        <Textarea
                                            id={`text-${contentIndex}`}
                                            value={content.text}
                                            onChange={(e) => handleContentChange(contentIndex, 'text', e.target.value)}
                                            placeholder="Enter text (use [blank] for blanks)"
                                            required
                                        />
                                        <div className="space-y-4">
                                            {content.blanks.map((blank, blankIndex) => (
                                                <Card key={blankIndex} className="p-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`hint-${contentIndex}-${blankIndex}`}>Hint (Optional)</Label>
                                                        <Input
                                                            id={`hint-${contentIndex}-${blankIndex}`}
                                                            value={blank.hint}
                                                            onChange={(e) => handleBlankChange(contentIndex, blankIndex, 'hint', e.target.value)}
                                                        />
                                                        <Label htmlFor={`correctAnswer-${contentIndex}-${blankIndex}`}>Correct Answer</Label>
                                                        <Input
                                                            id={`correctAnswer-${contentIndex}-${blankIndex}`}
                                                            value={exercise.correct_answers[contentIndex]?.[blankIndex] || ''}
                                                            onChange={(e) => handleCorrectAnswerChange(contentIndex, blankIndex, e.target.value)}
                                                            required
                                                        />
                                                        <Button type="button" onClick={() => removeBlank(contentIndex, blankIndex)} variant="destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Remove Blank
                                                        </Button>
                                                    </div>
                                                </Card>
                                            ))}
                                            <Button type="button" onClick={() => addBlank(contentIndex)} className="w-full">
                                                <PlusCircle className="mr-2 h-4 w-4" /> Add Blank
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