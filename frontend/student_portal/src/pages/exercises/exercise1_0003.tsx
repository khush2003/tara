import { useState } from "react";
import cake from "../../assets/TARA flashcards/cake.png";
import rice from "../../assets/TARA flashcards/rice.png";
import egg from "../../assets/TARA flashcards/egg.png";
import salad from "../../assets/TARA flashcards/salad.png";
import chicken from "../../assets/TARA flashcards/chicken.png";
import omelette from "../../assets/TARA flashcards/omelette.png";
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { Button } from "@/components/ui/button"
import {  CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast";
import LessonContainer from "@/components/LessonContainer";


//TODO: Implement the Checking of Answers Properly
const foodItems = [
  { id: 'cake', src: cake, alt: 'Birthday Cake' },
  { id: 'rice', src: rice, alt: 'Rice Bowl' },
  { id: 'egg', src: egg, alt: 'Egg' },
  { id: 'omlette', src: omelette, alt: 'Omlette' },
  { id: 'salad1', src: salad, alt: 'Salad Bowl 1' },
  { id: 'salad2', src: salad, alt: 'Salad Bowl 2' },
  { id: 'chicken', src: chicken, alt: 'Chicken' },
]

const sentences = [
  { id: 'josh', text: 'Josh cooked an omelette and prepared a salad', slots: 2, correctAnswers: ['egg', 'salad1'] },
  { id: 'bingo', text: 'Bingo prepared two salads', slots: 2, correctAnswers: ['salad1', 'salad2'] },
  { id: 'leo', text: 'Leo prepared a meal with rice and chicken', slots: 2, correctAnswers: ['rice', 'chicken'] },
]


interface DraggableFoodProps {
  id: string;
  src: string;
  alt: string;
}

const DraggableFood = ({ id, src, alt }: DraggableFoodProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'food',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} className="cursor-move">
      <img src={src} alt={alt} className="w-24 h-24 object-cover bg-gray-100 p-2 rounded-lg" />
    </div>
  )
}

interface DroppableSlotProps {
  onDrop: (itemId: string) => void;
  children: React.ReactNode;
}

const DroppableSlot = ({ onDrop, children }: DroppableSlotProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'food',
    drop: (item: { id: string }) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div 
      ref={drop} 
      className={`w-24 h-24 border-2 border-dashed ${isOver ? 'border-blue-500' : 'border-gray-300'} rounded-lg flex items-center justify-center`}
    >
      {children}
    </div>
  )
}

export default function FoodSentenceGame() {
  const [availableItems, setAvailableItems] = useState(foodItems)
  const [answers, setAnswers] = useState(
    Object.fromEntries(sentences.map(sentence => [sentence.id, Array(sentence.slots).fill(null)]))
  )

  interface HandleDropParams {
    sentenceId: string;
    slotIndex: number;
    itemId: string;
  }

  const handleDrop = ({ sentenceId, slotIndex, itemId }: HandleDropParams) => {
    setAnswers(prev => {
      const newAnswers = { ...prev }
      newAnswers[sentenceId][slotIndex] = itemId
      return newAnswers
    })
    setAvailableItems(prev => prev.filter(item => item.id !== itemId))
  }

  const checkAnswers = () => {
    let allCorrect = true
    sentences.forEach(sentence => {
      const isCorrect = sentence.correctAnswers.every(
        (answer, index) => answers[sentence.id][index] === answer
      )
      if (!isCorrect) allCorrect = false
    })

    if (allCorrect) {
      toast({
        title: "Congratulations!",
        description: "All answers are correct!",
        variant: "default",
      })
    } else {
      toast({
        title: "Oops!",
        description: "Some answers are incorrect. Try again!",
        variant: "destructive",
      })
    }
  }

  const resetGame = () => {
    setAvailableItems(foodItems)
    setAnswers(Object.fromEntries(sentences.map(sentence => [sentence.id, Array(sentence.slots).fill(null)])))
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <LessonContainer title="Food Sentence Game" overrideClass="max-w-4xl">
          <CardContent className="p-6">
            <p className="text-lg text-center mb-6">Drag the images to complete the sentences</p>
            <div className="flex justify-center space-x-4 mb-8">
              {availableItems.map((item) => (
                <DraggableFood key={item.id} id={item.id} src={item.src} alt={item.alt} />
              ))}
            </div>

            {sentences.map((sentence) => (
              <div key={sentence.id} className="mb-6">
                <p className="text-lg mb-2">{sentence.text}</p>
                <div className="flex space-x-4">
                  {Array.from({ length: sentence.slots }).map((_, index) => (
                    <DroppableSlot key={`${sentence.id}-${index}`} onDrop={(itemId) => handleDrop({ sentenceId: sentence.id, slotIndex: index, itemId })}>
                      {answers[sentence.id][index] && (
                        <img 
                          src={foodItems.find(item => item.id === answers[sentence.id][index])?.src} 
                          alt={foodItems.find(item => item.id === answers[sentence.id][index])?.alt}
                          className="w-12 h-12 object-cover"
                        />
                      )}
                    </DroppableSlot>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-center space-x-4 mt-8">
              <Button onClick={checkAnswers} className="bg-green-500 hover:bg-green-600 text-white">
                Check Answers
              </Button>
              <Button onClick={resetGame} variant="outline" className="bg-blue-100 hover:bg-blue-200 text-blue-800">
                Reset
              </Button>
            </div>
          </CardContent>
      </LessonContainer>
      </DndProvider>
  )
}