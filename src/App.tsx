import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ToolsPage } from './pages/ToolsPage';
import { ResumeInputPage } from './pages/ResumeInputPage';
import { ResumeEditorPage } from './pages/ResumeEditorPage';
import { CVInputPage } from './pages/CVInputPage';
import { CVEditorPage } from './pages/CVEditorPage';
import { AnalysisDetailPage } from './pages/AnalysisDetailPage';
import { CoverLetterGeneratorPage } from './pages/CoverLetterGeneratorPage';
import { ApplicationKitPage } from './pages/ApplicationKitPage';
import { ApplicationKitDetailPage } from './pages/ApplicationKitDetailPage';
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

          {/* Tools Routes */}
          <Route
            path="/tools"
            element={
              <ProtectedRoute>
                <ToolsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tools/resume"
            element={
              <ProtectedRoute>
                <ResumeInputPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/resume/input"
            element={
              <ProtectedRoute>
                <ResumeInputPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/resume/editor"
            element={
              <ProtectedRoute>
                <ResumeEditorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tools/cv"
            element={
              <ProtectedRoute>
                <CVInputPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/cv/input"
            element={
              <ProtectedRoute>
                <CVInputPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/cv/editor"
            element={
              <ProtectedRoute>
                <CVEditorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tools/cover-letter"
            element={
              <ProtectedRoute>
                <CoverLetterGeneratorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools/cover-letter/input"
            element={
              <ProtectedRoute>
                <CoverLetterGeneratorPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume/new"
            element={
              <ProtectedRoute>
                <ResumeInputPage />
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

          {/* Application Kit Routes */}
          <Route
            path="/application-kit"
            element={
              <ProtectedRoute>
                <ApplicationKitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/application-kit/:id"
            element={
              <ProtectedRoute>
                <ApplicationKitDetailPage />
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
