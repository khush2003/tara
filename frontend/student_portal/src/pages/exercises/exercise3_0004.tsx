import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import octopus from '@/assets/octopus.png'
import horse from '@/assets/horse.png'
import snail from '@/assets/snail.png'
import pigeon from '@/assets/pigeon.png'
import cow from '@/assets/cow.png'
import monkeys from '@/assets/monkey.png'
import LessonContainer from '@/components/LessonContainer'

const animals = [
  { name: 'octopus', image: octopus, thai: 'ปลาหมึก' },
  { name: 'horse', image: horse, thai: 'ม้า' },
  { name: 'snail', image: snail, thai: 'หอยทาก' },
  { name: 'pigeon', image: pigeon, thai: 'นกพิราบ' },
  { name: 'cow', image: cow, thai: 'วัว' },
  { name: 'monkeys', image: monkeys, thai: 'ลิง' },
]

export default function Exercise3_0004() {
  const [descriptions, setDescriptions] = useState(Array(6).fill(''))
  const [feedback, setFeedback] = useState(Array(6).fill(''))
  const [showFeedback, setShowFeedback] = useState(false)

  const handleInputChange = (index: number, value: string) => {
    const newDescriptions = [...descriptions]
    newDescriptions[index] = value
    setDescriptions(newDescriptions)
  }

  const handleSubmit = () => {
    const newFeedback = descriptions.map((desc, index) => 
      desc.toLowerCase().includes(animals[index].name) ? 
        '🎉 Great job!' : 
        `Try again! Hint: It's a ${animals[index].thai}.`
    )
    setFeedback(newFeedback)
    setShowFeedback(true)
  }

  return (
    <LessonContainer title="Describe the Animals">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {animals.map((animal, index) => (
          <motion.div 
            key={index}
            className="bg-white p-4 rounded-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.img 
              src={animal.image} 
              alt={animal.name}
              className="w-32 h-32 mx-auto mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            />
            <Input
              value={descriptions[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="mb-2"
              placeholder="Describe the animal"
            />
            {showFeedback && (
              <motion.p 
                className={feedback[index].includes('Great') ? 'text-green-600' : 'text-orange-500'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {feedback[index]}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
      <motion.div 
        className="mt-8 text-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          onClick={handleSubmit} 
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-full text-lg"
        >
          Check My Answers!
        </Button>
      </motion.div>
    </LessonContainer>
  )
}