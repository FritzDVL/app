/**
 * Thread Domain Validation
 * Simple validation for thread creation
 */
import { CreateThreadFormData } from "./types";

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
 * Validates thread creation form data
 */
export function validateCreateThreadForm(formData: CreateThreadFormData): ValidationResult {
  const errors: ValidationError[] = [];

  // Title validation
  if (!formData.title.trim()) {
    errors.push({
      field: "title",
      message: "Title is required",
      code: "TITLE_REQUIRED",
    });
  }

  // Summary validation
  if (!formData.summary.trim()) {
    errors.push({
      field: "summary",
      message: "Summary is required",
      code: "SUMMARY_REQUIRED",
    });
  }

  // Content validation
  if (!formData.content.trim()) {
    errors.push({
      field: "content",
      message: "Content is required",
      code: "CONTENT_REQUIRED",
    });
  }

  // Author validation
  if (!formData.author.trim()) {
    errors.push({
      field: "author",
      message: "Author address is required",
      code: "AUTHOR_REQUIRED",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
