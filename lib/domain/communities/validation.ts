/**
 * Community Domain Validation
 * Simple validation for community creation
 */
import { CreateCommunityFormData } from "./types";

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Validates community creation form data
 */
export function validateCreateCommunityForm(formData: CreateCommunityFormData): ValidationResult {
  const errors: ValidationError[] = [];

  // Name validation
  if (!formData.name.trim()) {
    errors.push({
      field: "name",
      message: "Community name is required",
      code: "NAME_REQUIRED",
    });
  }

  // Description validation
  if (!formData.description.trim()) {
    errors.push({
      field: "description",
      message: "Description is required",
      code: "DESCRIPTION_REQUIRED",
    });
  }

  // Admin address validation
  if (!formData.adminAddress.trim()) {
    errors.push({
      field: "adminAddress",
      message: "Admin address is required",
      code: "ADMIN_ADDRESS_REQUIRED",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
