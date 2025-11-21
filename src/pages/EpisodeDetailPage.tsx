import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { EpisodeDetail } from '../types';
import { getEpisodeByNumber } from '../lib/episodesService';
import AudioPlayer from '../components/AudioPlayer';
import PlatformLinks from '../components/PlatformLinks';
import GalaxyBackground from '../components/GalaxyBackground';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

export default function EpisodeDetailPage() {
  const { episodeNumber } = useParams<{ episodeNumber: string }>();
  const [episode, setEpisode] = useState<EpisodeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisode = async () => {
      if (!episodeNumber) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getEpisodeByNumber(parseInt(episodeNumber));
        if (!data) {
          setError('Episode nicht gefunden');
        } else {
          setEpisode(data);
        }
      } catch (err) {
        console.error('Failed to fetch episode:', err);
        setError('Fehler beim Laden der Episode. Bitte versuche es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [episodeNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg text-white">
        <GalaxyBackground />
        <div className="relative flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
          <p className="text-slate-400">Episode wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="min-h-screen bg-page-bg text-white">
        <GalaxyBackground />
        <div className="relative flex flex-col items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <p className="text-red-400 mb-4">{error || 'Episode nicht gefunden'}</p>
            <Link
              to="/episoden"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 text-slate-900 font-medium hover:bg-cyan-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zu allen Episoden
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Episode ${episode.episode}: ${episode.title} — Zukunft ist relativ`}
        description={episode.description}
        keywords={`Episode ${episode.episode}, ${episode.title}, Podcast Transkript, KI Podcast`}
        ogImage={episode.coverImage}
        ogType="article"
        publishedTime={episode.publishedDate}
      />
      <StructuredData type="episode" episode={episode} />

      <div className="min-h-screen bg-page-bg text-white">
        <GalaxyBackground />

        <div className="relative mx-auto w-full max-w-5xl px-6 md:px-8 pt-32 pb-20">
          <Link
            to="/episoden"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zu allen Episoden
          </Link>

          <div className="mb-8">
            <img
              src={episode.coverImage}
              alt={`Cover-Bild: ${episode.title}`}
              className="w-full max-w-md mx-auto rounded-2xl shadow-2xl ring-1 ring-white/10"
            />
          </div>

          <div className="text-center mb-8">
            <div className="text-cyan-400 font-medium mb-2">Episode {episode.episode}</div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              {episode.title}
            </h1>

            <div className="flex items-center justify-center gap-4 text-sm text-slate-400 mb-6">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {episode.durationMinutes} Min
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {episode.publishedDate}
              </span>
            </div>
          </div>

          <div className="mb-12">
            <AudioPlayer
              audioUrl={episode.audioUrl}
              title={episode.title}
              episode={episode.episode}
            />
          </div>

          <div className="mb-12">
            <PlatformLinks />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">Über diese Episode</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {episode.description}
            </p>
          </div>

          {episode.links && episode.links.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-white">Weiterführende Links</h2>
              <div className="space-y-4">
                {episode.links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-400/50 transition-all"
                  >
                    <ExternalLink className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                        {link.title}
                      </div>
                      {link.description && (
                        <div className="text-sm text-slate-400 mt-1">
                          {link.description}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {episode.transcription && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-8">
              <h2 className="text-2xl font-semibold mb-6 text-white">Transkript</h2>
              <div className="prose prose-invert prose-slate max-w-none">
                <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {episode.transcription.transcription_text}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
