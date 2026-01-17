# 🗄️ MongoDB Integration Guide - Jablix Arena

## ✅ Status: Fully Integrated & Ready for Production

MongoDB is now fully integrated into Jablix Arena with complete API coverage, testnet/mainnet support, and admin tools.

---

## 🌐 Network Configuration (Testnet/Mainnet)

### Current Environment
The app is currently configured for **TESTNET** mode. All blockchain operations and database entries are on Sui Testnet.

### Switching Networks

To switch between testnet and mainnet, update `src/config/env.ts`:

```typescript
// For Testnet (Current)
export const CURRENT_NETWORK: NetworkEnvironment = 'testnet';

// For Mainnet (Production)
export const CURRENT_NETWORK: NetworkEnvironment = 'mainnet';
```

### Network Indicators

- **UI Badge**: Fixed top-left corner shows current network (🧪 TESTNET or 🚀 MAINNET)
- **Color Coding**: 
  - Orange = Testnet
  - Green = Mainnet
- **Feature Flags**: Different settings for debug, analytics, etc.

---

## 📊 Database Structure

### Collections

1. **elemental_jablixes** (50 types)
   - All elemental Jablix metadata
   - Stats, elements, images (IPFS URLs)
   - Mintable flag

2. **special_jablixes** (40 types)
   - Exrix, Dragons, Minidragons, Cosmic
   - Evolution chains
   - Tier classification

3. **users**
   - Wallet address (primary key)
   - JXC balance, username
   - Battle statistics
   - Owned Jablixes array

4. **battles**
   - Complete battle history
   - PvP and PvE records
   - Rewards and duration

5. **marketplace**
   - Active/sold/cancelled listings
   - Price, seller, buyer info
   - Transaction timestamps

6. **matchmaking**
   - Active queue entries
   - Player ratings
   - Jablix selections

---

## 🔌 API Endpoints

### Jablixes

```bash
# Get all jablixes
GET /api/jablixes?type=all&mintable=true

# Get specific jablix
GET /api/jablixes/[id]
```

### Users

```bash
# Get user data
GET /api/user/[wallet]

# Create/update user
POST /api/user/[wallet]
Body: { username, jxcBalance, ... }

# Get user's jablixes
GET /api/user/[wallet]/jablixes

# Add jablix to user
POST /api/user/[wallet]/jablixes
Body: { jablixId, typeId, type }
```

### Marketplace

```bash
# Get all listings
GET /api/marketplace/listings?type=all

# Create listing
POST /api/marketplace/listings
Body: { jablixId, jablixType, typeId, seller, price }

# Get specific listing
GET /api/marketplace/listings/[id]

# Update listing
PATCH /api/marketplace/listings/[id]
Body: { status, price }

# Delete/cancel listing
DELETE /api/marketplace/listings/[id]
```

### Battles

```bash
# Get battle history
GET /api/battles?wallet=[address]&limit=50

# Record battle result
POST /api/battles
Body: { player1Wallet, player1JablixId, result, ... }
```

### Statistics

```bash
# Get global stats
GET /api/stats
```

### Database Initialization

```bash
# Initialize/refresh database
POST /api/db/init

# Check database status
GET /api/db/init
```

---

## 🛠️ Admin Panel

### Access

Navigate to `/admin` (only accessible by authorized wallet addresses)

### Features

1. **Database Initialization**
   - One-click setup of all Jablix data
   - Safe to run multiple times (upsert mode)
   - Populates 50 elementals + 40 specials

2. **Live Statistics**
   - Total users, battles, listings
   - Real-time data refresh (30s interval)
   - Network status indicator

3. **Network Monitoring**
   - Current network display
   - Database connection status
   - Recent activity logs

### Admin Wallet Addresses

Configured in `src/config/suiConfig.ts`:
- Primary: `WALLETS.PUBLISHER`
- Secondary: `WALLETS.ADMIN_1`

---

## 🚀 Integration Examples

### Example 1: Fetching User's Jablixes

```typescript
async function getUserJablixes(wallet: string) {
  const response = await fetch(`/api/user/${wallet}/jablixes`);
  const data = await response.json();
  
  if (data.success) {
    return data.data; // Array of owned jablixes
  }
}
```

### Example 2: Creating Marketplace Listing

```typescript
async function listJablix(jablixId: string, price: number, type: 'elemental' | 'special') {
  const response = await fetch('/api/marketplace/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jablixId,
      jablixType: type,
      typeId: 16, // Example: Droplet
      seller: walletAddress,
      price,
    }),
  });
  
  const data = await response.json();
  return data;
}
```

### Example 3: Recording Battle Result

