import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React from 'react';
import owl from '../assets/owl.png';
import { Progress } from '@/components/ui/progress';

const DashboardPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen p-6 bg-gray-100">
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
        <Button className="text-sm">Logout</Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <Card className="p-6 shadow-md rounded-lg bg-white">
        <h2 className="text-lg font-semibold mb-4">Today's Lesson</h2>
          <ul className="space-y-2">
            {/* Replace static values with dynamic data */}
            <li className="flex justify-between">
              <Button className='w-[100%] py-7 bg-blue-500 justify-between '> 
              <span>Unit 1</span>
              <Progress value={75} className="w-[60%]">75% Complete</Progress>
              </Button>
            </li>
            </ul>
            <div className='pt-8' />
          <h2 className="text-lg font-semibold mb-4">Learning Progress</h2>
          <ul className="space-y-2">
            {/* Replace static values with dynamic data */}
            <li className="flex justify-between">
              <Button className='w-[100%] py-7 bg-blue-500 justify-between '> 
              <span>Unit 1</span>
              <Progress value={75} className="w-[60%]">75% Complete</Progress>
              </Button>
            </li>
            <li className="flex justify-between">
            <Button className='w-[100%] py-7 bg-blue-300 justify-between '> 
              <span>Unit 2</span>
              <Progress value={50} className="w-[60%]">50% Complete</Progress>
              </Button>
            </li>
            <li className="flex justify-between">
            <Button className='w-[100%] py-7 bg-blue-300 justify-between '> 
              <span>Unit 3</span>
              <Progress value={30} className="w-[60%]">30% Complete</Progress>
              </Button>
            </li>
          </ul>
        </Card>
        

        {/* Points Tracker */}
        <Card className="p-6 shadow-md rounded-lg bg-white flex flex-col justify-between items-start">
          <div className='flex flex-col w-full space-y-4'>
          <h2 className="text-lg font-semibold">Game Points</h2>
          <p className="text-2xl font-bold">150 Coins</p> {/* Replace with dynamic points */}
          <div></div>
          <h2 className="text-lg font-semibold mb-4">Total Playtime Remaining</h2>
          <div className='w-full py-1 flex  justify-between '> 
              <span>5 mins</span>
              <Progress value={90} className="w-[60%]">30% Complete</Progress>
              </div>
          </div>
          <Button className="text-lg p-4">Go to Game</Button>
        </Card>
        <Card className="p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Recommended Courses</h2>
          <ul className="space-y-2">
            {/* Replace static values with dynamic data */}
            <li className="flex justify-between">
              <Button className='w-[100%] py-7 bg-gradient-to-tr from-purple-400 via-purple-700 to-purple-900  justify-between '> 
              <span>Unit 1</span>
              <p className='text-md '><b>40 points</b></p>
              </Button>
            </li>
            <li className="flex justify-between">
              <Button className='w-[100%] py-7 bg-gradient-to-tr from-purple-400 via-purple-700 to-purple-900  justify-between '> 
              <span>Unit 2</span>
              <p className='text-md '><b>35 points</b></p>
              </Button>
            </li>
          </ul>
        </Card>
        {/* Interactive Learning Resources */}
        <Card className="p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Learning Resources</h2>
          <div className="flex flex-wrap space-x-2">
            <Button className="w-40 h-12">Exercises</Button>
            <Button className="w-40 h-12">Review Units</Button>
          </div>
        </Card>
        

        
    

      <Card className="p-6 shadow-md rounded-lg bg-white">
        <h2 className="text-lg font-semibold mb-4">Actions</h2>
        <div className="flex flex-col space-y-4">
          <Button>Edit Profile</Button>
          <Button>Change Name</Button>
          <Button>Settings</Button>
        </div>
      </Card>
      
     {/* Announcements and Notifications */}
     <Card className="p-6 shadow-md rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-4">Announcements</h2>
          <ul className="space-y-2">
            {/* Replace with dynamic announcements */}
            <li className="text-sm">New exercise available in Unit 2.</li>
            <li className="text-sm">Reminder: Project submission due next week.</li>
          </ul>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex mt-8 justify-center space-x-6">
        
  
      </div>

      {/* Profile Actions */}
      
    </div>
  );
};


export default DashboardPage;

//Old Code
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import React from 'react';

// const DashboardPage: React.FC = () => {
//   return (
//     <div className="w-full h-screen flex items-center justify-center">
//       <div className="flex flex-col items-center space-y-10">
//         <h1 className="text-4xl font-bold">Dashboard</h1>
//         <div className="flex flex-wrap justify-center space-x-4">
//           <Button className="w-40 h-12">Course 1</Button>
//           <Button className="w-40 h-12">Course 2</Button>
//           <Button className="w-40 h-12">Course 3</Button>
//           <Button className="w-40 h-12">Course 4</Button>
//         </div>
//         <div className="flex space-x-4">
//           <Button className="text-2xl p-4">Game</Button>
//           <Button className="text-2xl p-4">Settings</Button>
//         </div>
//         <Card className="p-6 shadow-lg rounded-lg bg-white">
//           <div className="flex flex-col space-y-4">
//             <Button>Edit Profile</Button>
//             <Button>Login</Button>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
