import { supabase } from './supabase';
import { PodcastEpisode, EpisodeDetail, EpisodeLink } from '../types';

export async function getAllEpisodes(): Promise<PodcastEpisode[]> {
  const { data, error } = await supabase
    .from('episodes')
    .select('*')
    .eq('is_preview', false)
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching episodes:', error);
    throw error;
  }

  return (data || []).map(episode => ({
    id: episode.id,
    title: episode.title,
    episode: episode.episode,
    duration: episode.duration,
    durationMinutes: episode.duration_minutes,
    description: episode.description,
    publishedDate: new Date(episode.published_date).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    audioUrl: episode.audio_url,
    coverImage: episode.cover_image,
    episodeUrl: episode.episode_url
  }));
}

export async function searchEpisodes(searchTerm: string): Promise<PodcastEpisode[]> {
  if (!searchTerm.trim()) {
    return getAllEpisodes();
  }

  const { data, error } = await supabase
    .from('episodes')
    .select('*')
    .eq('is_preview', false)
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error searching episodes:', error);
    throw error;
  }

  return (data || []).map(episode => ({
    id: episode.id,
    title: episode.title,
    episode: episode.episode,
    duration: episode.duration,
    durationMinutes: episode.duration_minutes,
    description: episode.description,
    publishedDate: new Date(episode.published_date).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    audioUrl: episode.audio_url,
    coverImage: episode.cover_image,
    episodeUrl: episode.episode_url
  }));
}

export async function getLatestEpisode(): Promise<PodcastEpisode | null> {
  const { data, error } = await supabase
    .from('episodes')
    .select('*')
    .eq('is_preview', false)
    .order('published_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching latest episode:', error);
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    episode: data.episode,
    duration: data.duration,
    durationMinutes: data.duration_minutes,
    description: data.description,
    publishedDate: new Date(data.published_date).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    audioUrl: data.audio_url,
    coverImage: data.cover_image,
    episodeUrl: data.episode_url
  };
}

export interface SyncResult {
  success: boolean;
  message: string;
  details: {
    episodesAdded: number;
    episodesUpdated: number;
    episodesTotal: number;
    errors: string[];
  };
}

export async function syncRSSFeed(): Promise<SyncResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const apiUrl = `${supabaseUrl}/functions/v1/sync-rss-feed`;

  const headers = {
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
  });

  if (!response.ok) {
    throw new Error(`Sync failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
}

export async function getEpisodeByNumber(episodeNumber: number): Promise<EpisodeDetail | null> {
  const { data: episodeData, error: episodeError } = await supabase
    .from('episodes')
    .select('*')
    .eq('episode', episodeNumber)
    .eq('is_preview', false)
    .maybeSingle();

  if (episodeError) {
    console.error('Error fetching episode:', episodeError);
    throw episodeError;
  }

  if (!episodeData) {
    return null;
  }

  const { data: transcriptionData } = await supabase
    .from('episode_transcriptions')
    .select('*')
    .eq('episode_id', episodeData.id)
    .maybeSingle();

  const { data: linksData } = await supabase
    .from('episode_links')
    .select('*')
    .eq('episode_id', episodeData.id)
    .order('display_order', { ascending: true });

  return {
    id: episodeData.id,
    title: episodeData.title,
    episode: episodeData.episode,
    duration: episodeData.duration,
    durationMinutes: episodeData.duration_minutes,
    description: episodeData.description,
    publishedDate: new Date(episodeData.published_date).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    audioUrl: episodeData.audio_url,
    coverImage: episodeData.cover_image,
    episodeUrl: episodeData.episode_url,
    transcription: transcriptionData || undefined,
    links: linksData || []
  };
}

export async function saveTranscription(episodeId: string, transcriptionText: string): Promise<void> {
  const { data: existing } = await supabase
    .from('episode_transcriptions')
    .select('id')
    .eq('episode_id', episodeId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('episode_transcriptions')
      .update({
        transcription_text: transcriptionText,
        updated_at: new Date().toISOString()
      })
      .eq('episode_id', episodeId);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('episode_transcriptions')
      .insert({
        episode_id: episodeId,
        transcription_text: transcriptionText
      });

    if (error) throw error;
  }
}

export async function saveEpisodeLink(link: Omit<EpisodeLink, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('episode_links')
    .insert(link);

  if (error) throw error;
}

export async function updateEpisodeLink(linkId: string, updates: Partial<EpisodeLink>): Promise<void> {
  const { error } = await supabase
    .from('episode_links')
    .update(updates)
    .eq('id', linkId);

  if (error) throw error;
}

export async function deleteEpisodeLink(linkId: string): Promise<void> {
  const { error } = await supabase
    .from('episode_links')
    .delete()
    .eq('id', linkId);

  if (error) throw error;
}
