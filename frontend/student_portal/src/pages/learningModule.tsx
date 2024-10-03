import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowLeft,
    Book,
    BookOpen,
    Layers,
    Lock,
    LogIn,
    LogOut,
    Settings,
    Trophy,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Rocket, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { userInfo } from "os";
import useAuthStore from "@/store/authStore";
import { useState, useCallback, useEffect } from "react";

interface Lesson {
    lessonCode: string;
    title: string;
    completed: boolean;
}

interface Exercise {
    exerciseCode: string;
    title: string;
    completed: boolean;
    score: number;
    points: number;
}

interface ModuleData {
    moduleCode: number;
    title: string;
    description: string;
    isPremium: boolean;
    lessons: Lesson[];
    exercises: Exercise[];
}

const moduleData: ModuleData = {
    moduleCode: 1,
    title: "Animals",
    description:
        "Learn about animals and their characteristics. This module covers vocabulary and grammar.",
    isPremium: false,
    lessons: [
        { lessonCode: "0001L0001", title: "Bears", completed: true },
        {
            lessonCode: "0001L0002",
            title: "Wild Animals Vocabulary",
            completed: false,
        },
    ],
    exercises: [
        {
            exerciseCode: "0001E0001",
            title: "Match the Animal Sounds",
            completed: false,
            score: 5,
            points: 40,
        },
        {
            exerciseCode: "0001E0002",
            title: "Complete the Animal Poem",
            completed: false,
            score: 0,
            points: 30,
        },
        {
            exerciseCode: "0001E0003",
            title: "Describe Your Favorite Animal",
            completed: false,
            score: 0,
            points: 20,
        },
    ],
};

interface User {
    name: string;
    email: string;
    profilePicture: string;
    student_details: {
        game_points: number;
        classroom_code: string;
        game_hours_left: number;
    };
    role: string;
}

export default function SpaceExplorerModule() {
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [isGuest, setIsGuest] = useState<boolean>(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const accessToken = useAuthStore((state) => state.accessToken);
    const navigate = useNavigate();
    const progress =
        ((moduleData.lessons.filter((lesson) => lesson.completed).length +
            moduleData.exercises.filter((exercise) => exercise.completed)
                .length) /
            (moduleData.lessons.length + moduleData.exercises.length)) *
        100;
    const allLessonsCompleted = moduleData.lessons.every(
        (lesson) => lesson.completed
    );

    const fetchUserDetails = useCallback(async () => {
        // Fetch user details from the backend
        const response = await fetch("http://localhost:8080/auth/profile", {
            headers: {
                "auth-token": `${accessToken}`,
            },
        });
        if (!response.ok) {
            alert("Failed to fetch user details");
            return;
        }
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            setUserInfo(data);
        }
    }, [accessToken]);

    useEffect(() => {
        const fetchData = async () => {
            setIsGuest(false);
            await fetchUserDetails();
        };
        if (isLoggedIn) {
            fetchData();
        } else {
            setIsGuest(true);
        }

        fetchData();
    }, [fetchUserDetails, isLoggedIn]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4 sm:p-6 lg:p-8">
            <header className="bg-white rounded-3xl shadow-lg p-6 mb-8 flex items-center justify-between">
                <div className="flex flex-row items-center">
                <div className="flex items-center space-x-4">
                <Link to="/dashboard"><ArrowLeft className="text-purple-800 hover:scale-125 transition-transform" /></Link>
            <h1 className="text-3xl font-bold text-purple-800">Tara's Animals Mission</h1>
          </div>
                </div>
                <Button variant="ghost" onClick={() => navigate("/settings")} className="text-purple-600">
                    <Settings className="h-5 w-5" />
                </Button>
            </header>
            
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                >
        
          <h2 className="text-2xl font-bold mb-4 text-black">Your Learning Journey for this Unit</h2>
          <Progress
                                value={progress}
                                className="w-full h-6 bg-purple-100"
                            />
                  
          <p className="text-sm text-gray-600 mt-2">{isGuest ? "0%" : progress + "%"} of your
          journey completed</p>
        
                </motion.div>
                <motion.div
                    className="col-span-full lg:col-span-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                <Card className="bg-white border-2 border-purple-200 mt-8">
                    <CardHeader>
                        <CardTitle className="text-2xl text-gray-800 flex items-center">
                            <Layers className="mr-2 h-6 w-6 text-purple-600" />
                            Your Lessons
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {moduleData.lessons.map((lesson) => (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                    key={lesson.lessonCode}
                                >
                                    <Card
                                        className={`${
                                            lesson.completed
                                                ? "bg-purple-300"
                                                : "bg-purple-200"
                                        }`}
                                    >
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <Book className="mr-2" />
                                                {lesson.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardFooter>
                                            <Link
                                                to={`/learning/${lesson.lessonCode}`}
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                    }}
                                                >
                                                    <Button variant="secondary">
                                                        {lesson.completed
                                                            ? "Revisit Lesson"
                                                            : "Start Lesson"}
                                                    </Button>
                                                </motion.div>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                </motion.div>

                <motion.div
                    className="col-span-full lg:col-span-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Card className="bg-white border-2  mt-8 border-purple-200">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-800 flex items-center">
                                <Layers className="mr-2 h-6 w-6 text-purple-600" />
                                Your Exercises
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {moduleData.exercises.map((exercise) => (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            key={exercise.exerciseCode}
                        >
                            <Card className="bg-purple-200">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Trophy className="mr-2" />
                                        {exercise.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Coins: {exercise.points} 💎</p>
                                    {exercise.completed && (
                                        <p>Score: {exercise.score}</p>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Link
                                        to={
                                            allLessonsCompleted
                                                ? `/learning/${exercise.exerciseCode}`
                                                : "#"
                                        }
                                    >
                                        <motion.div
                                            whileHover={{
                                                scale: !allLessonsCompleted
                                                    ? 1
                                                    : 1.05,
                                            }}
                                            whileTap={{
                                                scale: !allLessonsCompleted
                                                    ? 1
                                                    : 0.9,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                            }}
                                        >
                                            <Button
                                                variant="secondary"
                                                disabled={!allLessonsCompleted}
                                            >
                                                {!allLessonsCompleted && (
                                                    <Lock className="mr-2" />
                                                )}
                                                {exercise.completed
                                                    ? "Reattempt Mission"
                                                    : "Start Mission"}
                                            </Button>
                                        </motion.div>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </motion.div>

            
        </div>
    );
}
