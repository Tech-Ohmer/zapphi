'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredProfile, getParentPin, saveParentPin, cn } from '@/lib/utils'
import { CURRICULUM, type SubjectId } from '@/lib/curriculum'
import { BADGES, starsFromScore } from '@/types'

export default function ParentPage() {
  const router = useRouter()
  const [step, setStep] = useState<'pin' | 'setup' | 'dashboard'>('pin')
  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const [newPin, setNewPin] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [progressData, setProgressData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = getStoredProfile()
    setProfile(stored)
    const parentPin = getParentPin()
    if (!parentPin) setStep('setup')
    else setStep('pin')
  }, [])

  function handlePinInput(idx: number, val: string, arr: string[], setArr: (p: string[]) => void) {
    if (!/^\d?$/.test(val)) return
    const newArr = [...arr]
    newArr[idx] = val
    setArr(newArr)
    if (val && idx < 5) document.getElementById(`ppin-${idx + 1}`)?.focus()
  }

  function handleEnterPin() {
    const entered = pin.join('')
    const stored = getParentPin()
    if (entered === stored) {
      setStep('dashboard')
      loadProgress()
    } else {
      setError(true)
      setPin(['', '', '', '', '', ''])
      setTimeout(() => setError(false), 2000)
    }
  }

  function handleSetupPin() {
    const pinStr = newPin.join('')
    if (pinStr.length < 6) return
    saveParentPin(pinStr)
    setStep('dashboard')
    loadProgress()
  }

  async function loadProgress() {
    if (!profile) return
    setLoading(true)
    try {
      const res = await fetch(`/api/progress?profile=${encodeURIComponent(profile.name)}`)
      const data = await res.json()
      setProgressData(data)
    } catch { setProgressData(null) }
    setLoading(false)
  }

  if (step === 'setup') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 space-y-4 text-center">
          <div className="text-5xl">👩‍👧</div>
          <h1 className="text-xl font-black text-gray-800">Parent Dashboard Setup</h1>
          <p className="text-sm text-gray-500">Create a 6-digit PIN para sa Parent View. Ito ay para sa inyo bilang magulang.</p>

          <div className="flex justify-center gap-2">
            {newPin.map((p, i) => (
              <input key={i} id={`nppin-${i}`} type="password" inputMode="numeric" maxLength={1} value={p}
                onChange={e => handlePinInput(i, e.target.value, newPin, setNewPin)}
                className="w-10 h-10 border-2 border-gray-200 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-purple-500" />
            ))}
          </div>

          <button onClick={handleSetupPin} disabled={newPin.join('').length < 6}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-2xl">
            Set Parent PIN
          </button>
          <button onClick={() => router.push('/')} className="text-sm text-gray-400 underline">Back</button>
        </div>
      </div>
    )
  }

  if (step === 'pin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 space-y-4 text-center">
          <div className="text-5xl">🔒</div>
          <h1 className="text-xl font-black text-gray-800">Parent View</h1>
          <p className="text-sm text-gray-500">Enter your 6-digit parent PIN</p>

          <div className="flex justify-center gap-2">
            {pin.map((p, i) => (
              <input key={i} id={`ppin-${i}`} type="password" inputMode="numeric" maxLength={1} value={p}
                onChange={e => handlePinInput(i, e.target.value, pin, setPin)}
                className={cn('w-10 h-10 border-2 rounded-xl text-center text-xl font-bold focus:outline-none',
                  error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-purple-500')} />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">Mali ang PIN. Try again!</p>}

          <button onClick={handleEnterPin} disabled={pin.join('').length < 6}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-2xl">
            Enter
          </button>
          <button onClick={() => router.push('/')} className="text-sm text-gray-400 underline">Back to Zapphi</button>
        </div>
      </div>
    )
  }

  // DASHBOARD
  const progress = progressData?.progress ?? []
  const sessions = progressData?.sessions ?? []
  const achievements = progressData?.achievements ?? []
  const totalStars = profile?.total_stars ?? 0
  const totalTopics = progress.filter((p: any) => p.completed).length
  const avgScore = sessions.length > 0 ? Math.round(sessions.reduce((s: number, q: any) => s + q.score, 0) / sessions.length) : 0

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pt-2">
        <div>
          <h1 className="text-xl font-black text-gray-800">👩‍👧 Parent Dashboard</h1>
          <p className="text-sm text-gray-500">Zapphira's Learning Progress</p>
        </div>
        <button onClick={() => router.push('/')} className="text-sm text-purple-500 underline">Back to App</button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading progress...</div>
      ) : (
        <div className="space-y-5 max-w-sm mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total Stars', value: `⭐ ${totalStars}`, color: 'bg-yellow-50 border-yellow-200' },
              { label: 'Topics Done', value: `📚 ${totalTopics}`, color: 'bg-green-50 border-green-200' },
              { label: 'Avg Score', value: `📊 ${avgScore}%`, color: 'bg-blue-50 border-blue-200' },
            ].map(s => (
              <div key={s.label} className={cn('rounded-2xl p-3 border text-center', s.color)}>
                <p className="font-bold text-sm">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Progress by subject */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-700 mb-3 text-sm">Progress by Subject</h2>
            <div className="space-y-3">
              {(['math', 'english', 'filipino', 'science', 'ap'] as SubjectId[]).map(sid => {
                const subject = CURRICULUM[sid]
                const subjectProgress = progress.filter((p: any) => p.subject_id === sid)
                const completed = subjectProgress.filter((p: any) => p.completed).length
                const total = subject.topics.length
                const pct = Math.round((completed / total) * 100)
                return (
                  <div key={sid}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{subject.emoji} {subject.name}</span>
                      <span>{completed}/{total} topics</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent quiz sessions */}
          {sessions.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-700 mb-3 text-sm">Recent Quiz Sessions</h2>
              <div className="space-y-2">
                {sessions.slice(0, 5).map((s: any, i: number) => {
                  const subject = CURRICULUM[s.subject_id as SubjectId]
                  const stars = starsFromScore(s.score)
                  return (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span>{subject?.emoji}</span>
                        <div>
                          <p className="text-xs font-medium text-gray-700">{subject?.name}</p>
                          <p className="text-xs text-gray-400">{s.topic_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-700">{s.score}%</p>
                        <p className="text-xs text-yellow-500">{'⭐'.repeat(stars)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Badges */}
          {achievements.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-700 mb-3 text-sm">Badges Earned 🏅</h2>
              <div className="flex flex-wrap gap-2">
                {achievements.map((a: any) => {
                  const badge = BADGES.find(b => b.id === a.badge_id)
                  return badge ? (
                    <div key={a.badge_id} className="bg-purple-50 rounded-xl px-3 py-2 text-center">
                      <div className="text-xl">{badge.emoji}</div>
                      <div className="text-xs text-purple-600 font-medium">{badge.nameTaglish}</div>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          )}

          {sessions.length === 0 && progress.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📚</div>
              <p>No study sessions yet.</p>
              <p className="text-sm">Let Zapphira start studying!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
