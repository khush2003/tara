import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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
    return (
        <div className={cn(`flex min-h-[90vh] items-center justify-center p-4`, className)}>
            <Card className={cn("w-full max-w-4xl bg-white rounded-3xl shadow-lg overflow-hidden", overrideClass)}>
                <CardHeader className={cn(headerBgColor)}>
                    <CardTitle className={cn("text-4xl font-bold text-center", headerTextColor)}>{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <AnimatePresence>
                        <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}>
                    {children}
                    </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
}
// Complete (Earn Points), Next, Excercise
export default LessonContainer