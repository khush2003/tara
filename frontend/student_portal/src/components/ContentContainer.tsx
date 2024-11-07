import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedCompleteButton from "./AnimatedCompleteButton";
import AnimatedNextButton from "./AnimatedNextButton";
import { useNavigate, useParams } from "react-router-dom";
import { useClassroom } from "@/hooks/useClassroom";
import { useUser } from "@/hooks/useUser";
import { useUnits } from "@/hooks/useUnit";
import { Exercise, Lesson } from "@/types/dbTypes";
import LessonDisplay from "@/pages/contentViewers/lessonDisplay";
import { Info } from "lucide-react";
import MCQViewer from '@/pages/build/mcqViewer';
import TextWithInputViewer from '@/pages/build/twiViewer';
import TextWithQuestionsViewer from '@/pages/build/twqViewer';
import ImagesWithInputViewer from '@/pages/build/iwiViewer';
import FillInTheBlanksViewer from '@/pages/build/fibViewer';
import DragAndDropViewer from '@/pages/build/dndViewer';
import CrosswordPuzzleViewer from '@/pages/build/crosswordExerciseViewer';
import { useExerciseStore } from "@/store/exerciseStore";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "./ui/toaster";
import { useEffect } from 'react';

interface LessonContainerProps {
    className?: string;
    headerBgColor?: string;
    headerTextColor?: string;
    overrideClass?: string;
}

