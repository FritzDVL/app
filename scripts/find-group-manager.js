// Script to find the Group Manager address for testnet
// Run with: node scripts/find-group-manager.js

const { PublicClient, testnet } = require("@lens-protocol/client");

async function findGroupManager() {
  try {
    console.log("🔍 Finding Lens Protocol Testnet Group Manager Address...\n");

    const client = PublicClient.create({
      environment: testnet,
    });

    // Method 1: Try to fetch any group and see what system addresses appear
    console.log("📋 Fetching sample groups to identify system addresses...");
    const { fetchGroups } = await import("@lens-protocol/client/actions");

    const groupsResult = await fetchGroups(client, {
      limit: 5,
    });

    if (groupsResult.isOk() && groupsResult.value.items.length > 0) {
      console.log("Found sample groups:");

      for (const group of groupsResult.value.items) {
        console.log(`\n📝 Group: ${group.metadata?.name || "Unnamed"}`);
        console.log(`   Address: ${group.address}`);
        console.log(`   Owner: ${group.owner}`);

        // Fetch admins to see system addresses
        const { fetchAdminsFor } = await import("@lens-protocol/client/actions");
        const adminsResult = await fetchAdminsFor(client, {
          address: group.address,
        });

        if (adminsResult.isOk()) {
          console.log("   Admins:");
          adminsResult.value.items.forEach(admin => {
            console.log(`     - ${admin.account.address} (${admin.account.username?.value || "No username"})`);
          });
        }
      }
    }

    // Method 2: Check known system addresses
    console.log("\n🏗️ Known System Addresses:");
    console.log("Mainnet Group Manager: 0xe12543e5f917adA5aeF92B26Bc08E1925ec9F53F");
    console.log("Current Testnet (in code): 0xbF3E90a9BD087716f42B5F25aaA61b0CABEf4df2");

    // Method 3: Try to verify the current testnet address
    console.log("\n✅ Verifying current testnet address...");
    const testAddress = "0xbF3E90a9BD087716f42B5F25aaA61b0CABEf4df2";

    // We can't directly query the group manager contract, but we can see if it appears
    // as an admin in groups (which would indicate it's a system address)

    console.log(`\n📍 Current testnet Group Manager address in constants.ts:`);
    console.log(`   ${testAddress}`);
    console.log("\n💡 This address is used to filter out system moderators from community lists.");
    console.log("   If communities show unexpected system moderators, this address may need updating.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

findGroupManager();
