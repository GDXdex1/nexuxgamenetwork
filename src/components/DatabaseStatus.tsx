'use client';

import { useState, useEffect } from 'react';
import { Database, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface DatabaseStats {
  overview: {
    totalUsers: number;
    totalBattles: number;
    activeListings: number;
    totalJablixes: number;
    elementalJablixes: number;
    specialJablixes: number;
  };
}

export default function DatabaseStatus() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data.data);
          setError(null);
        } else {
          setError(data.error || 'Failed to fetch stats');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading database status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-400">
        <XCircle className="w-4 h-4" />
        <span>Database offline</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-pink-500/30 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-bold text-white">Database Status</h3>
        <CheckCircle2 className="w-5 h-5 text-green-400 ml-auto" />
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-blue-400">{stats.overview.totalUsers}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Total Battles</p>
            <p className="text-2xl font-bold text-red-400">{stats.overview.totalBattles}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Active Listings</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.overview.activeListings}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Elementals</p>
            <p className="text-2xl font-bold text-cyan-400">{stats.overview.elementalJablixes}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Specials</p>
            <p className="text-2xl font-bold text-purple-400">{stats.overview.specialJablixes}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Total Jablixes</p>
            <p className="text-2xl font-bold text-pink-400">{stats.overview.totalJablixes}</p>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-pink-500/30">
        <p className="text-xs text-gray-400 text-center">
          MongoDB connected and operational ✅
        </p>
      </div>
    </div>
  );
}
