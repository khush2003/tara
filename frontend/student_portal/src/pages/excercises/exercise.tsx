import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import StudentGuide from "../guidance";
import Logo from "../../assets/Chat.png"; // Import your logo image
import users from "../../assets/users.png"; // Import your profile image

// ID: 0001E0001
const ExercisePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State for mobile sidebar toggle
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
                <h2 className="text-sm font-semibold mt-2">Johnny</h2>{" "}
                {/* Dynamic Name */}
                <p className="text-xs text-gray-300">Level 3</p>
                <p className="text-xs text-gray-300">490 Points</p>
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
                <Button className=" bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-800  hover:to-[#25c3ea] rounded-lg px-2 py-2"
                onClick={() => navigate("/learning")}
                >
                  Unit 1: Foods
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
                    onClick={() => navigate("/exercise")}
                  >
                    <span>Exercise 1: Translation</span>
                  </Button>
                </li>

                <li className="flex flex-col">
                  <Button
                    className="w-full py-4 bg-blue-400 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                    onClick={() => navigate("/exercise2")}
                  >
                    <span>Exercise 2: Fill in the blanks</span>
                  </Button>
                </li>

                <li className="flex flex-col">
                  <Button
                    className="w-full py-4 bg-blue-300 hover:bg-blue-800 rounded-lg text-left pl-3 mb-2"
                    onClick={() => navigate("/exercise")}
                  >
                    <span>Exercise 3: Drag and Drop</span>
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
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="flex items-center justify-center mb-3 bg-gradient-to-r from-[#002761] to-[#5E0076] pr-14 rounded-md border-1">
          <div className="">
            <h1 className="text-white text-4xl">EXERCISE: FOODS</h1>
          </div>
        </div>
        <Card className="p-8 shadow-md rounded-xl bg-white">
          <h2 className="text-2xl font-bold font-mono mb-4 text-center text-gray-700">
            ENGLISH OR THAI?
          </h2>
          <p className="text-center mb-6 text-gray-600">
            Translate this text to your native language
          </p>
          <div className="text-center mb-6">
            <blockquote className="italic text-gray-600 bg-gray-100 p-4 rounded-lg">
              Tom is hungry. He walks to the kitchen and gets some eggs. He
              takes some oil and puts a pan on the stove. Next, he turns on the
              heat and pours the oil into the pan. He cracks the eggs into a
              bowl, mixes them, and then pours them into the hot pan. He waits
              while the eggs cook. They cook for two minutes. Next, Tom puts the
              eggs on a plate and places the plate on the dining room table. Tom
              feels happy because he cooked eggs. He sits down in the big wooden
              chair, and eats the eggs with a spoon. They are good. He washes
              the plate with dishwashing soap, then washes the pan. He wets a
              sponge and finally cleans the table.
            </blockquote>
          </div>
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg mb-6"
            placeholder="Write your translation here..."
          ></textarea>
          <div className="flex justify-center space-x-4">
            <Button className="p-4 bg-green-500 text-white rounded-lg">
              Complete Exercise
            </Button>
            {/* & Earn Points */}
            <Button
              className="p-4 bg-blue-500 text-white rounded-lg"
              onClick={() => navigate("login")}
            >
              Next Lesson
            </Button>
          </div>
        </Card>
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

export default ExercisePage;
