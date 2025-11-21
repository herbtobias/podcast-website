import { Helmet } from 'react-helmet-async';
import { PodcastEpisode, EpisodeDetail } from '../types';

interface StructuredDataProps {
  type: 'website' | 'podcast' | 'episode';
  episode?: PodcastEpisode | EpisodeDetail;
}

export default function StructuredData({ type, episode }: StructuredDataProps) {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Zukunft ist relativ",
    "url": siteUrl,
    "description": "Der Podcast über das neue KI-Zeitalter, Identität und die Pfade des Fortschritts.",
    "inLanguage": "de-DE",
    "publisher": {
      "@type": "Organization",
      "name": "Zukunft ist relativ",
      "url": siteUrl
    }
  };

  const podcastSchema = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "name": "Zukunft ist relativ",
    "description": "Der Podcast über das neue KI-Zeitalter, Identität und die Pfade des Fortschritts. Tobias und Patrick erkunden KI & Kreativität, nachhaltige Tech-Wetten und die Zukunft des Körpers.",
    "url": siteUrl,
    "inLanguage": "de-DE",
    "genre": ["Technology", "Science", "Philosophy"],
    "keywords": "KI, Künstliche Intelligenz, Zukunft, Technologie, Innovation, Podcast",
    "author": [
      {
        "@type": "Person",
        "name": "Tobias",
        "description": "Der analytische Vordenker und technologiebegeisterte Co-Host"
      },
      {
        "@type": "Person",
        "name": "Patrick",
        "description": "Der strukturierte Rebell und Macher mit pragmatischem Weitblick"
      }
    ],
    "webFeed": `${siteUrl}/feed.xml`
  };

  const episodeSchema = episode ? {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    "url": `${siteUrl}/episoden`,
    "name": episode.title,
    "description": episode.description,
    "episodeNumber": episode.episode,
    "datePublished": episode.publishedDate,
    "duration": `PT${episode.durationMinutes}M`,
    "associatedMedia": {
      "@type": "MediaObject",
      "contentUrl": episode.audioUrl,
      "duration": `PT${episode.durationMinutes}M`
    },
    "partOfSeries": {
      "@type": "PodcastSeries",
      "name": "Zukunft ist relativ",
      "url": siteUrl
    },
    "image": episode.coverImage
  } : null;

  let schema;
  if (type === 'episode' && episodeSchema) {
    schema = episodeSchema;
  } else if (type === 'podcast') {
    schema = podcastSchema;
  } else {
    schema = websiteSchema;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
