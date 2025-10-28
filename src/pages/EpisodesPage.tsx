import { useEffect, useState } from 'react';
import { Search, X, Loader as Loader2 } from 'lucide-react';
import EpisodeListCard from '../components/EpisodeListCard';
import GalaxyBackground from '../components/GalaxyBackground';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';
import { PodcastEpisode } from '../types';
import { searchEpisodes } from '../lib/episodesService';
import { useDebounce } from '../hooks/useDebounce';

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchEpisodes(debouncedSearchTerm);
        setEpisodes(data);
      } catch (err) {
        console.error('Failed to fetch episodes:', err);
        setError('Fehler beim Laden der Episoden. Bitte versuche es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [debouncedSearchTerm]);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handlePlay = (episode: PodcastEpisode) => {
    console.log('Playing episode:', episode);
  };

  return (
    <>
      <SEO
        title="Alle Episoden — Zukunft ist relativ Podcast"
        description="Entdecke alle Folgen von 'Zukunft ist relativ' – der Podcast über KI, Technologie und Zukunft. Durchsuche Episoden zu KI & Kreativität, nachhaltige Tech-Wetten und die Zukunft des Körpers."
        keywords="Podcast Episoden, KI Podcast, alle Folgen, Zukunft ist relativ, Technologie Podcast Archiv"
        ogType="website"
      />
      <StructuredData type="website" />
      <div className="min-h-screen bg-page-bg text-white">
        <GalaxyBackground />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8 pt-32 pb-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
            Alle Episoden
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Entdecke alle Folgen von "Zukunft ist relativ" – sortiert nach Veröffentlichungsdatum
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Episoden durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-sm pl-12 pr-12 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                aria-label="Suche löschen"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {searchTerm && (
            <p className="mt-3 text-sm text-slate-400">
              {loading ? 'Suche...' : `${episodes.length} ${episodes.length === 1 ? 'Episode' : 'Episoden'} gefunden`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
            <p className="text-slate-400">Episoden werden geladen...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-lg bg-cyan-500 text-slate-900 font-medium hover:bg-cyan-400 transition-colors"
              >
                Erneut versuchen
              </button>
            </div>
          </div>
        ) : episodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              <Search className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Keine Episoden gefunden</h3>
              <p className="text-slate-400">
                {searchTerm
                  ? `Keine Ergebnisse für "${searchTerm}". Versuche es mit anderen Suchbegriffen.`
                  : 'Es sind noch keine Episoden verfügbar.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {episodes.map((episode) => (
              <EpisodeListCard
                key={episode.id}
                episode={episode}
                onPlay={handlePlay}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
