import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, BookOpen, Gamepad, Info, Layers, LogIn, LogOut, Rocket, Settings, Sparkles, Star } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../components/logoutmodal";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { useClassroom } from "@/hooks/useClassroom";
import { useUser } from "@/hooks/useUser";
import { useUnits } from "@/hooks/useUnit";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const LEARNING_MODULES = [
    { _id: "60f3b1b3b3b3b3b3b3b3b3b3", name: "Foods", moduleCode: "0001" },
    { _id: "60f3b1b3b3b3b3b3b3b3b3b2", name: "Places", moduleCode: "0002" },
    { _id: "60f3b1b3b3b3b3b3b3b3b313", name: "Animals", moduleCode: "0003" },
];

export default function DashboardPage() {
    const navigate = useNavigate();
    const [isLogoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [isGuest, setIsGuest] = useState(false);
    const { data: user, error: userError, isLoading: userLoading } = useUser();

    const classroomId = user?.classroom[0]?.toString();

    const { data: classroom, error: classroomError, isLoading: classroomLoading } = useClassroom(classroomId);

    const {
        data: units,
        error: unitsError,
        isLoading: unitsLoading
    } = useUnits(classroomId);



    useEffect(() => {
        console.log("classroom", classroomId);
        if (!isLoggedIn) {
            setIsGuest(true);
        }
    }, [classroomId, isLoggedIn]);

    const handleLogoutCancel = () => {
        setLogoutModalVisible(false); // Hide the modal without logging out
    };

    if (userError || classroomError || unitsError) {
        return (
            <div>
                Error: There was some unexpected error! {userError} || {classroomError} || {unitsError}
            </div>
        );
    }

    if (userLoading || classroomLoading || unitsLoading) {
        return (
            <div className="min-h-screen flex flex-col gap-8 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4 sm:p-6 lg:p-8">
                {["1", "2", "3", "4"].map((item) => (
                    <div key={item} className="col-span-full lg:col-span-2 gap-8">
                        <Skeleton className="flex h-[100px] w-full flex-col gap-4" />
                    </div>
                ))}
            </div>
        );
    }

    if (!classroomId){
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Button 
                    onClick={() => navigate("/learningCode")}
                    variant="secondary" 
                    className="bg-purple-600 text-white hover:bg-purple-700 text-lg px-6 py-4 rounded-full"
                >
                    Join a classroom
                </Button>
            </div>
        );
    }
    const todayunitProgress = user?.class_progress_info.find((p) => p.unit.id.toString() === classroom?.today_unit?.unit)?.progress_percent || 0;
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4 sm:p-6 lg:p-8">
            <DashboardHeader user={user || {}} isGuest={isGuest} navigate={navigate} setLogoutModalVisible={setLogoutModalVisible} />

            <LogoutModal isVisible={isLogoutModalVisible} onClose={handleLogoutCancel} />

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <motion.div
                    className="col-span-full lg:col-span-2"
                    whileHover={{ scale: isGuest ? 1 : 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Card
                        className={`bg-gradient-to-br from-purple-500 to-indigo-600 text-white overflow-hidden ${
                            isGuest ? "text-gray-200" : "text-white"
                        }`}
                    >
                        <CardHeader>
                            <CardTitle className="text-2xl sm:text-3xl flex items-center justify-between">
                                <span className="flex items-center">
                                    <Gamepad className="mr-3 h-8 w-8" />
                                    Game Zone
                                </span>
                                <Button
                                    disabled={
                                        isGuest ||
                                        user?.game_profile?.game_minutes_left === 0 ||
                                        classroom?.is_game_blocked === true ||
                                        (classroom?.game_restriction_period &&
                                            new Date().setHours(
                                                new Date(classroom.game_restriction_period.start).getHours(),
                                                new Date(classroom.game_restriction_period.start).getMinutes()
                                            ) < new Date().getTime() &&
                                            new Date().setHours(
                                                new Date(classroom.game_restriction_period.end).getHours(),
                                                new Date(classroom.game_restriction_period.end).getMinutes()
                                            ) > new Date().getTime())
                                    }
                                    onClick={() => navigate("/leaderboard")}
                                    variant="secondary"
                                    className="bg-white text-purple-600 hover:bg-purple-100 text-lg px-6 py-2 rounded-full"
                                >
                                    Play Now!
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row justify-between items-center">
                            <div>
                                <p className="text-2xl font-bold mb-2">Your Coins: {user?.game_profile?.game_points.toFixed(0) || 0} 💎</p>
                                <p className="text-lg">Playtime Left: {user?.game_profile?.game_minutes_left} space minutes</p>
                                <div className="w-full py-1 flex justify-between">
                                    <Progress
                                        value={user ? (user.game_profile?.game_minutes_left / 60) * 100 : (60 / 60) * 100}
                                        className="w-[100%] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 "
                                    />
                                </div>
                            </div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 30,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            >
                                <Rocket className="h-24 w-24 text-white mt-4 sm:mt-0" />
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    className="col-span-full md:col-span-1"
                    whileHover={{ scale: isGuest ? 1 : 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Card className={`bg-gradient-to-br from-green-400 to-blue-500 text-white h-full ${isGuest ? "text-gray-200" : "text-white"}`}>
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center">
                                <Bell className="mr-2 h-6 w-6" />
                                Tara News
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-lg">
                            {classroom?.announcement ? (
                                <ReactMarkdown>{classroom.announcement}</ReactMarkdown>
                            ) : (
                                <ReactMarkdown>{`🍰 **Yay!** No more announcements for today.\n\nSee you tomorrow!`}</ReactMarkdown>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div className="col-span-full" whileHover={{ scale: isGuest ? 1 : 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className={`bg-white border-2 border-purple-200 ${isGuest ? "text-gray-200" : "text-white"}`}>
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-800 flex items-center justify-between ">
                                <span className="flex items-center">
                                    <BookOpen className="mr-2 h-6 w-6 text-purple-600" />
                                    Today's Tara Unit: {classroom?.today_unit?.title || "No lesson today"}
                                </span>
                                <Button
                                    disabled={!classroom?.today_unit || isGuest}
                                    onClick={() => navigate("/learningModule/" + classroom?.today_unit?.unit + "/" + classroomId)}

                                    variant="outline"
                                    className="text-purple-600 border-purple-300 hover:bg-purple-50 rounded-full"
                                >
                                    {todayunitProgress ===
                                    100
                                        ? "Review"
                                        : "Let's Learn!"}
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress
                                value={
                                    todayunitProgress
                                }
                                className="h-4 bg-purple-100"
                            />
                            <p className="text-lg text-gray-600 mt-2">
                                {" "}
                                {classroom?.today_unit ? isGuest
                                    ? "0"
                                    : todayunitProgress.toFixed(0)
                                 + "% of your journey completed" : "No Unit Set for Today"}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div className="col-span-full lg:col-span-2" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="bg-white border-2 border-purple-200">
                        <CardHeader>
                            <CardTitle className="text-2xl text-gray-800 flex items-center">
                                <Layers className="mr-2 h-6 w-6 text-purple-600" />
                                Your Learning Units
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {classroom
                                    ? classroom.chosen_units.map((unit, index) => (
                                          <motion.li
                                              key={unit.unit}
                                              onClick={() => navigate("/learningModule/" + unit.unit + "/" + classroomId)}
                                              className={`p-4 rounded-xl flex items-center justify-between ${
                                                  index === 0 ? "bg-purple-100" : "bg-gray-100"
                                              }`}
                                              whileHover={{
                                                  scale: 1.03,
                                                  backgroundColor: "#e0e7ff",
                                              }}
                                          >
                                              <span className="text-lg font-medium flex items-center text-gray-800">
                                                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                                                  {unit.name}
                                              </span>
                                              <Progress
                                                  value={
                                                      user?.class_progress_info.find((p) => p.unit.id.toString() === unit.unit)?.progress_percent || 0
                                                  }
                                                  className="w-1/3 h-3 bg-gray-300"
                                              />
                                          </motion.li>
                                      ))
                                    : LEARNING_MODULES.map((unit, index) => (
                                          <motion.li //TODO: Update
                                              key={unit._id}
                                              onClick={() => navigate("/learning/" + unit.moduleCode + "L0001")}
                                              className={`p-4 rounded-xl flex items-center justify-between ${
                                                  index === 0 ? "bg-purple-100" : "bg-gray-100"
                                              }`}
                                              whileHover={{
                                                  scale: 1.03,
                                                  backgroundColor: "#e0e7ff",
                                              }}
                                          >
                                              <span className="text-lg font-medium flex items-center text-gray-800">
                                                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                                                  {unit.name}
                                              </span>
                                              <Progress value={[0, 0, 0, 0][index]} className="w-1/3 h-3" />
                                          </motion.li>
                                      ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div className="col-span-full md:col-span-1" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="bg-gradient-to-br from-purple-400 to-pink-500 text-white h-full">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center">
                                <Sparkles className="mr-2 h-6 w-6" />
                                Recommendations
                                <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="ml-2 h-5 w-5 text-white" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            You can redo the exercises and lessons in recommendations to earn extra points.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {user?.recommended?.lessons.map(
                                    //TODO: Recommendations
                                    (course) => (
                                        <motion.li
                                            key={course.id}
                                            className="p-3 bg-white bg-opacity-20 rounded-xl flex items-center justify-between"
                                            whileHover={{
                                                scale: 1.05,
                                                backgroundColor: "rgba(255,255,255,0.3)",
                                            }}
                                            onClick={() => navigate("/learning/" +  units?.find((unit) => {
                                                for (const lesson of unit.lessons) {
                                                    if (lesson._id === course.id) {
                                                        return unit._id;
                                                    }
                                                }
                                                for (const exercise of unit.exercises) {
                                                    if (exercise._id === course.id) {
                                                        return unit._id;
                                                    }
                                                }
                                            })?._id + "/" + course.id + "/" + classroomId)}
                                        >
                                            <span className="text-lg">{course.name}</span>
                                            <div className="flex flex-row">{course.extra_points} 💎</div>
                                        </motion.li>
                                    )
                                )}
                                {user?.recommended?.exercises.map(
                                    //TODO: Recommendations
                                    (course) => (
                                        <motion.li
                                            key={course.id}
                                            className="p-3 bg-white bg-opacity-20 rounded-xl flex items-center justify-between"
                                            whileHover={{
                                                scale: 1.05,
                                                backgroundColor: "rgba(255,255,255,0.3)",
                                            }}
                                            onClick={() => navigate("/learning/" +  units?.find((unit) => {
                                                for (const lesson of unit.exercises) {
                                                    if (lesson._id === course.id) {
                                                        return unit._id;
                                                    }
                                                }
                                                for (const exercise of unit.exercises) {
                                                    if (exercise._id === course.id) {
                                                        return unit._id;
                                                    }
                                                }
                                            })?._id + "/" + course.id + "/" + classroomId)}
                                        >
                                            <span className="text-lg">{course.name}</span>
                                            <div className="flex flex-row">{course.extra_points} 💎</div>
                                        </motion.li>
                                    )
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

const DashboardHeader = ({
    user,
    isGuest,
    navigate,
    setLogoutModalVisible,
}: {
    user: { name?: string, profile_picture?: string };  
    isGuest: boolean;
    navigate: (path: string) => void;
    setLogoutModalVisible: (visible: boolean) => void;
}) => (
    <header className="bg-white rounded-3xl shadow-lg p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Avatar className="w-16 h-16 border-4 border-purple-400">
                    <AvatarImage src={user.profile_picture} alt="Student" />
                    <AvatarFallback>ME</AvatarFallback>
                </Avatar>
            </motion.div>
            <div>
                <h1 className="text-3xl font-bold text-purple-800">Welcome, {user?.name || "Guest"}!</h1>
                <p className="text-lg text-purple-600">Ready to conquer new galaxies of knowledge?</p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => navigate("/settings")}>
                <Settings className="h-6 w-6 text-purple-600" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => navigate("/help")}>
                <BookOpen className="h-6 w-6 text-purple-600" />
            </Button>
            {isGuest ? (
                <Button variant="outline" size="icon" className="rounded-full" onClick={() => navigate("/login")}>
                    <LogIn className="h-6 w-6 text-purple-600" />
                </Button>
            ) : (
                <Button variant="outline" size="icon" className="rounded-full" onClick={() => setLogoutModalVisible(true)}>
                    <LogOut className="h-6 w-6 text-purple-600" />
                </Button>
            )}
        </div>
    </header>
);
