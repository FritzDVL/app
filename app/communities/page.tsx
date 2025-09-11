import { Communities } from "@/components/communities/list/communities";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { getCommunitiesPaginated } from "@/lib/services/community/get-communities-paginated";

export default async function CommunitiesPage() {
  const result = await getCommunitiesPaginated({ sort: { by: "memberCount", order: "desc" } });
  const communities = result.success ? (result.communities ?? []) : [];

  return (
    <ProtectedRoute>
      <Communities communities={communities} />
    </ProtectedRoute>
  );
}
