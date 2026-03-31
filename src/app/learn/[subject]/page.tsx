'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getStoredProfile, cn } from '@/lib/utils'
import { CURRICULUM, type SubjectId } from '@/lib/curriculum'

const SUBJECT_BG: Record<SubjectId, string> = {
  math: 'from-blue-400 to-blue-600',
  english: 'from-green-400 to-green-600',
  filipino: 'from-red-400 to-yellow-500',
  science: 'from-purple-400 to-purple-600',
  ap: 'from-orange-400 to-orange-600',
}

export default function SubjectPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = params.subject as SubjectId
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const stored = getStoredProfile()
    if (!stored) { router.push('/'); return }
    setProfile(stored)
  }, [])

  const subject = CURRICULUM[subjectId]
  if (!subject) return null

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Header */}
      <div className={cn('rounded-3xl p-5 mb-6 bg-gradient-to-br text-white', SUBJECT_BG[subjectId])}>
        <button onClick={() => router.push('/learn')} className="text-white/80 text-sm mb-2">
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <span className="text-5xl">{subject.emoji}</span>
          <div>
            <h1 className="text-2xl font-black">{subject.name}</h1>
            <p className="text-white/80 text-sm">{subject.nameFilipino} · {subject.topics.length} topics</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-700 mb-4">Pick a topic to learn: 📖</h2>

      {/* Topics list */}
      <div className="space-y-3 max-w-sm mx-auto">
        {subject.topics.map((topic, idx) => (
          <button
            key={topic.id}
            onClick={() => router.push(`/learn/${subjectId}/${topic.id}`)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 text-left active:scale-98 transition-transform hover:border-purple-200 hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl shrink-0">
              {topic.emoji}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm leading-tight">{topic.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{topic.nameTaglish}</p>
            </div>
            <span className="text-gray-300 text-xl">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
