import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { useExerciseStore } from '@/store/exerciseStore'

interface LessonData {
  title: string
  description: string
  instruction: string
  order: number
  lesson_type: 'flashcard' | 'image' | 'text'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lesson_content: any
}

function FlashCard({ image, title, description }: { image: string; title: string; description: string }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="relative h-[300px] cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of card */}
        <div 
          className="absolute w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <Card className="h-full bg-white rounded-3xl shadow-md overflow-hidden">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="flex-grow p-6 flex items-center justify-center">
                <img
                  src={image}
                  alt={title}
                  className="max-h-full w-auto object-contain"
                />
              </div>
              <div className="bg-gray-100 p-4">
                <h3 className="text-2xl font-bold text-center text-gray-900">
                  {title}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
    
        {/* Back of card */}
        <div 
          className="absolute w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Card className="h-full bg-white rounded-3xl shadow-md overflow-hidden">
            <CardContent className="p-0 h-full">
              <div className="h-full  p-6 overflow-y-auto">
                <p className="text-lg text-center font-bold text-gray-900">{description}</p>
              </div>
              <div className="bg-gray-100 p-4">
                <p className="text-center text-gray-600">Tap to flip back</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

function parseLesson(lessonData: LessonData) {
  console.log(lessonData)
  switch (lessonData.lesson_type) {
    case 'flashcard':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lessonData.lesson_content[0].images.map((image: string, index: number) => (
            <FlashCard
              key={index}
              image={image}
              title={lessonData.lesson_content[0].titles[index]}
              description={lessonData.lesson_content[0].descriptions[index]}
            />
          ))}
        </div>
      )
    case 'image':
      return (
        <div className="relative p-10">
          <img
            className="object-contain w-full h-full"
            src={lessonData.lesson_content[0].url}
            alt={lessonData.title}
          />
        </div>
      )
    case 'text': {
      const { paragraphs, background_image } = lessonData.lesson_content[0]
      const bgImageStyle = background_image.position === 'background'
        ? { backgroundImage: `url(${background_image.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : {}

      const getImagePositionClass = (position: string) => {
        switch (position) {
          case 'upper-left': return 'absolute top-0 left-0';
          case 'upper-right': return 'absolute top-0 right-0';
          case 'lower-left': return 'absolute bottom-0 left-0';
          case 'lower-right': return 'absolute bottom-0 right-0';
          case 'inline-left': return 'float-left mr-4 mb-4';
          case 'inline-right': return 'float-right ml-4 mb-4';
          default: return '';
        }
      };

      const imagePositionClass = getImagePositionClass(background_image.position);
      const isCornerPosition = ['upper-left', 'upper-right', 'lower-left', 'lower-right'].includes(background_image.position);
      const textClass = isCornerPosition
        ? (background_image.position.includes('right') ? 'pr-[35%]' : 'pl-[35%]')
        : '';

      return (
        <div className="relative p-4" style={bgImageStyle}>
          {background_image.position !== 'background' && (
            <img
              src={background_image.url}
              alt="Lesson illustration"
              className={`${imagePositionClass} ${isCornerPosition ? 'w-1/3 h-1/3' : 'w-1/4'} object-contain`}
            />
          )}
          <div className={`space-y-4 ${textClass}`}>
            {paragraphs.map((paragraph: string, index: number) => (
              <p key={index} className="text-xl">{paragraph}</p>
            ))}
          </div>
        </div>
      )
    }
    default:
      return <div>Unknown lesson type</div>
  }
}

export default function LessonDisplay() {
  const [jsonInput, setJsonInput] = useState('')
  const {lesson: lessonData, setLesson: setLessonData} = useExerciseStore()
  const [error, setError] = useState('')

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setLessonData(parsed)
      setError('')
    } catch {
      setError('Oops! That doesn\'t look right. Let\'s try again! 🙈')
    }
  }

  return (
      <div>
        {!lessonData ? (
          <div className="max-w-2xl mx-auto space-y-4 bg-white p-8 rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold text-center text-[#8B4513] mb-4">Let's Learn Something New! 🎉</h2>
            <Textarea
              className="min-h-[200px] font-mono text-lg border-4 border-[#DEB887] rounded-xl"
              placeholder="Paste your magical lesson here... ✨"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            {error && <p className="text-red-500 text-center text-xl">{error}</p>}
            <Button 
              onClick={handleJsonSubmit}
              className="w-full text-xl py-6 bg-[#4169E1] hover:bg-[#3157D1] text-white font-bold rounded-xl transition-transform transform hover:scale-105"
            >
              Start the Fun! 🚀
            </Button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
              {parseLesson(lessonData)}
          </div>
        )}
      </div>
  )
}