import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { latestEpisode } from '../data/content';

export default function EpisodeCard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (!heroSection) return;

      const heroRect = heroSection.getBoundingClientRect();
      const heroBottom = heroRect.bottom;

      setVisible(heroBottom <= 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-20 right-4 md:right-8 z-40 pointer-events-auto transform transition-all duration-300 ease-in-out ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="relative w-64 sm:w-72 rounded-2xl border border-white/10 bg-page-bg/95 backdrop-blur-md p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <img
            src={latestEpisode.coverImage}
            alt={`Cover der Episode: ${latestEpisode.title}`}
            className="h-12 w-12 rounded-lg object-cover ring-1 ring-white/10"
          />
          <div className="min-w-0">
            <div className="text-sm font-medium text-white/90 truncate">
              Neu: {latestEpisode.title}
            </div>
            <div className="text-xs text-slate-400">
              Folge {latestEpisode.episode} · {latestEpisode.durationMinutes} Min
            </div>
          </div>
          <button className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-slate-900 shadow-[0_0_0_1px_rgba(34,211,238,0.4)] hover:bg-cyan-400 transition-colors">
            <Play className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex items-end gap-1">
          {[4, 6, 3, 5, 7, 5, 4, 6].map((height, index) => (
            <div
              key={index}
              className={`h-${height} w-1 rounded bg-cyan-400/80 animate-pulse`}
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
