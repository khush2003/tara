// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import ProfilePage from './pages/profile';
import GamePage from './pages/game';
import HelpPage from './pages/help';
import RegisterPage from './pages/register';
import OnboardingPage from './pages/onboarding';
import LearningContentPage from './pages/learning';
import TeacherDashboard from './pages/teacher/teacherdashboard';
import TeacheraccessPage from './pages/teacher/teacheraccess';
import StudentGuide from './pages/guidance';
import SettingsPage from './pages/studentsetting';
import LandingPage from './pages/games/landingpage';

const App: React.FC = () => {
  return (
    <Router>
      {/* <NavBar /> Common navigation bar */}
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<div>Not Found</div>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/learning" element={<LearningContentPage />} />
        <Route path="/teacheraccress" element={<TeacheraccessPage />} />
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        <Route path="/StudentGuidance" element={<StudentGuide />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/gameintro" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};
export default App;
