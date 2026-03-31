'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredProfile, cn } from '@/lib/utils'
import { CURRICULUM, SUBJECT_ORDER, type SubjectId } from '@/lib/curriculum'
import { levelTitle, levelFromStars } from '@/types'

const SUBJECT_BG: Record<SubjectId, string> = {
  math: 'bg-gradient-to-br from-blue-400 to-blue-600',
  english: 'bg-gradient-to-br from-green-400 to-green-600',
  filipino: 'bg-gradient-to-br from-red-400 to-yellow-500',
  science: 'bg-gradient-to-br from-purple-400 to-purple-600',
  ap: 'bg-gradient-to-br from-orange-400 to-orange-600',
}

export default function LearnPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const stored = getStoredProfile()
    if (!stored) { router.push('/'); return }
    setProfile(stored)
  }, [])

  if (!profile) return null

  const level = levelFromStars(profile.total_stars)
  const title = levelTitle(level)

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-200 border-2 border-purple-400 flex items-center justify-center text-2xl">
            {profile.avatar_emoji}
          </div>
          <div>
            <p className="font-bold text-gray-800">{profile.name}</p>
            <p className="text-xs text-purple-600">{title} · Level {level}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-yellow-100 border border-yellow-300 rounded-full px-3 py-1 flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-bold text-yellow-700 text-sm">{profile.total_stars}</span>
          </div>
          <button onClick={() => router.push('/parent')} className="text-gray-400 hover:text-gray-600 text-xl">👩‍👧</button>
        </div>
      </div>

      {/* Welcome */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-purple-700">Anong Subject Ngayon? 📚</h1>
        <p className="text-gray-500 text-sm mt-1">What do you want to learn today?</p>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        {SUBJECT_ORDER.map((subjectId) => {
          const subject = CURRICULUM[subjectId]
          return (
            <button
              key={subjectId}
              onClick={() => router.push(`/learn/${subjectId}`)}
              className={cn(
                'rounded-3xl p-5 text-left shadow-lg active:scale-95 transition-transform',
                SUBJECT_BG[subjectId]
              )}
            >
              <div className="text-4xl mb-2">{subject.emoji}</div>
              <p className="text-white font-black text-base leading-tight">{subject.name}</p>
              <p className="text-white/80 text-xs mt-1">{subject.topics.length} topics</p>
            </button>
          )
        })}

        {/* Parent view shortcut */}
        <button
          onClick={() => router.push('/parent')}
          className="rounded-3xl p-5 text-left shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 active:scale-95 transition-transform"
        >
          <div className="text-4xl mb-2">👩‍👧</div>
          <p className="text-gray-600 font-black text-base leading-tight">Parent View</p>
          <p className="text-gray-400 text-xs mt-1">See progress</p>
        </button>
      </div>

      {/* Motivational badge */}
      <div className="mt-8 max-w-sm mx-auto bg-white rounded-2xl p-4 shadow-sm border border-purple-100 text-center">
        <p className="text-purple-600 font-bold text-sm">💪 Keep studying every day!</p>
        <p className="text-gray-400 text-xs mt-1">Araw-araw matuto para maging champion! 🏆</p>
      </div>
    </div>
  )
}
