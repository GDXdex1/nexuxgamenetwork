'use client';

import { useState } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Loader2, Plus } from 'lucide-react';
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
            toast.success('Gym Building created successfully! 🏟️');
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
    <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-4 border-purple-500/50 rounded-3xl p-8">
      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-6 text-center">
        🏟️ Create Your Gym
      </h2>

      <div className="bg-black/30 rounded-2xl p-8 border-2 border-purple-500/30 mb-6">
        <p className="text-xl text-purple-200 mb-6 text-center">
          Mint your own Gym NFT to start hosting private battles with friends!
        </p>

        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-purple-900/30 border-2 border-purple-400/30 rounded-xl p-6">
            <p className="text-lg text-purple-200 mb-3 text-center font-bold">
              🏟️ Gym Building NFT
            </p>
            <p className="text-sm text-purple-200 mb-3">
              💰 <span className="font-bold">Cost:</span> 2,000 JXC
            </p>
            <p className="text-xs text-purple-300">
              This gym will be yours forever as an NFT on the Sui blockchain. You can affiliate up to 20 trainers to your gym!
            </p>
          </div>

          <button
            onClick={handleMintGym}
            disabled={minting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-black py-4 px-8 rounded-2xl text-xl transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3"
          >
            {minting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Creating Gym...
              </>
            ) : (
              <>
                <Plus className="w-6 h-6" />
                Mint Gym NFT (2,000 JXC)
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-black/20 rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-bold text-purple-300 mb-3">What's a Gym NFT?</h3>
        <ul className="space-y-2 text-sm text-purple-200">
          <li>✅ Your own private battle arena</li>
          <li>✅ Invite friends for exclusive matches</li>
          <li>✅ Track battles, wins, and losses</li>
          <li>✅ Tradeable NFT on Sui blockchain</li>
          <li>✅ Permanent ownership</li>
          <li>✅ Affiliate up to 20 trainers</li>
        </ul>
      </div>
    </div>
  );
}
