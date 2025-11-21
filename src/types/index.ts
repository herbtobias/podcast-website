export interface PodcastEpisode {
  id: string;
  title: string;
  episode: number;
  duration: string;
  durationMinutes: number;
  description: string;
  publishedDate: string;
  audioUrl: string;
  coverImage: string;
  episodeUrl?: string;
}

export interface PodcastHost {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface PlatformLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
}

export interface NewsletterSubscription {
  id?: string;
  email: string;
  created_at?: string;
}

export interface EpisodeTranscription {
  id: string;
  episode_id: string;
  transcription_text: string;
  created_at: string;
  updated_at: string;
}

export interface EpisodeLink {
  id: string;
  episode_id: string;
  title: string;
  url: string;
  description: string;
  display_order: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  created_by?: string;
}

export interface EpisodeDetail extends PodcastEpisode {
  transcription?: EpisodeTranscription;
  links: EpisodeLink[];
}
