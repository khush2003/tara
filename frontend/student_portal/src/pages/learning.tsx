import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LearningContentPage: React.FC = () => {
    const navigate = useNavigate();
  // State to manage sidebar collapse
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Function to handle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } flex-shrink-0 p-4 bg-blue-900 text-white  shadow-md transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div className="flex flex-col items-center">
          {/* Toggle Sidebar Button */}
          <button
            onClick={toggleSidebar}
            className="self-end mb-4 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isSidebarCollapsed ? '>' : '<'}
          </button>

          {/* Profile Section */}
          <div className="flex flex-col items-center space-y-2">
            <img
              src="path-to-profile-pic" // Replace with dynamic source
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            {!isSidebarCollapsed && (
              <>
                <h2 className="text-sm font-semibold">Student Name</h2> {/* Replace with dynamic name */}
                <p className="text-xs">Game Points: 150 Coins</p> {/* Replace with dynamic points */}
                <Button className="text-xs mt-2">Go to Game</Button>
              </>
            )}
          </div>
        </div>

        {/* Recommended Courses */}
        {!isSidebarCollapsed && (
          <>
            <div className="mt-6">
              <h3 className="text-sm font-semibold">Recommended Courses</h3>
              <ul className="flex flex-col mt-2 space-y-1 text-xs">
                <Button>Unit 1</Button>
                <Button>Unit 2</Button>
              </ul>
            </div>

            {/* Current Courses */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold">Current Courses</h3>
              <ul className="space-y-2">
            {/* Replace static values with dynamic data */}
            <li className="flex justify-between">
              <Button className='w-[100%] py-7 bg-blue-500 justify-between '  onClick={() => navigate("/learning")}> 
              <span>Unit 1</span>
              <Progress value={75} className="w-[60%]">75% Complete</Progress>
              </Button>
            </li>
            <li className="flex justify-between">
            <Button className='w-[100%] py-7 bg-blue-300 justify-between ' onClick={() => navigate("learning")}> 
              <span>Unit 2</span>
              <Progress value={50} className="w-[60%]">50% Complete</Progress>
              </Button>
            </li>
            <li className="flex justify-between">
            <Button className='w-[100%] py-7 bg-blue-300 justify-between ' onClick={() => navigate("learning")}> 
              <span>Unit 3</span>
              <Progress value={30} className="w-[60%]">30% Complete</Progress>
              </Button>
            </li>
          </ul>
            </div>

            {/* See All Courses Button */}
            <Button className="mt-6 w-full text-xs" onClick={() => navigate("/dashboard")}>See All Courses</Button>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <Card className="p-8 shadow-md rounded-lg bg-white">
          {/* Poem Instructions */}
          <h2 className="text-xl font-bold mb-4 text-center">Translate the Poem</h2>
          <p className="text-center mb-6">
            Please translate the following poem into your native language:
          </p>
          
          {/* English Poem */}
          <div className="text-center mb-6">
            <blockquote className="italic text-gray-600">
            Tom is hungry. Tom is very hungry. Tom wants to eat.<br />

Tom walks to the kitchen. Tom walks very fast. Tom opens the door. <br />

Tom sees the eggs. Tom sees the bread. Tom sees the milk. <br />

Tom makes a sandwich. Tom makes a yummy sandwich. Tom eats the sandwich. 
            </blockquote>
          </div>

          {/* Input for Native Language Translation */}
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-md mb-6"
            placeholder="Write your translation here..."
          ></textarea>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button className="p-4 bg-green-500 text-white">Complete Exercise & Earn Points</Button>
            <Button className="p-4 bg-blue-500 text-white">Next Lesson</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LearningContentPage;
