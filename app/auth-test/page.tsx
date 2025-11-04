"use client";

import { CheckProfiles } from "@/components/auth/check-profiles";
import { CreateProfileForm } from "@/components/auth/create-profile-form";
import { LoginConnectButton } from "@/components/auth/login-connect-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogout } from "@/hooks/auth/use-logout";
import { useAuthStore } from "@/stores/auth-store";

export default function AuthTestPage() {
  const { account, walletAddress, isWalletConnected, lensSession, isLoggedIn } = useAuthStore();
  const { logout } = useLogout();

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-3xl font-bold">Authentication Test Page</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current authentication state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p>
                <strong>Wallet Connected:</strong> {isWalletConnected ? "✅ Yes" : "❌ No"}
              </p>
              <p>
                <strong>Wallet Address:</strong> {walletAddress || "Not connected"}
              </p>
              <p>
                <strong>Lens Logged In:</strong> {isLoggedIn ? "✅ Yes" : "❌ No"}
              </p>
              <p>
                <strong>Lens Account:</strong> {account?.username?.localName || "Not logged in"}
              </p>
              <p>
                <strong>Session Active:</strong> {lensSession ? "✅ Yes" : "❌ No"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Actions</CardTitle>
            <CardDescription>Test authentication functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!account ? (
              <LoginConnectButton />
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✅ Successfully authenticated as @{account.username?.localName}
                  </p>
                </div>
                <Button onClick={logout} variant="destructive" className="w-full">
                  Logout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Details */}
        {account && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Information about the connected Lens account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p>
                    <strong>Username:</strong> @{account.username?.localName}
                  </p>
                  <p>
                    <strong>Address:</strong> {account.address}
                  </p>
                  <p>
                    <strong>Display Name:</strong> {account.metadata?.name || "Not set"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Bio:</strong> {account.metadata?.bio || "Not set"}
                  </p>
                  <p>
                    <strong>Profile Picture:</strong> {account.metadata?.picture ? "Set" : "Not set"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Check Existing Profiles */}
        {!account && (
          <Card className="md:col-span-2">
            <CheckProfiles />
          </Card>
        )}

        {/* Create Profile Form */}
        {!account && (
          <Card className="md:col-span-2">
            <CreateProfileForm />
          </Card>
        )}

        {/* Environment Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Environment Information</CardTitle>
            <CardDescription>Current configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Environment:</strong> {process.env.NEXT_PUBLIC_LENSFORUM_ENV || "mainnet (default)"}
            </p>
            <p>
              <strong>Network:</strong>{" "}
              {process.env.NEXT_PUBLIC_LENSFORUM_ENV === "testnet" ? "Lens Testnet" : "Lens Mainnet"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
