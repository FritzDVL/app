/**
 * Community Domain Types
 * Basic domain types for community functionality
 */
import { Address } from "@/types/common";

/**
 * Community creation form data - domain model
 */
export interface CreateCommunityFormData {
  name: string;
  description: string;
  adminAddress: Address;
  tags?: string;
}
