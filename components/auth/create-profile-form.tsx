"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/lib/external/lens/protocol-client";
import { getAdminWallet } from "@/lib/external/wallets/admin-wallet";
import { createAccount } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/react";
import { Loader2, User } from "lucide-react";
import { useAccount } from "wagmi";

export function CreateProfileForm() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    bio: "",
  });

  const { address, isConnected } = useAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }

    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      // Get the admin wallet for account creation
      const adminWallet = await getAdminWallet();

      // Create the account
      const result = await createAccount(client, {
        account: evmAddress(address),
        username: {
          localName: formData.username.toLowerCase().trim(),
        },
        accountManager: adminWallet.account.address,
        metadataUri: "", // You might want to upload metadata to IPFS first
      });

      if (result.isOk()) {
        setSuccess(`Profile @${formData.username} created successfully!`);
        setFormData({ username: "", displayName: "", bio: "" });
      } else {
        setError(`Failed to create profile: ${result.error.message || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("Error creating profile:", err);
      setError(`Error creating profile: ${err.message || "Unknown error"}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create New Profile</CardTitle>
          <CardDescription>Create a new Lens profile for your wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please connect your wallet first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Create New Profile
        </CardTitle>
        <CardDescription>Create a new Lens profile for your connected wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username (e.g., johndoe)"
              value={formData.username}
              onChange={e => handleInputChange("username", e.target.value)}
              disabled={isCreating}
              className="lowercase"
            />
            <p className="text-xs text-muted-foreground">
              Username will be: @{formData.username.toLowerCase() || "username"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Enter display name (e.g., John Doe)"
              value={formData.displayName}
              onChange={e => handleInputChange("displayName", e.target.value)}
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={e => handleInputChange("bio", e.target.value)}
              disabled={isCreating}
              rows={3}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
            </div>
          )}

          <div className="space-y-2">
            <Button type="submit" disabled={isCreating || !formData.username.trim()} className="w-full">
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                "Create Profile"
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              Creating a profile requires admin wallet permissions and may take a few moments.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
