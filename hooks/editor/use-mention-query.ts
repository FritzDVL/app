import { useEffect, useState } from "react";
import { client } from "@/lib/clients/lens-protocol";
import { fetchAccounts } from "@lens-protocol/client/actions";
import { AccountsOrderBy } from "@lens-protocol/react";

const SUGGESTION_LIST_LENGTH_LIMIT = 5;

export type MentionAccount = {
  address: string;
  displayUsername: string;
  username: string;
  name: string;
  picture: string;
};

const useMentionQuery = (query: string): MentionAccount[] => {
  const [results, setResults] = useState<MentionAccount[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    async function doSearchAccounts() {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      const result = await fetchAccounts(client, {
        filter: {
          searchBy: {
            localNameQuery: debouncedQuery,
          },
        },
        orderBy: AccountsOrderBy.BestMatch,
      });

      if (result.isErr()) {
        console.error("Error fetching accounts:", result.error);
        setResults([]);
        return;
      }

      const accountsResult = result.value;
      if (accountsResult.items.length === 0) {
        setResults([]);
        return;
      }
      const accounts = accountsResult.items
        .filter(account => !account.operations?.isBlockedByMe && !account.operations?.hasBlockedMe)
        .map(
          (account): MentionAccount => ({
            address: account.address,
            displayUsername: account.username?.localName || "",
            name: account.metadata?.name || "",
            picture: account.metadata?.picture,
            username: account.username?.value,
          }),
        );

      setResults(accounts.slice(0, SUGGESTION_LIST_LENGTH_LIMIT));
    }

    doSearchAccounts();
  }, [debouncedQuery]);

  return results;
};

export default useMentionQuery;
