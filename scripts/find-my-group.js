import { PageSize, PublicClient, mainnet } from "@lens-protocol/client";
import { fetchGroups } from "@lens-protocol/client/actions";

// Create client
const client = PublicClient.create({
  environment: mainnet,
});

async function findMyGroup(ownerAddress) {
  console.log(`\n🔍 Searching for groups where ${ownerAddress} is a member/admin on MAINNET...`);

  const result = await fetchGroups(client, {
    pageSize: PageSize.Fifty,
    filter: {
      member: ownerAddress,
    },
  });

  if (result.isOk()) {
    const groups = result.value.items;
    console.log(`Found ${groups.length} groups:`);

    for (const group of groups) {
      console.log(`\n----------------------------------------`);
      console.log(`Name: ${group.metadata?.name || "Unnamed"}`);
      console.log(`Address: ${group.address}`);
      console.log(`Owner: ${group.owner}`);
      console.log(`Description: ${group.metadata?.description || "No description"}`);

      if (group.owner.toLowerCase() === ownerAddress.toLowerCase()) {
        console.log("🌟 YOU ARE THE OWNER OF THIS GROUP!");
      } else {
        console.log("ℹ️ You are a member/admin of this group.");
      }
    }

    if (groups.length === 0) {
      console.log("❌ No groups found.");
    }
  } else {
    console.error("Error fetching groups:", result.error);
  }
}

const ADDRESSES_TO_CHECK = ["0x8aE18FfF977aCc6Dc690C288a61004a7c7D5A931", "0xc93947ed78d87bdeb232d9c29c07fd0e8cf0a43e"];

async function run() {
  for (const address of ADDRESSES_TO_CHECK) {
    await findMyGroup(address);
  }
}

run();
