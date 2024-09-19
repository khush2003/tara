import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React, { useState } from 'react';
import owl from '../assets/owl.png';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './logoutmodal';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState<boolean>(false); // State to control modal visibility

  const handleLogoutClick = () => {
    setLogoutModalVisible(true); // Show the modal
  };

  const handleLogoutConfirm = () => {
    setLogoutModalVisible(false); // Hide the modal and perform logout
    navigate('/'); // Redirect to login or home after logout
  };

  const handleLogoutCancel = () => {
    setLogoutModalVisible(false); // Hide the modal without logging out
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gray-50 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={owl}
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-gray-300"
          />
          <h1 className="text-2xl font-bold">Welcome, Student Name!</h1> {/* Replace with dynamic name */}
        </div>
        <Button className="text-sm p-3 bg-red-500 text-white rounded-lg" onClick={handleLogoutClick}>
          Logout
        </Button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="space-y-6">
          {/* Today's Lesson */}
          <Card className="p-6 shadow-md rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-4">Today's Lesson</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-blue-500 text-white justify-between"
                  onClick={() => navigate('/learning')}
                >
                  <span>Unit 1</span>
                  <Progress value={75} className="w-[50%]" />
                </Button>
              </li>
            </ul>
          </Card>

          {/* Learning Progress */}
          <Card className="p-6 shadow-md rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-4">Learning Progress</h2>
            <ul className="space-y-4">
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-blue-500 justify-between text-white"
                  onClick={() => navigate('/learning')}
                >
                  <span>Unit 1</span>
                  <Progress value={75} className="w-[50%]" />
                </Button>
              </li>
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-blue-400 justify-between text-white"
                  onClick={() => navigate('/learning')}
                >
                  <span>Unit 2</span>
                  <Progress value={50} className="w-[50%]" />
                </Button>
              </li>
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-blue-300 justify-between text-white"
                  onClick={() => navigate('/learning')}
                >
                  <span>Unit 3</span>
                  <Progress value={30} className="w-[50%]" />
                </Button>
              </li>
            </ul>
          </Card>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* Points Tracker */}
          <Card className="p-6 shadow-md rounded-lg bg-white flex flex-col justify-between items-start">
            <div className="flex flex-col w-full space-y-4">
              <h2 className="text-lg font-semibold">Game Points</h2>
              <p className="text-2xl font-bold">150 Coins</p> {/* Replace with dynamic points */}
              <h2 className="text-lg font-semibold mb-4">Total Playtime Remaining</h2>
              <div className="w-full py-1 flex justify-between">
                <span>5 mins</span>
                <Progress value={90} className="w-[50%]" />
              </div>
            </div>
            <Button className="w-full text-lg py-3 bg-green-500 text-white rounded-lg mt-4" onClick={() => navigate('/gameintro')}>
              Go to Game
            </Button>
          </Card>

          {/* Recommended Courses */}
          <Card className="p-6 shadow-md rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-4">Recommended Courses</h2>
            <ul className="space-y-4">
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-purple-600 text-white justify-between"
                  onClick={() => navigate('/learning')}
                >
                  <span>Unit 1</span>
                  <p className="text-md font-bold">40 points</p>
                </Button>
              </li>
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-purple-600 text-white justify-between"
                  onClick={() => navigate('/learning')}
                >
                  <span>Unit 2</span>
                  <p className="text-md font-bold">35 points</p>
                </Button>
              </li>
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-purple-600 text-white justify-between"
                  onClick={() => navigate('/learning')}
                >
                  <span>Unit 3</span>
                  <p className="text-md font-bold">35 points</p>
                </Button>
              </li>
            </ul>
          </Card>
        </div>

        {/* Column 3 */}
        <div className="space-y-6">
          {/* Learning Resources */}
          <Card className="p-6 shadow-md rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-4">Learning Resources</h2>
            <div className="flex flex-wrap gap-4">
              <Button className="w-40 h-12 bg-indigo-500 text-white">Exercises</Button>
              <Button className="w-40 h-12 bg-indigo-500 text-white">Review Units</Button>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6 shadow-md rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="flex flex-col space-y-4">
              <Button className="bg-blue-500 text-white py-2">Edit Profile</Button>
              <Button className="bg-blue-500 text-white py-2">Change Name</Button>
              <Button className="bg-blue-500 text-white py-2">Settings</Button>
            </div>
          </Card>

          {/* Announcements */}
          <Card className="p-6 shadow-md rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-4">Announcements</h2>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">New exercise available in Unit 2.</li>
              <li className="text-sm text-gray-600">Reminder: Project submission due next week.</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Floating "Settings" Button */}
      <Button
        onClick={() => navigate('/settings')}
        className="fixed bottom-4 right-4 p-4 rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600"
      >
        Settings
      </Button>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isVisible={isLogoutModalVisible}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default DashboardPage;
