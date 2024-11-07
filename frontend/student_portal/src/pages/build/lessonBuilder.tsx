import { useState, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

type LessonType = 'flashcard' | 'image' | 'text' | ''

interface LessonContent {
  images?: string[]
  titles?: string[]
  descriptions?: string[]
  url?: string
  paragraphs?: string[]
  background_image?: {
    url: string
    position: string
  }
}

interface LessonData {
  title: string
  description: string
  instruction: string
  order: number
  lesson_type: LessonType
  lesson_content: LessonContent
}

export default function LessonContentMaker() {
  const [lessonData, setLessonData] = useState<LessonData>({
    title: '',
    description: '',
    instruction: '',
    order: 0,
    lesson_type: '',
    lesson_content: {}
  })

  const handleLessonChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLessonData(prev => ({ ...prev, [name]: name === 'order' ? Number(value) : value }))
  }

  const handleLessonTypeChange = (value: LessonType) => {
    setLessonData(prev => ({
      ...prev,
      lesson_type: value,
      lesson_content: value === 'flashcard' ? { images: [], titles: [], descriptions: [] } :
                      value === 'image' ? { url: '' } :
                      value === 'text' ? { paragraphs: [""], background_image: { url: '', position: 'background' } } :
                      {}
    }))
  }

  const updateFlashcardContent = (index: number, field: 'images' | 'titles' | 'descriptions', value: string) => {
    setLessonData(prev => {
      const newContent = { ...prev.lesson_content }
      if (newContent[field]) {
        newContent[field]![index] = value
      }
      return { ...prev, lesson_content: newContent }
    })
  }

  const addFlashcardItem = () => {
    setLessonData(prev => ({
      ...prev,
      lesson_content: {
        images: [...prev.lesson_content.images!, ''],
        titles: [...prev.lesson_content.titles!, ''],
        descriptions: [...prev.lesson_content.descriptions!, '']
      }
    }))
  }

  const updateTextContent = (index: number, value: string) => {
    setLessonData(prev => {
      const newParagraphs = [...prev.lesson_content.paragraphs!]
      newParagraphs[index] = value
      return { ...prev, lesson_content: { ...prev.lesson_content, paragraphs: newParagraphs } }
    })
  }

  const addTextParagraph = () => {
    setLessonData(prev => ({
      ...prev,
      lesson_content: {
        ...prev.lesson_content,
        paragraphs: [...prev.lesson_content.paragraphs!, '']
      }
    }))
  }

  const updateBackgroundImage = (field: 'url' | 'position', value: string) => {
    setLessonData(prev => ({
      ...prev,
      lesson_content: {
        ...prev.lesson_content,
        background_image: {
          ...prev.lesson_content.background_image!,
          [field]: value
        }
      }
    }))
  }

  const getJsonOutput = () => {
    return JSON.stringify(lessonData, null, 2)
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Lesson</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input
              name="title"
              placeholder="Title"
              value={lessonData.title}
              onChange={handleLessonChange}
            />
            <Textarea
              name="description"
              placeholder="Description"
              value={lessonData.description}
              onChange={handleLessonChange}
            />
            <Textarea
              name="instruction"
              placeholder="Instruction"
              value={lessonData.instruction}
              onChange={handleLessonChange}
            />
            <Input
              name="order"
              type="number"
              placeholder="Order"
              value={lessonData.order}
              onChange={handleLessonChange}
            />
            <Select
              name="lesson_type"
              onValueChange={handleLessonTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lesson type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flashcard">Flashcard</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>

            {lessonData.lesson_type === 'flashcard' && (
              <div className="space-y-4">
                {lessonData.lesson_content.images!.map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Input
                      placeholder={`Flashcard ${index + 1} Image URL`}
                      value={lessonData.lesson_content.images![index]}
                      onChange={(e) => updateFlashcardContent(index, 'images', e.target.value)}
                    />
                    <Input
                      placeholder={`Flashcard ${index + 1} Title`}
                      value={lessonData.lesson_content.titles![index]}
                      onChange={(e) => updateFlashcardContent(index, 'titles', e.target.value)}
                    />
                    <Textarea
                      placeholder={`Flashcard ${index + 1} Description`}
                      value={lessonData.lesson_content.descriptions![index]}
                      onChange={(e) => updateFlashcardContent(index, 'descriptions', e.target.value)}
                    />
                  </div>
                ))}
                <Button type="button" onClick={addFlashcardItem}>Add Flashcard</Button>
              </div>
            )}

            {lessonData.lesson_type === 'image' && (
              <Input
                placeholder="Image URL"
                value={lessonData.lesson_content.url!}
                onChange={(e) => setLessonData(prev => ({ ...prev, lesson_content: { url: e.target.value } }))}
              />
            )}

            {lessonData.lesson_type === 'text' && (
              <div className="space-y-4">
                {lessonData.lesson_content.paragraphs!.map((paragraph, index) => (
                  <Textarea
                    key={index}
                    placeholder={`Paragraph ${index + 1}`}
                    value={paragraph}
                    onChange={(e) => updateTextContent(index, e.target.value)}
                  />
                ))}
                <Button type="button" onClick={addTextParagraph}>Add Paragraph</Button>
                <div className="space-y-2">
                  <Label>Background Image (Optional)</Label>
                  <Input
                    placeholder="Background Image URL"
                    value={lessonData.lesson_content.background_image!.url}
                    onChange={(e) => updateBackgroundImage('url', e.target.value)}
                  />
                  <Select
                    value={lessonData.lesson_content.background_image!.position}
                    onValueChange={(value) => updateBackgroundImage('position', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select background position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="background">Background</SelectItem>
                      <SelectItem value="lower-left">Lower Left</SelectItem>
                      <SelectItem value="lower-right">Lower Right</SelectItem>
                      <SelectItem value="upper-left">Upper Left</SelectItem>
                      <SelectItem value="upper-right">Upper Right</SelectItem>
                      <SelectItem value="inline-left">Inline Left</SelectItem>
                      <SelectItem value="inline-right">Inline Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JSON Output</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {getJsonOutput()}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}