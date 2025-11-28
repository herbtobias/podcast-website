import { useState, useEffect } from 'react';
import { Clock, Calendar, ArrowRight, Loader2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import AudioPlayer from './AudioPlayer';
import { getLatestEpisode } from '../lib/episodesService';
import { PodcastEpisode } from '../types';

export default function LatestEpisode() {
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestEpisode = async () => {
      try {
        const data = await getLatestEpisode();
        setEpisode(data);
      } catch (error) {
        console.error('Error fetching latest episode:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestEpisode();
  }, []);

  if (loading) {
    return (
      <section id="episode" className="relative py-14 sm:py-16 md:py-20 border-b border-white/5">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
        </div>
      </section>
    );
  }

  if (!episode) {
    return null;
  }

  return (
    <section id="episode" className="relative py-14 sm:py-16 md:py-20 border-b border-white/5">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Neueste Episode: {episode.title}
        </h2>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="col-span-2">
            <AudioPlayer
              audioUrl={episode.audioUrl}
              title={episode.title}
              episode={episode.episode}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <div className="text-sm leading-relaxed text-slate-300">
              {episode.description}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-4 w-4" />
                {episode.durationMinutes} Minuten
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="h-4 w-4" />
                Veröffentlicht: {episode.publishedDate}
              </div>
            </div>
            <div className="mt-6">
              <Link
                to={`/episoden/${episode.id}`}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500/10 text-cyan-300 font-medium hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
              >
                <FileText className="h-4 w-4" />
                Zum Transkript
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/episoden"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-900 font-medium hover:bg-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
          >
            Alle Episoden anzeigen
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
