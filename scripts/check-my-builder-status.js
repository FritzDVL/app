// Check your builder status and apps
// Run with: node scripts/check-my-builder-status.js

const { PublicClient, mainnet, testnet } = require("@lens-protocol/client");

async function checkBuilderStatus() {
  try {
    console.log("🏗️  Checking Builder Status...\n");

    // Your addresses from constants.ts
    const addresses = {
      mainnet: {
        app: "0x30BB11c7A400cE65Fc13f345AA4c5FFC1C333603",
        baseFeed: "0x3BF4Eb9725232130F5dA804cD16bBdb61171cf28",
        admin: "0xaa4C60b784E2b3E485035399bF1b1aBDeD66A60f",
      },
      testnet: {
        app: "0x9eD1562A4e3803964F3c84301b18d4E1944D340b",
        baseFeed: "0x039dB35DC617b083ade172BCA13B9571672CEe71",
        admin: "0xaa4C60b784E2b3E485035399bF1b1aBDeD66A60f",
      },
    };

    // Check both networks
    for (const [network, addrs] of Object.entries(addresses)) {
      console.log(`\n🌐 ${network.toUpperCase()} Network:`);

      const client = PublicClient.create({
        environment: network === "mainnet" ? mainnet : testnet,
      });

      // Check if base feed exists and get stats
      const { fetchGroup, fetchGroupStats } = await import("@lens-protocol/client/actions");

      try {
        const groupResult = await fetchGroup(client, { group: addrs.baseFeed });
        if (groupResult.isOk()) {
          console.log(`  ✅ Base Feed Active: ${addrs.baseFeed}`);
          console.log(`  📝 Name: ${groupResult.value.metadata?.name || "N/A"}`);

          const statsResult = await fetchGroupStats(client, { group: addrs.baseFeed });
          if (statsResult.isOk()) {
            console.log(`  👥 Members: ${statsResult.value.totalMembers}`);
            console.log(`  📄 Posts: ${statsResult.value.totalPosts}`);
          }
        } else {
          console.log(`  ❌ Base Feed Not Found: ${addrs.baseFeed}`);
        }
      } catch (error) {
        console.log(`  ⚠️  Error checking ${network}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkBuilderStatus();
