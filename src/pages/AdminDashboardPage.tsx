import { Link } from 'react-router-dom';
import { FileText, Link as LinkIcon, Podcast } from 'lucide-react';
import AdminNav from '../components/AdminNav';
import GalaxyBackground from '../components/GalaxyBackground';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-page-bg text-white">
      <GalaxyBackground />
      <AdminNav />

      <div className="relative mx-auto max-w-7xl px-6 md:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">
            Verwalte Podcast-Episoden, Transkripte und weiterführende Links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/transcriptions"
            className="group rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-8 hover:border-cyan-400/50 hover:bg-slate-900/60 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-400/30 group-hover:ring-cyan-300/60 transition">
                <FileText className="h-6 w-6 text-cyan-300" />
              </div>
              <h2 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Transkripte
              </h2>
            </div>
            <p className="text-slate-400">
              Füge Transkriptionen für Podcast-Episoden hinzu oder bearbeite sie für besseres SEO.
            </p>
          </Link>

          <Link
            to="/admin/links"
            className="group rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-8 hover:border-cyan-400/50 hover:bg-slate-900/60 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-400/30 group-hover:ring-cyan-300/60 transition">
                <LinkIcon className="h-6 w-6 text-cyan-300" />
              </div>
              <h2 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Links
              </h2>
            </div>
            <p className="text-slate-400">
              Verwalte weiterführende Links und Ressourcen für jede Episode.
            </p>
          </Link>

          <Link
            to="/episoden"
            className="group rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-8 hover:border-cyan-400/50 hover:bg-slate-900/60 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-400/30 group-hover:ring-cyan-300/60 transition">
                <Podcast className="h-6 w-6 text-cyan-300" />
              </div>
              <h2 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Alle Episoden
              </h2>
            </div>
            <p className="text-slate-400">
              Sieh dir alle veröffentlichten Podcast-Episoden an.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
