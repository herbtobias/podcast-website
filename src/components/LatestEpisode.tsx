import { Clock, Calendar } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import { latestEpisode } from '../data/content';

export default function LatestEpisode() {
  return (
    <section id="episode" className="relative py-14 sm:py-16 md:py-20 border-b border-white/3">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Neueste Episode: {latestEpisode.title}
        </h2>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="col-span-2">
            <AudioPlayer
              audioUrl={latestEpisode.audioUrl}
              title={latestEpisode.title}
              season={latestEpisode.season}
              episode={latestEpisode.episode}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <div className="text-sm leading-relaxed text-slate-300">
              {latestEpisode.description}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-4 w-4" />
                {latestEpisode.durationMinutes} Minuten
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="h-4 w-4" />
                Veröffentlicht: {latestEpisode.publishedDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
