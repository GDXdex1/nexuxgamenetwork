'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useRouter } from 'next/navigation';
import { Database, RefreshCcw, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import DatabaseStatus from '@/components/DatabaseStatus';
import NetworkBadge from '@/components/NetworkBadge';
import { WALLETS } from '@/config/suiConfig';

export default function AdminPage() {
  const account = useCurrentAccount();
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'initialized' | 'empty' | 'error'>('checking');

  // Check if user is admin
  const isAdmin = account?.address === WALLETS.PUBLISHER || account?.address === WALLETS.COMMISSION;

  const handleInitializeDatabase = async () => {
    setIsInitializing(true);
    try {
      const response = await fetch('/api/db/init', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Database initialized successfully!', {
          description: `Inserted ${data.counts.elementalJablixes} elementals and ${data.counts.specialJablixes} specials`,
        });
        setDbStatus('initialized');
      } else {
        toast.error('Failed to initialize database', {
          description: data.error || 'Unknown error',
        });
        setDbStatus('error');
      }
    } catch (error: unknown) {
      console.error('Error initializing database:', error);
      toast.error('Failed to initialize database', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      setDbStatus('error');
    } finally {
      setIsInitializing(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4">
            🔒 Admin Access Required
          </h2>
          <p className="text-pink-200 mb-6">
            Please connect your wallet to access the admin panel.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
          >
            ← Back to Main
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-red-500/50 rounded-3xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-300 mb-4">
            ⛔ Access Denied
          </h2>
          <p className="text-red-200 mb-6">
            You don&apos;t have permission to access the admin panel.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            ← Back to Main
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-2">
              🛠️ Admin Dashboard
            </h1>
            <p className="text-lg text-pink-200">
              Jablix Arena Administration Panel
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            ← Back to Main
          </button>
        </div>

        {/* Network Badge Info */}
        <div className="mb-6 bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            <NetworkBadge size="large" />
            <div>
              <p className="text-white font-bold">Current Network</p>
              <p className="text-sm text-pink-300">
                All operations are performed on this network
              </p>
            </div>
          </div>
        </div>

        {/* Database Controls */}
        <div className="mb-6 bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-black text-white">Database Management</h2>
            </div>
          </div>

          <p className="text-pink-200 mb-6">
            Initialize the MongoDB database with all Jablix data (50 Elementals + 40 Specials)
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleInitializeDatabase}
              disabled={isInitializing}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2"
            >
              {isInitializing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Initializing Database...
                </>
              ) : (
                <>
                  <RefreshCcw className="w-5 h-5" />
                  Initialize / Refresh Database
                </>
              )}
            </button>
          </div>

          {dbStatus === 'initialized' && (
            <div className="mt-4 p-4 bg-green-500/20 border-2 border-green-500/50 rounded-xl">
              <p className="text-green-300 font-bold">
                ✅ Database initialized successfully!
              </p>
            </div>
          )}

          {dbStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-500/20 border-2 border-red-500/50 rounded-xl">
              <p className="text-red-300 font-bold">
                ❌ Database initialization failed. Check console for details.
              </p>
            </div>
          )}
        </div>

        {/* Database Status */}
        <DatabaseStatus />

        {/* Important Notes */}
        <div className="mt-6 bg-gradient-to-br from-orange-900/80 to-red-900/80 border-4 border-orange-500/50 rounded-3xl p-6">
          <h3 className="text-xl font-black text-orange-300 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Important Notes
          </h3>
          <ul className="space-y-2 text-orange-200">
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span>Database initialization can be run multiple times safely (upsert mode)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span>All Jablix metadata URLs are verified from the smart contract</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span>User data, battles, and marketplace listings are managed separately</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold">•</span>
              <span>MongoDB connection string is configured in environment variables</span>
            </li>
          </ul>
        </div>

        {/* Admin Info */}
        <div className="mt-6 bg-black/30 rounded-2xl p-4 border-2 border-pink-500/30">
          <p className="text-xs text-gray-400">
            Logged in as: <span className="text-pink-300 font-mono">{account.address}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Role: <span className="text-orange-300 font-bold">Administrator</span>
          </p>
        </div>
      </div>
    </div>
  );
}
