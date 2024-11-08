import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Confetti } from "./confetti"
import { Toaster } from '@/components/ui/toaster'
import { useExerciseStore } from '@/store/exerciseStore'

const springTransition = { type: "spring", stiffness: 300, damping: 30 }

const ItemTypes = {
    DRAG_ITEM: 'dragItem',
}

interface DraggableItemProps {
    id: string;
    content: string;
    alt?: string;
    type: string;
    onDrop: (dropAreaId: string, item: DropItemType) => void;
    isInDropArea: boolean;
}

function DraggableItem({ id, content, type, alt, isInDropArea }: DraggableItemProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.DRAG_ITEM,
        item: { id, content, type, alt },
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
            {type === 'text' ? (
                <span>{content}</span>
            ) : (
                <div className={`relative ${
                isInDropArea ? 'w-[70px] h-[70px]' : 'w-[160px] h-[200px]'
            }`}>
                    <img 
                        src={content} 
                        alt={alt}
                        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    />
                </div>
            )}
        </div>
    )
}

interface DroppableAreaProps {
    id: string;
    items: DropItemType[];
    onDrop: (dropAreaId: string, item: DropItemType) => void;
}

function DroppableArea({ id, items, onDrop }: DroppableAreaProps) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.DRAG_ITEM,
        drop: (item: DropItemType) => onDrop(id, item),
        collect: (monitor: DropTargetMonitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    return (
        <div
            ref={drop}
            className={`bg-white dark:bg-gray-800 p-2 rounded-md min-h-[40px] border-2 border-dashed ${
                isOver ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
            }`}
        >
            {items?.map((item) => (
                <DraggableItem key={item.id} id={item.id} content={item.content} type={item.type} alt={item.alt} onDrop={onDrop} isInDropArea={true} />
            ))}
        </div>
    )
}

export interface DropItemType {
    id: string;
    content: string;
    type: string;
    alt?: string;
}

export interface DndExercise {
    exercise_content: {
        dropArea: { type: 'single' | 'multiple' };
        text?: string;
        images: string[];
    }[];
    dropItems: DropItemType[];
    correct_answers: string[][];
    max_score: number;
    is_instant_scored: boolean;
    title: string;
    description: string;
    instruction: string;
    order: number;
    exercise_type: string;
    varients: string[];
}

export default function DragAndDropViewer() {
        const {
        exercise,
        score,
        showConfetti,
        setScore,
        setSubmitted,
        unitId,
        setExercise,
        handleComplete,
        setFirstSubmission,
        submitted,
        dropAreas,
        dropItems,
        setDropAreas,
        setDropItems,
    } = useExerciseStore()
    const [jsonInput, setJsonInput] = useState<string>('')


    const handleJsonSubmit = () => {
        try {
            const parsedExercise: DndExercise = JSON.parse(jsonInput)
            setExercise(parsedExercise)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setDropAreas((_prev) => parsedExercise.exercise_content.map((group, index) => ({ ...group.dropArea, id: `area-${index}`, items: [] })))
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setDropItems((_prev) => parsedExercise.dropItems)
            setScore(null)
            setSubmitted(false)
            setFirstSubmission(true)
        } catch (error) {
            console.error("Invalid JSON:", error)
            alert("Invalid JSON. Please check your input.")
        }
    }

        const handleDrop = useCallback(
      (dropAreaId: string, item: DropItemType) => {
        setDropAreas((areas) => {
          const newAreas = areas.map((area) => ({
            ...area,
            items: [...area.items],
          }));
    
          const targetAreaIndex = newAreas.findIndex((area) => area.id === dropAreaId);
          const sourceAreaIndex = newAreas.findIndex((area) =>
            area.items.some((i) => i.id === item.id)
          );
    
          if (sourceAreaIndex !== -1) {
            // Moving item from another drop area
            const movedItem = newAreas[sourceAreaIndex].items.find((i) => i.id === item.id);
            newAreas[sourceAreaIndex].items = newAreas[sourceAreaIndex].items.filter(
              (i) => i.id !== item.id
            );
    
            if (
              newAreas[targetAreaIndex].type === 'single' &&
              newAreas[targetAreaIndex].items.length > 0
            ) {
              const existingItem = newAreas[targetAreaIndex].items[0];
              setDropItems((items) => [...items, existingItem]);
            }
    
            newAreas[targetAreaIndex].items =
              newAreas[targetAreaIndex].type === 'single'
                ? [movedItem!]
                : [...newAreas[targetAreaIndex].items, movedItem!];
          } else {
            // Moving item from the original items list
            const movedItem = dropItems.find((i) => i.id === item.id);
    
            if (
              newAreas[targetAreaIndex].type === 'single' &&
              newAreas[targetAreaIndex].items.length > 0
            ) {
              const existingItem = newAreas[targetAreaIndex].items[0];
              setDropItems((items) => [...items, existingItem]);
            }
    
            newAreas[targetAreaIndex].items =
              newAreas[targetAreaIndex].type === 'single'
                ? [movedItem!]
                : [...newAreas[targetAreaIndex].items, movedItem!];
    
            setDropItems((items) => items.filter((i) => i.id !== item.id));
          }
    
          return newAreas;
        });
      },
      [dropItems, setDropAreas, setDropItems]
    );

    const handleReset = () => {
        if (exercise) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setDropAreas((_prev) => exercise.exercise_content.map((group, index) => ({ ...group.dropArea, id: `area-${index}`, items: [] })))
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setDropItems((_prev) => exercise.dropItems!)
            setSubmitted(false)
            setScore(null)
        }
    }

    const renderExerciseContent = () => {
        return (
            <div className="space-y-3">
                {exercise?.exercise_content.map((group, groupIndex) => (
                    <Card key={groupIndex} className="rounded-xl overflow-hidden">
                        <CardContent className="p-6 bg-green-50">
                            {group.text && <p className="mb-4">{group.text}</p>}
                            {group.images?.map((image: string | undefined, imageIndex: number) => (
                                <img key={imageIndex} src={image} alt={`Group ${groupIndex + 1} Image ${imageIndex + 1}`} width={140} height={140} className="mb-4 rounded-md" />
                            ))}
                            <DroppableArea
                                id={dropAreas[groupIndex]?.id}
                                items={dropAreas[groupIndex]?.items}
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
                                                    <DraggableItem key={item.id} id={item.id} content={item.content} type={item.type} alt={item.alt} onDrop={handleDrop} isInDropArea={false} />
                                                ))}
                                            </div>
                                            <div className="flex flex-col space-y-4">
                                                <Button onClick={handleReset} className="w-full bg-yellow-500 hover:bg-yellow-600">
                                                    Reset
                                                </Button>
                                                {!unitId && <Button onClick={handleComplete} className="w-full bg-blue-500 hover:bg-blue-600">
                                                    {submitted ? "Resubmit Answers" : "Submit Answers"}
                                                </Button>}
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