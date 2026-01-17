'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useUserGyms } from '@/hooks/useUserGyms';
import { Loader2, Plus, Trophy } from 'lucide-react';
import GymMinter from './GymMinter';
import GymInterface from './GymInterface';
import type { GymNFT } from '@/hooks/useUserGyms';

interface JablixGymNewProps {
  onBackToMain: () => void;
}

type ViewMode = 'list' | 'mint' | 'gym';

export default function JablixGymNew({ onBackToMain }: JablixGymNewProps) {
  const account = useCurrentAccount();
  const { gyms, loading, refetch, hasGyms } = useUserGyms();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedGym, setSelectedGym] = useState<GymNFT | null>(null);

  const handleGymMinted = () => {
    refetch();
    setViewMode('list');
  };

  const handleOpenGym = (gym: GymNFT) => {
    setSelectedGym(gym);
    setViewMode('gym');
  };

  const handleBackToList = () => {
    setSelectedGym(null);
    setViewMode('list');
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-8">
        <div className="max-w-md bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-pink-500/50 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4">
            🔒 Wallet Required
          </h2>
          <p className="text-pink-200 mb-6">
            Please connect your wallet to access the Gym.
          </p>
          <button
            onClick={onBackToMain}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
          >
            ← Back to Main
          </button>
        </div>
      </div>
    );
  }

  // Show gym interface if a gym is selected
  if (viewMode === 'gym' && selectedGym) {
    return <GymInterface gym={selectedGym} onBack={handleBackToList} />;
  }

  // Show minting interface
  if (viewMode === 'mint') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              🏟️ JABLIX GYM
            </h1>
            <button
              onClick={() => setViewMode('list')}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              ← Back
            </button>
          </div>
          <GymMinter onGymMinted={handleGymMinted} />
        </div>
      </div>
    );
  }

  // Show gym list
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4 md:p-8 relative">
      {/* Fixed Back Button - Always visible */}
      <button
        onClick={onBackToMain}
        className="fixed top-4 left-4 z-50 transition-transform hover:scale-110"
      >
        <img 
          src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/56fa9ed2-8a4e-42ba-8746-d03370944e7d-k39OOt1uF85tIpdfal9oa1yj57AqgR"
          alt="Back"
          className="w-16 h-16 object-contain drop-shadow-2xl"
        />
      </button>
      
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
            🏟️ JABLIX GYM
          </h1>
          <button
            onClick={onBackToMain}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            ← Back
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-purple-500/50 rounded-3xl p-12 text-center">
            <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-2xl text-purple-200 font-bold mb-6">Loading your gyms...</p>
            <button
              onClick={onBackToMain}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black py-3 px-8 rounded-2xl transition-all transform hover:scale-110"
            >
              ← Back
            </button>
          </div>
        ) : !hasGyms ? (
          /* No Gyms - Show Minter */
          <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-purple-500/50 rounded-3xl p-12 text-center">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6">
              No Gyms Yet!
            </h2>
            <p className="text-2xl text-purple-200 mb-8">
              Create your first gym to start hosting private battles with friends
            </p>
            <button
              onClick={() => setViewMode('mint')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black py-6 px-12 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-3"
            >
              <Plus className="w-8 h-8" />
              Create Your First Gym
            </button>
          </div>
        ) : (
          /* Gym List */
          <div>
            {/* Create New Gym Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setViewMode('mint')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create New Gym
              </button>
            </div>

            {/* Gym Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gyms.map((gym) => (
                <div
                  key={gym.id}
                  className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-purple-500/50 rounded-3xl p-6 hover:border-purple-400 transition-all cursor-pointer transform hover:scale-105"
                  onClick={() => handleOpenGym(gym)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-white mb-1">
                        🏟️ {gym.name}
                      </h3>
                      <p className="text-xs text-purple-300 font-mono">
                        {gym.id.slice(0, 8)}...{gym.id.slice(-4)}
                      </p>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-black/30 rounded-xl p-3 text-center border border-purple-500/30">
                      <p className="text-2xl font-black text-white">{gym.battlesPlayed}</p>
                      <p className="text-xs text-purple-300">Battles</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 text-center border border-green-500/30">
                      <p className="text-2xl font-black text-green-400">{gym.wins}</p>
                      <p className="text-xs text-green-300">Wins</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3 text-center border border-red-500/30">
                      <p className="text-2xl font-black text-red-400">{gym.losses}</p>
                      <p className="text-xs text-red-300">Losses</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-white">
                      Click to Open →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
