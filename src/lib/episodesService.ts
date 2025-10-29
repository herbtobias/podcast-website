import { supabase } from './supabase';
import { PodcastEpisode } from '../types';

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
