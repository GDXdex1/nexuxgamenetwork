'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useFriends, type Friend } from '@/hooks/useFriends';
import { useBattleSocket } from '@/hooks/useBattleSocket';
import type { GymNFT } from '@/hooks/useUserGyms';
import {
  Loader2,
  UserPlus,
  X,
  Users,
  Copy,
  CheckCircle2,
  Wifi,
  WifiOff,
  ArrowLeft,
  ChevronRight,
  Target,
  Sword,
  Shield,
  Trophy,
  Signal,
  Radio,
  Gamepad2,
  Trash2,
  ExternalLink
} from 'lucide-react';
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
      toast.success(
        <div className="bg-black border border-primary/50 p-4 rounded-xl">
          <p className="font-black text-primary uppercase text-xs mb-1 tracking-widest">Network_Link_Established</p>
          <p className="text-[10px] text-white/60 uppercase">Node added to synchronization grid.</p>
        </div>
      );
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
      toast.success('Signal stream terminated.');
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
    toast.success(
      <div className="bg-black border border-primary/50 p-4 rounded-xl">
        <p className="font-black text-primary uppercase text-xs mb-1 tracking-widest">Room_Initialized</p>
        <p className="text-[10px] text-white/60 uppercase">Sector code: {code}</p>
      </div>
    );
  };

  const handleCopyGymCode = async () => {
    if (gymCode) {
      await navigator.clipboard.writeText(gymCode);
      setCopiedGymCode(true);
      toast.success('Encrypted code copied to clipboard.');
      setTimeout(() => setCopiedGymCode(false), 2000);
    }
  };

  const handleInviteFriend = (friendAddress: string) => {
    if (gymCode) {
      toast.info(`Data packet sent to ${friendAddress.slice(0, 6)}...`);
    } else {
      toast.error('Create a battle room first to invite friends');
    }
  };

  const shortAddress = (addr: string): string => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 tech-bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Navigation HUD */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-primary/20 pb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="group relative p-4 bg-white/5 border border-white/10 hover:border-primary transition-all rounded-tr-xl flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-primary transition-colors" />
            </button>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-[1px] bg-primary/40" />
                <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">Private_Sector_{gymCode || 'OFFLINE'}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase font-heading">
                {gym.name}
              </h1>
            </div>
          </div>

          {/* Connection Monitoring HUD */}
          <div className={`hidden lg:flex items-center gap-6 px-8 py-3 rounded-bl-3xl border backdrop-blur-md transition-colors ${isConnected ? 'bg-black/40 border-green-500/20' : 'bg-black/40 border-orange-500/20'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-orange-500 animate-bounce'}`} />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                Server: {isConnected ? 'SYNCHRONIZED' : 'ESTABLISHING_LINK...'}
              </span>
            </div>
            <div className="w-[1px] h-6 bg-white/10" />
            <Signal className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-orange-500'}`} />
          </div>
        </div>

        {/* Tactical Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/40 border border-white/10 p-6 rounded text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Engagements</p>
            <p className="text-4xl font-black italic text-white font-heading">{gym.battlesPlayed}</p>
            <div className="absolute bottom-0 right-0 w-12 h-12 bg-primary/5 -translate-x-4 -translate-y-4 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
          </div>
          <div className="bg-black/40 border border-green-500/10 p-6 rounded text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500/40" />
            <p className="text-[8px] font-black text-green-500/40 uppercase tracking-[0.3em] mb-2">Success_Rate</p>
            <p className="text-4xl font-black italic text-green-500 font-heading">{gym.wins}</p>
            <Trophy className="absolute top-2 right-2 w-4 h-4 text-green-500/20" />
          </div>
          <div className="bg-black/40 border border-red-500/10 p-6 rounded text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/40" />
            <p className="text-[8px] font-black text-red-500/40 uppercase tracking-[0.3em] mb-2">Unit_Losses</p>
            <p className="text-4xl font-black italic text-red-500 font-heading">{gym.losses}</p>
          </div>
        </div>

        {/* Global Controller Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Action Module: Battle Core */}
          <div className="group relative">
            <div className="absolute inset-0 bg-primary/5 rounded-tr-[3rem] border border-white/10 group-hover:border-primary/40 transition-all duration-500" />
            <div className="relative p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-8">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-black italic uppercase tracking-widest">BATTLE_CONTROL</h2>
              </div>

              <div className="bg-black/60 border border-white/5 rounded-2xl p-8 text-center min-h-[280px] flex flex-col justify-center">
                {gymCode ? (
                  <div className="animate-in zoom-in duration-300">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Frequency_Band_Established</p>
                    <div className="inline-flex items-center justify-center gap-6 bg-white/5 border border-white/10 px-10 py-6 rounded-xl mb-6 group/code">
                      <p className="text-3xl font-black font-mono text-white tracking-widest">{gymCode}</p>
                      <button
                        onClick={handleCopyGymCode}
                        className="p-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-black transition-all rounded-lg"
                      >
                        {copiedGymCode ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest mb-8">Broadcast code to intercepting allies.</p>
                    <button
                      onClick={() => setGymCode('')}
                      className="px-8 py-3 bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-red-500/50 transition-all rounded uppercase text-[10px] font-black"
                    >
                      Abort_Room_Signal
                    </button>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-500">
                    <Radio className="w-12 h-12 text-white/10 mx-auto mb-6" />
                    <p className="text-[11px] text-white/30 uppercase tracking-[0.3em] mb-8 max-w-[280px] mx-auto leading-relaxed">
                      "Private sector idling. Initialize battle room to create a neural bridge for selected opponents."
                    </p>
                    <button
                      onClick={handleCreateBattle}
                      disabled={!isConnected}
                      className="px-10 py-5 bg-primary text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-all rounded shadow-lg shadow-primary/20 flex items-center justify-center gap-3 mx-auto disabled:opacity-20"
                    >
                      <Sword className="w-4 h-4 fill-current" />
                      Launch_Combat_Room
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Network Module: Neural Threads (Friends) */}
          <div className="bg-white/[0.02] border border-white/10 rounded-tr-[3rem] p-8 lg:p-12 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -translate-y-16 translate-x-16 rounded-full blur-3xl" />

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary/60" />
                <h2 className="text-xl font-black italic uppercase tracking-widest">NODE_REGISTRY</h2>
              </div>
            </div>

            {/* Search / Add HUD */}
            <div className="flex gap-2 mb-8 group">
              <div className="relative flex-1">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                <input
                  type="text"
                  value={newFriendAddress}
                  onChange={(e) => setNewFriendAddress(e.target.value)}
                  placeholder="INPUT_WALLET_ADDRESS..."
                  className="w-full bg-black border border-white/10 px-10 py-3 rounded text-xs font-mono uppercase tracking-[0.2em] focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/10"
                />
              </div>
              <button
                onClick={handleAddFriend}
                disabled={addingFriend || !newFriendAddress.trim()}
                className="px-5 bg-white/5 border border-white/10 hover:border-primary hover:text-primary transition-all rounded flex items-center justify-center disabled:opacity-20"
              >
                {addingFriend ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>

            {/* Nodes List HUD */}
            <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {loading && friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-20">
                  <Activity className="w-8 h-8 animate-pulse mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Interrogating_Network...</p>
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-12">
                  <WifiOff className="w-10 h-10 text-white/5 mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No_Affiliated_Nodes</p>
                </div>
              ) : (
                <>
                  {/* Priority: Online Signals */}
                  {onlineFriends.map((friend: Friend) => (
                    <div key={friend.address} className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between group/friend">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <div>
                          <p className="text-[11px] font-black font-mono text-white tracking-widest">{shortAddress(friend.address)}</p>
                          <p className="text-[7px] font-black text-green-500/60 uppercase">SIGNAL_STABLE</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleInviteFriend(friend.address)}
                          className="px-3 py-1.5 bg-primary/20 border border-primary/40 text-[10px] font-black text-primary uppercase hover:bg-primary hover:text-black transition-all rounded"
                        >
                          RECRUIT
                        </button>
                        <button
                          onClick={() => handleRemoveFriend(friend.address)}
                          className="p-2 text-white/20 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Standard: Offline Signals */}
                  {friends.filter((f: Friend) => !f.isOnline).map((friend: Friend) => (
                    <div key={friend.address} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-white/20 rounded-full" />
                        <div>
                          <p className="text-[11px] font-black font-mono text-white/40 tracking-widest">{shortAddress(friend.address)}</p>
                          <p className="text-[7px] font-black text-white/20 uppercase">NODE_DORMANT</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFriend(friend.address)}
                        className="p-2 text-white/10 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
