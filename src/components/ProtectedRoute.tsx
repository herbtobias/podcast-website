import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Authentifizierung wird überprüft...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center text-white">
        <div className="text-center max-w-md p-8">
          <h2 className="text-2xl font-bold mb-4">Zugriff verweigert</h2>
          <p className="text-slate-400 mb-6">
            Du hast keine Berechtigung, auf diesen Bereich zuzugreifen.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-lg bg-cyan-500 text-slate-900 font-medium hover:bg-cyan-400 transition-colors"
          >
            Zur Startseite
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
