import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewResumePage } from './pages/NewResumePage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';
import { CoverLetterGeneratorPage } from './pages/CoverLetterGeneratorPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { LandingPage } from './pages/LandingPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Open Sign In page as default landing if not logged in */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />}
          />

          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/product" element={<LandingPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume/new"
            element={
              <ProtectedRoute>
                <NewResumePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analysis/:id"
            element={
              <ProtectedRoute>
                <AnalysisDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cover-letter/new"
            element={
              <ProtectedRoute>
                <CoverLetterGeneratorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
