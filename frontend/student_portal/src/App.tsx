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
import useAuthStore from './store/authStore';
import ChatInterface from './pages/chat';
import NewLearningHome from './pages/unitOverview';
import EnhancedLearningHomePage from './pages/learningHome';
import { AnimatePresence } from 'framer-motion';
import LessonContentMaker from './pages/build/lessonBuilder';
import LessonDisplay from './pages/build/lessonDisplay';
import CrosswordPuzzleViewer from './pages/build/crosswordExerciseViewer';
import MCQBuilder from './pages/build/mcqBuilder';
import MCQViewer from './pages/build/mcqViewer';
import ContentContainer from './components/ContentContainerRaw';
import TextWithInputBuilder from './pages/build/twiBuilder';
import TextWithInputViewer from './pages/build/twiViewer';
import TextWithQuestionsBuilder from './pages/build/twqBuilder';
import TextWithQuestionsViewer from './pages/build/twqViewer';
import ImagesWithInputBuilder from './pages/build/iwiBuilder';
import ImagesWithInputViewer from './pages/build/iwiViewer';
import FillInTheBlanksBuilder from './pages/build/fibBuilder';
import FillInTheBlanksViewer from './pages/build/fibViewer';
import DragAndDropViewer from './pages/build/dndViewer';
import DragAndDropBuilder from './pages/build/dndBuilder';
import CrosswordPuzzleBuilder from './pages/build/crosswordBuilder';
import BuilderDashboard from './pages/build/builderDashboard';
import UploadImage from './pages/build/uploadImage';
import LearningPreference from './pages/preferences';

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
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/teacheraccess" element={<TeacheraccessPage />} />
          <Route path="/teacherdashboard" element={<TeacherDashboard />} />
          <Route path="/StudentGuidance" element={<StudentGuide />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/gameintro" element={<LandingPage />} />
          <Route path="/learningCode" element={<LearningCodePage />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/learning/:unitId/:contentId/:classroomId" element={<EnhancedLearningHomePage />} />
          <Route path="/learningModule/:id/:classroomId" element={<NewLearningHome />} />
          <Route path="*" element={<div>Not Found</div>} />
          <Route path="/lessonBuilder" element={<LessonContentMaker />} />
          <Route path='/lessonDisplay' element={<LessonDisplay />} />
          <Route path="/setPreferences" element={<LearningPreference />} />
          <Route path="/mcqBuilder" element={<MCQBuilder />} />
          <Route path="/mcqDisplay" element={<ContentContainer><MCQViewer /></ContentContainer>} />
          <Route path="/twiBuilder" element={<TextWithInputBuilder />} />
          <Route path="/twiDisplay" element={<ContentContainer><TextWithInputViewer /></ContentContainer>} />
          <Route path="/twqBuilder" element={<TextWithQuestionsBuilder />} />
          <Route path="/twqDisplay" element={<ContentContainer><TextWithQuestionsViewer /></ContentContainer>} />
          <Route path="/iwiBuilder" element={<ImagesWithInputBuilder />} />
          <Route path="/iwiDisplay" element={<ContentContainer><ImagesWithInputViewer /></ContentContainer>} />
          <Route path="/crosswordBuilder" element={<CrosswordPuzzleBuilder />} />
          <Route path="/crosswordDisplay" element={<ContentContainer><CrosswordPuzzleViewer /></ContentContainer>} />
          <Route path="/fibBuilder" element={<FillInTheBlanksBuilder />} />
          <Route path="/fibDisplay" element={<ContentContainer><FillInTheBlanksViewer /></ContentContainer>} />
          <Route path="/dndBuilder" element={<DragAndDropBuilder />} />
          <Route path="/dndDisplay" element={<ContentContainer><DragAndDropViewer /></ContentContainer>} />
          <Route path="/builder-dashboard" element={<BuilderDashboard />} />
          <Route path="/uploadImage" element={<UploadImage />} />
        </Routes>

      </Router>
    </AnimatePresence>
  );
};
export default App;
