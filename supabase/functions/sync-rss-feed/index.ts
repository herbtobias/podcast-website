import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RSSItem {
  guid: string;
  title: string;
  description: string;
  pubDate: string;
  enclosureUrl: string;
  duration: string;
  coverImage?: string;
}

interface SyncResult {
  success: boolean;
  episodesAdded: number;
  episodesUpdated: number;
  episodesTotal: number;
  errors: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const rssFeedUrl = "https://anchor.fm/s/10b01ce38/podcast/rss";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const syncLogId = crypto.randomUUID();
    await supabase.from("rss_sync_log").insert({
      id: syncLogId,
      started_at: new Date().toISOString(),
      status: "running",
    });

    console.log("Fetching RSS feed from:", rssFeedUrl);
    const response = await fetch(rssFeedUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const episodes = await parseRSSFeed(xmlText);

    console.log(`Parsed ${episodes.length} episodes from RSS feed`);

    const result: SyncResult = {
      success: true,
      episodesAdded: 0,
      episodesUpdated: 0,
      episodesTotal: episodes.length,
      errors: [],
    };

    for (const episode of episodes) {
      try {
        const existingEpisode = await supabase
          .from("episodes")
          .select("id, guid")
          .eq("guid", episode.guid)
          .maybeSingle();

        const episodeData = {
          guid: episode.guid,
          title: episode.title,
          description: episode.description,
          audio_url: episode.enclosureUrl,
          published_date: new Date(episode.pubDate).toISOString(),
          duration: episode.duration,
          duration_minutes: parseDurationToMinutes(episode.duration),
          cover_image: episode.coverImage || "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=600&auto=format&fit=crop",
          season: extractSeasonNumber(episode.title),
          episode: extractEpisodeNumber(episode.title),
          rss_imported_at: new Date().toISOString(),
          is_preview: false,
        };

        if (existingEpisode.data) {
          const { error } = await supabase
            .from("episodes")
            .update(episodeData)
            .eq("id", existingEpisode.data.id);

          if (error) throw error;
          result.episodesUpdated++;
          console.log(`Updated episode: ${episode.title}`);
        } else {
          const { error } = await supabase
            .from("episodes")
            .insert(episodeData);

          if (error) throw error;
          result.episodesAdded++;
          console.log(`Added new episode: ${episode.title}`);
        }
      } catch (error) {
        const errorMsg = `Error processing episode "${episode.title}": ${error.message}`;
        console.error(errorMsg);
        result.errors.push(errorMsg);
      }
    }

    const finalStatus = result.errors.length > 0 && result.episodesAdded === 0 ? "failed" : 
                        result.errors.length > 0 ? "partial" : "success";

    await supabase
      .from("rss_sync_log")
      .update({
        completed_at: new Date().toISOString(),
        status: finalStatus,
        episodes_added: result.episodesAdded,
        episodes_updated: result.episodesUpdated,
        episodes_total: result.episodesTotal,
        error_message: result.errors.length > 0 ? result.errors.join("; ") : null,
      })
      .eq("id", syncLogId);

    return new Response(
      JSON.stringify({
        success: result.success,
        message: `Sync completed: ${result.episodesAdded} added, ${result.episodesUpdated} updated`,
        details: result,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Sync error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: error.stack,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function parseRSSFeed(xmlText: string): RSSItem[] {
  const items: RSSItem[] = [];
  
  const itemMatches = xmlText.matchAll(/<item[^>]*>([\s\S]*?)<\/item>/g);
  
  for (const match of itemMatches) {
    const itemXml = match[1];
    
    const guidMatch = itemXml.match(/<guid[^>]*>([^<]+)<\/guid>/);
    const titleMatch = itemXml.match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/) || 
                      itemXml.match(/<title>([^<]+)<\/title>/);
    const descriptionMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                           itemXml.match(/<description>([\s\S]*?)<\/description>/);
    const pubDateMatch = itemXml.match(/<pubDate>([^<]+)<\/pubDate>/);
    const enclosureMatch = itemXml.match(/<enclosure[^>]*url="([^"]+)"/);
    const durationMatch = itemXml.match(/<itunes:duration>([^<]+)<\/itunes:duration>/);
    const imageMatch = itemXml.match(/<itunes:image[^>]*href="([^"]+)"/);
    
    if (guidMatch && titleMatch && enclosureMatch) {
      items.push({
        guid: guidMatch[1],
        title: titleMatch[1],
        description: descriptionMatch ? stripHtmlTags(descriptionMatch[1]) : "",
        pubDate: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
        enclosureUrl: enclosureMatch[1],
        duration: durationMatch ? durationMatch[1] : "00:00",
        coverImage: imageMatch ? imageMatch[1] : undefined,
      });
    }
  }
  
  return items;
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseDurationToMinutes(duration: string): number {
  if (!duration || duration === "00:00") return 0;
  
  const parts = duration.split(":").map(p => parseInt(p, 10));
  
  if (parts.length === 3) {
    return parts[0] * 60 + parts[1] + Math.round(parts[2] / 60);
  } else if (parts.length === 2) {
    return parts[0] + Math.round(parts[1] / 60);
  } else if (parts.length === 1) {
    return Math.round(parts[0] / 60);
  }
  
  return 0;
}

function extractSeasonNumber(title: string): number {
  const seasonMatch = title.match(/S(\d+)E\d+/i) || title.match(/Season\s+(\d+)/i);
  return seasonMatch ? parseInt(seasonMatch[1], 10) : 1;
}

function extractEpisodeNumber(title: string): number {
  const episodeMatch = title.match(/S\d+E(\d+)/i) || 
                      title.match(/Episode\s+(\d+)/i) ||
                      title.match(/Ep\.?\s*(\d+)/i) ||
                      title.match(/#(\d+)/);
  
  return episodeMatch ? parseInt(episodeMatch[1], 10) : 0;
}