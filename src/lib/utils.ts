import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getURLOrigin(url: string) {
  try {
    return new URL(url).origin
  } catch {
    return url
  }
}
