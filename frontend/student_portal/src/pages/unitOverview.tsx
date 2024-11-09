import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Book, Layers, Lock, Settings, Trophy } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import { useState, useEffect } from "react";
import { useClassroom } from "@/hooks/useClassroom";
import { useUnits } from "@/hooks/useUnit";
import { useUser } from "@/hooks/useUser";
import { Exercise, Lesson } from "@/types/dbTypes";

export default function SpaceExplorerModule() {
    const [isGuest, setIsGuest] = useState<boolean>(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const navigate = useNavigate();
    const { id, classroomId } = useParams();

    const { data: classroom, isLoading: classroomLoading, error: classroomError } = useClassroom(classroomId);

    const { data: user, isLoading: userLoading, error: userError } = useUser();

    const { data: units, isLoading: unitsLoading, error: unitsError } = useUnits(classroomId);


    useEffect(() => {
        if (!isLoggedIn) {
            setIsGuest(true);
        }
    }, [isLoggedIn]);

    if (unitsLoading || classroomLoading || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-2xl font-bold text-gray-800">Loading...</p>
            </div>
        );
    }

    if (unitsError || classroomError || userError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-2xl font-bold text-red-800">{unitsError || classroomError || userError}</p>
            </div>
        );
    }

    const learningModule = units?.find((unit) => unit._id === id);

    const allLessonsCompleted =
    user?.class_progress_info.find((progress) => {
        return progress.unit.id.toString() === id && progress.class.toString() === classroomId;
    })?.lessons_completed?.length === learningModule?.lessons.length;

    const progress = user?.class_progress_info.find((progress) => {
        return progress.unit.id.toString() === id && progress.class.toString() === classroom?._id;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4 sm:p-6 lg:p-8">
            <header className="bg-white rounded-3xl shadow-lg p-6 mb-8 flex items-center justify-between">
                <div className="flex flex-row items-center">
                    <div className="flex items-center space-x-4">
                        <Link to="/dashboard">
                            <ArrowLeft className="text-purple-800 hover:scale-125 transition-transform" />
                        </Link>
                        <h1 className="text-3xl font-bold text-purple-800">Tara's {learningModule?.name} Mission</h1>
                    </div>
                </div>
                <Button variant="ghost" onClick={() => navigate("/settings")} className="text-purple-600">
                    <Settings className="h-5 w-5" />
                </Button>
            </header>

            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }} className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-black">Your Learning Journey for this Unit</h2>
                <Progress
                    value={user?.class_progress_info.find((p) => p.unit.id.toString() === learningModule?._id)?.progress_percent || 0}
                    className="w-full h-6 bg-purple-100"
                />

                <p className="text-sm text-gray-600 mt-2">
                    {isGuest
                        ? "0%"
                        : user?.class_progress_info.find((p) => p.unit.id.toString() === learningModule?._id)?.progress_percent.toFixed(0) ||
                          0 + "%"}{" "}
                    of your journey completed
                </p>
            </motion.div>
            <Card className="bg-white border-2 border-purple-200 mt-8">
                <CardHeader>
                    <CardTitle className="text-2xl text-gray-800 flex items-center">
                        <Layers className="mr-2 h-6 w-6 text-purple-600" />
                        Your Lessons
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {learningModule?.lessons.map((l) => {
                            const lesson = l as Lesson;
                            return (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                    key={lesson._id}
                                >
                                    <Card
                                        className={`${
                                            progress?.lessons_completed?.find((l) => l.toString() === lesson._id.toString()) || isGuest
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
                                            <Link to={`/learning/${learningModule._id}/${lesson._id}/${classroomId}`}>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                    }}
                                                >
                                                    <Button variant="secondary">
                                                        {progress?.lessons_completed?.find((l) => l.toString() === lesson._id.toString()) || isGuest
                                                            ? "Revisit Lesson"
                                                            : "Start Lesson"}
                                                    </Button>
                                                </motion.div>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white border-2  mt-8 border-purple-200">
                <CardHeader>
                    <CardTitle className="text-2xl text-gray-800 flex items-center">
                        <Layers className="mr-2 h-6 w-6 text-purple-600" />
                        Your Exercises
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {learningModule?.exercises.map((e) => {
                            const exercise = e as unknown as Exercise;
                            const exerciseProgress = progress?.exercises?.find((e) => e.exercise.toString() === exercise._id.toString());
                            return (
                                <motion.div
                                    whileHover={{ scale: !allLessonsCompleted ? 1 : 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    key={exercise._id}
                                >
                                    <Card className="bg-purple-200">
                                        <CardHeader>
                                            <CardTitle className="flex items-center">
                                                <Trophy className="mr-2" />
                                                {exercise.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Coins: {exercise.max_score} 💎</p>
                                            {exerciseProgress && (
                                                <><p>
                                                    Coins Earned:{" "}
                                                    {progress?.exercises
                                                        ?.find((e) => e.exercise.toString() === exercise._id.toString())
                                                        ?.coins_earned?.toFixed(0) || 0}{" "}
                                                    💎
                                                </p><p>
                                                        Feeback: {" "}
                                                        {exerciseProgress?.feedback || "No feedback yet"}
                                                    </p>
                                                    <p>
                                                        Best Score:{" "}
                                                        {progress?.exercises
                                                            ?.find((e) => e.exercise.toString() === exercise._id.toString())
                                                            ?.best_score?.toFixed(0) || 0}{" "}
                                                    </p>
                                                    
                                                    {exerciseProgress?.best_score && exerciseProgress?.coins_earned ? exerciseProgress.best_score < exerciseProgress.coins_earned ? 
                                                        <p className="text-sm text-orange-600">Tip: You can ask your teacher to award you extra points for your high score!</p> : "" : ""
                                                    }
                                                    </>
                                            )}
                                        </CardContent>
                                        <CardFooter>
                                            <Link to={allLessonsCompleted ? `/learning/${learningModule._id}/${exercise._id}/${classroomId}` : "#"}>
                                                <motion.div
                                                    whileHover={{
                                                        scale: !allLessonsCompleted ? 1 : 1.05,
                                                    }}
                                                    whileTap={{
                                                        scale: !allLessonsCompleted ? 1 : 0.9,
                                                    }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 300,
                                                    }}
                                                >
                                                    <Button variant="secondary" disabled={!allLessonsCompleted}>
                                                        {!allLessonsCompleted && <Lock className="mr-2" />}
                                                        {progress?.exercises?.find((e) => e.exercise.toString() === exercise._id.toString()) ||
                                                        isGuest
                                                            ? "Reattempt Mission"
                                                            : "Start Mission"}
                                                    </Button>
                                                </motion.div>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
