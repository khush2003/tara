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
import Learning001 from './pages/lessons/learning';
import TeacherDashboard from './pages/teacher/teacherdashboard';
import TeacheraccessPage from './pages/teacher/teacheraccess';
import StudentGuide from './pages/guidance';
import SettingsPage from './pages/studentsetting';
import LandingPage from './pages/games/landingpage';
import LearningCodePage from './pages/learningCode';
import ExercisePage from './pages/excercises/exercise';
import ExercisePage2 from './pages/excercises/exercise2';
import ExercisePage3 from './pages/excercises/exercise3';
import useAuthStore from './store/authStore';
import LearningContentPage from './pages/learningHome';

const App: React.FC = () => {
  const autoLogin = useAuthStore((state) => state.autoLogin);
  useEffect(() => {
    autoLogin();
  }, [autoLogin]);


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
        <Route path="/learning/:id" element={<LearningContentPage />} />
        <Route path="/exercise" element={<ExercisePage />} />
        <Route path="/exercise2" element={<ExercisePage2 />} />
        <Route path="/exercise3" element={<ExercisePage3 />} />
        <Route path="/teacheraccess" element={<TeacheraccessPage />} />
        <Route path="/teacherdashboard" element={<TeacherDashboard />} />
        <Route path="/StudentGuidance" element={<StudentGuide />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/gameintro" element={<LandingPage />} />
        <Route path="/learningCode" element={<LearningCodePage />} />
        <Route path="/exercise" element={<ExercisePage />} />
      </Routes>
    </Router>
  );
};
export default App;
