# LensForum

A decentralized forum application built on Lens Protocol V3 with Web3 authentication, Supabase storage, and a rich text editor.

## 🚀 Features

- **Decentralized Authentication**: Web3 wallet connection with Lens Protocol integration
- **Community Management**: Create and manage decentralized communities
- **Rich Text Editor**: Advanced text editing with TipTap
- **Real-time Storage**: Supabase for metadata and thread indexing
- **IPFS Integration**: Decentralized content storage via Grove
- **Responsive Design**: Modern UI with Tailwind CSS and Radix UI

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Web3**: Wagmi, ConnectKit, Lens Protocol SDK
- **Storage**: Supabase, IPFS (Grove)
- **UI**: Tailwind CSS, Radix UI, Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation

## 📋 Prerequisites

- Node.js 18+ and pnpm
- A Web3 wallet (MetaMask, WalletConnect compatible)
- Supabase account (for local development)

## ⚙️ Environment Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd lens-forum
pnpm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:

```bash
# Supabase Configuration
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Lens Protocol Environment (testnet recommended for development)
NEXT_PUBLIC_LENSFORUM_ENV=testnet

# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Admin Wallet Private Key (for administrative operations)
PRIVATE_KEY=your_private_key_here
```

### 3. Get WalletConnect Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create an account and new project
3. Copy the Project ID to your `.env.local` file

### 4. Set Up Supabase (Local Development)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Start local Supabase instance
supabase start

# Generate database types
pnpm gen:db-types
```

## 🔐 Authentication Setup

LensForum uses a two-step authentication process:

### Step 1: Wallet Connection

Users connect their Web3 wallet using WalletConnect/ConnectKit.

### Step 2: Lens Account Selection

After wallet connection, users select from their available Lens Protocol accounts.

### For Development (Testnet)

**Important**: You need a Lens account on the **testnet** to use the app in development mode.

#### Create a Testnet Lens Account:

1. **Visit**: [testnet.hey.xyz](https://testnet.hey.xyz)
2. **Connect** your development wallet
3. **Create** a Lens profile on testnet (free)
4. **Return** to your local app and authenticate

#### Why Testnet?

- **Free transactions** - no real costs
- **Safe testing** - no financial risk
- **Separate from mainnet** - testnet and mainnet accounts are different

### For Production (Mainnet)

To switch to mainnet:

```bash
# In .env.local
NEXT_PUBLIC_LENSFORUM_ENV=mainnet
```

⚠️ **Warning**: Mainnet incurs real transaction costs (gas fees on Polygon).

## 🚀 Development

### Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Authentication Flow

1. **Connect Wallet**: Click "Connect Wallet" button
2. **Select Wallet**: Choose your preferred wallet (MetaMask, etc.)
3. **Approve Connection**: Confirm in your wallet
4. **Select Lens Account**: Choose from available Lens accounts
5. **Access Forum**: Start using the decentralized forum

### Common Issues

#### "No Lens accounts found"

- **Cause**: No Lens account on the current network (testnet/mainnet)
- **Solution**: Create a Lens account on [testnet.hey.xyz](https://testnet.hey.xyz) for development

#### "WalletConnect connection failed"

- **Cause**: Invalid or missing WalletConnect Project ID
- **Solution**: Verify your `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` in `.env.local`

#### "Authentication failed"

- **Cause**: Network mismatch or wallet issues
- **Solution**: Ensure your wallet is on the correct network and try reconnecting

## 📁 Project Structure

```
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── ui/              # Reusable UI components
│   └── providers/       # Context providers
├── hooks/               # Custom React hooks
│   └── auth/           # Authentication hooks
├── lib/                 # Utility libraries
│   ├── external/       # External service integrations
│   └── shared/         # Shared constants and utilities
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
└── .kiro/              # Kiro specs and configuration
    └── specs/          # Feature specifications
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev                 # Start development server
pnpm build              # Build for production
pnpm start              # Start production server

# Code Quality
pnpm lint               # Run ESLint
pnpm lint:fix           # Fix ESLint issues
pnpm format             # Format code with Prettier
pnpm type-check         # Run TypeScript checks
pnpm check-all          # Run all checks
pnpm fix-all            # Fix formatting and linting

# Database
pnpm gen:db-types       # Generate Supabase types
```

## 🌐 Network Configuration

The app automatically switches between networks based on `NEXT_PUBLIC_LENSFORUM_ENV`:

### Testnet Configuration

- **Network**: Lens Testnet
- **RPC**: `https://rpc.testnet.lens.dev`
- **Hey URL**: `https://testnet.hey.xyz`
- **Costs**: Free (test tokens)

