import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Confetti } from "./confetti"
import { Toaster } from '@/components/ui/toaster'

const springTransition = { type: "spring", stiffness: 300, damping: 30 }

const ItemTypes = {
    DRAG_ITEM: 'dragItem',
}

interface Content {
    type: 'text' | 'image';
    content: string;
    alt?: string;
}

interface DraggableItemProps {
    id: string;
    content: Content;
    onDrop: (dropAreaId: string, item: { id: string; content: Content }) => void;
    isInDropArea: boolean;
}

function DraggableItem({ id, content, isInDropArea }: DraggableItemProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.DRAG_ITEM,
        item: { id, content },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    return (
        <div
            ref={drag}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'move',
            }}
            className={`bg-white dark:bg-gray-800 p-2 mb-2  rounded-md shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 select-none `}
        >
            {content.type === 'text' ? (
                <span>{content.content}</span>
            ) : (
                <div className={`relative ${
                isInDropArea ? 'w-[70px] h-[70px]' : 'w-[160px] h-[200px]'
            }`}>
                    <img 
                        src={content.content} 
                        alt="Draggable item"
                        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    />
                </div>
            )}
        </div>
    )
}

interface DroppableAreaProps {
    id: string;
    items: { id: string; content: Content }[];
    onDrop: (dropAreaId: string, item: { id: string; content: Content }) => void;
}

function DroppableArea({ id, items, onDrop }: DroppableAreaProps) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.DRAG_ITEM,
        drop: (item: { id: string; content: Content }) => onDrop(id, item),
        collect: (monitor: DropTargetMonitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    return (
        <div
            ref={drop}
            className={`bg-white dark:bg-gray-800 p-2 rounded-md min-h-[100px] border-2 border-dashed ${
                isOver ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
            }`}
        >
            {items.map((item) => (
                <DraggableItem key={item.id} id={item.id} content={item.content} onDrop={onDrop} isInDropArea={true} />
            ))}
        </div>
    )
}

interface Exercise {
    exercise_content: {
        dropArea: { type: 'single' | 'multiple' };
        text?: string;
        images: string[];
    }[];
    dropItems: { id: string; content: Content }[];
    correct_answers: string[][];
    max_score: number;
    is_instant_scored: boolean;
}

