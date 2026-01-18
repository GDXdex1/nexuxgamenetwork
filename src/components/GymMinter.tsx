'use client';

import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Loader2, Plus, Coins, Shield, Box, ChevronRight, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { createMintGymTransaction } from '@/utils/mintTransactions';
import { COIN_TYPES, formatJxcBalance } from '@/config/suiConfig';

interface GymMinterProps {
  onGymMinted: () => void;
}

export default function GymMinter({ onGymMinted }: GymMinterProps) {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [minting, setMinting] = useState<boolean>(false);

  const handleMintGym = async () => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    setMinting(true);

    try {
      // Get user's JXC coins
      const { data: coins } = await suiClient.getCoins({
        owner: account.address,
        coinType: COIN_TYPES.JXC,
      });

      if (!coins || coins.length === 0) {
        toast.error('Insufficient JXC balance. You need 2000 JXC to mint a gym.');
        setMinting(false);
        return;
      }

      // Use the largest coin
      const jxcCoin = coins.reduce((max, coin) =>
        BigInt(coin.balance) > BigInt(max.balance) ? coin : max
      );

      const requiredAmount = 2_000_000_000_000n; // 2000 JXC
      if (BigInt(jxcCoin.balance) < requiredAmount) {
        toast.error(`Insufficient JXC. You need ${formatJxcBalance(requiredAmount)}`);
        setMinting(false);
        return;
      }

      // Create mint transaction
      const tx = createMintGymTransaction(jxcCoin.coinObjectId);

      // Sign and execute
      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log('Gym minted successfully:', result);
            toast.success(
              <div className="bg-black border border-primary/50 p-4 rounded-xl">
                <p className="font-black text-primary uppercase text-xs mb-1 tracking-widest">Construction_Complete</p>
                <p className="text-[10px] text-white/60 uppercase">Arena Sector Initialized Successfully.</p>
              </div>
            );
            onGymMinted();
          },
          onError: (error) => {
            console.error('Failed to mint gym:', error);
            toast.error(`Failed to mint gym: ${error.message}`);
          },
        }
      );
    } catch (error) {
      console.error('Error minting gym:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to mint gym');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="group relative bg-black/60 border border-white/10 rounded-tr-[4rem] p-12 overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 -translate-y-32 translate-x-32 rounded-full blur-[80px]" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
        {/* Blueprint Section */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-[1px] bg-primary/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Construction_Blueprints</span>
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase font-heading">
              ARENA_SECTOR <span className="text-primary neon-text-orange">UPGRADE</span>
            </h2>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-xl relative group/blueprint">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/blueprint:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <Box className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-black uppercase tracking-widest">GYM_UNIT_TYPE_A</h3>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] font-black text-white/30 uppercase">Construction_Cost</span>
                  <span className="text-sm font-black text-primary">2,000 JXC</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] font-black text-white/30 uppercase">Capacity_Nodes</span>
                  <span className="text-sm font-black text-white">20 TRAINERS</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[10px] font-black text-white/30 uppercase">Network_Type</span>
                  <span className="text-sm font-black text-white">DECENTRALIZED_SUI</span>
                </div>
              </div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
                "This facility grants permanent sovereignty over a private battle sector. Fully tradeable on secondary data markets."
              </p>
            </div>
          </div>

          <button
            onClick={handleMintGym}
            disabled={minting}
            className="w-full py-6 bg-primary text-black font-black uppercase text-sm tracking-[0.4em] hover:bg-white transition-all rounded shadow-[0_0_30px_rgba(255,107,0,0.2)] disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-4"
          >
            {minting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                INITIALIZING_SECTOR...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current" />
                EXECUTE_CONSTRUCTION
              </>
            )}
          </button>
        </div>

        {/* Benefits HUD */}
        <div className="w-full lg:w-80 bg-black border border-white/5 p-8 rounded-tr-3xl relative">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="w-4 h-4 text-primary/60" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Facility_Advantages</span>
          </div>

          <ul className="space-y-6">
            {[
              'Private_Battle_Arena',
              'Exclusive_Invite_Channel',
              'Sector_Win/Loss_Tracking',
              'Blockchain_Ownership',
              'Neural_Network_Privacy',
              'Affiliate_Management'
            ].map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_rgba(255,107,0,0.5)]" />
                <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">Verification_Status</p>
            <div className="flex justify-center gap-1">
              <div className="w-3 h-1 bg-primary rounded-full" />
              <div className="w-4 h-1 bg-primary rounded-full" />
              <div className="w-2 h-1 bg-primary rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
