import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Activity } from 'lucide-react';
import AdminNav from '../components/AdminNav';
import {
  getAnalyticsStats,
  getPopularPages,
  getEventSummary,
  getRecentEvents,
  AnalyticsStats,
  PopularPage,
  EventSummary,
  RecentEvent,
} from '../lib/analyticsService';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(7);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [popularPages, setPopularPages] = useState<PopularPage[]>([]);
  const [eventSummary, setEventSummary] = useState<EventSummary[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [statsData, pagesData, eventsData, recentData] = await Promise.all([
        getAnalyticsStats(timeRange),
        getPopularPages(timeRange),
        getEventSummary(timeRange),
        getRecentEvents(20),
      ]);

      setStats(statsData);
      setPopularPages(pagesData);
      setEventSummary(eventsData);
      setRecentEvents(recentData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-page-bg">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400">Übersicht über Website-Nutzung und Interaktionen</p>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTimeRange(7)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              timeRange === 7
                ? 'bg-cyan-500 text-slate-900'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Letzte 7 Tage
          </button>
          <button
            onClick={() => setTimeRange(30)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              timeRange === 30
                ? 'bg-cyan-500 text-slate-900'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Letzte 30 Tage
          </button>
          <button
            onClick={() => setTimeRange(90)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              timeRange === 90
                ? 'bg-cyan-500 text-slate-900'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Letzte 90 Tage
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <p className="text-slate-400 mt-4">Lade Analytics-Daten...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 text-sm font-medium">Sessions</h3>
                  <Users className="h-5 w-5 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats?.uniqueSessions || 0}</p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 text-sm font-medium">Seitenaufrufe</h3>
                  <Eye className="h-5 w-5 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats?.totalPageViews || 0}</p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 text-sm font-medium">Events</h3>
                  <Activity className="h-5 w-5 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-white">{stats?.totalEvents || 0}</p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 text-sm font-medium">Ø Seiten/Session</h3>
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {stats?.uniqueSessions
                    ? (stats.totalPageViews / stats.uniqueSessions).toFixed(1)
                    : '0'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-800 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  Beliebte Seiten
                </h3>
                <div className="space-y-3">
                  {popularPages.length === 0 ? (
                    <p className="text-slate-400 text-sm">Keine Daten verfügbar</p>
                  ) : (
                    popularPages.map((page, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-white/5"
                      >
                        <span className="text-slate-300 text-sm truncate flex-1 mr-4">
                          {page.page_path}
                        </span>
                        <span className="text-cyan-400 font-medium">{page.view_count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  Event-Zusammenfassung
                </h3>
                <div className="space-y-3">
                  {eventSummary.length === 0 ? (
                    <p className="text-slate-400 text-sm">Keine Daten verfügbar</p>
                  ) : (
                    eventSummary.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-white/5"
                      >
                        <span className="text-slate-300 text-sm">{event.event_type}</span>
                        <span className="text-cyan-400 font-medium">{event.event_count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Letzte Events</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                        Event-Typ
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                        Daten
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                        Zeitpunkt
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-slate-400">
                          Keine Events verfügbar
                        </td>
                      </tr>
                    ) : (
                      recentEvents.map((event) => (
                        <tr key={event.id} className="border-b border-white/5">
                          <td className="py-3 px-4 text-sm text-slate-300">
                            {event.event_type}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-400">
                            {event.event_data
                              ? JSON.stringify(event.event_data).substring(0, 50) + '...'
                              : '-'}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-400">
                            {formatDate(event.created_at)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
