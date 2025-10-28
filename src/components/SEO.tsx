import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  publishedTime?: string;
  author?: string;
}

export default function SEO({
  title = 'Zukunft ist relativ — dein neuer Podcast',
  description = 'Der Podcast über das neue KI-Zeitalter, Identität und die Pfade des Fortschritts. Tobias und Patrick erkunden KI, Kreativität, nachhaltige Technologie und die Zukunft des Körpers.',
  keywords = 'Podcast, KI, Künstliche Intelligenz, Zukunft, Technologie, Kreativität, Innovation, Wissenschaft, Philosophie, generative KI, Biohacking, Nachhaltigkeit',
  ogImage = 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
  ogType = 'website',
  canonicalUrl,
  publishedTime,
  author,
}: SEOProps) {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : siteUrl);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <link rel="canonical" href={currentUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Zukunft ist relativ" />
      <meta property="og:locale" content="de_DE" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}

      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
}
