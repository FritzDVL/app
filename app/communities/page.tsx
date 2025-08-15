import { CommunitiesClient } from "@/components/communities/communities-client";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { getAllCommunities } from "@/lib/services/community/get-all-communities";

export default async function CommunitiesPage() {
  const result = await getAllCommunities("memberCount", "desc");
  const communities = result.success ? (result.communities ?? []) : [];

  return (
    <ProtectedRoute>
      <CommunitiesClient initialCommunities={communities} />
    </ProtectedRoute>
  );
}
