import { Play, Clock } from 'lucide-react';
import { PodcastEpisode } from '../types';

interface EpisodeListCardProps {
  episode: PodcastEpisode;
  onPlay?: (episode: PodcastEpisode) => void;
}

export default function EpisodeListCard({ episode, onPlay }: EpisodeListCardProps) {
  const handlePlayClick = () => {
    if (onPlay) {
      onPlay(episode);
    }
  };

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-5 transition-all duration-300 hover:border-cyan-500/30 hover:bg-slate-900/60 hover:shadow-lg hover:shadow-cyan-500/10">
      <div className="flex gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={episode.coverImage}
            alt={episode.title}
            className="h-24 w-24 rounded-lg object-cover ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105"
          />
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-label={`Play ${episode.title}`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-slate-900 shadow-lg transition-transform hover:scale-110">
              <Play className="h-5 w-5 fill-current" />
            </div>
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
              {episode.title}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
            <span className="flex items-center gap-1">
              S{episode.season}E{episode.episode}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {episode.durationMinutes} Min
            </span>
            <span>•</span>
            <span>{episode.publishedDate}</span>
          </div>

          <p className="text-sm text-slate-300/80 line-clamp-2 leading-relaxed">
            {episode.description}
          </p>
        </div>
      </div>
    </div>
  );
}
