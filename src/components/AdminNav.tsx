import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, FileText, Link as LinkIcon, LayoutDashboard, BarChart3 } from 'lucide-react';

export default function AdminNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <nav className="border-b border-white/10 bg-slate-900/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              to="/admin"
              className="text-lg font-bold bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent"
            >
              Admin Panel
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/admin"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/admin/analytics"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <Link
                to="/admin/transcriptions"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <FileText className="h-4 w-4" />
                Transkripte
              </Link>
              <Link
                to="/admin/links"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <LinkIcon className="h-4 w-4" />
                Links
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="text-sm text-slate-400 hidden md:block">
                {user.email}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Abmelden</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