export default function DragAndDropViewer() {
    const [jsonInput, setJsonInput] = useState<string>('')
    const [exercise, setExercise] = useState<Exercise | null>(null)
    const [dropAreas, setDropAreas] = useState<{ id: string; type: 'single' | 'multiple'; items: { id: string; content: Content }[] }[]>([])
    const [dropItems, setDropItems] = useState<{ id: string; content: Content }[]>([])
    const [score, setScore] = useState<number | null>(null)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [showConfetti, setShowConfetti] = useState<boolean>(false)
    const [firstSubmission, setFirstSubmission] = useState<boolean>(true)
    const { toast } = useToast()

    useEffect(() => {
        if (score !== null && score === exercise?.max_score) {
            setShowConfetti(true)
            const timer = setTimeout(() => setShowConfetti(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [score, exercise?.max_score])

    const handleJsonSubmit = () => {
        try {
            const parsedExercise: Exercise = JSON.parse(jsonInput)
            setExercise(parsedExercise)
            setDropAreas(parsedExercise.exercise_content.map((group, index) => ({ ...group.dropArea, id: `area-${index}`, items: [] })))
            setDropItems(parsedExercise.dropItems)
            setScore(null)
            setSubmitted(false)
            setFirstSubmission(true)
        } catch (error) {
            console.error("Invalid JSON:", error)
            alert("Invalid JSON. Please check your input.")
        }
    }

    const handleDrop = useCallback((dropAreaId: string, item: { id: string; content: Content }) => {
        setDropAreas(areas => {
            const newAreas = [...areas]
            const targetAreaIndex = newAreas.findIndex(area => area.id === dropAreaId)
            const sourceAreaIndex = newAreas.findIndex(area => area.items.some(i => i.id === item.id))

            // If the item is coming from another drop area
            if (sourceAreaIndex !== -1) {
                const movedItem = newAreas[sourceAreaIndex].items.find(i => i.id === item.id)
                newAreas[sourceAreaIndex].items = newAreas[sourceAreaIndex].items.filter(i => i.id !== item.id)
                
                if (newAreas[targetAreaIndex].type === 'single' && newAreas[targetAreaIndex].items.length > 0) {
                    // Move the existing item back to the items list
                    const existingItem = newAreas[targetAreaIndex].items[0]
                    setDropItems(items => [...items, existingItem])
                }
                
                newAreas[targetAreaIndex].items = newAreas[targetAreaIndex].type === 'single' 
                    ? [movedItem!]
                    : [...newAreas[targetAreaIndex].items, movedItem!]
            } else {
                // If the item is coming from the original items list
                const movedItem = dropItems.find(i => i.id === item.id)
                
                if (newAreas[targetAreaIndex].type === 'single' && newAreas[targetAreaIndex].items.length > 0) {
                    // Move the existing item back to the items list
                    const existingItem = newAreas[targetAreaIndex].items[0]
                    setDropItems(items => [...items, existingItem])
                }
                
                newAreas[targetAreaIndex].items = newAreas[targetAreaIndex].type === 'single'
                    ? [movedItem!]
                    : [...newAreas[targetAreaIndex].items, movedItem!]
                
                setDropItems(items => items.filter(i => i.id !== item.id))
            }

            return newAreas
        })
    }, [dropItems])

    const handleReset = () => {
        if (exercise) {
            setDropAreas(exercise.exercise_content.map((group, index) => ({ ...group.dropArea, id: `area-${index}`, items: [] })))
            setDropItems(exercise.dropItems)
            setSubmitted(false)
            setScore(null)
        }
    }

    const handleSubmit = () => {
        if (!exercise) return

        let correctCount = 0
        let totalQuestions = 0
        let answersString = ""

        dropAreas.forEach((area, index) => {
            const correctAnswers = exercise.correct_answers[index] || []
            const userAnswers = area.items.map(item => item.id)

            answersString += `**Group** ${index + 1}:\n`
            answersString += `**Correct Answers**: \n`
            correctAnswers.forEach(answerId => {
                const item = exercise.dropItems.find(i => i.id === answerId)
                if (item) {
                    if (item.content.type === 'image') {
                        answersString += `- Image: ${item.content.content} (Alt: ${item.content.alt || 'No alt text'})\n`
                    } else {
                        answersString += `- Text: ${item.content.content}\n`
                    }
                }
            })
            answersString += `**User Answers**: \n`
            userAnswers.forEach(answerId => {
                const item = exercise.dropItems.find(i => i.id === answerId)
                if (item) {
                    if (item.content.type === 'image') {
                        answersString += `- Image: ${item.content.content} (Alt: ${item.content.alt || 'No alt text'})\n`
                    } else {
                        answersString += `- Text: ${item.content.content}\n`
                    }
                }
            })

            if (area.type === 'single') {
                if (userAnswers.length === 1 && correctAnswers.includes(userAnswers[0])) {
                    correctCount++
                }
                totalQuestions++
            } else {
                const correctSet = new Set(correctAnswers)
                const userSet = new Set(userAnswers)
                if (correctSet.size === userSet.size && [...correctSet].every(answer => userSet.has(answer))) {
                    correctCount++
                }
                totalQuestions++
            }

            answersString += `Is Correct: ${correctCount === totalQuestions}\n\n`
        })

        console.log("Student's Answers:\n", answersString)
        setSubmitted(true)
        if (exercise.is_instant_scored) {
            const scorePercentage = (correctCount / totalQuestions) * 100
            const finalScore = Math.round((scorePercentage / 100) * exercise.max_score)
            setScore(finalScore)
            
            if (firstSubmission) {
                toast({
                    title: "Answers Submitted!",
                    description: `You've earned ${finalScore} out of ${exercise.max_score} points (${scorePercentage.toFixed(2)}%)!`,
                    duration: 3000,
                })
                setFirstSubmission(false)
            }
        }
        
    }

    const renderExerciseContent = () => {
        return (
            <div className="space-y-3">
                {exercise?.exercise_content.map((group, groupIndex) => (
                    <Card key={groupIndex} className="rounded-xl overflow-hidden">
                        <CardContent className="p-6 bg-green-50">
                            {group.text && <p className="mb-4">{group.text}</p>}
                            {group.images.map((image, imageIndex) => (
                                <img key={imageIndex} src={image} alt={`Group ${groupIndex + 1} Image ${imageIndex + 1}`} width={140} height={140} className="mb-4 rounded-md" />
                            ))}
                            <DroppableArea
                                id={dropAreas[groupIndex].id}
                                items={dropAreas[groupIndex].items}
                                onDrop={handleDrop}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={springTransition}
                className=""
            >
                {!exercise && <Card className="w-full max-w-4xl mx-auto mb-8 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                    <CardContent className="p-6">
                        <Textarea
                            placeholder="Paste your exercise JSON here"
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="min-h-[200px] mb-4 bg-white dark:bg-gray-800 rounded-lg"
                        />
                        <Button onClick={handleJsonSubmit} className="w-full text-lg py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 rounded-lg">
                            Start the Exercise
                        </Button>
                    </CardContent>
                </Card>}
                <Toaster />
                <AnimatePresence>
                    {exercise && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={springTransition}
                        >
                            <div>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-4 gap-6">
                                        <div className="space-y-4 col-span-3">
                                            {renderExerciseContent()}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-white col-span-1 dark:bg-gray-800 p-4 rounded-md">
                                                {dropItems.map((item) => (
                                                    <DraggableItem key={item.id} id={item.id} content={item.content} onDrop={handleDrop} isInDropArea={false} />
                                                ))}
                                            </div>
                                            <div className="flex flex-col space-y-4">
                                                <Button onClick={handleReset} className="w-full bg-yellow-500 hover:bg-yellow-600">
                                                    Reset
                                                </Button>
                                                <Button onClick={handleSubmit} className="w-full bg-blue-500 hover:bg-blue-600">
                                                    {submitted ? "Resubmit Answers" : "Submit Answers"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {submitted && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={springTransition}
                                            className="mt-4"
                                        >
                                            <Alert className="bg-blue-100 border-blue-500 text-blue-800 rounded-lg">
                                                <AlertTitle className="text-xl font-bold">
                                                    {exercise.is_instant_scored ? "Your Score" : "Answers Submitted"}
                                                </AlertTitle>
                                                <AlertDescription className="text-lg">
                                                    {exercise.is_instant_scored
                                                        ? `You scored ${score ?? 0} out of ${exercise.max_score} (${(((score ?? 0) / exercise.max_score) * 100).toFixed(2)}%)`
                                                        : "Your answers have been recorded. Your teacher will review and score them."}
                                                </AlertDescription>
                                            </Alert>
                                        </motion.div>
                                    )}
                                </CardContent>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {showConfetti && <Confetti />}
            </motion.div>
        </DndProvider>
    )
}