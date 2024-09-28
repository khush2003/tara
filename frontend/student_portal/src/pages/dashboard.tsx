import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Bell,
    BookOpen,
    Gamepad,
    Layers,
    LogOut,
    Rocket,
    Settings,
    Sparkles,
    Star,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import LogoutModal from "./logoutmodal";

interface User {
    name: string;
    email: string;
    profilePicture: string;
    student_details: {
        game_points: number;
        classroom_code: string;
        game_hours_left: number;
    }
    role: string;
}

interface LearningModule {
    _id: string;
    name: string;
    description: string;
    difficulty: string;
    skills: string[];
    createdAt: string;
    updatedAt: string;
    isPremium: boolean;
    moduleCode: string;
    prerequisites: LearningModule[];
    related_modules: LearningModule[];
    exercises: any[];
    lessons: any[];
    __v: number;
}

interface Classroom {
    classroom_code: string;
    classroom_name: string;
    createdAt: string;
    extra_points_award: any[];
    is_game_active: boolean;
    learning_modules: LearningModule[];
    performance_records: any[];
    students_enrolled: string[];
    teacher_id: string;
    today_lesson: LearningModule;
    updatedAt: string;
    __v: number;
    _id: string;
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const [isLogoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const accessToken = useAuthStore((state) => state.accessToken);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [isGuest, setIsGuest] = useState(false);
    const [classroomDetails, setClassroomDetails] = useState<Classroom | null>(null);
    // const [hoveredCard, setHoveredCard] = useState(null);

    const fetchClassroomDetails = useCallback(async () => {
        if (!userInfo?.student_details.classroom_code) {
            if (!userInfo) {
                return;
            }
            if (!userInfo.student_details.classroom_code) {
                navigate("/learningCode");
                return;
            }

        }
        const response = await fetch("http://localhost:8080/classroom/classrooms/" + userInfo?.student_details.classroom_code, {
            headers: {
                "auth-token": `${accessToken}`,
            },
        });
        if (!response.ok) {
            console.log("Failed to fetch classroom details");
            navigate("/learningCode");
            return;
        }
        const data = await response.json();
        console.log(data);
        setClassroomDetails(data);
    }, [userInfo?.student_details.classroom_code, accessToken, navigate]);

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
            await fetchClassroomDetails();
        };

        if (isLoggedIn) {
            fetchData();
        } else {
            setIsGuest(true);
        }
    }, [isLoggedIn, fetchUserDetails, fetchClassroomDetails]);

    
  

      const handleLogoutCancel = () => {
        setLogoutModalVisible(false); // Hide the modal without logging out
      };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4 sm:p-6 lg:p-8">
            <header className="bg-white rounded-3xl shadow-lg p-6 mb-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Avatar className="w-16 h-16 border-4 border-purple-400">
                            <AvatarImage
                                src="/placeholder.svg?height=64&width=64"
                                alt="Student"
                            />
                            <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                    </motion.div>
                    <div>
                        <h1 className="text-3xl font-bold text-purple-800">
                            Welcome, {userInfo?.name}!
                        </h1>
                        <p className="text-lg text-purple-600">
                            Ready to conquer new galaxies of knowledge?
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => navigate("/settings")}
                    >
                        <Settings className="h-6 w-6 text-purple-600" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setLogoutModalVisible(true)}
                    >
                        <LogOut className="h-6 w-6 text-purple-600"  />
                    </Button>
                </div>
            </header>

            <LogoutModal
                isVisible={isLogoutModalVisible}
                onClose={handleLogoutCancel}
            />

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div 
          className="col-span-full lg:col-span-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl flex items-center justify-between">
                <span className="flex items-center">
                  <Gamepad className="mr-3 h-8 w-8" />
                  Game Zone
                </span>
                <Button onClick={() => navigate("/gameintro")} variant="secondary" className="bg-white text-purple-600 hover:bg-purple-100 text-lg px-6 py-2 rounded-full">
                  Play Now!
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <p className="text-2xl font-bold mb-2">Your Coins: {userInfo?.student_details.game_points} 💎</p>
                <p className="text-lg">Playtime Left: {userInfo?.student_details.game_hours_left} space minutes</p>
                <div className="w-full py-1 flex justify-between">
                    <Progress value={userInfo? userInfo.student_details.game_hours_left/60 * 100 : 60/60*100}  className="w-[100%] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 " />
                  </div>
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <Rocket className="h-24 w-24 text-white mt-4 sm:mt-0" />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

                <motion.div
                    className="col-span-full md:col-span-1"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Card className="bg-gradient-to-br from-green-400 to-blue-500 text-white h-full">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center">
                                <Bell className="mr-2 h-6 w-6" />
                                Tara News
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg">
                                🍰 <strong>Yay! </strong> Let's Finish foods unit on your own! <br></br>
                                No more announcements for today. <br></br> See you tomorrow! 
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div 
          className="col-span-full"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-white border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 flex items-center justify-between">
                <span className="flex items-center">
                  <BookOpen className="mr-2 h-6 w-6 text-purple-600" />
                  Today's Tara Lesson: {classroomDetails?.today_lesson.name || "No lesson today"}
                </span>
                <Button onClick={() => navigate("/learning/" + classroomDetails?.today_lesson.moduleCode + "L0001")} variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50 rounded-full">
                  Let's Learn
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={30} className="h-4 bg-purple-100" />
              <p className="text-lg text-gray-600 mt-2">30% of your journey completed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="col-span-full lg:col-span-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="bg-white border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 flex items-center">
                <Layers className="mr-2 h-6 w-6 text-purple-600" />
                Your Learning Units
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {classroomDetails?.learning_modules.map((unit, index) => (
                  <motion.li 
                    key={unit._id} 
                    onClick={() => navigate("/learning/" + unit.moduleCode + "L0001")}
                    className={`p-4 rounded-xl flex items-center justify-between ${index === 0 ? 'bg-purple-100' : 'bg-gray-100'}`}
                    whileHover={{ scale: 1.03, backgroundColor: "#e0e7ff" }}
                  >
                    <span className="text-lg font-medium flex items-center text-gray-800" >
                      <Star className="mr-2 h-5 w-5 text-yellow-500" />
                      {unit.name}
                    </span>
                    <Progress value={[30, 100, 60, 10][index]} className="w-1/3 h-3" />
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

                <motion.div
                    className="col-span-full md:col-span-1"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Card className="bg-gradient-to-br from-purple-400 to-pink-500 text-white h-full">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center">
                                <Sparkles className="mr-2 h-6 w-6" />
                                Recommended Units
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {classroomDetails?.learning_modules.map((course) => (
                                    <motion.li
                                        key={course._id}
                                        className="p-3 bg-white bg-opacity-20 rounded-xl flex items-center justify-between"
                                        whileHover={{
                                            scale: 1.05,
                                            backgroundColor:
                                                "rgba(255,255,255,0.3)",
                                        }}
                                    >
                                        <span className="text-lg">
                                            {course.name}
                                        </span>
                                        <div className="flex flex-row">
                                        20 💎
                                        
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
