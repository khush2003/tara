import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React, { useState, useEffect } from 'react';
import owl from '../assets/owl.png';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './logoutmodal';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Fetch username and check login status when the component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUsername || 'Student');
    } else {
      setIsLoggedIn(false);
      setUsername('Student'); // Default value if username not available
    }
  }, []);

  const handleLogoutClick = () => {
    setLogoutModalVisible(true); // Show the modal
  };

  const handleLogoutConfirm = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token'); 
    localStorage.removeItem('username'); 
    setIsLoggedIn(false); // Update login status
    setLogoutModalVisible(false); // Hide the modal
    navigate('/'); // Redirect to login or home after logout
  };

  const handleLogoutCancel = () => {
    setLogoutModalVisible(false); // Hide the modal without logging out
  };

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to login page
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
          <h1 className="text-2xl font-bold">
            Welcome, {username}!
          </h1>
        </div>
        {isLoggedIn ? (
          <Button className="text-sm p-3 bg-red-500 text-white rounded-lg" onClick={handleLogoutClick}>
            Logout
          </Button>
        ) : (
          <Button className="text-sm p-3 bg-blue-500 text-white rounded-lg" onClick={handleLoginClick}>
            Login
          </Button>
        )}
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
                  className="w-full py-7 bg-blue-500 text-white justify-between"
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
              {['Unit 1', 'Unit 2', 'Unit 3'].map((unit, index) => (
                <li key={index} className="flex justify-between">
                  <Button
                    className={`w-full py-7 text-white justify-between ${['bg-blue-500', 'bg-blue-400', 'bg-blue-300'][index]}`}
                    onClick={() => navigate('/learning')}
                  >
                    <span>{unit}</span>
                    <Progress value={[75, 50, 30][index]} className="w-[50%]" />
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* Points Tracker */}
          <Card className="p-6 shadow-md rounded-lg bg-white flex flex-col justify-between items-start">
            <div className="flex flex-col w-full space-y-4">
              <h2 className="text-lg font-semibold">Game Points</h2>
              <p className="text-2xl font-bold">150 Coins</p>
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
              {['Unit 1', 'Unit 2', 'Unit 3'].map((unit, index) => (
                <li key={index} className="flex justify-between">
                  <Button
                    className="w-full py-7 bg-purple-600 text-white justify-between"
                    onClick={() => navigate('/learning')}
                  >
                    <span>{unit}</span>
                    <p className="text-md font-bold">{40 - index * 5} points</p>
                  </Button>
                </li>
              ))}
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
              {['Edit Profile', 'Change Name', 'Settings'].map((action, index) => (
                isLoggedIn && (
                  <Button key={index} className="bg-blue-500 text-white py-2" onClick={() => navigate('/settings')}>
                    {action}
                  </Button>
                )
              ))}
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
      {isLoggedIn && (
        <Button
          onClick={() => navigate('/settings')}
          className="fixed bottom-4 right-4 p-4 rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600"
        >
          Settings
        </Button>
      )}

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
