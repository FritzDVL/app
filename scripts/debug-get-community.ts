import { getCommunity } from "@/lib/services/community/get-community";
import { TARGET_GROUP_ADDRESS } from "@/lib/shared/constants";
import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split("\n").forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["'](.*)["']$/, "$1");
      process.env[key] = value;
    }
  });
}

async function main() {
  console.log("Debugging getCommunity...");
  console.log("TARGET_GROUP_ADDRESS:", TARGET_GROUP_ADDRESS);

  try {
    const result = await getCommunity(TARGET_GROUP_ADDRESS as any);
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
