/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Trash2, Image as ImageIcon } from "lucide-react"

export default function DragAndDropBuilder() {
  const [exercise, setExercise] = useState<{
    title: string;
    description: string;
    instruction: string;
    order: number;
    exercise_type: string;
    exercise_content: {
      text: string;
      images: string[];
      dropArea: { type: string; items: string[] };
    }[];
    dropItems: { id: string; type: string; content: string; alt?: string }[];
    correct_answers: string[][];
    is_instant_scored: boolean;
    max_score: number;
    variants: string[];
  }>({
    title: '',
    description: '',
    instruction: '',
    order: 0,
    exercise_type: 'drag_and_drop',
    exercise_content: [{
      text: '',
      images: [],
      dropArea: { type: 'single', items: [] }
    }],
    dropItems: [],
    correct_answers: [] as string[][],
    is_instant_scored: true,
    max_score: 0,
    variants: [],
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setExercise(prev => ({ ...prev, [name]: name === 'max_score' ? parseInt(value) : value }))
  }

  const handleGroupChange = (index: number, field: string, value: string) => {
    setExercise(prev => {
      const newContent = [...prev.exercise_content]
      newContent[index] = { ...newContent[index], [field]: value }
      return { ...prev, exercise_content: newContent }
    })
  }

  const addGroup = (): void => {
    setExercise(prev => ({
      ...prev,
      exercise_content: [...prev.exercise_content, { text: '', images: [], dropArea: { type: 'single', items: [] } }],
      correct_answers: [...prev.correct_answers, []]
    }))
  }

  const removeGroup = (index: number): void => {
    setExercise(prev => ({
      ...prev,
      exercise_content: prev.exercise_content.filter((_, i) => i !== index),
      correct_answers: prev.correct_answers.filter((_, i) => i !== index)
    }))
  }

  const addImage = (groupIndex: number): void => {
    setExercise(prev => {
      const newContent = [...prev.exercise_content]
      newContent[groupIndex].images.push('' as never)
      return { ...prev, exercise_content: newContent }
    })
  }

  const removeImage = (groupIndex: number, imageIndex: number): void => {
    setExercise(prev => {
      const newContent = [...prev.exercise_content]
      newContent[groupIndex].images = newContent[groupIndex].images.filter((_, i) => i !== imageIndex)
      return { ...prev, exercise_content: newContent }
    })
  }

  const handleImageChange = (groupIndex: number, imageIndex: number, value: string): void => {
    setExercise(prev => {
      const newContent = [...prev.exercise_content]
      newContent[groupIndex].images[imageIndex] = value as never
      return { ...prev, exercise_content: newContent }
    })
  }

  const toggleDropAreaType = (groupIndex: number): void => {
    setExercise(prev => {
      const newContent = [...prev.exercise_content]
      newContent[groupIndex].dropArea.type = newContent[groupIndex].dropArea.type === 'single' ? 'multi' : 'single'
      return { ...prev, exercise_content: newContent }
    })
  }

  const addDropItem = (): void => {
    const newId = `item-${Date.now()}`
    setExercise(prev => ({
      ...prev,
      dropItems: [...prev.dropItems, { id: newId, type: 'text', content: '' }]
    }))
  }

  const removeDropItem = (index: number): void => {
    setExercise(prev => ({
      ...prev,
      dropItems: prev.dropItems.filter((_, i) => i !== index)
    }))
  }

  const handleDropItemChange = (index: number, field: string, value: string): void => {
    setExercise(prev => {
      const newDropItems = [...prev.dropItems]
      newDropItems[index] = { ...newDropItems[index], [field]: value as never }
      return { ...prev, dropItems: newDropItems }
    })
  }

  const handleCorrectAnswerChange = (groupIndex: number, value: string): void => {
    setExercise(prev => {
      const newCorrectAnswers = [...prev.correct_answers]
      newCorrectAnswers[groupIndex] = value.split(',').map((item: string) => item.trim()) as never[]
      return { ...prev, correct_answers: newCorrectAnswers }
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
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
          <CardTitle className="text-3xl font-bold text-center text-primary">Drag and Drop Builder</CardTitle>
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
              <Input id="max_score" name="max_score" type="number" value={exercise.max_score} onChange={handleInputChange} required />
            </div>

            <div className="space-y-4">
              <Button type="button" onClick={addGroup} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Group
              </Button>
              {exercise.exercise_content.map((group, groupIndex) => (
                <Card key={groupIndex} className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor={`group-text-${groupIndex}`}>Group Text (Optional)</Label>
                    <Textarea
                      id={`group-text-${groupIndex}`}
                      value={group.text}
                      onChange={(e) => handleGroupChange(groupIndex, 'text', e.target.value)}
                    />
                    <div className="space-y-2">
                      <Label>Images (Optional)</Label>
                      {group.images.map((image, imageIndex) => (
                        <div key={imageIndex} className="flex items-center space-x-2">
                          <Input
                            value={image}
                            onChange={(e) => handleImageChange(groupIndex, imageIndex, e.target.value)}
                            placeholder="Image URL"
                          />
                          <Button type="button" onClick={() => removeImage(groupIndex, imageIndex)} variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" onClick={() => addImage(groupIndex)} className="w-full">
                        <ImageIcon className="mr-2 h-4 w-4" /> Add Image
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Drop Area Type</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`drop-area-type-${groupIndex}`}
                          checked={group.dropArea.type === 'multi'}
                          onCheckedChange={() => toggleDropAreaType(groupIndex)}
                        />
                        <Label htmlFor={`drop-area-type-${groupIndex}`}>
                          {group.dropArea.type === 'single' ? 'Single Drop' : 'Multi Drop'}
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`correct-answer-${groupIndex}`}>Correct Answer(s)</Label>
                      <Input
                        id={`correct-answer-${groupIndex}`}
                        value={exercise.correct_answers[groupIndex]?.join(', ') ?? ''}
                        onChange={(e) => handleCorrectAnswerChange(groupIndex, e.target.value)}
                        placeholder="Comma-separated list of correct item IDs"
                      />
                    </div>
                    <Button type="button" onClick={() => removeGroup(groupIndex)} variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Group
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="space-y-4 pt-20">
              <Button type="button" onClick={addDropItem} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Drop Item
              </Button>
              {exercise.dropItems.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor={`drop-item-id-${index}`}>Item ID</Label>
                    <Input
                      id={`drop-item-id-${index}`}
                      value={(item as any).id}
                      readOnly
                      className="bg-gray-100"
                    />
                    <Label htmlFor={`drop-item-type-${index}`}>Item Type</Label>
                    <select
                      id={`drop-item-type-${index}`}
                      value={(item as any).type}
                      onChange={(e) => handleDropItemChange(index, 'type', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                    </select>
                    <Label htmlFor={`drop-item-content-${index}`}>Content</Label>
                    <Input
                      id={`drop-item-content-${index}`}
                      value={(item as any).content}
                      onChange={(e) => handleDropItemChange(index, 'content', e.target.value)}
                      placeholder={(item as any).type === 'text' ? 'Enter text' : 'Enter image URL'}
                    />
                    {(item as any).type != 'text' && (<><Label htmlFor={`drop-item-alt-${index}`}>Image Alt</Label>
                    <Input
                      id={`drop-item-alt-${index}`}
                      value={(item as any).alt}
                      onChange={(e) => handleDropItemChange(index, 'alt', e.target.value)}
                      placeholder={'Add image alt for teachers to understand what the image is about in submissions'}
                    /></>)}
                    <Button type="button" onClick={() => removeDropItem(index)} variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Drop Item
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