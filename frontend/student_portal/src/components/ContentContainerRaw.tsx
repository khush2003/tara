import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedCompleteButton from "./AnimatedCompleteButton";
import AnimatedNextButton from "./AnimatedNextButton";
import { Info } from "lucide-react";

interface LessonContainerProps {
    children: React.ReactNode;
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
    children
}) => {

    return (
        <div className={cn(`flex min-h-[85vh] items-center justify-center p-4`, className)}>
            <Card className={cn("w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden", overrideClass)}>
                <CardHeader className={cn(headerBgColor)}>
                    <CardTitle className={cn("text-4xl font-bold text-center", headerTextColor)}>{"Example Title"}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <AnimatePresence>
                        <div>
                            {(
                                <div className="bg-[#FFF3E0] p-6 rounded-xl border-2 border-[#DEB887] flex items-start">
                                    <Info className="w-6 h-6 text-[#8B4513] mr-4 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="text-lg text-[#8B4513]">{"Just for view description, do not worry, your title, description and instruction will appear in the final view"}</p>
                                    </div>
                                </div>
                            )}

                            {(
                                <div className="bg-[#4169E1] pl-6 my-4 p-4 rounded-xl shadow-md">
                                    <h2 className="text-2xl font-bold text-white mb-2">Your Mission 🚀</h2>
                                    <p className="text-lg text-white">{"Do multiple choice questions"}</p>
                                </div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {children}
                            </motion.div>
                            <div className="flex flex-row justify-between">
                                <AnimatedCompleteButton
                                    onClick={() => {}}
                                    isExercise={true}
                                    isAlreadyComplete={!!false}
                                    className="mt-10"
                                    displayText={"Complete"}
                                />
                                {(
                                    <AnimatedNextButton
                                        onClick={() => {}}
                                        isAlreadyNext={false}
                                        className="mt-10"
                                        text="Dashboard"
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
