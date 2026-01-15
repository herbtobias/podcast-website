import { supabase } from './supabase';

export interface AnalyticsStats {
  totalSessions: number;
  totalPageViews: number;
  totalEvents: number;
  uniqueSessions: number;
}

export interface PopularPage {
  page_path: string;
  view_count: number;
}

export interface EventSummary {
  event_type: string;
  event_count: number;
}

export interface RecentEvent {
  id: string;
  event_type: string;
  event_data: any;
  created_at: string;
}

export async function getAnalyticsStats(days: number = 7): Promise<AnalyticsStats> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: sessions } = await supabase
    .from('analytics_sessions')
    .select('session_id')
    .gte('created_at', since.toISOString());

  const { data: pageViews } = await supabase
    .from('analytics_page_views')
    .select('id')
    .gte('created_at', since.toISOString());

  const { data: events } = await supabase
    .from('analytics_events')
    .select('id')
    .gte('created_at', since.toISOString());

  return {
    totalSessions: sessions?.length || 0,
    totalPageViews: pageViews?.length || 0,
    totalEvents: events?.length || 0,
    uniqueSessions: sessions?.length || 0,
  };
}

export async function getPopularPages(days: number = 7, limit: number = 10): Promise<PopularPage[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from('analytics_page_views')
    .select('page_path')
    .gte('created_at', since.toISOString());

  if (!data) return [];

  const pageCounts = data.reduce((acc: { [key: string]: number }, view) => {
    acc[view.page_path] = (acc[view.page_path] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(pageCounts)
    .map(([page_path, view_count]) => ({ page_path, view_count: view_count as number }))
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, limit);
}

export async function getEventSummary(days: number = 7): Promise<EventSummary[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from('analytics_events')
    .select('event_type')
    .gte('created_at', since.toISOString());

  if (!data) return [];

  const eventCounts = data.reduce((acc: { [key: string]: number }, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(eventCounts)
    .map(([event_type, event_count]) => ({ event_type, event_count: event_count as number }))
    .sort((a, b) => b.event_count - a.event_count);
}

export async function getRecentEvents(limit: number = 20): Promise<RecentEvent[]> {
  const { data, error } = await supabase
    .from('analytics_events')
    .select('id, event_type, event_data, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch recent events:', error);
    return [];
  }

  return data || [];
}
