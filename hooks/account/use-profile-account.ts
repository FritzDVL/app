import { useEffect, useState } from "react";
import { getAccountByUsername, getAccountStats } from "@/lib/services/account-service";
import { useAuthStore } from "@/stores/auth-store";
import { Account } from "@lens-protocol/client";

export interface LensAccountStats {
  followers: number;
  following: number;
  posts: number;
  loading: boolean;
}

export function useProfileAccount(username: string) {
  const { account } = useAuthStore();
  const isOwnProfile = account?.username?.localName === username;
  const [lensAccount, setLensAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<LensAccountStats>({
    followers: 0,
    following: 0,
    posts: 0,
    loading: false,
  });

  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);

      if (isOwnProfile && account) {
        setLensAccount(account);
        await fetchStats(account.address);
      } else {
        const accountResult = await getAccountByUsername(username);
        if (accountResult.success && accountResult.account) {
          setLensAccount(accountResult.account);
          await fetchStats(accountResult.account.address);
        } else {
          setLensAccount(null);
        }
      }

      setIsLoading(false);
    };

    const fetchStats = async (address: string) => {
      setStats(prev => ({ ...prev, loading: true }));

      const statsResult = await getAccountStats(address);
      if (statsResult.success && statsResult.stats) {
        setStats({
          ...statsResult.stats,
          loading: false,
        });
      } else {
        setStats({ followers: 0, following: 0, posts: 0, loading: false });
      }
    };

    loadProfileData();
  }, [username, account, isOwnProfile]);

  return {
    lensAccount,
    stats,
    isOwnProfile,
    isLoading,
  };
}
