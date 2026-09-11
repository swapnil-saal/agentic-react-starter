import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names, letting later Tailwind utilities win over earlier ones.
 *
 * Plain string concatenation does not work with utility classes: `"p-2 p-4"`
 * leaves both in the class list and the winner depends on CSS source order,
 * not on the order you wrote them. `twMerge` resolves conflicts so a caller's
 * `className` can always override a component's defaults — which is what makes
 * these components extensible without editing them.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
