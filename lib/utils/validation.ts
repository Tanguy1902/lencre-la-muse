/**
 * Validation utilities for user-generated content.
 */

export const LIMITS = {
  TITLE_MAX: 200,
  CONTENT_MAX: 50000,
  BIO_MAX: 500,
  DISPLAY_NAME_MAX: 60,
  ROLE_MAX: 40,
  COMMENT_MAX: 2000,
} as const;

export interface ValidationError {
  field: string;
  message: string;
}

export function validatePoem(title: string, content: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!title.trim()) {
    errors.push({ field: "title", message: "Mila misy lohateny ny tononkalo." });
  } else if (title.length > LIMITS.TITLE_MAX) {
    errors.push({ field: "title", message: `Ny lohateny dia tsy tokony hihoatra ${LIMITS.TITLE_MAX} litera.` });
  }

  if (!content.trim() || content === "<p></p>") {
    errors.push({ field: "content", message: "Mila misy votoatiny ny tononkalo." });
  } else if (content.length > LIMITS.CONTENT_MAX) {
    errors.push({ field: "content", message: `Ny votoatiny dia tsy tokony hihoatra ${LIMITS.CONTENT_MAX} litera.` });
  }

  return errors;
}

export function validateProfile(data: { displayName?: string; bio?: string; role?: string }): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.displayName !== undefined) {
    if (!data.displayName.trim()) {
      errors.push({ field: "displayName", message: "Mila misy anarana." });
    } else if (data.displayName.length > LIMITS.DISPLAY_NAME_MAX) {
      errors.push({ field: "displayName", message: `Ny anarana dia tsy tokony hihoatra ${LIMITS.DISPLAY_NAME_MAX} litera.` });
    }
  }

  if (data.bio !== undefined && data.bio.length > LIMITS.BIO_MAX) {
    errors.push({ field: "bio", message: `Ny bio dia tsy tokony hihoatra ${LIMITS.BIO_MAX} litera.` });
  }

  if (data.role !== undefined && data.role.length > LIMITS.ROLE_MAX) {
    errors.push({ field: "role", message: `Ny andraikitra dia tsy tokony hihoatra ${LIMITS.ROLE_MAX} litera.` });
  }

  return errors;
}

export function validateComment(content: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!content.trim()) {
    errors.push({ field: "content", message: "Mila misy votoatiny ny hafatra." });
  } else if (content.length > LIMITS.COMMENT_MAX) {
    errors.push({ field: "content", message: `Ny hafatra dia tsy tokony hihoatra ${LIMITS.COMMENT_MAX} litera.` });
  }

  return errors;
}
