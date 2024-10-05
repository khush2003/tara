import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedCompleteButton from "./AnimatedCompleteButton";
import AnimatedNextButton from "./AnimatedNextButton";
import useLearningStore from "@/store/learningStore";
import { useNavigate, useParams } from "react-router-dom";
import { useClassroomStore } from "@/store/classroomStore";

interface LessonContainerProps {
    title: string;
    className?: string;
    headerBgColor?: string;
    headerTextColor?: string;
    children?: React.ReactNode;
    overrideClass?: string;
}

const LessonContainer: React.FC<LessonContainerProps> = ({
    title = "Default Title",
    className = "bg-gradient-to-r from-green-200 to-blue-200",
    headerBgColor = "bg-green-100",
    headerTextColor = "text-green-800",
    overrideClass = "",
    children
}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isComplete, setIsComplete] = useState(false);
    const learningModule = useLearningStore(state => state.learningModule);
    const classroom = useClassroomStore(state => state.classroom);

    const sortedLessons = learningModule?.lessons.sort((a, b) => {
        const aCode = a.lessonCode?.split(/L|E/)[1] || "0";
        const bCode = b.lessonCode?.split(/L|E/)[1] || "0";
        return parseInt(aCode) - parseInt(bCode);
    });
    const sortedExercises = learningModule?.exercises.sort((a, b) => {
        const aCode = a.exerciseCode?.split(/L|E/)[1] || "0";
        const bCode = b.exerciseCode?.split(/L|E/)[1] || "0";
        return parseInt(aCode) - parseInt(bCode);
    });
    const moduleOrder = [...(sortedLessons || []), ...(sortedExercises || [])];
    const currentModuleIndex = moduleOrder.findIndex((module) => {
        if ('lessonCode' in module) {
            return module.lessonCode === id;
        }
        if ('exerciseCode' in module) {
            return module.exerciseCode === id;
        }
        return false;
    });
    const nextModule = moduleOrder[currentModuleIndex + 1];
    const nextModuleId = (nextModule && 'lessonCode' in nextModule) ? nextModule.lessonCode : (nextModule && 'exerciseCode' in nextModule) ? nextModule.exerciseCode : undefined;
    const isLastModule = currentModuleIndex === moduleOrder.length - 1;
    
    const isAlreadyComplete = classroom?.progress.some(progress => 
        id ? (progress.completedLessons.includes(id) || progress.completedExercises.includes(id)) : false
    );

    const handleComplete = () => {
        setIsComplete(true);
        console.log("Module marked as complete");
    };

    return (
        <div className={cn(`flex min-h-[85vh] items-center justify-center p-4`, className)}>
            <Card className={cn("w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden", overrideClass)}>
                <CardHeader className={cn(headerBgColor)}>
                    <CardTitle className={cn("text-4xl font-bold text-center", headerTextColor)}>{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <AnimatePresence>
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}>
                                {children}
                            </motion.div>
                            <div className="flex flex-row justify-between">
                                <AnimatedCompleteButton onClick={handleComplete} isAlreadyComplete={isAlreadyComplete ? isAlreadyComplete : false} className="mt-10" />
                                {isLastModule ? (
                                    <AnimatedNextButton onClick={() => { navigate('/dashboard') }} isAlreadyNext={false} className="mt-10" text="Dashboard" />
                                ) : (
                                    <AnimatedNextButton onClick={() => { navigate(`/learning/${nextModuleId}`) }} isAlreadyNext={false} className="mt-10" disabled={!(isComplete || isAlreadyComplete)} />
                                )}
                            </div>
                        </div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
}

export default LessonContainer;