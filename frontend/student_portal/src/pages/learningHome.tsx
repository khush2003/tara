import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    BookOpen,
    Settings,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    X,
    Sun,
    Cloud,
    Umbrella,
    Wind,
    PuzzleIcon,
    Trophy,
    GamepadIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import PageContent from "@/components/PageContent";
import ChatModule from "@/components/ChatModule";

const lessons = ["Colors", "Numbers", "Shapes", "Animals"];
const exercises = [
    { title: "Quiz 1", code: "0001E0001" },
    { title: "Quiz 2", code: "0001E0002" },
    { title: "Quiz 3", code: "0001E0003" },
    { title: "Quiz 4", code: "0002E0001" },
    { title: "Quiz 5", code: "0002E0002" },
    { title: "New Quiz", code: "0002E0003" },
    { title: "New Quiz 2", code: "0002E0004" },
    { title: "Quiz 6", code: "0003E0001" },
    { title: "Quiz 7", code: "0003E0002" },
    { title: "Quiz 8", code: "0003E0003" },
    { title: "Quiz 9", code: "0003E0004" },
];

const weatherIcons = [
    { icon: Sun, color: "text-yellow-500" },
    { icon: Cloud, color: "text-gray-400" },
    { icon: Umbrella, color: "text-blue-500" },
    { icon: Wind, color: "text-teal-500" },
];

export default function EnhancedLearningHomePage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const { id } = useParams();

    const MotionButton = motion.create(Button);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
            <AnimatePresence>
                <MotionButton
                    key={sidebarOpen ? "close" : "open"}
                    variant="outline"
                    size="icon"
                    className={`fixed top-4 ${
                        sidebarOpen ? "left-72" : "left-4"
                    } bg-white`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleSidebar}
                >
                    {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
                </MotionButton>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed top-0 left-0 h-full w-64 bg-white p-6 shadow-lg rounded-r-3xl"
                    >
                        <motion.div
                            className="flex flex-col items-center mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex h-screen w-64 flex-col">
                                <div className="flex items-center justify-between border-b p-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h2 className="font-semibold">
                                                Little Explorer
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                Level 5
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <Settings className="h-5 w-5" />
                                    </Button>
                                </div>
                                <ScrollArea className="flex-1">
                                    <div className="p-4">
                                        <Card className="mb-4 bg-gradient-to-br from-purple-100 to-purple-300 p-4">
                                            <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                                <GamepadIcon className="h-5 w-5" />
                                                Game Zone
                                            </h3>
                                            <p className="mb-2 text-sm">
                                                Your Coins: 30 💎
                                            </p>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                            >
                                                Play Now!
                                            </Button>
                                        </Card>
                                        <div className="mb-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <h3 className="font-semibold">
                                                    Lessons
                                                </h3>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="h-auto p-0"
                                                    onClick={() =>
                                                        navigate(
                                                            "/learningModule/" +
                                                                (id?.includes(
                                                                    "L"
                                                                )
                                                                    ? id.split(
                                                                          "L"
                                                                      )[0]
                                                                    : id?.split(
                                                                          "E"
                                                                      )[0])
                                                        )
                                                    }
                                                >
                                                    See All{" "}
                                                    <ChevronRight className="ml-1 h-3 w-3" />
                                                </Button>
                                            </div>
                                            <ul className="space-y-1">
                                                {lessons.map(
                                                    (lesson, index) => (
                                                        <li key={index}>
                                                            <Button
                                                                variant="ghost"
                                                                className="w-full justify-start"
                                                                size="sm"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/learning/000${
                                                                            index +
                                                                            1
                                                                        }L0001`
                                                                    )
                                                                }
                                                            >
                                                                <BookOpen className="mr-2 h-4 w-4" />
                                                                {lesson}
                                                            </Button>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="mb-2 font-semibold">
                                                Exercises
                                            </h3>
                                            <ul className="space-y-1">
                                                {exercises.map(
                                                    (exercise, key) => (
                                                        <li key={key}>
                                                            <Button
                                                                variant="ghost"
                                                                className="w-full justify-between"
                                                                size="sm"
                                                                onClick={() =>
                                                                    navigate(
                                                                        "/learning/" +
                                                                            exercise.code
                                                                    )
                                                                }
                                                            >
                                                                <span className="flex items-center">
                                                                    {exercise.title.startsWith(
                                                                        "Quiz"
                                                                    ) ? (
                                                                        <Trophy className="mr-2 h-4 w-4" />
                                                                    ) : (
                                                                        <PuzzleIcon className="mr-2 h-4 w-4" />
                                                                    )}
                                                                    {
                                                                        exercise.title
                                                                    }
                                                                </span>
                                                                <span className="text-xs font-normal text-gray-500">
                                                                    {40} 💎
                                                                </span>
                                                            </Button>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </div>
                        </motion.div>
                    </motion.aside>
                )}
            </AnimatePresence>

            <main
                className={`flex-1 p-6  transition-all duration-300 ${
                    sidebarOpen ? "ml-64" : "ml-0"
                } `}
            >
                <motion.div
                    className="bg-white rounded-3xl shadow-lg p-0 overflow-hidden mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="">
                        <PageContent id={id} />
                    </div>
                </motion.div>

                <ChatModule />
            </main>
        </div>
    );
}
