# ERC-1155 Token Gating Guide

## Overview

Your LensForum now supports **ERC-1155 semi-fungible tokens** for access control! This enables advanced use cases like tiered memberships, achievement-based access, and multi-token gating.

## What is ERC-1155?

ERC-1155 is a multi-token standard that allows a single smart contract to manage multiple token types. Each token type has a unique **Token ID**.

### Key Features:

- **Multiple token types in one contract**: Token ID 0, 1, 2, etc. can represent different items
- **Fungible per ID**: Each token ID can have multiple copies (like ERC-20)
- **Unique per ID**: Each token ID can be unique (like ERC-721)
- **Gas efficient**: Batch operations save gas costs

## Use Cases for Token Gating

### 1. **Tiered Membership System**

```typescript
// Example: Gaming DAO with membership tiers
Contract: 0x1234...MembershipNFT

Token ID 0 = "Basic Member"     → Access to general discussions
Token ID 1 = "Premium Member"   → Access to strategy channels
Token ID 2 = "VIP Member"       → Access to exclusive alpha channels
Token ID 3 = "Founder"          → Access to governance forums
```

**Configuration:**

- Token Standard: `ERC1155`
- Contract Address: `0x1234...MembershipNFT`
- Token ID: `2` (VIP tier)
- Minimum Balance: `1`

**Result:** Only users holding at least 1 of Token ID #2 can join.

---

### 2. **Achievement-Based Access**

```typescript
// Example: Game community requiring specific achievements
Contract: 0x5678...GameAchievements

Token ID 10 = "Completed Tutorial"
Token ID 25 = "Reached Level 50"
Token ID 42 = "Defeated Final Boss"
Token ID 99 = "Speedrun Champion"
```

**Configuration:**

- Token Standard: `ERC1155`
- Contract Address: `0x5678...GameAchievements`
- Token ID: `42` (Final Boss achievement)
- Minimum Balance: `1`

**Result:** Only players who defeated the final boss can access the endgame strategy forum.

---

### 3. **Event Ticket Gating**

```typescript
// Example: Conference community
Contract: 0xABCD...EventTickets

Token ID 2024 = "DevCon 2024 Ticket"
Token ID 2025 = "DevCon 2025 Ticket"
Token ID 3000 = "Speaker Pass"
Token ID 4000 = "Sponsor Pass"
```

**Configuration:**

- Token Standard: `ERC1155`
- Contract Address: `0xABCD...EventTickets`
- Token ID: `2025`
- Minimum Balance: `1`

**Result:** Only DevCon 2025 ticket holders can access the event forum.

---

### 4. **Multi-Item Requirements**

```typescript
// Example: Crafting game requiring multiple items
Contract: 0xDEF0...GameItems

Token ID 1 = "Iron Ore" (fungible)
Token ID 2 = "Coal" (fungible)
Token ID 3 = "Legendary Sword" (unique)
```

**Configuration (for exclusive blacksmith forum):**

- Token Standard: `ERC1155`
- Contract Address: `0xDEF0...GameItems`
- Token ID: `3` (Legendary Sword)
- Minimum Balance: `1`

**Result:** Only players who crafted the Legendary Sword can join.

---

## How to Configure ERC-1155 Token Gating

### Step 1: Navigate to Community Settings

1. Go to your community page
2. Click "Settings" (must be owner/moderator)
3. Select "Access Rules" tab

### Step 2: Configure Token Gate

1. **Token Standard**: Select `ERC1155 (Semi-Fungible)`
2. **Token Contract Address**: Enter the ERC-1155 contract address
   - Example: `0x1234567890abcdef1234567890abcdef12345678`
3. **Token ID**: Enter the specific token ID required
   - Example: `2` for VIP tier
   - Example: `42` for achievement badge
4. **Minimum Balance**: Enter how many of that token ID users must hold
   - Example: `1` for "must own at least 1"
   - Example: `5` for "must own at least 5"

### Step 3: Save and Test

1. Click "Update Rule"
2. Sign the transaction in your wallet
3. Test by trying to join with a different account

---

## Technical Implementation

### Token Gate Structure

```typescript
{
  type: "TokenGatedGroupRule",
  tokenGatedRule: {
    token: {
      currency: "0x1234...ContractAddress",  // ERC-1155 contract
      standard: TokenStandard.Erc1155,       // Semi-fungible standard
      value: "1",                             // Minimum balance required
      tokenId: "2"                            // Specific token ID (VIP tier)
    }
  }
}
```

