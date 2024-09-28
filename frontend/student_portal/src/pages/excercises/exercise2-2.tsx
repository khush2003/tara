import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import StudentGuide from "../guidance";
import Logo from "../../assets/Chat.png";
import users from "../../assets/users.png";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";

const ExercisePageUnit2Ver2: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Toggle Sidebar Collapse (for desktop)
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  // Toggle the visibility of the StudentGuide
  const toggleGuide = () => {
    setShowGuide(!showGuide);
  };

  // Toggle mobile sidebar
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
          isSidebarCollapsed ? "w-16" : "w-60"
        } h-full p-4 bg-gradient-to-r from-[#002761] to-[#5E0076] text-white shadow-lg transition-all duration-300 ease-in-out md:flex flex-col md:static`}
      >
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
                <h2 className="text-sm font-semibold mt-2">Johnny</h2>
                <p className="text-xs text-gray-300">Level 3</p>
                <p className="text-xs text-gray-300">490 Points</p>
                <Button
                  className="w-full py-4 bg-blue-800 hover:from-purple-800 rounded-lg"
                  onClick={() => navigate("/gameintro")}
                >
                  Let's Play TARA Game!
                </Button>
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
                  className=" bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-800  hover:to-[#25c3ea] rounded-lg px-2 py-2"
                  onClick={() => navigate("/learning2")}
                >
                  Unit 1: Was & Were
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
                    onClick={() => navigate("/exercise2-1")}
                  >
                    <span>Exercise 1: Fill in the blanks</span>
                  </Button>
                </li>

                <li className="flex flex-col">
                  <Button
                    className="w-full py-4 bg-blue-400 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                    onClick={() => navigate("/")}
                  >
                    <span>Exercise 2: Fill in the blanks</span>
                  </Button>
                </li>

                {/* <li className="flex flex-col">
                  <Button
                    className="w-full py-4 bg-blue-300 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                    onClick={() => navigate("/")}
                  >
                    <span>Exercise 3: Drag and Drop</span>
                  </Button>
                </li> */}
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
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="flex items-center justify-center mb-3 bg-gradient-to-r from-[#002761] to-[#5E0076] pr-14 rounded-md border-1">
          <div className="">
            <h1 className="text-white text-4xl">EXERCISE: WAS AND WERE</h1>
          </div>
        </div>

        <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl font-bold">TRUE OR FALSE</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ExerciseSection
                story="Last summer, Emily and her friends were on a camping trip. The weather was hot, and the lake was perfect for swimming. The tents were set up quickly, and everyone was excited."
                questions={[
                  "The weather was chilly.",
                  "The lake was great for swimming.",
                  "The tents were set up slowly.",
                ]}
                image="/placeholder.svg?height=100&width=200"
                imageAlt="Camping scene with tent and campfire"
              />
              <ExerciseSection
                story="Last Friday, Alex and his family were at the zoo. The animals were active, and the weather was sunny. The lions were roaring loudly, and the penguins were swimming in the water. Alex's favorite part was watching the elephants play with water."
                questions={[
                  "The lions were sleeping quietly.",
                  "Alex's favorite part was watching the elephants.",
                  "The penguins were swimming in the water.",
                ]}
                image="/placeholder.svg?height=100&width=200"
                imageAlt="Zoo animals including a penguin, lion, and elephant"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center space-x-4 mt-6">
          <Button className="p-4 bg-green-500 text-white rounded-lg">
            Complete Exercise
          </Button>
          <Button
            className="p-4 bg-blue-500 text-white rounded-lg"
            onClick={() => navigate("/nextlesson")}
          >
            Next Lesson
          </Button>
        </div>
      </div>

      {/* Floating Circular Button - Dark Blue */}
      <Button
        onClick={toggleGuide}
        className="fixed bottom-4 right-4 w-16 h-16 p-0 rounded-full bg-blue-900 text-white shadow-lg hover:bg-purple-600 flex items-center justify-center"
      >
        <img src={Logo} alt="Logo" className="w-10 h-10" />
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

  function ExerciseSection({ story, questions, image, imageAlt }) {
    const [answers, setAnswers] = useState(Array(questions.length).fill(""));

    const handleAnswerChange = (index, value) => {
      const newAnswers = [...answers];
      newAnswers[index] = value;
      setAnswers(newAnswers);
    };

    return (
      <div className="space-y-4">
        <div className="border border-green-500 p-4 rounded-lg">
          <p className="text-lg">{story}</p>
        </div>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="font-semibold">{index + 1}.</span>
              <p className="flex-grow">{question}</p>
              <RadioGroup
                value={answers[index]}
                onValueChange={(value) => handleAnswerChange(index, value)}
                className="flex space-x-4"
              >
                {/* True Option */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="true"
                    id={`true-${index}`}
                    className="w-4 h-4 rounded-full border border-gray-400 checked:bg-blue-600"
                    onClick={() => handleAnswerChange(index, "true")}

                  />
                  <Label htmlFor={`true-${index}`} className="cursor-pointer">
                    True
                  </Label>
                </div>

                {/* False Option */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="false"
                    id={`false-${index}`}
                    className="w-4 h-4 rounded-full border border-gray-400 checked:bg-red-600"
                    onClick={() => handleAnswerChange(index, "false")}
                  />
                  <Label htmlFor={`false-${index}`} className="cursor-pointer">
                    False
                  </Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-32 object-contain"
        />
      </div>
    );
  }
};

export default ExercisePageUnit2Ver2;
