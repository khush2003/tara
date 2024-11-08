import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import useAuthStore from './stores/authStore';
import { useEffect } from 'react';
import ClassCreationPage from './pages/ClassCreationPage';
import DashboardPage from './pages/DashboardPage';
import ClassDetailsPage from './pages/ClassDetailPage';
import StudentProgressDetails from './pages/StudentDetail';
import UserSettings from './pages/SettingsPage';


function App() {
  
  const autoLogin = useAuthStore((state) => state.autoLogin);
  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  return (
    <AnimatePresence mode="wait">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/createClass" element={<ClassCreationPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/classDetails/:id' element={<ClassDetailsPage />} />
          <Route path="/studentDetails/:studentId/:classId" element={<StudentProgressDetails />} />
          <Route path="*" element={<div>Not Found</div>} />
          <Route path="/settings" element={<UserSettings />} />
        </Routes>
      </Router>
    </AnimatePresence>
  )
}

export default App
