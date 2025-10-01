# LensForum Copilot Instructions

LensForum is a Next.js 14 decentralized forum built on Lens Protocol V3 with Web3 authentication, Supabase storage, and a rich text editor.

## Architecture Overview

**Multi-Service Integration Pattern:**

- **Lens Protocol**: Primary data layer via `@lens-protocol/client` and `@lens-protocol/react`
- **Supabase**: Secondary storage for metadata, communities, and thread indexing
- **Grove**: IPFS storage client via `@lens-chain/storage-client`
- **Wagmi + ConnectKit**: Web3 wallet connectivity and transaction management

**Environment-Aware Configuration:**

- Use `lib/env.ts` (getCurrentEnv(), isMainnet()) to switch between mainnet/testnet
- Constants in `lib/shared/constants.ts` adapt addresses and configurations per environment
- Lens client initialization in `lib/external/lens/protocol-client.ts` follows this pattern

## Core Development Patterns

**Service Layer Architecture:**

```
lib/services/[domain]/[action].ts → lib/adapters/[domain]-adapter.ts → types/[domain].ts
```

- Services handle business logic and external API calls
- Adapters transform external data to internal domain types
- Example: `lib/services/thread/create-thread.ts` → `lib/adapters/thread-adapter.ts`

**Authentication Flow:**

- Zustand store (`stores/auth-store.ts`) manages wallet + Lens session state
- Multi-step auth: wallet connection → Lens account selection → session creation
- Use `hooks/auth/use-login.ts` for authentication logic, never direct store manipulation

**Data Flow Pattern:**

1. User action triggers service function with domain types
2. Service calls Lens Protocol APIs and/or Supabase operations
3. Adapter transforms response to domain types
4. UI components receive typed domain objects

## Development Workflows

**Local Development:**

```bash
pnpm dev                    # Start Next.js dev server
supabase start             # Start local Supabase (in separate terminal)
supabase db reset          # Reset local database with migrations
```

**Code Quality:**

```bash
pnpm check-all             # Run type-check + lint + format checks
pnpm fix-all              # Auto-fix formatting and linting issues
```

## Component Conventions

**UI Components:**

- Use `components/ui/` for shadcn/ui primitives with CVA variants
- Feature components in `components/[domain]/` follow domain boundaries
- Custom Tailwind theme with CSS variables for light/dark mode support

**Rich Text Editor:**

- ProseKit-based editor in `components/editor/text-editor.tsx`
- Markdown ↔ HTML conversion via `lib/external/prosekit/markdown.ts`
- Supports mentions, slash commands, and block editing

**Provider Hierarchy:**

```tsx
<ThemeProvider>
  <Web3Provider>
    {" "}
    {/* Wagmi + Lens Protocol */}
    <AppProvider>
      <Container>{children}</Container>
    </AppProvider>
  </Web3Provider>
</ThemeProvider>
```

## Critical Integration Points

**Lens Protocol V3:**

- Session management via `@lens-protocol/react` hooks
- Fragment system for GraphQL queries (see `fragments/index.ts`)
- Posts, Comments, Groups, and Feeds are primary entities

**Database Schema:**

- `communities` table maps to Lens Groups with feed addresses
- `community_threads` tracks thread metadata with Lens post IDs
- Use Supabase types from `types/supabase.ts` for database operations

**Web3 Patterns:**

- Transaction signing through Wagmi's `useWalletClient`
- Environment-specific chain configuration in `components/providers/web3-provider.tsx`
- Always check wallet connection status before Lens operations

## Common Anti-Patterns

❌ **Don't** call Lens APIs directly from components - use service layer
❌ **Don't** hardcode addresses/URLs - use environment-aware constants  
❌ **Don't** bypass adapter pattern - always transform external data
❌ **Don't** ignore error handling - Lens SDK returns Result types with `.isOk()`

## Key Files to Reference

- `lib/services/thread/create-thread.ts` - Complete service implementation example
- `hooks/auth/use-login.ts` - Authentication patterns
- `components/providers/web3-provider.tsx` - Web3 setup
- `lib/adapters/thread-adapter.ts` - Data transformation patterns
