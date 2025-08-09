/**
 * Thread Domain Types
 * Pure domain types for thread-related business logic
 */
import { Address } from "@/types/common";

/**
 * Thread creation form data - domain model
 */
export interface CreateThreadFormData {
  title: string;
  summary: string;
  content: string;
  tags?: string;
  author: Address;
}
