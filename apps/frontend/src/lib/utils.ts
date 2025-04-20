import { clsx } from "clsx";

/**
 * Combines class names using clsx
 */
export function cn(...inputs) {
  return clsx(inputs);
}
