/**
 * Domain model for token distributions/rewards
 */
export interface TokenDistribution {
  id: string;
  amount: string;
  token: string;
  timestamp: string;
  type: string;
}
