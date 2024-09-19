import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import StudentGuide from './guidance';
import Logo from '../assets/Chat.png'; // Import your logo image
import Users from '../assets/users.png'; // Import your logo image

const LearningContentPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Toggle Sidebar Collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  // Toggle the visibility of the StudentGuide
  const toggleGuide = () => {
    setShowGuide(!showGuide);
  };

  return (
    <div className="relative flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarCollapsed ? 'w-16' : 'w-60'
        } flex-shrink-0 p-4 bg-blue-900 text-white shadow-lg transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div className="flex flex-col items-center">
          {/* Toggle Sidebar Button */}
          <button
            onClick={toggleSidebar}
            className="self-end mb-4 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isSidebarCollapsed ? '>' : '<'}
          </button>

          {/* Profile Section */}
          <div className="flex flex-col items-center space-y-2">
            <img
              src={Users} // Replace with dynamic source
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white"
            />

            {!isSidebarCollapsed && (
              <>
                <h2 className="text-sm font-semibold mt-2">Johnny</h2> {/* Dynamic Name */}
                <p className="text-xs text-gray-300">Level 3</p>
                <p className="text-xs text-gray-300">490 Points</p>
                <Button className="w-full py-4 bg-indigo-500 rounded-lg">Go to Game</Button> {/* Updated */}
              </>
              )
              }
          </div>
        </div>

        {/* Recommended Courses */}
        {!isSidebarCollapsed && (
          <>
            <div className="mt-6">
              <h3 className="text-xs font-semibold">Recommended Lessons</h3>
              <ul className="flex flex-col mt-2 space-y-1 text-xs">
                <Button className="bg-indigo-500 rounded-lg px-2 py-2">A Limerick</Button>
              </ul>
            </div>

            {/* Current Courses */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold">Current Lessons</h3>
              <ul className="space-y-4">
                <li className="flex flex-col">
                  <Button 
                    className='w-full py-4 bg-blue-500 rounded-lg text-left pl-3 mb-2' 
                    onClick={() => navigate("/learning")}
                  >
                    <span>Unit 1</span>
                  </Button>
                </li>
                
                <li className="flex flex-col">
                  <Button 
                    className='w-full py-4 bg-blue-400 rounded-lg text-left pl-3 mb-2' 
                    onClick={() => navigate("/learning")}
                  >
                    <span>Unit 2</span>
                  </Button>
                </li>

                <li className="flex flex-col">
                  <Button 
                    className='w-full py-4 bg-blue-300 rounded-lg text-left pl-3 mb-2' 
                    onClick={() => navigate("/learning")}
                  >
                    <span>Unit 3</span>
                  </Button>
                </li>
              </ul>
            </div>

            {/* See All Courses Button */}
            <Button className="mt-6 w-full bg-green-500 text-xs rounded-lg" onClick={() => navigate("/dashboard")}>
              See All Lessons
            </Button>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Card className="p-8 shadow-md rounded-xl bg-white">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Translate the Poem</h2>
          <p className="text-center mb-6 text-gray-600">Please translate the following poem into your native language:</p>
          <div className="text-center mb-6">
            <blockquote className="italic text-gray-600 bg-gray-100 p-4 rounded-lg">
              Tom is hungry. Tom is very hungry. Tom wants to eat.<br />
              Tom walks to the kitchen. Tom walks very fast. Tom opens the door.<br />
              Tom sees the eggs. Tom sees the bread. Tom sees the milk.<br />
              Tom makes a sandwich. Tom makes a yummy sandwich. Tom eats the sandwich.
            </blockquote>
          </div>
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-lg mb-6"
            placeholder="Write your translation here..."
          ></textarea>
          <div className="flex justify-center space-x-4">
            <Button className="p-4 bg-green-500 text-white rounded-lg">Complete Exercise & Earn Points</Button>
            <Button className="p-4 bg-blue-900 text-white rounded-lg">Next Lesson</Button>
          </div>
        </Card>
      </div>

      {/* Floating Circular Button */}
      <Button
        onClick={toggleGuide}
        className="fixed bottom-4 right-4 w-16 h-16 p-0 rounded-full bg-blue-900 text-white shadow-lg hover:bg-purple-600 flex items-center justify-center"
      >
        <img src={Logo} alt="Logo" className="w-10 h-10" /> {/* Resized the logo */}
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

export default LearningContentPage;
