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
 * @param href nav link
 * @param pathname current pathname
 * @returns true if pathname is active
 */
export const checkPathnameActive = (
  href: string,
  pathname: string,
): boolean => {
  // Special case for homepage
  if (pathname !== '/' && href === '/') {
    return false;
  }

  return pathname === href || pathname.startsWith(href);
};
