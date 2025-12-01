// Quick script to inspect Lens Protocol state
// Run with: node scripts/inspect-lens-state.js

const { PublicClient, mainnet, testnet } = require("@lens-protocol/client");

// Create client (change to testnet if needed)
const client = PublicClient.create({
  environment: mainnet, // or testnet
});

async function inspectState() {
  try {
    console.log("🔍 Inspecting Lens Protocol State...\n");

    // 1. Check your app address info
    const appAddress = "0x30BB11c7A400cE65Fc13f345AA4c5FFC1C333603"; // Your mainnet app address

    // 2. Fetch groups (communities)
    console.log("📋 Fetching Groups...");
    const { fetchGroups } = await import("@lens-protocol/client/actions");
    const { PageSize } = require("@lens-protocol/client");
    const groupsResult = await fetchGroups(client, {
      pageSize: PageSize.Fifty,
    });

    if (groupsResult.isOk()) {
      console.log(`Found ${groupsResult.value.items.length} groups:`);
      groupsResult.value.items.forEach((group, i) => {
        console.log(`  ${i + 1}. ${group.metadata?.name || "Unnamed"} (${group.address}) - Owner: ${group.owner}`);
      });
    }

    // 3. Check specific group stats
    const baseFeeedAddress = "0x3BF4Eb9725232130F5dA804cD16bBdb61171cf28";
    console.log(`\n📊 Checking Base Feed Stats (${baseFeeedAddress})...`);

    const { fetchGroupStats } = await import("@lens-protocol/client/actions");
    const statsResult = await fetchGroupStats(client, {
      group: baseFeeedAddress,
    });

    if (statsResult.isOk()) {
      const stats = statsResult.value;
      console.log(`  Total Members: ${stats.totalMembers}`);
      console.log(`  Total Posts: ${stats.totalPosts}`);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

inspectState();
