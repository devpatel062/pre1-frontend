import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AssessmentPage from './pages/AssessmentPage';
import ResultPage from './pages/ResultPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute roles={['student']} />}>
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/result/:attemptId" element={<ResultPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['admin', 'superuser']} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
