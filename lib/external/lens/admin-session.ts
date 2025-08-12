import { client } from "@/lib/external/lens/protocol-client";
import { getAdminSigner } from "@/lib/external/wallets/admin-wallet";
import { ChallengeRequest, type SessionClient } from "@lens-protocol/client";

let cachedSessionClient: SessionClient | null = null;
let lastSessionTime: number | null = null;
const SESSION_TTL_MS = 1000 * 60 * 50; // 50 minutes (adjust as needed)

/**
 * Authenticates the admin signer and returns a SessionClient for privileged Lens actions.
 * Transparently caches the session for reuse. If expired or missing, re-authenticates.
 */
export async function getAdminSessionClient(): Promise<SessionClient> {
  const now = Date.now();
  if (cachedSessionClient && lastSessionTime && now - lastSessionTime < SESSION_TTL_MS) {
    return cachedSessionClient;
  }

  // Get the admin signer
  const adminSigner = await getAdminSigner();
  console.log("Admin signer address:", adminSigner.address);

  // Prepare the challenge request for builder admin
  const challengeRequest: ChallengeRequest = {
    builder: {
      address: adminSigner.address,
    },
  };

  // Get the challenge
  const challengeResult = await client.challenge(challengeRequest);
  if (challengeResult.isErr()) {
    throw new Error(`Failed to get challenge: ${challengeResult.error.message}`);
  }
  const challenge = challengeResult.value;

  // Sign the challenge text
  const signature = await adminSigner.signMessage({ message: challenge.text });

  // Authenticate with the signed challenge
  const sessionResult = await client.authenticate({
    id: challenge.id,
    signature,
  });

  if (sessionResult.isErr()) {
    throw new Error(`Failed to authenticate: ${sessionResult.error.message}`);
  }

  cachedSessionClient = sessionResult.value;
  lastSessionTime = now;
  return cachedSessionClient;
}
