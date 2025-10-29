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
