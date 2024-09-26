import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import owl from "../assets/owl.png";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import LogoutModal from "./logoutmodal";
import blackboard from "../assets/bb.jpg";
import doggy from "../assets/GameDog.png";
import food from "../assets/food.png";
import book from "../assets/book.png";
import progrss from "../assets/success.png";
import reccommend from "../assets/recommend.png";





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
    <div className="w-full min-h-screen bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 bg-gradient-to-r from-[#002761] to-[#5E0076] pr-14">
        <div className="flex items-center space-x-4 m-3">
          <img
            src={owl}
            alt="Profile"
            onClick={() => navigate("/settings")}
            className="w-16 h-16 rounded-full border-2 border-gray-300 cursor-pointer"
          />
          <h1 className="text-xl font-bold text-white">
            Welcome, Student Name!
          </h1>{" "}
          {/* Replace with dynamic name */}
        </div>
        <div>
          <img
            src="tara.png"
            alt="tara"
            className="bg-white border-spacing-3 rounded-lg m-2"
          />
        </div>
        <div className="pl-10">
          <Button
            className="text-lg p-3 bg-red-500 text-white rounded-lg m-3"
            onClick={handleLogoutClick}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 m-3">
        {/* Announcements Section */}
        <div className="col-span-1">
          <Card
            className="p-6 shadow-md rounded-lg h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${blackboard})`,
            }}
          >
            <h2 className="text-2xl font-semibold text-white mb-4 p-2 rounded-md">
              Announcements for Student Name
            </h2>
            <ul className="space-y-2 p-2 rounded-md">
              <li className="text-sm text-white">
                New exercise available in Unit 2.
              </li>
              <li className="text-sm text-white">
                Reminder: Project submission due next week.
              </li>
            </ul>
          </Card>
        </div>

        {/* Game Points Section */}
        <div className="col-span-1">
          <Card className="p-6 shadow-md rounded-lg bg-white flex flex-col justify-between h-full ">
            <Card className="p-6 shadow-md rounded-lg bg-white flex flex-col justify-between h-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-35"
                style={{ height: 350, backgroundImage: `url(${doggy})` }}
              />
              <div className="relative z-10">
                <div className="flex flex-col w-full space-y-2">
                  <h2 className="text-2xl font-semibold">TARA Points</h2>
                  <p className="text-2xl font-bold">150 Coins</p>
                  <h2 className="text-lg font-semibold mb-4">
                    Total Playtime Remaining
                  </h2>
                  <div className="w-full py-1 flex justify-between">
                    <span>5 mins</span>
                    <Progress value={40} className="w-[50%] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 " />
                  </div>
                </div>
              </div>
            </Card>

            <Button
              className="w-full text-lg py-3 bg-gradient-to-r from-[#002761] to-[#5E0076] hover:from-purple-800 text-white rounded-lg mt-4"
              onClick={() => navigate("/gameintro")}
            >
              Let's Play TARA Game!
            </Button>
          </Card>
        </div>
      </div>

      {/*Today Lesson */}
      <div className="shadow-md rounded-lg m-3">
        <Card className="p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-2xl font-semibold mb-4 inline-flex place-items-center gap-x-3">
            <img src={book} alt="book logo" className="h-10 w-10" />
            Today's Lesson
          </h2>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <Button
                className="w-[100%] py-7 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-800  hover:to-[#25c3ea] text-white justify-between"
                onClick={() => navigate("/learning")}
              >
                <span className="inline-flex place-items-center gap-x-3">
                  <img src={food} alt="food logo" className="h-10 w-10" />
                  Unit 1 (Foods)
                </span>
                <Progress value={75} className="w-[50%]" />
              </Button>
            </li>
          </ul>
        </Card>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 m-3">
        {/* Column 1 */}
        <div className="space-y-6">
          {/* Learning Progress */}
          <Card className="p-6 shadow-md rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-4 inline-flex place-items-center gap-x-3">
              <img src={progrss} alt="progress logo" className="h-10 w-10" />
              Learning Progress
            </h2>

            <ul className="space-y-4">
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-blue-500 justify-between text-white hover:bg-blue-800"
                  onClick={() => navigate("/learning")}
                >
                  <span className="inline-flex place-items-center gap-x-3">
                    <img src={food} alt="food logo" className="h-10 w-10" />
                    Unit 1 (Foods)
                  </span>
                  <Progress value={75} className="w-[50%]" />
                </Button>
              </li>
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-blue-400 justify-between text-white hover:bg-blue-800"
                  onClick={() => navigate("/learning")}
                >
                  <span className="inline-flex place-items-center gap-x-3">
                    <img src={food} alt="food logo" className="h-10 w-10" />
                    Unit 2 (Foods)
                  </span>
                  <Progress value={50} className="w-[50%]" />
                </Button>
              </li>
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-blue-300 justify-between text-white hover:bg-blue-800"
                  onClick={() => navigate("/learning")}
                >
                  <span className="inline-flex place-items-center gap-x-3">
                    <img src={food} alt="food logo" className="h-10 w-10" />
                    Unit 3 (Foods)
                  </span>
                  <Progress value={30} className="w-[50%]" />
                </Button>
              </li>
            </ul>
          </Card>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* Recommended Courses */}
          <Card className="p-6 shadow-md rounded-lg bg-white">
            <h2 className="text-lg font-semibold mb-4 inline-flex place-items-center gap-x-3">
              <img
                src={reccommend}
                alt="reccommend logo"
                className="w-10 h-10"
              />
              Recommended Courses
            </h2>
            <ul className="space-y-4">
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-gradient-to-r from-[#002761] to-[#5E0076] hover:from-purple-800 text-white justify-between"
                  onClick={() => navigate("/learning")}
                >
                  <span className="inline-flex place-items-center gap-x-3">
                    <img src={food} alt="food logo" className="h-10 w-10" />
                    Unit 1 (Foods)
                  </span>
                  <p className="text-md font-bold">40 points</p>
                </Button>
              </li>
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-gradient-to-r from-[#002761] to-[#5E0076] hover:from-purple-800  opacity-80 text-white justify-between"
                  onClick={() => navigate("/learning")}
                >
                  <span className="inline-flex place-items-center gap-x-3">
                    <img src={food} alt="food logo" className="h-10 w-10" />
                    Unit 2 (Foods)
                  </span>
                  <p className="text-md font-bold">35 points</p>
                </Button>
              </li>
              <li className="flex justify-between">
                <Button
                  className="w-[100%] py-7 bg-gradient-to-r from-[#002761] to-[#5E0076] hover:from-purple-800 opacity-60 text-white justify-between"
                  onClick={() => navigate("/learning")}
                >
                  <span className="inline-flex place-items-center gap-x-3">
                    <img src={food} alt="food logo" className="h-10 w-10" />
                    Unit 3 (Foods)
                  </span>
                  <p className="text-md font-bold">35 points</p>
                </Button>
              </li>
            </ul>
          </Card>
        </div>
      </div>

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