### Verification Logic (Coming Soon)

When a user tries to join, the system will:

```typescript
// Pseudo-code for verification
const userBalance = await erc1155Contract.balanceOf(
  userAddress,
  tokenId, // Check balance of specific token ID
);

if (userBalance >= minimumRequired) {
  // Allow user to join
} else {
  // Show error: "You need at least X of Token ID Y"
}
```

---

## Comparison: ERC-20 vs ERC-721 vs ERC-1155

| Feature              | ERC-20                      | ERC-721                               | ERC-1155                         |
| -------------------- | --------------------------- | ------------------------------------- | -------------------------------- |
| **Use Case**         | Fungible tokens (USDC, DAI) | Unique NFTs (CryptoPunks, Bored Apes) | Multi-token (Games, Memberships) |
| **Token ID**         | ❌ No                       | ✅ Yes (each NFT unique)              | ✅ Yes (multiple types)          |
| **Fungibility**      | ✅ All identical            | ❌ All unique                         | ✅ Fungible per ID               |
| **Batch Operations** | ⚠️ Limited                  | ❌ No                                 | ✅ Yes                           |
| **Gas Efficiency**   | ⚠️ Medium                   | ⚠️ High                               | ✅ Low                           |
| **Best For**         | Token holders               | NFT collectors                        | Gamers, tiered access            |

---

## Real-World Examples

### 1. **Parallel TCG** (Trading Card Game)

- Contract: ERC-1155
- Token IDs = Different card types
- Rare cards = Token gate for exclusive strategy forums

### 2. **Decentraland Wearables**

- Contract: ERC-1155
- Token IDs = Different wearable items
- Exclusive fashion items = Access to designer communities

### 3. **Enjin Gaming Ecosystem**

- Contract: ERC-1155
- Token IDs = In-game items across multiple games
- Legendary items = Access to pro player forums

### 4. **OpenSea Shared Storefront**

- Contract: ERC-1155
- Token IDs = Different creator collections
- Specific collection holders = Access to creator communities

---

## Benefits of ERC-1155 for Your Forum

✅ **Flexible Access Control**: Different token IDs = different access levels  
✅ **Gas Efficient**: Cheaper to mint and transfer than ERC-721  
✅ **Scalable**: One contract can manage unlimited token types  
✅ **Future-Proof**: Supports both fungible and non-fungible use cases  
✅ **Gaming-Friendly**: Perfect for game-based communities  
✅ **Tiered Memberships**: Easy to implement bronze/silver/gold tiers

---

## Next Steps

1. ✅ **ERC-1155 UI is now enabled** in your token gating settings
2. ⏳ **Token verification** will be implemented in Phase 1 (8-10 hours)
3. 🚀 **You can now configure ERC-1155 rules** for your communities!

---

## Questions?

**Q: Can I require multiple different token IDs?**  
A: Currently, you can set one token ID per community. For multiple requirements, you'd need to create a custom smart contract that checks multiple conditions.

**Q: What happens if a user transfers their tokens after joining?**  
A: Currently, membership is permanent once joined. Phase 3 will add real-time balance monitoring to auto-remove users who no longer meet requirements.

**Q: Can I use the same ERC-1155 contract for multiple communities?**  
A: Yes! Each community can require a different token ID from the same contract. Perfect for tiered access.

**Q: How do I find the token ID for an ERC-1155 NFT?**  
A: Check the NFT marketplace (OpenSea, Rarible) or use a block explorer (Etherscan) to view the token ID in the contract.

---

## Example Configuration Scenarios

### Scenario 1: Gaming Guild

```
Community: "Elite Raiders Guild"
Token Standard: ERC1155
Contract: 0x...GameItems
Token ID: 999 (Legendary Raid Badge)
Min Balance: 1
→ Only players who completed the legendary raid can join
```

### Scenario 2: Tiered DAO

```
Community: "Governance Forum"
Token Standard: ERC1155
Contract: 0x...DAOMembership
Token ID: 3 (Governance Token Tier 3)
Min Balance: 1
→ Only Tier 3+ members can participate in governance
```

### Scenario 3: Event Community

```
Community: "ETHDenver 2025 Attendees"
Token Standard: ERC1155
Contract: 0x...EventPOAPs
Token ID: 2025 (ETHDenver 2025 POAP)
Min Balance: 1
→ Only verified attendees can access the community
```

---

**Your forum now supports the most flexible token standard in Web3!** 🎉