### Mainnet Configuration

- **Network**: Lens Mainnet (Polygon)
- **RPC**: `https://rpc.lens.xyz`
- **Hey URL**: `https://hey.xyz`
- **Costs**: Real gas fees (~$0.01-$0.50 per transaction)

## 🔒 Security Notes

- **Never commit** `.env.local` to version control
- **Use testnet** for development and testing
- **Generate dedicated wallets** for development (never use mainnet wallets)
- **Keep private keys secure** and never share them

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm check-all` to ensure code quality
5. Submit a pull request

## 📚 Additional Resources

- [Lens Protocol Documentation](https://docs.lens.xyz/)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 🐛 Troubleshooting

### Environment Issues

- Verify all required environment variables are set
- Check that WalletConnect Project ID is valid
- Ensure Supabase is running locally

### Authentication Issues

- Create a Lens account on the correct network (testnet for development)
- Verify wallet is connected to the correct network
- Check browser console for detailed error messages

### Development Issues

- Clear browser cache and localStorage
- Restart the development server
- Check that all dependencies are installed with `pnpm install`

For more detailed troubleshooting, check the authentication system specification in `.kiro/specs/authentication-system-fix/`.

## Directory Structure of the whole project

Directory structure:
└── fritzdvl-app/
├── components.json
├── next.config.mjs
├── package.json
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
├── .eslintrc.json
├── .prettierignore
├── .prettierrc.js
├── app/
│ ├── globals.css
│ ├── layout.tsx
│ ├── page.tsx
│ ├── actions/
│ │ └── revalidate-path.ts
│ ├── communities/
│ │ ├── page.tsx
│ │ ├── [address]/
│ │ │ ├── page.tsx
│ │ │ ├── edit/
│ │ │ │ └── page.tsx
│ │ │ └── new-thread/
│ │ │ └── page.tsx
│ │ └── new/
│ │ └── page.tsx
│ ├── notifications/
│ │ └── page.tsx
│ ├── reply/
│ │ └── [replyId]/
│ │ └── page.tsx
│ ├── rewards/
│ │ └── page.tsx
│ ├── terms/
│ │ └── page.tsx
│ ├── thread/
│ │ └── [slug]/
│ │ ├── page.tsx
│ │ └── edit/
│ │ └── page.tsx
│ └── u/
│ └── [username]/
│ └── page.tsx
├── components/
│ ├── assets/
│ │ ├── hey-logo.tsx
│ │ └── lensreputation-logo.tsx
│ ├── auth/
│ │ ├── login-connect-button.tsx
│ │ └── login-lens-accounts-dialog.tsx
│ ├── communities/
│ │ ├── community-creation-tips.tsx
│ │ ├── display/
│ │ │ ├── community-header-actions.tsx
│ │ │ ├── community-header.tsx
│ │ │ ├── community-leave-dialog.tsx
│ │ │ ├── community-moderators.tsx
│ │ │ ├── community-nav-actions.tsx
│ │ │ ├── community-owner.tsx
│ │ │ ├── community-sidebar.tsx
│ │ │ ├── join-community-button.tsx
│ │ │ ├── leave-community-button.tsx
│ │ │ └── new-thread-button.tsx
│ │ ├── forms/
│ │ │ ├── community-create-form.tsx
│ │ │ ├── community-create-rules-form.tsx
│ │ │ └── rules/
│ │ │ ├── membership-approval-rule-form.tsx
│ │ │ ├── rule-type-select.tsx
│ │ │ ├── simple-payment-rule-form.tsx
│ │ │ └── token-gated-rule-form.tsx
│ │ ├── list/
│ │ │ ├── communities-header.tsx
│ │ │ ├── communities-list.tsx
│ │ │ ├── communities-stats.tsx
│ │ │ ├── communities.tsx
│ │ │ └── community-card.tsx
│ │ ├── rules/
│ │ │ ├── community-rule-details.tsx
│ │ │ ├── community-rule-message.tsx
│ │ │ ├── community-rules-tips.tsx
│ │ │ └── edit/
│ │ │ ├── community-rules-manager.tsx
│ │ │ └── types/
│ │ │ ├── membership-approval-rule-edit-config.tsx
│ │ │ ├── simple-payment-rule-edit-config.tsx
│ │ │ └── token-gated-rule-edit-config.tsx
│ │ ├── settings/
│ │ │ ├── community-access-denied.tsx
│ │ │ ├── community-edit-form.tsx
│ │ │ ├── community-settings-client.tsx
│ │ │ ├── community-settings-tab-panel.tsx
│ │ │ ├── members/
│ │ │ │ ├── community-banned-accounts.tsx
│ │ │ │ ├── community-members-manager.tsx
│ │ │ │ ├── community-members.tsx
│ │ │ │ ├── community-membership-requests.tsx
│ │ │ │ ├── community-user-card.tsx
│ │ │ │ ├── remove-member-dialog.tsx
│ │ │ │ └── unban-member-dialog.tsx
│ │ │ └── moderators/
│ │ │ └── community-moderators-manager.tsx
│ │ └── threads/
│ │ ├── community-thread-card.tsx
│ │ ├── community-threads-list.tsx
│ │ ├── community-threads.tsx
│ │ └── crosspost-switch.tsx
│ ├── editor/
│ │ ├── block-handle.tsx
│ │ ├── code-block-view.tsx
│ │ ├── emojis.ts
│ │ ├── extension.ts
│ │ ├── image-upload-popover.tsx
│ │ ├── image-view.tsx
│ │ ├── inline-menu.tsx
│ │ ├── mention-picker.tsx
│ │ ├── mention-popover.tsx
│ │ ├── mention.tsx
│ │ ├── slash-menu-empty.tsx
│ │ ├── slash-menu-item.tsx
│ │ ├── slash-menu.tsx
│ │ ├── table-handle.tsx
│ │ ├── text-editor.css
│ │ ├── text-editor.tsx
│ │ ├── toolbar-button.tsx
│ │ ├── toolbar.tsx
│ │ └── upload-file.tsx
│ ├── home/
│ │ ├── featured-communities.tsx
│ │ ├── hero-section.tsx
│ │ ├── stats-bar.tsx
│ │ ├── thread-list-item.tsx
│ │ ├── thread-votes-display.tsx
│ │ ├── threads-list.tsx
│ │ └── threads-switcher.tsx
│ ├── layout/
│ │ ├── container.tsx
│ │ ├── footer.tsx
│ │ ├── navbar-desktop.tsx
│ │ ├── navbar-mobile.tsx
│ │ └── navbar.tsx
│ ├── notifications/
│ │ ├── avatar-profile-link.tsx
│ │ ├── mention-notification-item.tsx
│ │ ├── notification-card.tsx
│ │ ├── notification-item.tsx
│ │ ├── notifications-filter.tsx
│ │ ├── notifications-list.tsx
│ │ ├── reaction-notification-item.tsx
│ │ ├── reply-notification-item.tsx
│ │ └── token-distribution-notification-item.tsx
│ ├── pages/
│ │ └── protected-route.tsx
│ ├── profile/
│ │ ├── profile-header.tsx
│ │ ├── profile-joined-communities.tsx
│ │ ├── profile-recent-activity.tsx
│ │ ├── profile-stats.tsx
│ │ ├── profile-tabs-manager.tsx
│ │ ├── profile-tabs.tsx
│ │ └── profile.tsx
│ ├── providers/
│ │ ├── app-provider.tsx
│ │ ├── connect-provider.tsx
│ │ └── web3-provider.tsx
│ ├── reply/
│ │ ├── reply-shared-card.tsx
│ │ ├── reply-to-shared-card.tsx
│ │ └── reply-voting.tsx
│ ├── rewards/
│ │ └── rewards-history.tsx
│ ├── shared/
│ │ ├── content-renderer.tsx
│ │ ├── pagination.tsx
│ │ ├── rules-guidelines.tsx
│ │ ├── status-banner.tsx
│ │ └── tip-gho-popover.tsx
│ ├── theme/
│ │ ├── theme-provider.tsx
│ │ └── theme-toggle.tsx
│ ├── thread/
│ │ ├── join-community-announcement.tsx
│ │ ├── thread-actions.tsx
│ │ ├── thread-card-actions.tsx
│ │ ├── thread-card-info.tsx
│ │ ├── thread-card-reply-box.tsx
│ │ ├── thread-card.tsx
│ │ ├── thread-create-form.tsx
│ │ ├── thread-in-reply-to.tsx
│ │ ├── thread-replies-list.tsx
│ │ ├── thread-reply-actions.tsx
│ │ ├── thread-reply-box.tsx
│ │ ├── thread-reply-card.tsx
│ │ ├── thread-reply-moderator-actions.tsx
│ │ ├── thread-share-dialog.tsx
│ │ ├── thread-sidebar.tsx
│ │ ├── thread-simple-main-card.tsx
│ │ ├── thread-voting.tsx
│ │ ├── thread.tsx
│ │ └── edit/
│ │ └── thread-edit-form.tsx
│ └── ui/
│ ├── accordion.tsx
│ ├── alert-dialog.tsx
│ ├── alert.tsx
│ ├── aspect-ratio.tsx
│ ├── avatar.tsx
│ ├── back-navigation-link.tsx
│ ├── badge.tsx
│ ├── breadcrumb.tsx
│ ├── button.tsx
│ ├── calendar.tsx
│ ├── card.tsx
│ ├── carousel.tsx
│ ├── chart.tsx
│ ├── checkbox.tsx
│ ├── collapsible.tsx
│ ├── command.tsx
│ ├── context-menu.tsx
│ ├── custom-select-item.tsx
│ ├── dialog.tsx
│ ├── drawer.tsx
│ ├── dropdown-menu.tsx
│ ├── form.tsx
│ ├── hover-card.tsx
│ ├── image-upload-input.tsx
│ ├── input-otp.tsx
│ ├── input.tsx
│ ├── label.tsx
│ ├── loading-spinner.tsx
│ ├── menubar.tsx
│ ├── navigation-menu.tsx
│ ├── pagination.tsx
│ ├── popover.tsx
│ ├── progress.tsx
│ ├── radio-group.tsx
│ ├── resizable.tsx
│ ├── scroll-area.tsx
│ ├── select.tsx
│ ├── separator.tsx
│ ├── sheet.tsx
│ ├── sidebar.tsx
│ ├── skeleton.tsx
│ ├── slider.tsx
│ ├── sonner.tsx
│ ├── switch.tsx
│ ├── table.tsx
│ ├── tabs.tsx
│ ├── tags-input.tsx
│ ├── textarea.tsx
│ ├── toast.tsx
│ ├── toggle-group.tsx
│ ├── toggle.tsx
│ ├── tooltip.tsx
│ ├── use-mobile.tsx
│ └── user-search.tsx
├── fragments/
│ ├── index.ts
│ └── notifications.ts
├── hooks/
│ ├── account/
│ │ └── use-profile-account.ts
│ ├── admin/
│ │ └── use-is-admin.ts
│ ├── auth/
│ │ ├── use-login.ts
│ │ ├── use-logout.ts
│ │ └── use-switch-account.ts
│ ├── common/
│ │ ├── use-mobile.tsx
│ │ └── use-voting.ts
│ ├── communities/
│ │ ├── use-add-moderator.ts
│ │ ├── use-community-banned-members.ts
│ │ ├── use-community-members.ts
│ │ ├── use-community-membership-management.ts
│ │ ├── use-community-membership.ts
│ │ ├── use-community-remove-member.ts
│ │ ├── use-community-rules.ts
│ │ ├── use-community-unban-member.ts
│ │ ├── use-is-moderator.ts
│ │ ├── use-join-community.ts
│ │ ├── use-leave-community.ts
│ │ ├── use-remove-moderator.ts
│ │ └── use-request-join-community.ts
│ ├── editor/
│ │ └── use-account-search.ts
│ ├── forms/
│ │ ├── use-community-create-form.ts
│ │ ├── use-community-edit-form.ts
│ │ ├── use-tags-input.ts
│ │ ├── use-thread-create-form.ts
│ │ └── use-thread-edit-form.ts
│ ├── notifications/
│ │ └── use-notifications.ts
│ ├── queries/
│ │ ├── use-community.ts
│ │ ├── use-reply.ts
│ │ ├── use-thread-replies.ts
│ │ └── use-thread.ts
│ ├── replies/
│ │ ├── use-hide-reply.ts
│ │ └── use-reply-create.ts
│ ├── rewards/
│ │ └── use-token-distributions.ts
│ └── threads/
│ ├── use-can-edit-thread.ts
│ └── use-threads-paginated.ts
├── lib/
│ ├── env.ts
│ ├── adapters/
│ │ ├── community-adapter.ts
│ │ ├── reply-adapter.ts
│ │ ├── thread-adapter.ts
│ │ └── token-distribution-adapter.ts
│ ├── domain/
│ │ ├── communities/
│ │ │ └── types.ts
│ │ ├── replies/
│ │ │ ├── content.ts
│ │ │ └── types.ts
│ │ ├── rewards/
│ │ │ └── token-distribution.ts
│ │ ├── rules/
│ │ │ └── types.ts
│ │ └── threads/
│ │ ├── content.ts
│ │ ├── types.ts
│ │ └── validation.ts
│ ├── external/
│ │ ├── grove/
│ │ │ ├── client.ts
│ │ │ └── upload-image.ts
│ │ ├── lens/
│ │ │ ├── admin-session.ts
│ │ │ ├── chain.ts
│ │ │ ├── protocol-client.ts
│ │ │ └── primitives/
│ │ │ ├── accounts.ts
│ │ │ ├── admins.ts
│ │ │ ├── articles.ts
│ │ │ ├── feeds.ts
│ │ │ ├── groups.ts
│ │ │ ├── notifications.ts
│ │ │ ├── posts.ts
│ │ │ └── token-distribution.ts
│ │ ├── prosekit/
│ │ │ ├── markdown.ts
│ │ │ └── helpers/
│ │ │ ├── rehype-join-paragraph.ts
│ │ │ ├── rehype-mention-to-markdown-link.ts
│ │ │ ├── remark-break-handler.ts
│ │ │ └── remark-link-protocol.ts
│ │ ├── slug/
│ │ │ └── generate-slug.ts
│ │ ├── supabase/
│ │ │ ├── client.ts
│ │ │ ├── communities.ts
│ │ │ ├── stats.ts
│ │ │ └── threads.ts
│ │ └── wallets/
│ │ └── admin-wallet.ts
│ ├── services/
│ │ ├── account/
│ │ │ ├── get-account-by-username.ts
│ │ │ └── get-account-stats.ts
│ │ ├── community/
│ │ │ ├── add-moderator.ts
│ │ │ ├── create-community.ts
│ │ │ ├── get-communities-joined.ts
│ │ │ ├── get-communities-paginated.ts
│ │ │ ├── get-community.ts
│ │ │ ├── get-featured-communities.ts
│ │ │ ├── remove-moderator.ts
│ │ │ ├── remove-rule-community.ts
│ │ │ ├── update-community.ts
│ │ │ └── update-rule-community.ts
│ │ ├── membership/
│ │ │ ├── check-community-membership.ts
│ │ │ ├── join-community.ts
│ │ │ └── leave-community.ts
│ │ ├── notifications/
│ │ │ └── get-all-notifications.ts
│ │ ├── reply/
│ │ │ ├── create-reply.ts
│ │ │ ├── get-latest-replies-by-author.ts
│ │ │ ├── get-replies-by-parent-id.ts
│ │ │ ├── get-reply.ts
│ │ │ └── get-thread-replies.ts
│ │ ├── stats/
│ │ │ └── get-forum-statistics.ts
│ │ └── thread/
│ │ ├── create-thread.ts
│ │ ├── get-community-threads.ts
│ │ ├── get-featured-threads.ts
│ │ ├── get-latest-threads.ts
│ │ ├── get-thread.ts
│ │ └── update-thread.ts
│ └── shared/
│ ├── constants.ts
│ ├── payment-tokens.ts
│ └── utils.ts
├── public/
│ └── 3534416bbfdcc9be-s.p.woff2
├── scripts/
│ ├── check-my-builder-status.js
│ ├── find-group-manager.js
│ └── inspect-lens-state.js
├── stores/
│ └── auth-store.ts
├── styles/
│ └── rich-text-content.css
├── supabase/
│ ├── config.toml
│ └── migrations/
│ ├── 20250620100640_add_community_table.sql
│ ├── 20250620100910_add_thread_table.sql
│ ├── 20250623121606_add_author_column_at_community_threads.sql
│ ├── 20250623212650_add_thread_main_post_column.sql
│ ├── 20250624110308_add_posts_count_colum_to_threads.sql
│ ├── 20250626092327_add_community_name_column.sql
│ ├── 20250703173843_add_increment_replies_count_function.sql
│ ├── 20250703181530_add_members_count_to_communities_table.sql
│ ├── 20250709080338_add_featured_column_to_communities.sql
│ ├── 20250712121251_fix_column_community_threads_root_post.sql
│ ├── 20250712125526_add_featured_column_community_threads_table.sql
│ ├── 20250906053227_add_visibility_threads_communities.sql
│ ├── 20250906054147_remote_schema.sql
│ ├── 20250906193544_add_feed_column_to_communities.sql
│ └── 20250908194414_add_title_summary_thread_table.sql
├── types/
│ ├── common.ts
│ └── supabase.ts
└── .github/
└── copilot-instructions.md
