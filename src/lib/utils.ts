import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const validateString = (
  value: unknown,
  maxLength: number,
): value is string => {
  if (!value || typeof value !== 'string' || value.length > maxLength) {
    return false;
  }

  return true;
};

export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message);
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'Something went wrong';
  }

  return message;
};

/**
 * Checks if pathname is active
 *
 * The match is on path segments, not on characters. A bare `startsWith` — which
 * is what this used to do — would light up `/portfolio` for `/portfolio-archive`,
 * since one string is a prefix of the other without being an ancestor of it.
 *
 * @param href nav link
 * @param pathname current pathname
 * @returns true if pathname is active
 */
export const checkPathnameActive = (
  href: string,
  pathname: string,
): boolean => {
  // Special case for homepage
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(href + '/');
};
