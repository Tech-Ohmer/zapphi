import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Profile stored in localStorage
export const PROFILE_KEY = 'zapphi-profile'
export const PARENT_PIN_KEY = 'zapphi-parent-pin'

export function getStoredProfile(): any | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveProfile(profile: any) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function getParentPin(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(PARENT_PIN_KEY)
}

export function saveParentPin(pin: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PARENT_PIN_KEY, pin)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(new Date(dateStr))
}

// Encourage phrases in Taglish
export const ENCOURAGEMENTS = [
  'Ang galing mo! Keep it up! 🌟',
  'Wow! So smart ka talaga! 💪',
  'Tama! You got it! ⭐',
  'Excellent! Hindi ka susuko! 🎉',
  'Perfect! You\'re amazing! 🦋',
  'Napakahusay! Great job! 👏',
  'You can do it! Kaya mo yan! 🚀',
  'Bravo! Proud si Daddy/Mommy! 🏆',
]

export function randomEncouragement(): string {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
}
