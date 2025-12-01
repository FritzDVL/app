import { fetchGroupFromLens } from "@/lib/external/lens/primitives/groups";
import { persistCommunity } from "@/lib/external/supabase/communities";

async function seedMyGroup() {
  const GROUP_ADDRESS = "0xa9Dd68cA2Bd21140354a95E8ce4CbDa80BC4f775";

  console.log("🔍 Fetching group from Lens Protocol...");
  const group = await fetchGroupFromLens(GROUP_ADDRESS);

  if (!group) {
    console.error("❌ Failed to fetch group from Lens");
    return;
  }

  console.log(`✅ Found group: ${group.metadata?.name}`);
  console.log(`   Address: ${group.address}`);
  console.log(`   Feed: ${group.feed?.address}`);

  console.log("\n💾 Adding to Supabase database...");
  const result = await persistCommunity(
    group.address,
    group.feed?.address || group.address,
    group.metadata?.name || "Society Protocol",
  );

  console.log("✅ Group successfully added to database!");
  console.log(`   Database ID: ${result.id}`);
  console.log("\n🎉 You can now run your app!");
}

seedMyGroup().catch(console.error);
