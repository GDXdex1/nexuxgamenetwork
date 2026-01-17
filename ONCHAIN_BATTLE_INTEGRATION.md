# 🎮 Jablix Arena - On-Chain Battle Integration

## 📋 Overview

Jablix Arena battle system is now fully integrated with the Sui blockchain smart contract for **real money battles**. The system uses a hybrid architecture combining on-chain bet escrow and off-chain real-time gameplay.

**Smart Contract**: `0x12e854e44a8c1c1056c0a718fe01668f9ed9376edd2412fd532e715c83cad4df::battle`

---

## 🏗️ Architecture

### Hybrid System Design

```
┌─────────────────────────────────────────────────────────────┐
│                      JABLIX BATTLE SYSTEM                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ON-CHAIN (Sui Blockchain)          OFF-CHAIN (Pusher)      │
│  ├─ Bet Escrow                      ├─ Real-time Updates    │
│  ├─ Match Creation                  ├─ Battle Actions       │
│  ├─ Prize Distribution              ├─ Turn Management      │
│  └─ Server Signatures               └─ Game Logic           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Battle Types

1. **Random Matchmaking** (ON-CHAIN)
   - Real JXC bets (3000 or 5000 JXC)
   - Smart contract escrow
   - Prize distribution with 3% commission
   - Server-signed resolution

2. **AI Battles** (OFF-CHAIN)
   - No real bets
   - Practice and fun
   - In-memory gameplay

3. **Gym Battles** (ON-CHAIN) - Coming Soon
   - Private battles with friends
   - Same as random matchmaking

---

## 🔄 On-Chain Battle Flow

### Phase 1: Matchmaking

```
Client → POST /api/battle/join-random
         ├─ address: string
         ├─ team: string[3]
         └─ betLevel: 0 | 1

Server → Matches 2 players
      → Creates OnChainBattleInfo
      → Broadcasts "match_found" via Pusher

Both Clients ← Receive match_found event
```

### Phase 2: Transaction Signatures

**Player 1 (Host):**
```typescript
// Client signs start_battle transaction
const tx = createStartBattleSpecialTransaction(
  opponentAddress,
  betAmount,
  jablix1Id,
  jablix2Id,
  jablix3Id,
  paymentCoinId
);

const result = await signAndExecuteTransaction({ transaction: tx });

// Notify server
POST /api/battle/sign-start
{
  battleId: string,
  txDigest: string,
  sessionId: string // BattleSession object ID from tx
}
```

**Player 2:**
```typescript
// Client signs join_battle transaction
const tx = createJoinBattleSpecialTransaction(
  sessionId,
  jablix1Id,
  jablix2Id,
  jablix3Id,
  paymentCoinId,
  betAmount
);

const result = await signAndExecuteTransaction({ transaction: tx });

// Notify server
POST /api/battle/sign-join
{
  battleId: string,
  txDigest: string
}
```

### Phase 3: Activation (Server-Signed)

```
Server → Detects both signatures
       → Signs activate_battle message
       → Executes activate_battle_signed transaction
       → Battle enters ACTIVE state
```

### Phase 4: Gameplay (Off-Chain)

```
Clients ↔ Pusher ↔ Server
  ├─ Battle actions
  ├─ Turn updates
  ├─ Real-time state sync
  └─ Battle engine calculations
```

### Phase 5: Resolution (Server-Signed)

```
Server → Battle ends
       → Signs resolve_battle message
       → Executes resolve_battle_signed transaction
       → Distributes prizes:
           ├─ Winner: Pot - 3% commission
           └─ Commission: 3% to COMMISSION_WALLET
