import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle } from 'lucide-react'
import ContentContainer from '@/components/ContentContainer'
import { Card } from '@/components/ui/card'

const questions = [
  {
    id: 1,
    question: "What do bears eat?",
    options: [
      { id: 'a', text: "Only plants" },
      { id: 'b', text: "Only animals" },
      { id: 'c', text: "Both plants and animals" },
      { id: 'd', text: "Only fish" }
    ],
    correctAnswer: 'c'
  },
  {
    id: 2,
    question: "Why do some bears hibernate during the winter?",
    options: [
      { id: 'a', text: "To avoid predators" },
      { id: 'b', text: "To save energy when food is scarce" },
      { id: 'c', text: "To take a break from hunting" },
      { id: 'd', text: "To keep warm during cold weather" }
    ],
    correctAnswer: 'b'
  },
  {
    id: 3,
    question: "Which type of bear relies mostly on meat for food?",
    options: [
      { id: 'a', text: "Brown bear" },
      { id: 'b', text: "Black bear" },
      { id: 'c', text: "Panda bear" },
      { id: 'd', text: "Polar bear" }
    ],
    correctAnswer: 'd'
  },
  {
    id: 4,
    question: "How long do bear cubs stay with their mothers?",
    options: [
      { id: 'a', text: "One year" },
      { id: 'b', text: "Two years" },
      { id: 'c', text: "Six months" },
      { id: 'd', text: "Four years" }
    ],
    correctAnswer: 'b'
  },
  {
    id: 5,
    question: "What is one special ability that black bears have?",
    options: [
      { id: 'a', text: "They can swim long distances" },
      { id: 'b', text: "They are skilled climbers" },
      { id: 'c', text: "They live in large groups" },
      { id: 'd', text: "They don't need to hibernate" }
    ],
    correctAnswer: 'b'
  }
]

export default function Exercise3_0001() {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(new Array(questions.length).fill(''))
  const [submitted, setSubmitted] = useState(false)

  const handleOptionChange = (questionId: number, value: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[questionId - 1] = value
    setSelectedAnswers(newAnswers)
  }

  const handleSubmit = () => {
    setSubmitted(true)
    
    const score = getScore();
    const scorePercent = (score / questions.length) * 100;

    const answersJson = questions.map((question, index) => {
      const isCorrect = question.correctAnswer === selectedAnswers[index];
      return {
      question: question.question,
      studentAnswer: selectedAnswers[index],
      isCorrect: isCorrect
      };
    });

    // Convert the answers to a markdown string
    const answersMD = answersJson.map((answer) => {
      return `- **${answer.question}**: ${answer.isCorrect ? "Correct" : "Incorrect"} - Student Answer: ${answer.studentAnswer}`;
    }).join("\n");

    return { answers: answersMD, score: scorePercent };

  }

  const getScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (question.correctAnswer === selectedAnswers[index] ? 1 : 0)
    }, 0)
  }

  return (
    <ContentContainer title='Bear Quiz for Kids!' className='bg-gradient-to-r from-blue-300 to-sky-300' overrideClass="bg-white" headerBgColor='bg-blue-200' headerTextColor='text-blue-900' isInstantScoredExercise onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questions.map((question) => (
          <Card key={question.id} className="bg-blue-100 p-4 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">{question.question}</h2>
            <RadioGroup
              value={selectedAnswers[question.id - 1]}
              onValueChange={(value) => handleOptionChange(question.id, value)}
              className="space-y-2"
            >
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                  <Label
                    htmlFor={`${question.id}-${option.id}`}
                    className="text-lg cursor-pointer hover:text-blue-600"
                  >
                    {option.text}
                  </Label>
                  {submitted && option.id === selectedAnswers[question.id - 1] && (
                    option.id === question.correctAnswer ? (
                      <CheckCircle className="text-green-500 ml-2" />
                    ) : (
                      <XCircle className="text-red-500 ml-2" />
                    )
                  )}
                </div>
              ))}
            </RadioGroup>
          </Card>
        ))}
      </div>
      {/* {submitted && (
        <div className="mt-6 p-4 bg-yellow-100 rounded-md text-center">
          <p className="text-2xl font-bold text-yellow-800">
            Great job! You got {getScore()} out of {questions.length} correct!
          </p>
          <p className="text-xl text-yellow-700 mt-2">
            {getScore() === questions.length ? "Perfect score! You're a bear expert!" : "Keep learning about bears!"}
          </p>
        </div>
      )} */}
      
    </ContentContainer>
  )
}