import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboard'
import StudentProfile from './pages/StudentProfile'
import FindMentor from './pages/FindMentor'
import MyRequests from './pages/MyRequests'
import Messages from './pages/Messages'
import Meetings from './pages/Meetings'
import Feedback from './pages/Feedback'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/profile" element={<StudentProfile />} />
                <Route path="/find-mentor" element={<FindMentor />} />
                <Route path="/requests" element={<MyRequests />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/meetings" element={<Meetings />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    )
}

export default App
