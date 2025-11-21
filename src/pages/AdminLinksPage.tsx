import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import AdminNav from '../components/AdminNav';
import GalaxyBackground from '../components/GalaxyBackground';
import { getAllEpisodes, getEpisodeByNumber, saveEpisodeLink, deleteEpisodeLink } from '../lib/episodesService';
import { PodcastEpisode, EpisodeLink } from '../types';

export default function AdminLinksPage() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<string>('');
  const [links, setLinks] = useState<EpisodeLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: ''
  });

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
    const loadLinks = async () => {
      if (!selectedEpisode) {
        setLinks([]);
        return;
      }

      const episode = episodes.find(e => e.id === selectedEpisode);
      if (!episode) return;

      try {
        const episodeDetail = await getEpisodeByNumber(episode.episode);
        if (episodeDetail?.links) {
          setLinks(episodeDetail.links);
        } else {
          setLinks([]);
        }
      } catch (error) {
        console.error('Failed to load links:', error);
      }
    };

    loadLinks();
  }, [selectedEpisode, episodes]);

  const handleAddLink = async () => {
    if (!selectedEpisode || !newLink.title || !newLink.url) {
      setMessage({ type: 'error', text: 'Bitte fülle alle Pflichtfelder aus.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await saveEpisodeLink({
        episode_id: selectedEpisode,
        title: newLink.title,
        url: newLink.url,
        description: newLink.description,
        display_order: links.length
      });

      setMessage({ type: 'success', text: 'Link erfolgreich hinzugefügt!' });
      setNewLink({ title: '', url: '', description: '' });

      const episode = episodes.find(e => e.id === selectedEpisode);
      if (episode) {
        const episodeDetail = await getEpisodeByNumber(episode.episode);
        if (episodeDetail?.links) {
          setLinks(episodeDetail.links);
        }
      }
    } catch (error) {
      console.error('Failed to save link:', error);
      setMessage({ type: 'error', text: 'Fehler beim Speichern. Bitte versuche es erneut.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Möchtest du diesen Link wirklich löschen?')) return;

    try {
      await deleteEpisodeLink(linkId);
      setLinks(links.filter(link => link.id !== linkId));
      setMessage({ type: 'success', text: 'Link erfolgreich gelöscht!' });
    } catch (error) {
      console.error('Failed to delete link:', error);
      setMessage({ type: 'error', text: 'Fehler beim Löschen. Bitte versuche es erneut.' });
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
            Links verwalten
          </h1>
          <p className="text-slate-400">
            Füge weiterführende Links und Ressourcen für einzelne Episoden hinzu.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-8 mb-8">
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
                <h3 className="text-lg font-semibold mb-4">Neuen Link hinzufügen</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Titel *
                    </label>
                    <input
                      type="text"
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="z.B. Studie über KI und Kreativität"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      URL *
                    </label>
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Beschreibung (optional)
                    </label>
                    <textarea
                      value={newLink.description}
                      onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="Kurze Beschreibung des Links..."
                    />
                  </div>

                  {message && (
                    <div
                      className={`p-4 rounded-lg ${
                        message.type === 'success'
                          ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                          : 'bg-red-500/10 border border-red-500/30 text-red-400'
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <button
                    onClick={handleAddLink}
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
                        <Plus className="h-5 w-5" />
                        Link hinzufügen
                      </>
                    )}
                  </button>
                </div>
              </div>

              {links.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Vorhandene Links</h3>
                  <div className="space-y-3">
                    {links.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-start gap-4 p-4 rounded-lg border border-white/10 bg-slate-900/60"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white mb-1">{link.title}</div>
                          <div className="text-sm text-cyan-400 mb-1 truncate">{link.url}</div>
                          {link.description && (
                            <div className="text-sm text-slate-400">{link.description}</div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="flex-shrink-0 p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
