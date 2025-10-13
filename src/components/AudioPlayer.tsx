import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  season: number;
  episode: number;
}

export default function AudioPlayer({ audioUrl, title, season, episode }: AudioPlayerProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    seek,
    skipBackward,
    skipForward,
    changeVolume,
    formatTime
  } = useAudioPlayer(audioUrl);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const ratio = x / rect.width;
    if (isFinite(duration)) {
      seek(ratio * duration);
    }
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const ratio = x / rect.width;
    changeVolume(ratio);
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const volumePercentage = volume * 100;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlayPause}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-slate-900 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:ring-offset-0 shadow-[0_0_0_1px_rgba(34,211,238,0.4),0_10px_30px_rgba(34,211,238,0.25)] transition"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" strokeWidth={1.5} />
          ) : (
            <Play className="h-6 w-6" strokeWidth={1.5} />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-white/90 truncate">
              {title} — Staffel {season}, Folge {episode}
            </div>
            <div className="text-xs tabular-nums text-slate-400 ml-4 flex-none">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div
            onClick={handleProgressClick}
            className="mt-3 h-2 w-full rounded-full bg-white/10 cursor-pointer"
          >
            <div
              className="h-2 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.45)]"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-slate-300">
        <button
          onClick={() => skipBackward(15)}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 hover:border-cyan-400/50 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
        >
          <SkipBack className="h-4 w-4" />
          <span className="text-xs">-15s</span>
        </button>
        <button
          onClick={() => skipForward(30)}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 hover:border-cyan-400/50 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition"
        >
          <SkipForward className="h-4 w-4" />
          <span className="text-xs">+30s</span>
        </button>
        <div className="ml-auto inline-flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-slate-400" />
          <div
            onClick={handleVolumeClick}
            className="relative h-2 w-28 rounded-full bg-white/10 cursor-pointer"
          >
            <div
              className="h-2 rounded-full bg-cyan-400"
              style={{ width: `${volumePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
