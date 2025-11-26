# Token Verification Implementation Plan

## Overview

This document outlines the step-by-step implementation of token verification for the LensForum token gating system.

## Current Status

- ✅ Token gating UI complete (ERC-20, ERC-721, ERC-1155)
- ✅ Lens Protocol integration complete
- ✅ Token gate configuration working
- ❌ Token balance verification not implemented
- ❌ Join flow enforcement not implemented

## Implementation Tasks

### Phase 1: Token Verification Service (4-5 hours)

#### File: `lib/services/verification/verify-token-requirements.ts`

**Purpose**: Core service to verify if a user meets token requirements

**Functions to Implement**:

1. `verifyTokenRequirements()`
   - Main verification function
   - Handles all three token standards
   - Returns detailed verification result

2. `checkERC20Balance()`
   - Query ERC-20 token balance
   - Compare against minimum requirement

3. `checkERC721Balance()`
   - Query ERC-721 NFT balance
   - Verify ownership

4. `checkERC1155Balance()`
   - Query ERC-1155 balance for specific token ID
   - Compare against minimum requirement

5. `getTokenMetadata()`
   - Fetch token symbol/name
   - Improve error messages

**Dependencies**:

- `viem` - For blockchain queries
- `@lens-protocol/client` - For rule parsing
- Public RPC client

**Testing Scenarios**:

- User has sufficient tokens → Allow join
- User has insufficient tokens → Block with helpful message
- Invalid token contract → Handle gracefully
- Network errors → Retry logic

---

### Phase 2: Join Flow Integration (2-3 hours)

#### File: `lib/services/membership/join-community.ts`

**Changes Needed**:

1. Add verification check before join
2. Return detailed error with token requirements
3. Handle verification failures gracefully
4. Add loading states

**Flow**:

```
User clicks "Join"
  → Check if community has token gate
  → Verify user's token balance
  → If insufficient: Show error with details
  → If sufficient: Proceed with join
  → Update UI based on result
```

---

### Phase 3: Enhanced UX (2-3 hours)

#### Files to Update:

1. `components/communities/display/join-community-button.tsx`
   - Add pre-join balance check
   - Show "You qualify" or "Need X more tokens"
   - Add refresh button

2. `components/communities/rules/community-rule-details.tsx`
   - Display token requirements more prominently
   - Show token symbol/name
   - Add helpful context

3. `hooks/communities/use-join-community.ts`
   - Integrate verification
   - Handle loading states
   - Improve error messages

**New Hook**: `hooks/verification/use-token-verification.ts`

- React hook for token verification
- Caching with React Query
- Auto-refresh on wallet change

---

## File Structure

```
lib/
├── services/
│   ├── verification/
│   │   ├── verify-token-requirements.ts    [NEW]
│   │   ├── check-erc20-balance.ts          [NEW]
│   │   ├── check-erc721-balance.ts         [NEW]
│   │   ├── check-erc1155-balance.ts        [NEW]
│   │   └── get-token-metadata.ts           [NEW]
│   └── membership/
│       └── join-community.ts               [UPDATE]
│
hooks/
├── verification/
│   └── use-token-verification.ts           [NEW]
└── communities/
    └── use-join-community.ts               [UPDATE]
│
components/
├── communities/
│   ├── display/
│   │   └── join-community-button.tsx       [UPDATE]
│   └── rules/
│       └── community-rule-details.tsx      [UPDATE]
```

---

## Implementation Order

### Step 1: Core Verification Service ⭐ START HERE

**File**: `lib/services/verification/verify-token-requirements.ts`
**Time**: 4-5 hours
**Priority**: CRITICAL

This is the foundation - everything else depends on it.

### Step 2: Join Flow Integration

**File**: `lib/services/membership/join-community.ts`
**Time**: 2-3 hours
**Priority**: CRITICAL

Makes the verification actually work in the join flow.

### Step 3: UI Updates

**Files**: Multiple component files
**Time**: 2-3 hours
**Priority**: HIGH

Improves user experience with better feedback.

---

## Success Criteria

### Minimum Viable Product (MVP)

- ✅ Users cannot join if they don't meet token requirements
- ✅ Clear error message explaining what's needed
- ✅ Works for all three token standards (ERC-20, ERC-721, ERC-1155)

### Production Ready

- ✅ Pre-join balance checks (before user clicks join)
- ✅ Token symbol/name displayed (not just address)
- ✅ Helpful error messages with exact requirements
- ✅ Loading states during verification
- ✅ Refresh balance functionality

---

## Testing Checklist

### ERC-20 Testing

- [ ] User with sufficient tokens can join
- [ ] User with insufficient tokens cannot join
- [ ] Error message shows exact amount needed
- [ ] Token symbol displayed correctly

### ERC-721 Testing

- [ ] User with NFT can join
- [ ] User without NFT cannot join
- [ ] Error message shows NFT requirement
- [ ] Collection name displayed correctly

### ERC-1155 Testing

- [ ] User with correct token ID can join
- [ ] User without token ID cannot join
- [ ] User with wrong token ID cannot join
- [ ] Error message shows token ID requirement
- [ ] Balance check uses correct token ID

### Edge Cases

- [ ] Invalid token contract address
- [ ] Network errors handled gracefully
- [ ] Wallet not connected
- [ ] Wrong network
- [ ] Token contract doesn't exist

---

## Next Steps

1. **Review this plan** - Make sure we're aligned on approach
2. **Start with Step 1** - Build core verification service
3. **Test thoroughly** - Verify all token standards work
4. **Integrate** - Connect to join flow
5. **Polish** - Add enhanced UX

---

## Questions to Consider

1. **RPC Provider**: Which RPC should we use for token queries?
   - Public RPC (free but rate-limited)
   - Alchemy/Infura (paid but reliable)
   - Current: Using Lens Chain RPC

2. **Caching**: How long should we cache token balances?
   - Suggestion: 30 seconds (balance can change)
   - Use React Query for automatic cache management

3. **Error Handling**: What should happen if verification fails?
   - Show error message
   - Allow retry
   - Suggest troubleshooting steps

4. **Loading States**: How to handle verification time?
   - Show spinner
   - Disable join button
   - Display "Checking balance..." message

---

## Ready to Start!

We'll begin with **Step 1: Core Verification Service**.

This will be the foundation for everything else. Once this is working, the rest will fall into place quickly.

Let's build this! 🚀
