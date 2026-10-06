/**
 * JSON Schema & Validation Utilities
 */

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function validateSchema<T>(data: unknown, validator: (v: any) => boolean, errorMessage: string): ValidationResult<T> {
  if (data && validator(data)) {
    return { success: true, data: data as T };
  }
  return { success: false, error: errorMessage };
}
