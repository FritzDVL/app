import { useEffect, useState } from "react";
import { client } from "@/lib/clients/lens-protocol";
import { useAuthStore } from "@/stores/auth-store";
import { Account } from "@lens-protocol/client";
import { fetchAccount, fetchAccountStats } from "@lens-protocol/client/actions";
import { evmAddress } from "@lens-protocol/react";

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
        try {
          const accountResult = await fetchAccount(client, {
            username: { localName: username },
          });
          if (accountResult.isOk() && accountResult.value) {
            setLensAccount(accountResult.value);
            await fetchStats(accountResult.value.address);
          } else {
            setLensAccount(null);
          }
        } catch {
          setLensAccount(null);
        }
      }

      setIsLoading(false);
    };

    const fetchStats = async (address: string) => {
      setStats(prev => ({ ...prev, loading: true }));
      try {
        const statsResult = await fetchAccountStats(client, {
          account: evmAddress(address),
        });
        if (statsResult.isOk() && statsResult.value) {
          const s = statsResult.value;
          setStats({
            followers: s.graphFollowStats?.followers || 0,
            following: s.graphFollowStats?.following || 0,
            posts: s.feedStats?.posts || 0,
            loading: false,
          });
        }
      } catch {
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
