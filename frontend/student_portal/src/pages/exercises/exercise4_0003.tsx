import { DragEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import img1 from '@/assets/img_match_1.png'
import img2 from '@/assets/img_match_2.png'
import img3 from '@/assets/img_match_3.png'
import img4 from '@/assets/img_match_4.png'
import ContentContainer from '@/components/ContentContainer'


const descriptions = [
  "The couple is sitting outside, dressed in traditional clothing. The trees around them are full of flowers, and a few petals are gently falling. They are smiling and enjoying the breeze.",
  "The ground is covered in white, and the couple is playing together outside. They are wearing thick, warm clothes, and the air looks cold.",
  "The couple is enjoying a meal outside. The leaves around them are falling. They are sitting on a blanket and having a picnic under a big tree.",
  "It's raining, and the couple is outside. One of them is looking at a small snail on the ground, while the other watches from under the shelter of a tree."
]

const initialImages = [
  { id: 'img1', src: img1, alt: "Person sitting near hydrangea flowers" },
  { id: 'img2', src: img2, alt: "Two people in kimonos standing together" },
  { id: 'img3', src: img3, alt: "Family having a picnic under an autumn tree" },
  { id: 'img4', src: img4, alt: "Two children playing in a snowy scene" }
]

const correctMatches = [
  { description: descriptions[0], image: 'img2' },
  { description: descriptions[1], image: 'img4' },
  { description: descriptions[2], image: 'img3' },
  { description: descriptions[3], image: 'img1' }
]

export default function Component() {
  const [matches, setMatches] = useState<{ [key: string]: string }>({})
  const [availableImages, setAvailableImages] = useState(initialImages)
  const [result, setResult] = useState<{ answer: string; score: string } | null>(null)

const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id)
}

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, description: string) => {
    e.preventDefault()
    const imageId = e.dataTransfer.getData('text')
    
    // Remove the image from availableImages
    setAvailableImages(prev => prev.filter(img => img.id !== imageId))
    
    // Update matches
    setMatches(prev => ({
      ...prev,
      [description]: imageId
    }))
  }

  const handleSubmit = () => {
    let correctCount = 0
    let feedback = ""

    correctMatches.forEach(({ description, image }) => {
      const isCorrect = matches[description] === image
      if (isCorrect) correctCount++
      const studentChoice = matches[description] 
        ? initialImages.find(img => img.id === matches[description])?.alt || 'Image not found'
        : 'Not answered'
      feedback += `Description: ${description.slice(0, 40)}..., Student Choice: ${studentChoice}, Correct: ${isCorrect}\n\n`
    })

    const score = (correctCount / correctMatches.length) * 100

    setResult({
      answer: feedback,
      score: score.toFixed(2)
    })
    return { answers: feedback, score }
  }

  return (
    <ContentContainer title="Match the Image to the Description" overrideClass="max-w-4xl" isInstantScoredExercise onSubmit={handleSubmit}>
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <h1 className="text-lg font-medium text-gray-800 mb-4">Click and drag an image to the correct desciption of the image</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            {descriptions.map((desc, index) => (
              <div
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, desc)}
                className="p-4 border rounded mb-2 min-h-[100px]"
              >
                <p className="mb-2">{desc}</p>
                {matches[desc] && (
                  <img 
                    src={initialImages.find(img => img.id === matches[desc])?.src} 
                    alt={initialImages.find(img => img.id === matches[desc])?.alt} 
                    className="w-16 h-16 object-cover" 
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center">
            {availableImages.map((img) => (
              <div
                key={img.id}
                draggable
                onDragStart={(e) => handleDragStart(e, img.id)}
                className="m-2 cursor-move"
              >
                <img src={img.src} alt={img.alt} className="w-32 h-32 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
    </ContentContainer>
  )
}