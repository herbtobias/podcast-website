import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GalaxyBackground from '../components/GalaxyBackground';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { user, isAdmin, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg text-white">
        <GalaxyBackground />
        <div className="relative flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
          <p className="text-slate-400">Wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-bg text-white">
      <GalaxyBackground />
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              Admin Login
            </h1>
            <p className="text-slate-400">
              Melde dich mit deinem Google-Konto an, um auf den Admin-Bereich zuzugreifen.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-sm p-8">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-slate-900 font-medium hover:bg-slate-100 transition-colors shadow-lg"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Mit Google anmelden
            </button>

            <p className="mt-6 text-sm text-slate-400 text-center">
              Nur autorisierte Administratoren haben Zugriff auf diesen Bereich.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
