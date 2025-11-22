#!/bin/bash

# This script updates your .env.local file with Supabase credentials
# Run this script: chmod +x setup-env.sh && ./setup-env.sh

ENV_FILE=".env.local"

# Supabase credentials from local instance
SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"

# Create or update .env.local
cat > "$ENV_FILE" << EOF
# Supabase Configuration
SUPABASE_URL=$SUPABASE_URL
SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Lens Protocol Environment (testnet recommended for development)
NEXT_PUBLIC_LENSFORUM_ENV=testnet

# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Admin Wallet Private Key (for administrative operations)
PRIVATE_KEY=your_private_key_here

# Target Group Address for Single-Group Forum
NEXT_PUBLIC_TARGET_GROUP_ADDRESS=0x461090932c2afd871c00F44679678E1C59008f59
EOF

echo "✅ .env.local has been updated with Supabase credentials!"
echo "📝 Don't forget to add your WalletConnect Project ID and Private Key if needed."
