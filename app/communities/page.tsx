import { Communities } from "@/components/communities/list/communities";
import { ProtectedRoute } from "@/components/pages/protected-route";
import { getCommunitiesPaginated } from "@/lib/services/community/get-communities-paginated";
import { COMMUNITIES_PER_PAGE } from "@/lib/shared/constants";

export default async function CommunitiesPage() {
  const result = await getCommunitiesPaginated({
    sort: { by: "memberCount", order: "desc" },
    limit: COMMUNITIES_PER_PAGE,
  });
  const communities = result.success ? (result.communities ?? []) : [];

  return (
    <ProtectedRoute>
      <Communities communities={communities} />
    </ProtectedRoute>
  );
}
