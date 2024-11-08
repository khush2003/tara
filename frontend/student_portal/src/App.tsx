// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import ProfilePage from './pages/profile';
import GamePage from './pages/game';
import HelpPage from './pages/help';
import RegisterPage from './pages/register';
import OnboardingPage from './pages/onboarding';
import TeacherDashboard from './pages/teacher/teacherdashboard';
import TeacheraccessPage from './pages/teacher/teacheraccess';
import StudentGuide from './pages/guidance';
import SettingsPage from './pages/studentsetting';
import LandingPage from './pages/games/landingpage';
import LearningCodePage from './pages/classCode';
import Exercise1_0001 from './pages/exercises/exercise1_0001';
import Exercise1_0002 from './pages/exercises/exercise1_0002';
import Exercise1_0003 from './pages/exercises/exercise1_0003';
import useAuthStore from './store/authStore';
import ChatInterface from './pages/chat';
import NewLearningHome from './pages/learningModule';
import EnhancedLearningHomePage from './pages/learningHome';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const autoLogin = useAuthStore((state) => state.autoLogin);
  useEffect(() => {
    autoLogin();
  }, [autoLogin]);


  return (
    <AnimatePresence mode="wait">
      <Router>
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<div>Not Found</div>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} /> 
          
          <Route path="/exercise" element={<Exercise1_0001 />} />
          <Route path="/exercise2" element={<Exercise1_0002 />} />
          <Route path="/exercise3" element={<Exercise1_0003 />} />
          <Route path="/teacheraccess" element={<TeacheraccessPage />} />
          <Route path="/teacherdashboard" element={<TeacherDashboard />} />
          <Route path="/StudentGuidance" element={<StudentGuide />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/gameintro" element={<LandingPage />} />
          <Route path="/learningCode" element={<LearningCodePage />} />
          <Route path="/exercise" element={<Exercise1_0001 />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/learning/:id" element={<EnhancedLearningHomePage />} />
          <Route path="/learningModule/:id" element={<NewLearningHome />} />
        </Routes>
      </Router>
    </AnimatePresence>
  );
};
export default App;
