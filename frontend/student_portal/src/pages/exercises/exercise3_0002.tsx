import React, { useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import dog from '@/assets/dog.png'
import bird from '@/assets/bird.png'
import elephant from '@/assets/elephant.png'
import goat from '@/assets/goat.png'
import lion from '@/assets/lion.png'
import lizard from '@/assets/lizard.png'
import snake from '@/assets/snake.png'
import whale from '@/assets/whale.png'
import LessonContainer from '@/components/LessonContainer'

const animals = [
  { id: 'dog', src: dog, alt: 'Dog' },
  { id: 'elephant', src: elephant, alt: 'Elephant' },
  { id: 'goat', src: goat, alt: 'Goat' },
  { id: 'snake', src: snake, alt: 'Snake' },
  { id: 'manatee', src: whale, alt: 'Manatee' },
  { id: 'lion', src: lion , alt: 'Lion' },
  { id: 'bird', src: bird, alt: 'Bird' },
  { id: 'lizard', src: lizard, alt: 'Lizard' },
]

interface DraggableAnimalProps {
  id: string;
  src: string;
  alt: string;
}

const DraggableAnimal: React.FC<DraggableAnimalProps> = ({ id, src, alt }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'animal',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <img
      ref={drag}
      src={src}
      alt={alt}
      className={`w-20 h-20 cursor-move ${isDragging ? 'opacity-50' : ''}`}
    />
  )
}

interface DropZoneProps {
  onDrop: (id: string) => void;
  children: React.ReactNode;
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'animal',
    drop: (item: { id: string }) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={`w-full h-64 border-2 border-dashed ${
        isOver ? 'border-green-500 bg-green-100' : 'border-gray-300'
      } flex flex-wrap content-start p-4`}
    >
      {children}
    </div>
  )
}

export default function Exercise3_0002() {
  const [createdAnimal, setCreatedAnimal] = useState<string[]>([])


  const handleDrop = (id: string) => {
    setCreatedAnimal((prev: string[]) => [...prev, id])
  }

  const handleReset = () => {
    setCreatedAnimal([])
  }

  return (
    <LessonContainer title="Create This Mythological Animal">
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Drag And Drop To Make This Mythological Animal</h1>
        <p className="mb-4">
          It is a fearsome creature with a unique and striking appearance. It has a large, powerful
          body covered in thick fur, giving it a wild and rugged look. At the front, it features a
          fierce head with sharp teeth and glowing eyes. Rising from its back is another head, this
          one resembling a smaller, horned creature. Its tail is long and snake-like, often depicted
          with scales that glisten in shades of green and black. It is a mix of strength and
          ferocity.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-2">Available Animals</h2>
            <div className="flex flex-wrap gap-2">
              {animals.map((animal) => (
                <DraggableAnimal key={animal.id} {...animal} />
              ))}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-semibold mb-2">Create here</h2>
            <DropZone onDrop={handleDrop}>
              {createdAnimal.map((id, index) => {
                const animal = animals.find((a) => a.id === id)
                return (
                  <img
                    key={index}
                    src={animal?.src}
                    alt={animal?.alt}
                    className="w-20 h-20 m-1"
                  />
                )
              })}
            </DropZone>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
    </LessonContainer>
  )
}