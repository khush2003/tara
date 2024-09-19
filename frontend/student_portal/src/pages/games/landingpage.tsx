import React from 'react';
import tara from '../../assets/tara.png';
import auth from '../../assets/auth.png';

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-blue-900 text-white font-sans">
      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-6">
        <img src={tara} alt="Logo" className="h-14" />

        <nav className="space-x-8 text-lg">
          <a href="#" className="hover:text-gray-400">TRICK</a>
          <a href="#" className="hover:text-gray-400">INSTRUCTION</a>
          <a href="#" className="hover:text-gray-400">HELP</a>
          <a href="/dashboard" className="hover:text-gray-400">BACK</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-center items-center px-6 py-12 md:py-24">
        {/* Left Section */}
        <div className="text-center md:text-left space-y-6 md:max-w-lg flex-1 md:ml-12"> {/* Added md:ml-12 for left margin */}
          <h1 className="text-6xl font-bold leading-tight">PLAY & COLLECT</h1>
          <p className="text-lg text-gray-300">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab totam dolore quae
            doloremque ex sed vel eius nihil, animi quia.
          </p>
          <button className="mt-6 bg-red-500 hover:bg-red-600 text-xl text-white font-bold py-4 px-10 rounded-full">
            START HERE
          </button>
        </div>

        {/* Right Section */}
        <div className="mt-12 md:mt-0 flex-1 flex justify-center">
          <img src={auth} alt="Illustration" className="w-full md:w-[400px] lg:w-[500px]" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
