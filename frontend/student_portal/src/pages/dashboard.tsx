import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React from 'react';
import owl from '../assets/owl.png';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full min-h-screen p-6 bg-gray-100 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={owl} // Replace with dynamic source
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
          <h1 className="text-2xl font-bold">Welcome, Student Name!</h1> {/* Replace with dynamic name */}
        </div>
        <Button className="text-sm" onClick={() => navigate("/")}>Logout</Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <Card className="p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Today's Lesson</h2>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <Button className="w-[100%] py-7 bg-blue-500 justify-between" onClick={() => navigate("/learning")}> 
                <span>Unit 1</span>
                <Progress value={75} className="w-[60%]">75% Complete</Progress>
              </Button>
            </li>
          </ul>

          <div className="pt-8" />
          <h2 className="text-lg font-semibold mb-4">Learning Progress</h2>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <Button className="w-[100%] py-7 bg-blue-500 justify-between" onClick={() => navigate("/learning")}> 
                <span>Unit 1</span>
                <Progress value={75} className="w-[60%]">75% Complete</Progress>
              </Button>
            </li>
            <li className="flex justify-between">
              <Button className="w-[100%] py-7 bg-blue-300 justify-between" onClick={() => navigate("/learning")}> 
                <span>Unit 2</span>
                <Progress value={50} className="w-[60%]">50% Complete</Progress>
              </Button>
            </li>
            <li className="flex justify-between">
              <Button className="w-[100%] py-7 bg-blue-300 justify-between" onClick={() => navigate("/learning")}> 
                <span>Unit 3</span>
                <Progress value={30} className="w-[60%]">30% Complete</Progress>
              </Button>
            </li>
          </ul>
        </Card>

        {/* Points Tracker */}
        <Card className="p-6 shadow-md rounded-lg bg-white flex flex-col justify-between items-start">
          <div className="flex flex-col w-full space-y-4">
            <h2 className="text-lg font-semibold">Game Points</h2>
            <p className="text-2xl font-bold">150 Coins</p> {/* Replace with dynamic points */}
            <h2 className="text-lg font-semibold mb-4">Total Playtime Remaining</h2>
            <div className="w-full py-1 flex justify-between"> 
              <span>5 mins</span>
              <Progress value={90} className="w-[60%]">30% Complete</Progress>
            </div>
          </div>
          <Button className="text-lg p-4">Go to Game</Button>
        </Card>

        {/* Recommended Courses */}
        <Card className="p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Recommended Courses</h2>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <Button className="w-[100%] py-7 bg-gradient-to-tr from-purple-400 via-purple-700 to-purple-900 justify-between"> 
                <span>Unit 1</span>
                <p className="text-md"><b>40 points</b></p>
              </Button>
            </li>
            <li className="flex justify-between">
              <Button className="w-[100%] py-7 bg-gradient-to-tr from-purple-400 via-purple-700 to-purple-900 justify-between"> 
                <span>Unit 2</span>
                <p className="text-md"><b>35 points</b></p>
              </Button>
            </li>
          </ul>
        </Card>

        {/* Learning Resources */}
        <Card className="p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Learning Resources</h2>
          <div className="flex flex-wrap space-x-2">
            <Button className="w-40 h-12">Exercises</Button>
            <Button className="w-40 h-12">Review Units</Button>
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="flex flex-col space-y-4">
            <Button>Edit Profile</Button>
            <Button>Change Name</Button>
            <Button>Settings</Button>
          </div>
        </Card>

        {/* Announcements */}
        <Card className="p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Announcements</h2>
          <ul className="space-y-2">
            <li className="text-sm">New exercise available in Unit 2.</li>
            <li className="text-sm">Reminder: Project submission due next week.</li>
          </ul>
        </Card>
      </div>

      {/* Floating "Settings" Button */}
      <Button
        onClick={() => navigate("/settings")}  // Navigate to the settings page
        className="fixed bottom-4 right-4 p-4 rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600"
      >
        Settings
      </Button>
    </div>
  );
};

export default DashboardPage;
