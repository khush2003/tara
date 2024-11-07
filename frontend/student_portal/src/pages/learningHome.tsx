import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Settings, ChevronLeft, ChevronRight, Trophy, GamepadIcon, Book, Dumbbell, Lock, Layout, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ChatModule from "@/components/ChatModule";
import useAuthStore from "@/store/authStore";
import { useClassroom } from "@/hooks/useClassroom";
import { useUser } from "@/hooks/useUser";
import { useUnits } from "@/hooks/useUnit";
import { Exercise, Lesson } from "@/types/dbTypes";
import ContentContainer from "@/components/ContentContainer";

export default function EnhancedLearningHomePage() {
    const [isGuest, setIsGuest] = useState(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    const [hoverTimer, setHoverTimer] = useState<number | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const { unitId, classroomId } = useParams();
    const navigate = useNavigate();

    const { data: classroom, isLoading: classroomLoading, error: classroomError } = useClassroom(classroomId);

    const { data: user, isLoading: userLoading, error: userError } = useUser();

    const { data: units, isLoading: unitsLoading, error: unitsError } = useUnits(classroomId);

    useEffect(() => {
        if (!isLoggedIn) {
            setIsGuest(true);
        }
    }, [isLoggedIn]);

    if (unitsError || userError || classroomError) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-2xl text-red-500">Error fetching module</div>
                    <Button variant="default" onClick={() => navigate("/dashboard")}>
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    if (unitsLoading || userLoading || classroomLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-2xl">Loading...</div>
                </div>
            </div>
        );
    }

    const unit = units?.find((unit) => unit._id === unitId);

    const allLessonsCompleted =
        user?.class_progress_info.find((progress) => {
            return progress.unit.toString() === unitId && progress.class.toString() === classroomId;
        })?.lessons_completed?.length === unit?.lessons.length;


    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const MotionButton = motion.create(Button);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
            <AnimatePresence>
                <MotionButton
                    key={sidebarOpen ? "close" : "open"}
                    variant="outline"
                    size="icon"
                    className={`fixed top-4 ${sidebarOpen ? "left-[21rem]" : "left-4"} bg-white`}
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
                        className="fixed top-0 left-0 h-scree p-4 shadow-lg rounded-r-3xl w-[20rem] bg-gradient-to-r from-fuchsia-400 to-purple-400"
                    >
                        <motion.div
                            className="flex flex-col mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex h-screen flex-col">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex items-center justify-between mb-4 bg-white text-violet-600 rounded-2xl p-4 shadow-md"
                                >
                                    <div className="flex items-center space-x-4">
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                            className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-2xl shadow-md overflow-hidden"
                                        >
                                            {user?.profile_picture ? (
                                                <img 
                                                    src={user.profile_picture} 
                                                    alt="Profile" 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                "ME"
                                            )}
                                        </motion.div>
                                        <div>
                                            <h2 className="font-bold text-indigo-800 text-xl">{user?.name || "Guest"}</h2>
                                            <p className="text-sm text-indigo-600">Unit {unit?.name}</p>
                                        </div>
                                    </div>
                                    <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }} onClick={() => navigate("/settings")}>
                                        <Settings className="text-indigo-500 cursor-pointer w-8 h-8" />
                                    </motion.div>
                                </motion.div>
                                <ScrollArea className="flex-1">
                                    <div>
                                        <motion.div
                                            className="bg-gradient-to-br from-fuchsia-200 to-fuchsia-300 text-fuchsia-700 p-5 rounded-2xl shadow-md"
                                            whileHover={{
                                                scale:
                                                    isGuest || user?.game_profile.game_minutes_left === 0 || classroom?.is_game_blocked === true
                                                        ? 1
                                                        : 1.02,
                                            }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <GamepadIcon className=" w-6 h-6" />
                                                <h3 className="font-bold text-xl">Game Zone</h3>
                                            </div>
                                            <p className=" mb-2 text-md">Your Coins: {user?.game_profile.game_points.toFixed(0) || 0} 💎</p>
                                            <motion.button
                                                className="w-full bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-700 text-white py-2 rounded-xl font-bold text-md shadow-sm"
                                                whileHover={{
                                                    scale:
                                                        isGuest || user?.game_profile.game_minutes_left === 0 || classroom?.is_game_blocked === true
                                                            ? 1
                                                            : 1.05,
                                                }}
                                                whileTap={{
                                                    scale:
                                                        isGuest || user?.game_profile.game_minutes_left === 0 || classroom?.is_game_blocked === true
                                                            ? 1
                                                            : 0.95,
                                                }}
                                                onClick={() => {
                                                    if (
                                                        isGuest ||
                                                        user?.game_profile.game_minutes_left === 0 ||
                                                        classroom?.is_game_blocked === true
                                                    ) {
                                                        alert("Game is not active");
                                                    } else {
                                                        navigate("/gameintro");
                                                    }
                                                }}
                                            >
                                                Play Now!
                                            </motion.button>
                                        </motion.div>
                                        <motion.div
                                            className="bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-700 mt-4 p-6 rounded-2xl shadow-md"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="flex items-center space-x-3 mb-4">
                                                <Book className=" w-6 h-6" />
                                                <h3 className="font-bold  text-xl">Lessons</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {unit?.lessons.map((l, index) => {
                                                    const lesson = l as Lesson;
                                                    return (
                                                        <motion.button
                                                            key={index}
                                                            className="w-full bg-white bg-opacity-95 text-sm py-3 px-4 rounded-xl font-semibold text-left flex items-center space-x-3 shadow-sm"
                                                            whileHover={{
                                                                scale: 1.03,
                                                                backgroundColor: "#f0fdfa",
                                                            }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => navigate(`/learning/${unit._id}/${lesson._id}/${classroomId}`)}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            <BookOpen className="w-4 h-4 text-yellow-500" />
                                                            <span>{lesson.title}</span>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 mt-4 p-4 rounded-2xl shadow-md"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="flex items-center space-x-3 mb-4">
                                                <Dumbbell className=" w-6 h-6" />
                                                <h3 className="font-bold  text-xl">Exercises</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {unit?.exercises.map((ex, index) => {
                                                    const exercise = ex as unknown as Exercise;
                                                    return (
                                                        <motion.button
                                                            key={index}
                                                            className="w-full bg-white bg-opacity-95 text-sm font-medium text-amber-700 p-3 rounded-xl  text-left flex flex-col items-left justify-between shadow-sm"
                                                            whileHover={{
                                                                scale: !allLessonsCompleted ? 1 : 1.03,
                                                                backgroundColor: !allLessonsCompleted ? "text-amber-700" : "#fff7ed",
                                                            }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                            disabled={!allLessonsCompleted}
                                                            whileTap={{ scale: !allLessonsCompleted ? 1 : 0.98 }}
                                                            onHoverStart={() => {
                                                                if (!allLessonsCompleted) {
                                                                    const timer = setTimeout(() => {
                                                                        alert("To start an exercise, please complete all lessons first");
                                                                    }, 2000);
                                                                    setHoverTimer(timer as unknown as number);
                                                                }
                                                            }}
                                                            onHoverEnd={() => {
                                                                clearTimeout(hoverTimer as unknown as number);
                                                            }}
                                                            onClick={() => {
                                                                if (allLessonsCompleted) navigate("/learning/" + unit._id + "/" + exercise._id + "/" + classroomId);
                                                                else {
                                                                    alert("Please complete all lessons first");
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex w-full flex-row items-center justify-between">
                                                                <span className="flex items-center space-x-3">
                                                                    {!allLessonsCompleted ? (
                                                                        <Lock className="w-4 h-4 text-yellow-500" />
                                                                    ) : (
                                                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                                                    )}
                                                                    <span>{exercise.title}</span>
                                                                </span>
                                                                <span className="bg-orange-200 text-orange-700 px-2 py-1 text-center rounded-2xl text-sm font-medium whitespace-nowrap">
                                                                    {exercise.max_score} 💎
                                                                </span>
                                                            </div>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                        <div className="flex flex-1 items-center space-x-3 mt-4" />
                                        <motion.div
                                            className="bg-white text-violet-600  p-4 rounded-2xl shadow-md"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="space-y-3">
                                                <motion.button
                                                    className="w-full bg-gray-100 bg-opacity-50 text-sm font-medium p-3 rounded-xl  text-left flex flex-row items-center px-4 shadow-sm"
                                                    whileHover={{
                                                        scale: 1.03,
                                                        backgroundColor: "#fff7ed",
                                                    }}
                                                    whileTap={{ scale: 0.98 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                    onClick={() => navigate("/dashboard")}
                                                >
                                                    <Layout className="mr-2" size={18} />
                                                    Dashboard
                                                </motion.button>
                                                <motion.button
                                                    className="w-full bg-gray-100 bg-opacity-50 text-sm font-medium  p-3 rounded-xl  text-left flex flex-row items-center px-4 shadow-sm"
                                                    whileHover={{
                                                        scale: 1.03,
                                                        backgroundColor: "#fff7ed",
                                                    }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => navigate("/learningModule/" + unit?._id + "/" + classroomId)}
                                                >
                                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                                    Back to Lesson
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </ScrollArea>
                            </div>
                        </motion.div>
                    </motion.aside>
                )}
            </AnimatePresence>

            <main className={`flex-1 p-6  transition-all duration-300 ${sidebarOpen ? "ml-[20rem]" : "ml-0"} `}>
                <motion.div
                    className="bg-white rounded-3xl shadow-lg p-0 overflow-hidden mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                <ContentContainer />
                </motion.div>

                <ChatModule />
            </main>
        </div>
    );
}