const ContentContainer: React.FC<LessonContainerProps> = ({
    className = "bg-gradient-to-r from-green-200 to-blue-200",
    headerBgColor = "bg-green-100",
    headerTextColor = "text-green-800",
    overrideClass = "",
}) => {
    const navigate = useNavigate();
    const { toast } = useToast()

    const { unitId, contentId, classroomId } = useParams();

    const { data: classroom } = useClassroom(classroomId);
    const { data: user } = useUser();
    const { data: units } = useUnits(classroomId);

    const unit = units?.find((unit) => unit._id === unitId);

    const lesson: Lesson = unit?.lessons.find((l) => {
        const lesson = l as unknown as Lesson;
        return lesson._id === contentId;
    }) as unknown as Lesson;

    const exercise: Exercise = unit?.exercises.find((e) => {
        const exercise = e as unknown as Exercise;
        return exercise._id === contentId;
    }) as unknown as Exercise;

    const isExercise = !!exercise;

    const isAlreadyComplete = user?.class_progress_info?.find((progress) => {
        if (isExercise) {
            return progress.exercises?.find((exercise) => exercise.exercise.toString() === contentId);
        } else {
            return progress.lessons_completed?.find((lesson) => lesson.toString() === contentId);
        }
    });

    const progress = user?.class_progress_info.find((progress) => {
        return progress.unit.toString() === unitId && progress.class.toString() === classroom?._id;
    });

    const feedback = isExercise ? progress?.exercises?.find((e) => e.exercise.toString() == exercise._id)?.feedback : undefined;

    let title;
    if (isExercise) {
        title = exercise.title;
    } else {
        title = lesson.title;
    }

    const {
        setExercise,
        handleComplete,
        setFirstSubmission,
        submitted,
        setClassId,
        setContentId,
        setUnitId,
        score,
        error,
        setLesson
    } = useExerciseStore()

    useEffect(() => {
        if (classroomId) setClassId(classroomId)
        if (contentId) setContentId(contentId)
        if (unitId) setUnitId(unitId)
    }, [classroomId, contentId, unitId, setClassId, setContentId, setUnitId]);
    
    useEffect(() => {
        if (isExercise) {
            setExercise(exercise)
            setFirstSubmission(!isAlreadyComplete)
        } else {
            setLesson(lesson)
        }
    }, [isExercise, exercise, isAlreadyComplete, setExercise, setFirstSubmission, setLesson, lesson]);

    const lessonData = isExercise ? exercise : lesson;

    const nextContentId = (unit?.lessons.find((l) => l.order === lessonData.order + 1) as unknown as Lesson | undefined)?._id || (unit?.exercises.find((e) => e.order === lessonData.order + 1) as unknown as Exercise | undefined)?._id;
    const isLastModule = !nextContentId;

    function handleCompleteFull(){
        if (!isAlreadyComplete){
            toast({
                title: "Points Earned!",
                description: `You've earned ${score} points!`,
                duration: 3000,
              })
        }
          handleComplete()
    }
    
    const renderExerciseContent = () => {
        if (!exercise) return null;
      
        switch (exercise.exercise_type) {
          case 'multiple_choice':
            return <MCQViewer />;
          case 'text_with_input':
            return <TextWithInputViewer />;
          case 'text_with_questions':
            return <TextWithQuestionsViewer />;
          case 'images_with_input':
            return <ImagesWithInputViewer />;
          case 'fill_in_the_blanks':
            return <FillInTheBlanksViewer />;
          case 'drag_and_drop':
            return <DragAndDropViewer />;
          case 'crossword_puzzle':
            return <CrosswordPuzzleViewer />;
          default:
            return <div>Unsupported exercise type</div>;
        }
      };

    return (
        <div className={cn(`flex min-h-[85vh] items-center justify-center p-4`, className)}>
            <Card className={cn("w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden", overrideClass)}>
                <CardHeader className={cn(headerBgColor)}>
                    <CardTitle className={cn("text-4xl font-bold text-center", headerTextColor)}>{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <AnimatePresence>
                        <div>
                            {lessonData.description && (
                                <div className="bg-[#FFF3E0] p-6 rounded-xl border-2 border-[#DEB887] flex items-start">
                                    <Info className="w-6 h-6 text-[#8B4513] mr-4 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-lg text-[#8B4513]">{lessonData.description}</p>
                                    </div>
                                </div>
                            )}
                            <Toaster />

                            {lessonData.instruction && (
                                <div className="bg-[#4169E1] pl-6 my-4 p-4 rounded-xl shadow-md">
                                    <h2 className="text-2xl font-bold text-white mb-2">Your Mission 🚀</h2>
                                    <p className="text-lg text-white">{lessonData.instruction}</p>
                                </div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {!isExercise ? <LessonDisplay /> : <>
                                <p>Your best score: {progress?.exercises?.find(
                                    (e) => e.exercise.toString() === exercise._id
                                )?.best_score || "N/A"}</p>
                                <p>
                                You have earned: {progress?.exercises?.find(
                                    (e) => e.exercise.toString() === exercise._id
                                )?.coins_earned + " Coins" || "N/A"}
                                </p>
                                <p>
                                You have attempted this exercise: {progress?.exercises?.find(
                                    (e) => e.exercise.toString() === exercise._id
                                )?.attempts.length || 0} times
                                </p>
                                {renderExerciseContent()}
                                </>}
                            </motion.div>
                            {feedback && (
                                <div className="my-4">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Teacher Feedback: </h2>
                                    <p className="text-sm text-gray-600">{feedback}</p>
                                </div>
                            )}
                            {error && (
                                <div className="my-4">
                                    <h2 className="text-lg font-semibold text-red-800 mb-4">Error: </h2>
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}
                            <div className="flex flex-row justify-between">
                                <AnimatedCompleteButton
                                    onClick={handleCompleteFull}
                                    isExercise={isExercise}
                                    isAlreadyComplete={!!isAlreadyComplete}
                                    className="mt-10"
                                    displayText={exercise ? (exercise.is_instant_scored ? "Earn Coins" : "Submit To Teacher") : "Complete"}
                                />
                                {isLastModule ? (
                                    <AnimatedNextButton
                                        onClick={() => {
                                            navigate("/dashboard");
                                        }}
                                        isAlreadyNext={false}
                                        className="mt-10"
                                        text="Dashboard"
                                    />
                                ) : (
                                    <AnimatedNextButton
                                        onClick={() => {
                                            navigate(`/learning/${unitId}/${nextContentId}/${classroomId}`);
                                        }}
                                        isAlreadyNext={false}
                                        className="mt-10"
                                        disabled={!submitted && !isAlreadyComplete}
                                    />
                                )}
                            </div>
                        </div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContentContainer;
