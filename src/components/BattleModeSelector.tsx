'use client';

import { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Bot, Dumbbell, AlertCircle } from 'lucide-react';

export type BattleMode = 'random' | 'ai' | 'gym';

interface BattleModeSelectorProps {
  onModeSelect: (mode: BattleMode) => void;
  onBack: () => void;
}

export default function BattleModeSelector({ onModeSelect, onBack }: BattleModeSelectorProps) {
  const account = useCurrentAccount();
  const [selectedMode, setSelectedMode] = useState<BattleMode | null>(null);

  const handleModeSelect = (mode: BattleMode): void => {
    if (!account) {
      return;
    }
    setSelectedMode(mode);
    onModeSelect(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Back Button */}
        <div className="absolute top-0 left-0">
          <button
            onClick={onBack}
            className="transition-all transform hover:scale-110 active:scale-95"
          >
            <img 
              src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/56fa9ed2-8a4e-42ba-8746-d03370944e7d-k39OOt1uF85tIpdfal9oa1yj57AqgR"
              alt="Back"
              className="w-16 h-16 object-contain drop-shadow-2xl"
            />
          </button>
        </div>

        {/* Banner */}
        <div className="text-center mb-8">
          <img
            src="https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/4f3ded0e-dfc8-4203-a8b5-c5520107ed9b-4CHtf1hokrrrUpgGLZRmBEQ5pDYP3C"
            alt="Jablix Arena"
            className="w-full max-w-3xl mx-auto rounded-3xl shadow-2xl border-4 border-purple-500/50 mb-6"
          />
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 mb-3">
            SELECT BATTLE MODE
          </h1>
          <p className="text-xl text-purple-200 font-semibold">
            Choose how you want to battle
          </p>
        </div>

        {/* Wallet Connection Alert */}
        {!account && (
          <Alert className="mb-8 bg-red-900/50 border-red-500">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-white font-semibold">
              ⚠️ You need to connect your Sui wallet in Jablix Arena before selecting a battle mode
            </AlertDescription>
          </Alert>
        )}

        {/* Battle Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Random Matchmaking Mode */}
          <Card 
            className={`cursor-pointer transition-all hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-green-900/80 to-emerald-900/80 border-4 ${
              !account ? 'opacity-50 cursor-not-allowed' : 'hover:border-green-400 border-green-600'
            }`}
            onClick={() => account && handleModeSelect('random')}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-6 bg-green-600 rounded-full">
                  <Users className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white mb-2">
                🎲 Random Match
              </CardTitle>
              <CardDescription className="text-green-200 text-base">
                Find random opponents worldwide
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2 mb-4">
                <p className="text-sm text-green-100">✅ Matchmaking system</p>
                <p className="text-sm text-green-100">✅ Real-time battles</p>
                <p className="text-sm text-green-100">✅ Global leaderboard</p>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                disabled={!account}
              >
                Find Match
              </Button>
            </CardContent>
          </Card>

          {/* AI Mode */}
          <Card 
            className={`cursor-pointer transition-all hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-blue-900/80 to-cyan-900/80 border-4 ${
              !account ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 border-blue-600'
            }`}
            onClick={() => account && handleModeSelect('ai')}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-6 bg-blue-600 rounded-full">
                  <Bot className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white mb-2">
                🤖 AI Battle
              </CardTitle>
              <CardDescription className="text-blue-200 text-base">
                Practice against AI opponents
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2 mb-4">
                <p className="text-sm text-blue-100">✅ Solo practice mode</p>
                <p className="text-sm text-blue-100">✅ Smart AI enemies</p>
                <p className="text-sm text-blue-100">✅ No matchmaking wait</p>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                disabled={!account}
              >
                Battle AI
              </Button>
            </CardContent>
          </Card>

          {/* Jablix Gym Mode */}
          <Card 
            className={`cursor-pointer transition-all hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 ${
              !account ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-400 border-purple-600'
            }`}
            onClick={() => account && handleModeSelect('gym')}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-6 bg-purple-600 rounded-full">
                  <Dumbbell className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-white mb-2">
                🏟️ Jablix Gym
              </CardTitle>
              <CardDescription className="text-purple-200 text-base">
                Create lobbies and battle friends
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2 mb-4">
                <p className="text-sm text-purple-100">✅ Private lobbies</p>
                <p className="text-sm text-purple-100">✅ Challenge friends</p>
                <p className="text-sm text-purple-100">✅ Gym NFT ownership</p>
              </div>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
                disabled={!account}
              >
                Enter Gym
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            {account 
              ? "Select a mode to start your battle journey" 
              : "Connect your wallet to access battle modes"}
          </p>
        </div>
      </div>
    </div>
  );
}
