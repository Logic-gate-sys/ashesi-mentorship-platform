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
import AlumniDashboard from './pages/alumni/AlumniDashboard'
import AlumniRequests from './pages/alumni/AlumniRequests'
import AlumniMentees from './pages/alumni/AlumniMentees'
import AlumniMeetings from './pages/alumni/AlumniMeetings'
import AlumniFeedback from './pages/alumni/AlumniFeedback'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminConnections from './pages/admin/AdminConnections'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminIssues from './pages/admin/AdminIssues'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminSettings from './pages/admin/AdminSettings'
import AlumniProfile from './pages/alumni/AlumniProfile'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/alumni-dashboard" element={<AlumniDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/connections" element={<AdminConnections />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/issues" element={<AdminIssues />} />
                <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/alumni/requests" element={<AlumniRequests />} />
                <Route path="/alumni/mentees" element={<AlumniMentees />} />
                <Route path="/alumni/meetings" element={<AlumniMeetings />} />
                <Route path="/alumni/feedback" element={<AlumniFeedback />} />
                <Route path="/alumni/profile" element={<AlumniProfile />} />
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
