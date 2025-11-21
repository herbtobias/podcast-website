import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import AdminNav from '../components/AdminNav';
import GalaxyBackground from '../components/GalaxyBackground';
import { getAllEpisodes, saveTranscription, getEpisodeByNumber } from '../lib/episodesService';
import { PodcastEpisode } from '../types';

export default function AdminTranscriptionsPage() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<string>('');
  const [transcriptionText, setTranscriptionText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const data = await getAllEpisodes();
        setEpisodes(data);
      } catch (error) {
        console.error('Failed to fetch episodes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  useEffect(() => {
    const loadTranscription = async () => {
      if (!selectedEpisode) {
        setTranscriptionText('');
        return;
      }

      const episode = episodes.find(e => e.id === selectedEpisode);
      if (!episode) return;

      try {
        const episodeDetail = await getEpisodeByNumber(episode.episode);
        if (episodeDetail?.transcription) {
          setTranscriptionText(episodeDetail.transcription.transcription_text);
        } else {
          setTranscriptionText('');
        }
      } catch (error) {
        console.error('Failed to load transcription:', error);
      }
    };

    loadTranscription();
  }, [selectedEpisode, episodes]);

  const handleSave = async () => {
    if (!selectedEpisode || !transcriptionText.trim()) {
      setMessage({ type: 'error', text: 'Bitte wähle eine Episode und gib einen Text ein.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await saveTranscription(selectedEpisode, transcriptionText);
      setMessage({ type: 'success', text: 'Transkript erfolgreich gespeichert!' });
    } catch (error) {
      console.error('Failed to save transcription:', error);
      setMessage({ type: 'error', text: 'Fehler beim Speichern. Bitte versuche es erneut.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg text-white">
        <GalaxyBackground />
        <AdminNav />
        <div className="relative flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-bg text-white">
      <GalaxyBackground />
      <AdminNav />

      <div className="relative mx-auto max-w-5xl px-6 md:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
            Transkripte verwalten
          </h1>
          <p className="text-slate-400">
            Füge Transkriptionen für einzelne Episoden hinzu oder bearbeite sie.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Episode auswählen
            </label>
            <select
              value={selectedEpisode}
              onChange={(e) => setSelectedEpisode(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="">-- Episode auswählen --</option>
              {episodes.map((episode) => (
                <option key={episode.id} value={episode.id}>
                  Episode {episode.episode}: {episode.title}
                </option>
              ))}
            </select>
          </div>

          {selectedEpisode && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Transkript
                </label>
                <textarea
                  value={transcriptionText}
                  onChange={(e) => setTranscriptionText(e.target.value)}
                  rows={20}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono text-sm"
                  placeholder="Füge hier das Transkript der Episode ein..."
                />
              </div>

              {message && (
                <div
                  className={`mb-4 p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-500 text-slate-900 font-medium hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Wird gespeichert...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Transkript speichern
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
