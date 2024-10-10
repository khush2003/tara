import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage';


function App() {
  

  return (
    <AnimatePresence mode="wait">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </Router>
    </AnimatePresence>
  )
}

export default App
