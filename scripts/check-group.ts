import { PublicClient, evmAddress, testnet } from "@lens-protocol/client";
import { fetchGroup } from "@lens-protocol/client/actions";

const client = PublicClient.create({
  environment: testnet,
  origin: "http://localhost:3000",
});

const TARGET_GROUP_ADDRESS = "0xC3DA95f23230F6bE3b8Bf1B22a0dfCE1A628A6d3";

async function main() {
  console.log(`Checking group: ${TARGET_GROUP_ADDRESS}`);
  try {
    const result = await fetchGroup(client, { group: evmAddress(TARGET_GROUP_ADDRESS) });

    if (result.isErr()) {
      console.error("Error fetching group:", result.error);
    } else if (!result.value) {
      console.log("Group not found (value is null)");
    } else {
      const group = result.value;
      console.log("Group found!");
      console.log("Name:", group.metadata?.name);
      console.log("Address:", group.address);
      console.log("Owner:", group.owner);
    }
  } catch (e) {
    console.error("Exception:", e);
  }
}

main();