```typescript
async function recordBattle(battleData: {
  player1Wallet: string;
  player1JablixId: string;
  player2Wallet: string | null;
  result: 'win' | 'loss' | 'draw';
}) {
  const response = await fetch('/api/battles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(battleData),
  });
  
  return await response.json();
}
```

---

## 🔄 Workflow: Mint → Database → Marketplace

### Complete User Journey

1. **User Mints Jablix** (Blockchain)
   ```typescript
   // Execute mint transaction on Sui
   const tx = createMintElementalTransaction(jxcCoinId, typeId);
   const result = await signAndExecuteTransaction({ transaction: tx });
   ```

2. **Add to User's Collection** (Database)
   ```typescript
   // Record ownership in MongoDB
   await fetch(`/api/user/${wallet}/jablixes`, {
     method: 'POST',
     body: JSON.stringify({
       jablixId: result.objectId,
       typeId,
       type: 'elemental',
     }),
   });
   ```

3. **List on Marketplace** (Optional)
   ```typescript
   // Create marketplace listing
   await fetch('/api/marketplace/listings', {
     method: 'POST',
     body: JSON.stringify({
       jablixId: result.objectId,
       jablixType: 'elemental',
       typeId,
       seller: wallet,
       price: 5000, // JXC
     }),
   });
   ```

4. **Battle & Earn** (Tracked)
   ```typescript
   // Record battle result
   await fetch('/api/battles', {
     method: 'POST',
     body: JSON.stringify({
       player1Wallet: wallet,
       player1JablixId: result.objectId,
       result: 'win',
       rewardJxc: 100,
     }),
   });
   ```

---

## 📁 Key Files

### Configuration
- `src/config/env.ts` - Network environment config (testnet/mainnet)
- `src/lib/mongodb.ts` - MongoDB connection
- `src/lib/mongoDbService.ts` - Database operations

### API Routes
- `src/app/api/jablixes/` - Jablix data endpoints
- `src/app/api/user/` - User management
- `src/app/api/marketplace/` - Marketplace operations
- `src/app/api/battles/` - Battle history
- `src/app/api/stats/` - Global statistics
- `src/app/api/db/init/` - Database initialization

### UI Components
- `src/components/NetworkBadge.tsx` - Network indicator
- `src/components/DatabaseStatus.tsx` - Live DB stats
- `src/app/admin/page.tsx` - Admin dashboard

### Data Sources
- `src/data/elementalJablixDatabase.ts` - Elemental metadata
- `src/data/specialJablixDatabase.ts` - Special metadata

---

## 🎯 Deployment Checklist

### Before Going to Mainnet

- [ ] Update `CURRENT_NETWORK` in `src/config/env.ts` to `'mainnet'`
- [ ] Update MongoDB connection string for mainnet database
- [ ] Verify all smart contract addresses in `src/config/suiConfig.ts`
- [ ] Run database initialization on mainnet MongoDB
- [ ] Test all API endpoints on mainnet
- [ ] Verify network badge shows "🚀 MAINNET"
- [ ] Enable analytics and strict validation
- [ ] Update admin wallet addresses if needed
- [ ] Review and adjust feature flags

### Database Initialization Steps

1. Access admin panel: `/admin`
2. Connect with authorized wallet
3. Click "Initialize / Refresh Database"
4. Wait for confirmation (50 elementals + 40 specials)
5. Verify in DatabaseStatus widget
6. Check collections in MongoDB

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check MongoDB connection string in .env.local
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jablixarena

# Verify database name matches
DATABASE_NAME=jablixarena
```

### API Errors

- Check Next.js console for detailed error logs
- Verify MongoDB collections are created
- Ensure network matches between client and contract
- Check wallet permissions for admin routes

### Network Mismatch

- Verify `CURRENT_NETWORK` in env.ts
- Check Sui RPC endpoint
- Confirm package ID matches network
- Validate IPFS URLs are accessible

---

## 📚 Additional Resources

- [Sui Config Documentation](./src/config/suiConfig.ts)
- [API Reference](./MONGODB_INTEGRATION.md)

## 🔐 Security Note

**IMPORTANT**: Never commit real credentials to the repository. Always use environment variables:
- Store credentials in `.env.local` (not tracked by git)
- Use `process.env.MONGODB_URI` in your code
- Rotate credentials regularly for production

---

## ✅ Integration Complete!

MongoDB is now fully integrated with:
- ✅ 10+ REST API endpoints
- ✅ Testnet/Mainnet switching
- ✅ Admin dashboard
- ✅ Network indicators
- ✅ Complete CRUD operations
- ✅ Battle & marketplace tracking
- ✅ Real-time statistics
- ✅ Production-ready architecture

**Your Jablix Arena is ready for both testnet testing and mainnet deployment!** 🎮⚔️
