import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * The function `cn` in TypeScript merges multiple class values using `clsx` and `twMerge`.
 * @param {ClassValue[]} inputs - The `inputs` parameter in the `cn` function is a rest parameter that
 * allows you to pass in multiple class values as arguments. These class values can be strings, arrays
 * of strings, or objects with key-value pairs where the key represents the class name and the value
 * represents a condition for applying that
 * @returns The `cn` function is returning the result of merging the class names passed as arguments
 * using the `clsx` function and then merging them with Tailwind CSS classes using the `twMerge`
 * function.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
