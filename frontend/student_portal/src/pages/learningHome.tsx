import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../assets/Chat.png"; // Import your logo image
import users from "../assets/users.png"; // Import your profile image

import Learning001 from "./lessons/learning";
import ExercisePage from "./excercises/exercise";
import ExercisePage2 from "./excercises/exercise2";
import ExercisePage3 from "./excercises/exercise3";
import StudentGuide from "./guidance";
import Learning0003 from "./lessons/learning3";
import Unit3exercise1 from "./excercises/excercise3_02";
import Excercise3_01 from "./excercises/excercise3_01";
import Excercise3_02 from "./excercises/excercise3_02";
import Excercise3_03 from "./excercises/excercise3_03";
import Excercise3_004 from "./excercises/excercise3_04";
import LearningContentPage2 from "./lessons/learning2";
import ExercisePageUnit2Ver2 from "./excercises/exercise2-2";
import ExercisePageUnit2 from "./excercises/exercise2-1";

// ID: 0001L0001

const LearningContentPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    const toggleGuide = () => {
        setShowGuide(!showGuide);
    };

    const toggleMobileSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="relative flex h-screen bg-gray-50">
            {/* Mobile Sidebar Toggle Button */}
            <div className="md:hidden fixed top-4 left-4 z-20">
                <Button
                    onClick={toggleMobileSidebar}
                    className="p-2 bg-blue-600 text-white rounded-lg shadow-lg"
                >
                    {isSidebarOpen ? (
                        // Close "X" icon
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    ) : (
                        // Hamburger icon
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    )}
                </Button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed z-10 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 transform md:relative flex-shrink-0 ${
                    isSidebarCollapsed ? "w-20" : "w-80"
                } h-full p-4 bg-gradient-to-r from-[#002761] to-[#5E0076] text-white shadow-lg transition-all duration-300 ease-in-out md:flex flex-col md:static`}
            >
                {/* Collapse Button */}
                <Button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 bg-gray-700 text-white rounded-lg p-2"
                >
                    {isSidebarCollapsed ? 'Expand' : 'Collapse'}
                </Button>

                {/* Sidebar Header */}
                <div className="flex flex-col items-center">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center space-y-2">
                        <img
                            src={users} // Replace with dynamic source
                            alt="Profile"
                            className="w-12 h-12 rounded-full border-2 border-white"
                        />
                        {!isSidebarCollapsed && (
                            <>
                                <h2 className="text-sm font-semibold mt-2">
                                    Johnny
                                </h2>{" "}
                                {/* Dynamic Name */}
                                <p className="text-xs text-gray-300">Level 3</p>
                                <p className="text-xs text-gray-300">
                                    490 Points
                                </p>
                                <Button
                                    className="w-full py-4 bg-blue-800 hover:from-purple-800 rounded-lg"
                                    onClick={() => navigate("/gameintro")}
                                >
                                    Let's Play TARA Game!
                                </Button>{" "}
                                {/* Updated */}
                            </>
                        )}
                    </div>
                </div>

                {/* Recommended Courses */}
                {!isSidebarCollapsed && (
                    <>
                        <div className="mt-6">
                            <h3 className="text-xs font-semibold">Lesson</h3>
                            <ul className="flex flex-col mt-2 space-y-1 text-xs">
                                <Button
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-800 hover:to-[#25c3ea] rounded-lg px-2 py-2"
                                    onClick={() => navigate("/learning/0001L0001")}
                                >
                                    Unit 1: Foods
                                </Button>
                            </ul>
                            <ul className="flex flex-col mt-2 space-y-1 text-xs">
                                <Button
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-800 hover:to-[#25c3ea] rounded-lg px-2 py-2"
                                    onClick={() => navigate("/learning/0002L0001")}
                                >
                                    Unit 2: Places
                                </Button>
                            </ul>
                            <ul className="flex flex-col mt-2 space-y-1 text-xs">
                                <Button
                                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-800 hover:to-[#25c3ea] rounded-lg px-2 py-2"
                                    onClick={() => navigate("/learning/0003L0001")}
                                >
                                    Unit 3: Animals
                                </Button>
                            </ul>
                        </div>
                        

                        {/* Current Courses */}
                        <div className="mt-6">
                            <h3 className="text-xs font-semibold">Exercises</h3>
                            <ul className="space-y-4 mt-2">
                                <li className="flex flex-col">
                                    <Button
                                        className="w-full py-4 bg-blue-500 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                                        onClick={() => navigate("/learning/0001E0001")}
                                    >
                                        <span>Unit 1 Exercise 1: Translation</span>
                                    </Button>
                                </li>

                                <li className="flex flex-col">
                                    <Button
                                        className="w-full py-4 bg-blue-400 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                                        onClick={() => navigate("/learning/0001E0002")}
                                    >
                                        <span>
                                            Unit 1 Exercise 2: Fill in the blanks
                                        </span>
                                    </Button>
                                </li>

                                <li className="flex flex-col">
                                    <Button
                                        className="w-full py-4 bg-blue-300 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                                        onClick={() => navigate("/learning/0001E0003")}
                                    >
                                        <span>Unit 1 Exercise 3: Drag and Drop</span>
                                    </Button>
                                </li>

                                <li className="flex flex-col">
                                    <Button
                                        className="w-full py-4 bg-blue-300 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                                        onClick={() => navigate("/learning/0002E0001")}
                                    >
                                        <span>Unit 2 Exercise 1: Fill Story</span>
                                    </Button>
                                </li>

                                <li className="flex flex-col">
                                    <Button
                                        className="w-full py-4 bg-blue-300 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                                        onClick={() => navigate("/learning/0002E0002")}
                                    >
                                        <span>Unit 2 Exercise 2: True or False</span>
                                    </Button>
                                </li>

                                <li className="flex flex-col">
                                    <Button
                                        className="w-full py-4 bg-blue-300 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                                        onClick={() => navigate("/learning/0003E0001")}
                                    >
                                        <span>Unit 3 Exercise 1: Choose </span>
                                    </Button>
                                </li>

                                <li className="flex flex-col">
                                    <Button
                                        className="w-full py-4 bg-blue-300 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                                        onClick={() => navigate("/learning/0003E0002")}
                                    >
                                        <span>Unit 3 Exercise 2: Drag and Drop</span>
                                    </Button> 
                                </li>

                                <li className="flex flex-col">
                                    <Button
                                        className="w-full py-4 bg-blue-300 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                                        onClick={() => navigate("/learning/0003E0003")}
                                    >
                                        <span>Unit 3 Exercise 3: Answer</span>
                                    </Button>
                                </li>

                                <li className="flex flex-col">
                                    <Button
                                        className="w-full py-4 bg-blue-300 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                                        onClick={() => navigate("/learning/0003E0004")}
                                    >
                                        <span>Unit 3 Exercise 4: Describe</span>
                                    </Button>
                                </li>
                            </ul>
                        </div>

                        {/* See All Courses Button */}
                        <Button
                            className="mt-6 w-full bg-green-500 text-xs rounded-lg"
                            onClick={() => navigate("/dashboard")}
                        >
                            See All Lessons
                        </Button>
                    </>
                )}
            </div>

            {/* Backdrop for Mobile Sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-5 md:hidden"
                    onClick={toggleMobileSidebar}
                ></div>
            )}

            {/* Main Content */}
            <div>
                
            <PageContent id={id} />


            </div>

            {/* Floating Circular Button - Dark Blue */}
            <Button
                onClick={toggleGuide}
                className="fixed bottom-4 right-4 w-16 h-16 p-0 rounded-full bg-blue-900 text-white shadow-lg hover:bg-purple-600 flex items-center justify-center"
            >
                <img src={Logo} alt="Logo" className="w-10 h-10" />{" "}
                {/* Resized the logo */}
            </Button>

            {/* Student Guide Modal */}
            {showGuide && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg">
                        <StudentGuide />
                        <Button
                            onClick={toggleGuide}
                            className="mt-4 p-2 bg-red-500 text-white rounded-lg"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
        
        </div>
    );
};


            


const PageContent: React.FC<{ id: string | undefined }> = ({ id }) => {
    switch (id) {
        case "0001L0001":
            return <Learning001 />;
        case "0002L0001":
            return <LearningContentPage2 />;
        case "0001E0001":
            return <ExercisePage />;
        case "0001E0002":
            return <ExercisePage2 />;
        case "0001E0003":
            return <ExercisePage3 />;
        case "0002E0001":
            return <ExercisePageUnit2 />;
        case "0002E0002":
            return <ExercisePageUnit2Ver2 />;
        case "0003L0001":
            return <Learning0003 />;
        case "0003E0001":
            return <Excercise3_01 />;
        case "0003E0002":
            return <Excercise3_02 />;
        case "0003E0003":
            return <Excercise3_03 />;
        case "0003E0004":
            return <Excercise3_004 />;
        default:
            return <Learning001 />;
    }
}

export default LearningContentPage;
