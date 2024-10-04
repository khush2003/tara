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
    Layers,
    Lock,
    Settings,
    Trophy,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import { useState, useCallback, useEffect } from "react";
import useLearningStore from "@/store/learningStore";
import { useClassroomStore } from "@/store/classroomStore";


export default function SpaceExplorerModule() {
    const [isGuest, setIsGuest] = useState<boolean>(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();
    const [ learningModule, fetchLearningModule, moduleLoading, moduleError] = useLearningStore((state) => [
        state.learningModule,
        state.fetchLearningModule,
        state.moduleLoading,
        state.moduleError,
    ]);
    const classroom = useClassroomStore((state) => state.classroom);
    const allLessonsCompleted = classroom?.progress.find(
        (progress) =>
            progress.completedLessons.length === learningModule?.lessons.length
    ) 

    const { id } = useParams();
    useEffect(() => {
        if (!isLoggedIn) {
            setIsGuest(true);
        }
        if (id){
            fetchLearningModule(id);
        } else {
            navigate("/notFound");
        }
    }, [fetchLearningModule, id, isLoggedIn, navigate]);

    if (moduleLoading) {
        if (!classroom){
            navigate("/dashboard");
        }
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-2xl font-bold text-gray-800">Loading...</p>
            </div>
        );
    }

    if (moduleError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-2xl font-bold text-red-800">{moduleError}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4 sm:p-6 lg:p-8">
            <header className="bg-white rounded-3xl shadow-lg p-6 mb-8 flex items-center justify-between">
                <div className="flex flex-row items-center">
                <div className="flex items-center space-x-4">
                <Link to="/dashboard"><ArrowLeft className="text-purple-800 hover:scale-125 transition-transform" /></Link>
            <h1 className="text-3xl font-bold text-purple-800">Tara's {learningModule?.name} Mission</h1>
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
                                value={classroom?.progress.find( 
                                    (progress) => progress.moduleCode === learningModule?.moduleCode)?.progressPercentage || 0
                                }
                                className="w-full h-6 bg-purple-100"
                            />
                  
          <p className="text-sm text-gray-600 mt-2">{isGuest ? "0%" : classroom?.progress.find(
                (progress) => progress.moduleCode === learningModule?.moduleCode)?.progressPercentage || 0 + "%"} of your journey completed</p>
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
                            {learningModule?.lessons.map((lesson) => (
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
                                            classroom?.progress.find(
                                                (progress) =>
                                                    progress.completedLessons.includes(
                                                        lesson.lessonCode? lesson.lessonCode : ""
                                                    )
                                            ) || isGuest
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
                                                        {classroom?.progress.find(
                                                            (progress) =>
                                                                progress.completedLessons.includes(
                                                                    lesson.lessonCode
                                                                )
                                                        ) || isGuest
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
                    {learningModule?.exercises.map((exercise) => (
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
                                    <p>Coins: {exercise.maxScore} 💎</p>
                                    {classroom?.progress.find(
                                        (progress) =>
                                            progress.completedExercises.includes(
                                                exercise.exerciseCode ? exercise.exerciseCode : ""
                                            )
                                    ) && (
                                        <p>Score: Not Implemented 💎</p>
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
                                                {classroom?.progress.find(
                                                    (progress) =>
                                                        progress.completedExercises.includes(
                                                            exercise.exerciseCode ? exercise.exerciseCode : ""
                                                    )) || isGuest
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
