'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useFriends, type Friend } from '@/hooks/useFriends';
import { useBattleSocket } from '@/hooks/useBattleSocket';
import { Loader2, UserPlus, X, Users, Swords, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface JablixGymProps {
  onBackToMain: () => void;
}

type GymTab = 'friends' | 'create' | 'join';

export default function JablixGym({ onBackToMain }: JablixGymProps) {
  const account = useCurrentAccount();
  const { friends, onlineFriends, loading, addFriend, removeFriend, refreshFriends } = useFriends();
  const { isConnected, createGym, joinGym } = useBattleSocket();
  
  const [activeTab, setActiveTab] = useState<GymTab>('friends');
  const [newFriendAddress, setNewFriendAddress] = useState<string>('');
  const [gymCode, setGymCode] = useState<string>('');
  const [createdGymCode, setCreatedGymCode] = useState<string | null>(null);
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

  const handleCreateGym = () => {
    // For now, generate a simple gym code
    const code = `GYM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setCreatedGymCode(code);
    toast.success(`Gym created! Share code: ${code}`);
    
    // TODO: Integrate with createGym socket event
    // createGym(selectedTeam, betLevel);
  };

  const handleJoinGym = () => {
    if (!gymCode.trim()) {
      toast.error('Please enter a gym code');
      return;
    }

    toast.info(`Joining gym: ${gymCode}`);
    
    // TODO: Integrate with joinGym socket event
    // joinGym(selectedTeam, gymCode);
  };

  const handleCopyGymCode = async () => {
    if (createdGymCode) {
      await navigator.clipboard.writeText(createdGymCode);
      setCopiedGymCode(true);
      toast.success('Gym code copied!');
      setTimeout(() => setCopiedGymCode(false), 2000);
    }
  };

  const handleInviteFriend = (friendAddress: string) => {
    if (createdGymCode) {
      toast.info(`Invited ${friendAddress.slice(0, 6)}...${friendAddress.slice(-4)} to gym!`);
      // TODO: Send invitation via socket or notification system
    } else {
      toast.error('Create a gym first to invite friends');
    }
  };

  const shortAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
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

        {/* Connection Status */}
        {!isConnected && (
          <div className="mb-6 bg-orange-900/50 border-2 border-orange-500/50 rounded-2xl p-4 text-center">
            <p className="text-orange-200 font-bold">
              ⚠️ Connecting to battle server...
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-purple-500/50 rounded-3xl p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold transition-all ${
                activeTab === 'friends'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-purple-300 hover:bg-purple-800/50'
              }`}
            >
              <Users className="w-5 h-5 inline-block mr-2" />
              Friends ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold transition-all ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-purple-300 hover:bg-purple-800/50'
              }`}
            >
              <Swords className="w-5 h-5 inline-block mr-2" />
              Create Gym
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold transition-all ${
                activeTab === 'join'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'text-purple-300 hover:bg-purple-800/50'
              }`}
            >
              <UserPlus className="w-5 h-5 inline-block mr-2" />
              Join Gym
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-purple-500/50 rounded-3xl p-6 md:p-8">
          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6">
                👥 Your Friends
              </h2>

              {/* Add Friend */}
              <div className="mb-6 bg-black/30 rounded-2xl p-6 border-2 border-purple-500/30">
                <h3 className="text-xl font-bold text-purple-200 mb-4">Add New Friend</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newFriendAddress}
                    onChange={(e) => setNewFriendAddress(e.target.value)}
                    placeholder="Enter wallet address (0x...)"
                    className="flex-1 bg-black/50 border-2 border-purple-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                  />
                  <button
                    onClick={handleAddFriend}
                    disabled={addingFriend || !newFriendAddress.trim()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
                  >
                    {addingFriend ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                    Add
                  </button>
                </div>
              </div>

              {/* Friends List */}
              {loading && friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                  <p className="text-xl text-purple-200">Loading friends...</p>
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-5xl mb-4">😢</p>
                  <p className="text-2xl text-purple-200 mb-4">No friends yet!</p>
                  <p className="text-lg text-pink-300">
                    Add friends to battle together in the Gym
                  </p>
                </div>
              ) : (
                <div>
                  {/* Online Friends */}
                  {onlineFriends.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                        Online Now ({onlineFriends.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {onlineFriends.map((friend: Friend) => (
                          <div
                            key={friend.address}
                            className="bg-gradient-to-r from-green-900/40 to-purple-900/40 border-2 border-green-500/50 rounded-xl p-4 hover:border-green-400 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <div>
                                  <p className="font-mono text-white font-bold">
                                    {shortAddress(friend.address)}
                                  </p>
                                  <p className="text-xs text-green-300">Online</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleInviteFriend(friend.address)}
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
                                >
                                  Invite
                                </button>
                                <button
                                  onClick={() => handleRemoveFriend(friend.address)}
                                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Offline Friends */}
                  {friends.filter((f: Friend) => !f.isOnline).length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-400 mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                        Offline ({friends.filter((f: Friend) => !f.isOnline).length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {friends.filter((f: Friend) => !f.isOnline).map((friend: Friend) => (
                          <div
                            key={friend.address}
                            className="bg-black/30 border-2 border-gray-500/30 rounded-xl p-4 hover:border-gray-400/50 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                <div>
                                  <p className="font-mono text-white font-bold">
                                    {shortAddress(friend.address)}
                                  </p>
                                  <p className="text-xs text-gray-400">Offline</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveFriend(friend.address)}
                                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Create Gym Tab */}
          {activeTab === 'create' && (
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6">
                ⚔️ Create Private Gym
              </h2>

              <div className="bg-black/30 rounded-2xl p-8 border-2 border-purple-500/30 text-center">
                <p className="text-xl text-purple-200 mb-6">
                  Create a private gym and invite your friends to battle!
                </p>

                {createdGymCode ? (
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 border-2 border-purple-400 rounded-2xl p-6 mb-4">
                      <p className="text-sm text-purple-300 mb-2">Your Gym Code:</p>
                      <div className="flex items-center justify-center gap-4">
                        <p className="text-3xl font-black font-mono text-white">
                          {createdGymCode}
                        </p>
                        <button
                          onClick={handleCopyGymCode}
                          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl transition-all"
                        >
                          {copiedGymCode ? (
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                          ) : (
                            <Copy className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-pink-300 mb-6">
                      Share this code with your friends to invite them!
                    </p>
                    <button
                      onClick={() => setCreatedGymCode(null)}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-8 rounded-xl transition-all"
                    >
                      Create New Gym
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCreateGym}
                    disabled={!isConnected}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black py-6 px-12 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-2xl"
                  >
                    Create Gym 🎮
                  </button>
                )}

                {!isConnected && (
                  <p className="text-sm text-orange-300 mt-4">
                    ⚠️ Waiting for connection to battle server...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Join Gym Tab */}
          {activeTab === 'join' && (
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6">
                🎯 Join Friend's Gym
              </h2>

              <div className="bg-black/30 rounded-2xl p-8 border-2 border-purple-500/30">
                <p className="text-xl text-purple-200 mb-6 text-center">
                  Enter the gym code shared by your friend
                </p>

                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    value={gymCode}
                    onChange={(e) => setGymCode(e.target.value.toUpperCase())}
                    placeholder="Enter gym code (e.g., GYM-ABC123)"
                    className="w-full bg-black/50 border-2 border-purple-500/50 rounded-xl px-6 py-4 text-white text-center text-xl font-mono placeholder-gray-400 focus:border-purple-400 focus:outline-none mb-6"
                  />

                  <button
                    onClick={handleJoinGym}
                    disabled={!isConnected || !gymCode.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black py-6 px-12 rounded-2xl text-2xl transition-all transform hover:scale-105 shadow-2xl"
                  >
                    Join Gym 🚀
                  </button>

                  {!isConnected && (
                    <p className="text-sm text-orange-300 mt-4 text-center">
                      ⚠️ Waiting for connection to battle server...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
