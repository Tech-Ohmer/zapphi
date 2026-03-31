// Zapphi — TypeScript Types

export type SubjectId = 'math' | 'english' | 'filipino' | 'science' | 'ap'
export type AvatarColor = 'pink' | 'purple' | 'blue' | 'green' | 'yellow' | 'orange'
export type QuizType = 'multiple_choice' | 'true_false' | 'fill_blank'
export type GameMode = 'learn' | 'quiz' | 'flashcard' | 'story'

export interface Profile {
  id: string
  name: string
  pin: string // 4-digit, stored in localStorage
  avatar_color: AvatarColor
  avatar_emoji: string
  level: number
  total_stars: number
  created_at: string
}

export interface TopicProgress {
  id: string
  profile_id: string
  subject_id: SubjectId
  topic_id: string
  stars: number // 0-3
  times_attempted: number
  best_score: number // 0-100
  completed: boolean
  last_attempted: string
}

export interface QuizSession {
  id: string
  profile_id: string
  subject_id: SubjectId
  topic_id: string
  mode: QuizType
  score: number
  total_questions: number
  stars_earned: number
  created_at: string
}

export interface Achievement {
  id: string
  profile_id: string
  badge_id: string
  earned_at: string
}

export interface Badge {
  id: string
  name: string
  nameTaglish: string
  emoji: string
  description: string
  condition: string // e.g. "Complete all Math topics"
}

export interface QuizQuestion {
  type: QuizType
  question: string
  options?: string[]
  correct_answer: string
  explanation: string
}

// Badges
export const BADGES: Badge[] = [
  { id: 'math_star', name: 'Math Star', nameTaglish: 'Bituin sa Math', emoji: '⭐', description: 'Completed first Math quiz', condition: 'Complete any Math quiz' },
  { id: 'english_star', name: 'English Star', nameTaglish: 'Bituin sa English', emoji: '📚', description: 'Completed first English quiz', condition: 'Complete any English quiz' },
  { id: 'filipino_star', name: 'Filipino Star', nameTaglish: 'Bituin sa Filipino', emoji: '🇵🇭', description: 'Completed first Filipino quiz', condition: 'Complete any Filipino quiz' },
  { id: 'science_star', name: 'Science Star', nameTaglish: 'Bituin sa Science', emoji: '🔬', description: 'Completed first Science quiz', condition: 'Complete any Science quiz' },
  { id: 'ap_star', name: 'AP Star', nameTaglish: 'Bituin sa AP', emoji: '🌍', description: 'Completed first AP quiz', condition: 'Complete any AP quiz' },
  { id: 'perfect_score', name: 'Perfect!', nameTaglish: 'Perpekto!', emoji: '💯', description: 'Got 100% on any quiz', condition: 'Score 100% on a quiz' },
  { id: 'streak_3', name: '3-Day Streak', nameTaglish: '3 Araw na Pag-aaral', emoji: '🔥', description: 'Studied 3 days in a row', condition: 'Login and study 3 consecutive days' },
  { id: 'collector', name: 'Star Collector', nameTaglish: 'Tagakolekta ng Bituin', emoji: '🌟', description: 'Earned 50 stars total', condition: 'Collect 50 stars' },
  { id: 'explorer', name: 'Subject Explorer', nameTaglish: 'Tagalakbay ng Paaralan', emoji: '🗺️', description: 'Tried all 5 subjects', condition: 'Complete at least one quiz in all 5 subjects' },
  { id: 'zapphira_champion', name: 'Zapphira Champion!', nameTaglish: 'Kampeon ng Zapphira!', emoji: '👑', description: 'Reached level 5', condition: 'Reach Level 5' },
]

export const AVATAR_EMOJIS = ['👧', '🦋', '🌸', '⭐', '🦄', '🐬', '🌈', '💎']
export const AVATAR_COLORS: AvatarColor[] = ['pink', 'purple', 'blue', 'green', 'yellow', 'orange']

export const AVATAR_COLOR_CLASSES: Record<AvatarColor, string> = {
  pink: 'bg-pink-200 border-pink-400',
  purple: 'bg-purple-200 border-purple-400',
  blue: 'bg-blue-200 border-blue-400',
  green: 'bg-green-200 border-green-400',
  yellow: 'bg-yellow-200 border-yellow-400',
  orange: 'bg-orange-200 border-orange-400',
}

export function starsFromScore(score: number): number {
  if (score >= 90) return 3
  if (score >= 70) return 2
  if (score >= 50) return 1
  return 0
}

export function levelFromStars(stars: number): number {
  if (stars >= 200) return 10
  if (stars >= 150) return 9
  if (stars >= 100) return 8
  if (stars >= 75) return 7
  if (stars >= 50) return 6
  if (stars >= 35) return 5
  if (stars >= 25) return 4
  if (stars >= 15) return 3
  if (stars >= 8) return 2
  return 1
}

export function levelTitle(level: number): string {
  const titles = ['', 'Batang Matalino', 'Junior Iskolar', 'Promising Student', 'Rising Star', 'Zapphira Champion', 'Honor Awardee', 'Math Wizard', 'Science Genius', 'Filipino Pride', 'Bida ng Klase!']
  return titles[Math.min(level, 10)] ?? 'Super Student'
}