```

---

## 📝 Smart Contract Functions

### start_battle_special / start_battle_elemental
**Player 1 creates battle session**

```move
public entry fun start_battle_special(
    opponent: address,
    bet_amount: u64,
    p1_jablix_0: &JablixSpecial,
    p1_jablix_1: &JablixSpecial,
    p1_jablix_2: &JablixSpecial,
    p1_bet: Coin<JABLIXCOIN>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**Requirements:**
- Bet must be `3_000_000_000_000` or `5_000_000_000_000` (3000 or 5000 JXC)
- Player must own 3 Jablix NFTs
- Player must have enough JXC
- Creates shared BattleSession object

### join_battle_special / join_battle_elemental
**Player 2 joins battle session**

```move
public entry fun join_battle_special(
    session: &mut BattleSession,
    p2_jablix_0: &JablixSpecial,
    p2_jablix_1: &JablixSpecial,
    p2_jablix_2: &JablixSpecial,
    p2_bet: Coin<JABLIXCOIN>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**Requirements:**
- Must be the designated opponent
- Session must be in PENDING state
- Bet amount must match Player 1's bet
- Transitions session to READY state

### activate_battle_signed
**Server activates battle with ed25519 signature**

```move
public entry fun activate_battle_signed(
    authority: &BattleAuthority,
    session: &mut BattleSession,
    server_signature: vector<u8>,
    clock: &Clock,
    _ctx: &mut TxContext
)
```

**Server Signs:**
```
message = session_id + "activate" + timestamp
signature = ed25519_sign(message, server_private_key)
```

**Transitions to ACTIVE state**

### resolve_battle_signed
**Server resolves battle with ed25519 signature**

```move
public entry fun resolve_battle_signed(
    authority: &BattleAuthority,
    session: &mut BattleSession,
    winner: address,
    battle_log_hash: vector<u8>,
    server_signature: vector<u8>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

**Server Signs:**
```
message = session_id + winner_address + battle_log_hash + timestamp
signature = ed25519_sign(message, server_private_key)
```

**Prize Distribution:**
- Total pot = bet1 + bet2
- Commission = 3% of pot
- Winner receives: pot - commission
- Draw (winner = 0x0): Both players get refund - commission

---

## 💰 Bet Levels

| Level | Amount (JXC) | Amount (Smallest Unit) |
|-------|--------------|------------------------|
| 0     | 3,000        | 3_000_000_000_000      |
| 1     | 5,000        | 5_000_000_000_000      |

---

## 🔐 Security Features

### 1. Server Signatures
- Battle activation requires server signature
- Battle resolution requires server signature
- Uses ed25519 cryptography
- Prevents unauthorized state changes

### 2. Bet Escrow
- Bets locked in BattleSession object
- Only smart contract can move funds
- Automatic distribution on resolution
- Timeout protection (600 seconds)

### 3. NFT References
- Jablixes are referenced, not transferred
- Players retain ownership during battle
- No risk of NFT loss

---

## 🛠️ Developer Guide

### Testing On-Chain Battles

1. **Setup:**
   ```bash
   # Ensure you have test JXC
   # Ensure you have 3+ Jablix NFTs
   # Connect wallet to Sui Testnet
   ```

2. **Join Random Matchmaking:**
   ```typescript
   const response = await fetch('/api/battle/join-random', {
     method: 'POST',
     body: JSON.stringify({
       address: walletAddress,
       team: ['1', '2', '3'], // Jablix IDs
       betLevel: 0 // 3000 JXC
     })
   });
   ```

3. **Listen for Match:**
   ```typescript
   pusher.subscribe(`user-${address}`).bind('match_found', (data) => {
     if (data.isHost) {
       // Sign start_battle
     } else {
       // Wait for host, then sign join_battle
     }
   });
   ```

4. **Sign Transactions:**
   ```typescript
   // Get Jablix object IDs from wallet
   const jablixObjects = await getUserJablixes(suiClient, address);
   
   // Create and sign transaction
   const tx = await createStartBattleAutoTransaction(
     suiClient,
     opponentAddress,
     betAmount,
     jablixObjects[0].id,
     jablixObjects[1].id,
     jablixObjects[2].id,
     jxcCoinId
   );
   
   const result = await signAndExecuteTransaction({ transaction: tx });
   
   // Notify server
   await fetch('/api/battle/sign-start', {
     method: 'POST',
     body: JSON.stringify({
       battleId: data.battleId,
       txDigest: result.digest,
       sessionId: extractSessionId(result)
     })
   });
   ```

### Important Functions

```typescript
import {
  createStartBattleSpecialTransaction,
  createStartBattleElementalTransaction,
  createJoinBattleSpecialTransaction,
  createJoinBattleElementalTransaction,
  createStartBattleAutoTransaction, // Auto-detects type
  createJoinBattleAutoTransaction,  // Auto-detects type
  getBetAmount,
  isValidBetLevel
} from '@/utils/battleTransactions';
```

---

## 📊 Database Schema

### OnChainBattleInfo
```typescript
{
  battleId: string;          // Unique identifier
  sessionId?: string;        // BattleSession object ID on Sui
  player1: string;           // Player 1 address
  player2: string;           // Player 2 address
  player1Team: string[];     // Player 1 Jablix IDs
  player2Team: string[];     // Player 2 Jablix IDs
  betLevel: number;          // 0 or 1
  betAmount: bigint;         // 3000 or 5000 JXC (smallest unit)
  mode: 'random' | 'gym';    // Battle type
  phase: OnChainBattlePhase; // Current phase
  player1SignedTx?: string;  // start_battle digest
  player2SignedTx?: string;  // join_battle digest
  activatedTx?: string;      // activate_battle digest
  resolvedTx?: string;       // resolve_battle digest
  winner?: string;           // Winner address
  created_at: number;        // Timestamp
  updated_at: number;        // Timestamp
}
```

### OnChainBattlePhase
```typescript
type OnChainBattlePhase = 
  | 'matching'              // Finding opponent
  | 'waiting_p1_signature'  // Waiting for Player 1 to sign
  | 'waiting_p2_signature'  // Waiting for Player 2 to sign
  | 'activating'            // Server activating battle
  | 'active'                // Battle in progress
  | 'resolving'             // Server resolving battle
  | 'finished';             // Battle completed
```

---

## 🚀 Deployment Checklist

- [x] Smart contract deployed on Sui Testnet
- [x] Battle transactions implemented
- [x] On-chain battle service created
- [x] API routes updated
- [x] Pusher integration configured
- [ ] Server signature system (TODO)
- [ ] Battle resolution automation (TODO)
- [ ] Timeout handling (TODO)
- [ ] Error recovery (TODO)
- [ ] Mainnet deployment (TODO)

---

## 🐛 Known Issues & TODOs

### Critical
1. **Server Signature Implementation**
   - Need to implement ed25519 key management
   - Sign activate_battle messages
   - Sign resolve_battle messages

2. **Timeout Handling**
   - Implement emergency_cancel for abandoned battles
   - Refund mechanism after 600 seconds

3. **Error Recovery**
   - Handle failed transactions
   - Retry logic for network issues
   - Cleanup stuck battles

### Enhancement
1. **Gas Optimization**
   - Batch transaction execution
   - Optimize gas budgets

2. **User Experience**
   - Loading states during signatures
   - Transaction status tracking
   - Clear error messages

3. **Monitoring**
   - Battle metrics dashboard
   - Transaction success rates
   - Average resolution times

---

## 📚 Resources

- **Smart Contract**: `0x12e854e44a8c1c1056c0a718fe01668f9ed9376edd2412fd532e715c83cad4df::battle`
- **Repository**: https://github.com/GDXdex1/jablixscbeta
- **Sui Explorer**: https://suiscan.xyz/testnet
- **Documentation**: https://docs.sui.io

---

## 💡 Notes

- AI battles remain off-chain (no real bets)
- Random matchmaking uses on-chain escrow
- Server signatures ensure fair resolution
- 3% commission on all battles
- Timeout protection at 600 seconds
- Emergency cancel available if needed

---

**Last Updated**: January 16, 2026
**Version**: 1.0.0
**Status**: MVP - Testing Phase
