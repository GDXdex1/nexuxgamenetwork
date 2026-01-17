# ⚔️ Jablix Arena - Battle System Status

## 📊 Current Implementation

### ✅ What's Working
- **Real-time Battles**: Pusher provides instant communication
- **Matchmaking**: Random matchmaking, AI battles, and private gyms
- **Battle Logic**: Full game engine with damage calculation, status effects, and win conditions
- **Serverless**: Runs entirely on Vercel (no VPS needed)
- **Off-chain MVP**: Fast and free for testing

### 🔧 Architecture

```
┌─────────────────┐
│   Next.js App   │
│  (Client-side)  │
└────────┬────────┘
         │
         ├─────── Pusher (Real-time) ─────────┐
         │                                     │
         ├─────── API Routes ─────────────────┤
         │                                     │
         │  ┌────────────────────────────┐    │
         │  │  /api/battle/join-random   │    │
         │  │  /api/battle/start-ai      │    │
         │  │  /api/battle/action        │    │
         │  └────────────────────────────┘    │
         │                                     │
         └─────── Memory Storage ─────────────┘
                  (activeBattles Map)
```

## 🚧 Smart Contract Status

### ✅ Contract Deployed
- **Package ID**: `0x12e854e44a8c1c1056c0a718fe01668f9ed9376edd2412fd532e715c83cad4df`
- **Module**: `battle`
- **Network**: Sui Testnet
- **Functions Available**:
  - `start_battle()` - Create battle with bet escrow
  - `join_battle()` - Join existing battle
  - `resolve_battle()` - Finalize and distribute rewards

### ⚠️ Not Currently Integrated
The smart contract exists and is functional, but the battle flow doesn't use it yet.

**Current Flow (Off-chain)**:
1. User selects team
2. Click "Find Match"
3. API creates battle in memory
4. Pusher broadcasts battle_start
5. Players take turns (API validates actions)
6. Winner declared, stored in memory

**Ideal Flow (On-chain)**:
1. User selects team
2. Click "Find Match"
3. **Wallet prompts to sign transaction** (bet escrow)
4. **Blockchain creates BattleSession object**
5. Pusher broadcasts battle_start
6. Players take turns (API validates actions)
7. **Winner declared, resolve_battle transaction**
8. **Blockchain distributes rewards**

## 📁 Key Files

### Battle System
- `src/app/api/battle/` - API routes for battle actions
- `src/lib/battleService.ts` - Battle creation and management
- `src/lib/pusherClient.ts` - Real-time client
- `src/lib/pusherServer.ts` - Real-time server broadcasts
- `src/hooks/useBattleSocket.ts` - React hook for battle state

### Smart Contract Integration
- `src/utils/battleTransactions.ts` - Transaction builders (ready to use)
- `src/config/suiConfig.ts` - Contract addresses and configuration
- `src/config/battleConfig.ts` - Battle system settings

## 🔄 Migration to On-chain (Not Yet Done)

### Why Not On-chain Yet?
1. **MVP Speed**: Off-chain is faster to test and iterate
2. **Gas Costs**: Users don't pay gas during testing
3. **Complexity**: Wallet integration adds friction
4. **Testing**: Easier to debug off-chain logic first

### Benefits of Going On-chain
1. ✅ **Trustless**: No server can cheat
2. ✅ **Verifiable**: All battles recorded on blockchain
3. ✅ **Secure Bets**: Funds escrowed in smart contract
4. ✅ **Transparency**: Anyone can audit results

### To Integrate On-chain:

#### Step 1: Modify `src/app/api/battle/join-random/route.ts`
```typescript
// Current: Just create battle in memory
const battle = await createBattle(...);

// Future: Create transaction, wait for user signature
import { createStartBattleTransaction } from '@/utils/battleTransactions';

const tx = createStartBattleTransaction(opponent, betAmount, playerCoinId);
// Return tx to client for signing
// Wait for transaction result
// Use session object ID from blockchain
```

#### Step 2: Modify Client (Matchmaking)
```typescript
// Current: Direct API call
await fetch('/api/battle/join-random', ...);

// Future: Execute transaction via wallet
const tx = await fetch('/api/battle/create-tx', ...);
const result = await signAndExecuteTransaction({ transaction: tx });
```

#### Step 3: Resolve Battles On-chain
```typescript
// In endBattle() function
const tx = createResolveBattleTransaction(sessionId, winner);
await executeTransaction(tx);
```

## 🎮 Current User Experience

1. ✅ Connect wallet
2. ✅ Select 3 Jablixes
3. ✅ Choose battle mode
4. ✅ Click "Find Match"
5. ✅ Battle starts instantly (no transaction)
6. ✅ Take turns playing cards
7. ✅ Winner declared
8. ❌ No on-chain rewards (yet)

## 💡 Recommendations

### For MVP (Current)
- ✅ Keep off-chain for fast iteration
- ✅ Pusher works great for real-time
- ✅ No gas costs for users during testing

### For Production
1. **Phase 1**: Add optional on-chain battles
   - Let users choose "Free Battle" (off-chain) or "Ranked Battle" (on-chain with bets)
   
2. **Phase 2**: Migrate all PvP to on-chain
   - Keep AI battles off-chain (free practice)
   - All player vs player battles use smart contract

3. **Phase 3**: Add tournaments
   - Multi-round brackets
   - Prize pools
   - Leaderboards

## 🐛 Connection Issues?

If battles aren't connecting:

1. **Check Pusher Status**
   - Open browser console
   - Look for `[Pusher] Client initialized`
   - Check for connection errors

2. **Verify API Route**
   - Check `/api/battle/join-random` response
   - Ensure battle is created successfully

3. **Check User Channel**
   - Pusher subscribes to `user-{wallet_address}`
   - Verify address is correct

4. **Session Channel**
   - After battle_start, subscribes to `session-{battleId}`
   - Check battleId is valid

## 📚 Further Reading

- [Pusher Documentation](https://pusher.com/docs)
- [Sui Smart Contracts](https://docs.sui.io/build/smart-contracts)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Last Updated**: June 2024  
**Status**: Off-chain MVP with on-chain integration ready
