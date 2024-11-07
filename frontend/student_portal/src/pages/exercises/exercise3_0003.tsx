import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ContentContainer from '@/components/ContentContainer'
import { Card } from '@/components/ui/card'

export default function Exercise3_0003() {
  const [answers, setAnswers] = useState(['', '', '', ''])
  const [feedback, setFeedback] = useState(['', '', '', ''])
  const [submitted, setSubmitted] = useState(false)

  const correctAnswers = ['octopus', 'zebra', 'sloth', 'lion']
  const riddles = [
    "I live in the sea, but I'm not a fish,\nWith eight long arms that squirm and twist.\nI'm clever and sneaky, I can change my hue,\nWhat kind of ocean creature am I to you?",
    "I run very fast on the African plain,\nWith black and white stripes, I'm easy to name.\nI graze on the grass, with a herd I stay,\nWhat animal am I, can you say?",
    "I hang upside down in a tree all day,\nI move very slowly, that's just my way.\nWith three or two toes, I live in the wild,\nWhat animal am I, calm and mild?",
    "I have a big roar and a golden mane,\nI'm known as the king of the savannah plain.\nI live in a pride, and I hunt for my food,\nWhat animal am I, fierce and shrewd?"
  ]

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value.toLowerCase()
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    const newFeedback = answers.map((answer, index) => 
      answer === correctAnswers[index] ? '✅ Correct!' : '❌ Try again!'
    )
    setFeedback(newFeedback)
    setSubmitted(true)

    const correctCount = newFeedback.filter(f => f.includes('Correct')).length
    const scorePercent = (correctCount / correctAnswers.length) * 100

    const answerMD = riddles.map((riddle, index) => 
      `**Question:** ${riddle}\n**Your Answer:** ${answers[index]}\n**Feedback:** ${newFeedback[index]}\n`
    ).join('\n')

    return { answers: answerMD, score: scorePercent }
  }

  return (
   <ContentContainer title="Animal Riddles" isInstantScoredExercise onSubmit={handleSubmit} >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {riddles.map((riddle, index) => (
          <Card key={index} className="bg-white p-4 rounded-lg shadow">
            <p className="whitespace-pre-wrap mb-4 text-gray-700">{riddle}</p>
            <Label htmlFor={`answer-${index}`}>Your Answer:</Label>
            <Input
              id={`answer-${index}`}
              value={answers[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="mb-2 mt-2 rounded-xl border border-gray-300 p-2 w-full"
              placeholder="Write here"
            />
            {submitted && (
              <p className={feedback[index].includes('Correct') ? 'text-green-600' : 'text-red-600'}>
                {feedback[index]}
              </p>
            )}
          </Card>
        ))}
      </div>

      </ContentContainer>
  )
}