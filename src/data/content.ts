import { PodcastEpisode, PodcastHost, Topic, PlatformLink } from '../types';
import profilePicture from './profil_picture_th.jpg';
import profilePicturePG from './profil_picture_pg.jpg';

export const latestEpisode: PodcastEpisode = {
  id: '7',
  title: 'Quantenrauschen',
  episode: 7,
  duration: '54:00',
  durationMinutes: 54,
  description: 'In dieser Folge sprechen wir über die unerwarteten Überschneidungen von generativer KI und moderner Physik — von Transformer-Analogien bis zu Quantenrauschen. Kuratierte Links und Paper im Episoden-Notizbuch.',
  publishedDate: 'Heute',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  coverImage: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=600&auto=format&fit=crop'
};

export const hosts: PodcastHost[] = [
  {
    id: '1',
    name: 'Tobias',
    role: 'Der analytische Vordenker und technologiebegeisterte Co-Host',
    bio: 'Tobias ist der Co-Host mit einem Gespür für zukünftige Trends, der die Diskussionen mit Einblicken in agile KI-Entwicklung, gesellschaftliche Dynamiken und zeitgenössische Philosophie bereichert.',
    image: profilePicture
  },
  {
    id: '2',
    name: 'Patrick',
    role: 'Der strukturierte Rebell und Macher mit pragmatischem Weitblick',
    bio: 'Patrick ist der Co-Host, der Klartext spricht.  mit einem Händchen für Struktur und einem Herzen für Freiheit bringt er Praxis, Humor und Haltung zusammen. Er navigiert durch Themen wie KI, Gesellschaft, Effizienz und Wandel – immer mit dem Blick dafür, was wirklich funktioniert. Zwischen Chaos und Klarheit ist Patrick derjenige, der den roten Faden findet und Fragen stellt, die andere lieber vermeiden.',
    image: profilePicturePG
  }
];

export const topics: Topic[] = [
  {
    id: '1',
    title: 'KI & Kreativität',
    description: 'Von Prompt-Poesie bis zu neuartigen Entwurfsprozessen: Wo Maschinen Inspiration finden — und wir Grenzen verschieben.',
    icon: 'sparkles',
    tags: ['generative-modelle', 'multimodal']
  },
  {
    id: '2',
    title: 'Nachhaltige Tech-Wetten',
    description: 'Infrastruktur, die bleibt: Effizienz, Energie und die Kunst, langfristig richtig zu wetten.',
    icon: 'leaf',
    tags: ['effizienz', 'infra', 'klima']
  },
  {
    id: '3',
    title: 'Die Zukunft des Körpers',
    description: 'Neuro-Interfaces, Biohacking und Langlebigkeit — der Körper als erweiterbare Plattform.',
    icon: 'activity',
    tags: ['neuro', 'bio', 'sensorik']
  }
];

export const platforms: PlatformLink[] = [
  {
    id: 'spotify',
    name: 'Spotify',
    url: 'https://open.spotify.com/show/6tfL44Ad4WixIzLO2DBek8',
    icon: 'radio',
    description: 'Streamen & Folgen'
  },
  {
    id: 'apple',
    name: 'Apple Podcasts',
    url: 'https://podcasts.apple.com',
    icon: 'podcast',
    description: 'Abonnieren'
  },
  {
    id: 'google',
    name: 'Google Podcasts',
    url: 'https://podcasts.google.com',
    icon: 'waves',
    description: 'Entdecken'
  },
  {
    id: 'amazon',
    name: 'Amazon Music',
    url: 'https://music.amazon.com',
    icon: 'music',
    description: 'Anhören'
  }
];

export const listenerAvatars = [
  'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=300&auto=format&fit=crop'
];