'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useFriends, type Friend } from '@/hooks/useFriends';
import { useBattleSocket } from '@/hooks/useBattleSocket';
import type { GymNFT } from '@/hooks/useUserGyms';
import { Loader2, UserPlus, X, Users, Copy, CheckCircle2, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

interface GymInterfaceProps {
  gym: GymNFT;
  onBack: () => void;
}

export default function GymInterface({ gym, onBack }: GymInterfaceProps) {
  const account = useCurrentAccount();
  const { friends, onlineFriends, loading, addFriend, removeFriend, refreshFriends } = useFriends();
  const { isConnected, createGym, joinGym } = useBattleSocket();
  
  const [newFriendAddress, setNewFriendAddress] = useState<string>('');
  const [gymCode, setGymCode] = useState<string>('');
  const [copiedGymCode, setCopiedGymCode] = useState<boolean>(false);
  const [addingFriend, setAddingFriend] = useState<boolean>(false);

  // Refresh friends list every 15 seconds
  useEffect(() => {
    if (account?.address) {
      const interval = setInterval(() => {
        refreshFriends();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [account?.address, refreshFriends]);

  const handleAddFriend = async () => {
    if (!newFriendAddress.trim()) {
      toast.error('Please enter a valid wallet address');
      return;
    }

    try {
      setAddingFriend(true);
      await addFriend(newFriendAddress.trim());
      toast.success('Friend added successfully! 🎉');
      setNewFriendAddress('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add friend');
    } finally {
      setAddingFriend(false);
    }
  };

  const handleRemoveFriend = async (friendAddress: string) => {
    try {
      await removeFriend(friendAddress);
      toast.success('Friend removed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove friend');
    }
  };

  const handleCreateBattle = () => {
    if (!isConnected) {
      toast.error('Not connected to battle server. Please wait...');
      return;
    }

    // Generate gym code based on NFT ID
    const code = `GYM-${gym.id.slice(-6).toUpperCase()}`;
    setGymCode(code);
    toast.success(`Battle room created! Share code: ${code}`);
    
    // TODO: Integrate with createGym socket event
    // createGym({ address: account!.address, team: selectedTeam, betLevel: 0 });
  };

  const handleCopyGymCode = async () => {
    if (gymCode) {
      await navigator.clipboard.writeText(gymCode);
      setCopiedGymCode(true);
      toast.success('Gym code copied!');
      setTimeout(() => setCopiedGymCode(false), 2000);
    }
  };

  const handleInviteFriend = (friendAddress: string) => {
    if (gymCode) {
      toast.info(`Invited ${friendAddress.slice(0, 6)}...${friendAddress.slice(-4)} to battle!`);
      // TODO: Send invitation via socket or notification system
    } else {
      toast.error('Create a battle room first to invite friends');
    }
  };

  const shortAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              🏟️ {gym.name}
            </h1>
            <p className="text-purple-300 font-mono text-sm mt-2">
              Gym ID: {gym.id.slice(0, 8)}...{gym.id.slice(-6)}
            </p>
          </div>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            ← Back
          </button>
        </div>

        {/* Connection Status */}
        <div className={`mb-6 ${isConnected ? 'bg-green-900/50 border-green-500/50' : 'bg-orange-900/50 border-orange-500/50'} border-2 rounded-2xl p-4 flex items-center justify-center gap-3`}>
          {isConnected ? (
            <>
              <Wifi className="w-5 h-5 text-green-400" />
              <p className="text-green-200 font-bold">
                ✅ Connected to battle server
              </p>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-orange-400" />
              <p className="text-orange-200 font-bold">
                ⚠️ Connecting to battle server...
              </p>
            </>
          )}
        </div>

        {/* Gym Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-purple-500/50 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-white">{gym.battlesPlayed}</p>
            <p className="text-purple-300 font-bold mt-2">Total Battles</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/80 to-emerald-900/80 border-4 border-green-500/50 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-white">{gym.wins}</p>
            <p className="text-green-300 font-bold mt-2">Wins</p>
          </div>
          <div className="bg-gradient-to-br from-red-900/80 to-pink-900/80 border-4 border-red-500/50 rounded-2xl p-6 text-center">
            <p className="text-4xl font-black text-white">{gym.losses}</p>
            <p className="text-red-300 font-bold mt-2">Losses</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Battle Room */}
          <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-purple-500/50 rounded-3xl p-6">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6">
              ⚔️ Battle Room
            </h2>

            <div className="bg-black/30 rounded-2xl p-6 border-2 border-purple-500/30">
              {gymCode ? (
                <div>
                  <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 border-2 border-purple-400 rounded-2xl p-6 mb-4">
                    <p className="text-sm text-purple-300 mb-2">Active Battle Code:</p>
                    <div className="flex items-center justify-center gap-4">
                      <p className="text-2xl font-black font-mono text-white">
                        {gymCode}
                      </p>
                      <button
                        onClick={handleCopyGymCode}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-xl transition-all"
                      >
                        {copiedGymCode ? (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-pink-300 mb-4 text-center">
                    Share this code with friends to invite them!
                  </p>
                  <button
                    onClick={() => setGymCode('')}
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all"
                  >
                    Close Battle Room
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-purple-200 mb-6">
                    Create a battle room to invite friends
                  </p>
                  <button
                    onClick={handleCreateBattle}
                    disabled={!isConnected}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black py-4 px-8 rounded-2xl text-xl transition-all transform hover:scale-105 shadow-2xl"
                  >
                    Create Battle Room 🎮
                  </button>
                  {!isConnected && (
                    <p className="text-sm text-orange-300 mt-4">
                      ⚠️ Waiting for server connection...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Friends List */}
          <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-purple-500/50 rounded-3xl p-6">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6">
              👥 Friends
            </h2>

            {/* Add Friend */}
            <div className="mb-6 bg-black/30 rounded-2xl p-4 border-2 border-purple-500/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFriendAddress}
                  onChange={(e) => setNewFriendAddress(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 bg-black/50 border-2 border-purple-500/50 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                />
                <button
                  onClick={handleAddFriend}
                  disabled={addingFriend || !newFriendAddress.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2"
                >
                  {addingFriend ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Friends List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loading && friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-3" />
                  <p className="text-sm text-purple-200">Loading friends...</p>
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-3xl mb-3">😢</p>
                  <p className="text-lg text-purple-200">No friends yet</p>
                </div>
              ) : (
                <>
                  {/* Online Friends */}
                  {onlineFriends.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-green-400 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        ONLINE ({onlineFriends.length})
                      </p>
                      {onlineFriends.map((friend: Friend) => (
                        <div
                          key={friend.address}
                          className="bg-gradient-to-r from-green-900/40 to-purple-900/40 border-2 border-green-500/50 rounded-xl p-3 mb-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <p className="font-mono text-white text-sm font-bold">
                                {shortAddress(friend.address)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleInviteFriend(friend.address)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-1 px-3 rounded-lg transition-all text-xs"
                              >
                                Invite
                              </button>
                              <button
                                onClick={() => handleRemoveFriend(friend.address)}
                                className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-lg transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Offline Friends */}
                  {friends.filter((f: Friend) => !f.isOnline).length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                        OFFLINE ({friends.filter((f: Friend) => !f.isOnline).length})
                      </p>
                      {friends.filter((f: Friend) => !f.isOnline).map((friend: Friend) => (
                        <div
                          key={friend.address}
                          className="bg-black/30 border-2 border-gray-500/30 rounded-xl p-3 mb-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              <p className="font-mono text-white text-sm font-bold">
                                {shortAddress(friend.address)}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveFriend(friend.address)}
                              className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-lg transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
