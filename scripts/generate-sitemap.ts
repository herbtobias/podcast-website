import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface Episode {
  episode: number;
  published_date: string;
}

async function generateSitemap() {
  const { data: episodes, error } = await supabase
    .from('episodes')
    .select('episode, published_date')
    .eq('is_preview', false)
    .order('episode', { ascending: false });

  if (error) {
    console.error('Error fetching episodes:', error);
    process.exit(1);
  }

  const baseUrl = 'https://zukunft-ist-relativ.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticPages = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/episoden`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    }
  ];

  const episodePages = (episodes || []).map((episode: Episode) => ({
    loc: `${baseUrl}/episode/${episode.episode}`,
    lastmod: new Date(episode.published_date).toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.8'
  }));

  const allPages = [...staticPages, ...episodePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(page => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}

</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');

  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✓ Sitemap generated successfully with ${allPages.length} URLs`);
  console.log(`  - ${staticPages.length} static pages`);
  console.log(`  - ${episodePages.length} episode pages`);
}

generateSitemap().catch(console.error);
