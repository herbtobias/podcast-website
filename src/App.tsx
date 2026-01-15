import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import EpisodesPage from './pages/EpisodesPage';
import EpisodeDetailPage from './pages/EpisodeDetailPage';
import SyncEpisodesPage from './pages/SyncEpisodesPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminTranscriptionsPage from './pages/AdminTranscriptionsPage';
import AdminLinksPage from './pages/AdminLinksPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import ProtectedRoute from './components/ProtectedRoute';
import CookieConsent from './components/CookieConsent';
import { AuthProvider } from './contexts/AuthContext';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';

  useAnalytics();

  return (
    <AuthProvider>
      {!isAdminRoute && !isLoginRoute && <Navigation />}
      <CookieConsent />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/episoden" element={<EpisodesPage />} />
        <Route path="/episode/:episodeNumber" element={<EpisodeDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transcriptions"
          element={
            <ProtectedRoute>
              <AdminTranscriptionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/links"
          element={
            <ProtectedRoute>
              <AdminLinksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sync-episodes"
          element={
            <ProtectedRoute>
              <SyncEpisodesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <AdminAnalyticsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
