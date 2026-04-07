import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import JobPostsPage from './pages/job-posts/JobPostsPage';
import JobPostDetailPage from './pages/job-posts/JobPostDetailPage';
import CreateJobPostPage from './pages/job-posts/CreateJobPostPage';
import ApplicationsPage from './pages/applications/ApplicationsPage';
import DormitoriesPage from './pages/dormitories/DormitoriesPage';
import DormitoryDetailPage from './pages/dormitories/DormitoryDetailPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-posts"
        element={
          <ProtectedRoute>
            <JobPostsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-posts/create"
        element={
          <ProtectedRoute>
            <CreateJobPostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-posts/:id"
        element={
          <ProtectedRoute>
            <JobPostDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <ApplicationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dormitories"
        element={
          <ProtectedRoute>
            <DormitoriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dormitories/:id"
        element={
          <ProtectedRoute>
            <DormitoryDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
