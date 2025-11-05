import { useState } from 'react';
import { syncRSSFeed, SyncResult } from '../lib/episodesService';

export default function SyncEpisodesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const syncResult = await syncRSSFeed();
      setResult(syncResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sync');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">RSS Feed Sync</h1>

        <div className="bg-gray-900 rounded-lg p-8">
          <p className="text-gray-300 mb-6">
            Trigger a manual sync of the RSS feed to import new episodes into the database.
          </p>

          <button
            onClick={handleSync}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {loading ? 'Syncing...' : 'Sync Now'}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
              <h2 className="text-xl font-semibold text-green-400 mb-2">Sync Successful</h2>
              <p className="text-gray-300 mb-3">{result.message}</p>
              <div className="space-y-1 text-sm text-gray-400">
                <p>Episodes Added: {result.details.episodesAdded}</p>
                <p>Episodes Updated: {result.details.episodesUpdated}</p>
                <p>Episodes Total: {result.details.episodesTotal}</p>
                {result.details.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-yellow-400">Errors:</p>
                    <ul className="list-disc list-inside">
                      {result.details.errors.map((err, idx) => (
                        <li key={idx} className="text-yellow-300">{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
              <h2 className="text-xl font-semibold text-red-400 mb-2">Sync Failed</h2>
              <p className="text-gray-300">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
