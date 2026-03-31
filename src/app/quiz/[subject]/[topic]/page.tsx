'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getStoredProfile, saveProfile, randomEncouragement, cn } from '@/lib/utils'
import { CURRICULUM, type SubjectId } from '@/lib/curriculum'
import { starsFromScore, type QuizQuestion } from '@/types'

type GameState = 'loading' | 'playing' | 'result'

export default function QuizPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = params.subject as SubjectId
  const topicId = params.topic as string
  const [profile, setProfile] = useState<any>(null)
  const [state, setGameState] = useState<GameState>('loading')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [encouragement, setEncouragement] = useState('')
  const [saving, setSaving] = useState(false)

  const subject = CURRICULUM[subjectId]
  const topic = subject?.topics.find(t => t.id === topicId)

  useEffect(() => {
    const stored = getStoredProfile()
    if (!stored) { router.push('/'); return }
    setProfile(stored)
    loadQuiz()
  }, [])

  async function loadQuiz() {
    setGameState('loading')
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subjectId, topic: topicId, topicName: topic?.name, count: 5 }),
      })
      const data = await res.json()
      setQuestions(data.questions ?? [])
      setGameState('playing')
    } catch {
      setQuestions([])
      setGameState('playing')
    }
  }

  function handleAnswer(option: string) {
    if (selected !== null) return
    setSelected(option)
    setShowExplanation(true)
    if (option === questions[currentIdx]?.correct_answer) {
      setScore(s => s + 1)
      setEncouragement(randomEncouragement())
    }
  }

  async function handleNext() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1)
      setSelected(null)
      setShowExplanation(false)
      setEncouragement('')
    } else {
      // End of quiz
      setGameState('result')
      await saveResult()
    }
  }

  async function saveResult() {
    if (!profile) return
    setSaving(true)
    const pct = Math.round((score / questions.length) * 100)
    const stars = starsFromScore(pct)
    const newStars = (profile.total_stars ?? 0) + stars

    // Update profile stars
    const updatedProfile = { ...profile, total_stars: newStars }
    saveProfile(updatedProfile)
    setProfile(updatedProfile)

    // Save to Supabase
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileName: profile.name,
          subjectId,
          topicId,
          score: pct,
          totalQuestions: questions.length,
          mode: 'multiple_choice',
        }),
      })
    } catch { /* non-critical */ }
    setSaving(false)
  }

  const current = questions[currentIdx]
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
  const stars = starsFromScore(pct)

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <div className="text-6xl animate-spin">⭐</div>
        <p className="text-purple-600 font-bold text-lg">Ginagawa ni Zapphi ang quiz...</p>
        <p className="text-gray-400 text-sm">Sandali lang! Just a moment!</p>
      </div>
    )
  }

  if (state === 'result') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 text-center space-y-4">
          <div className="text-6xl">
            {stars === 3 ? '🏆' : stars === 2 ? '🎉' : stars === 1 ? '💪' : '😊'}
          </div>
          <h2 className="text-2xl font-black text-purple-700">
            {stars === 3 ? 'Perpekto! 💯' : stars === 2 ? 'Magaling! 🌟' : stars === 1 ? 'Kaya mo pa! 💪' : 'Try ulit! 😊'}
          </h2>
          <p className="text-gray-600">
            {score} out of {questions.length} correct ({pct}%)
          </p>

          {/* Stars */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map(s => (
              <span key={s} className={cn('text-4xl transition-all', s <= stars ? 'opacity-100' : 'opacity-30')}>⭐</span>
            ))}
          </div>

          <div className="bg-purple-50 rounded-2xl p-3">
            <p className="text-purple-600 font-bold text-sm">+{stars} stars earned!</p>
            <p className="text-gray-500 text-xs">Total: {profile?.total_stars ?? 0} stars 🌟</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setCurrentIdx(0); setScore(0); setSelected(null); setShowExplanation(false); loadQuiz() }}
              className="flex-1 border-2 border-purple-300 text-purple-600 font-bold py-3 rounded-2xl"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => router.push(`/learn/${subjectId}`)}
              className="flex-1 bg-purple-500 text-white font-bold py-3 rounded-2xl"
            >
              📚 More Topics
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!current) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-4xl mb-4">😅</p>
          <p className="text-gray-600">Hindi ma-load ang quiz. Try again!</p>
          <button onClick={() => router.push(`/learn/${subjectId}`)} className="mt-4 text-purple-500 underline">Back to Topics</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.push(`/learn/${subjectId}/${topicId}`)} className="text-gray-400">←</button>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span>Score: {score}/{currentIdx + (selected ? 1 : 0)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topic badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{topic?.emoji}</span>
        <span className="text-sm font-medium text-purple-600">{topic?.name}</span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-purple-100 mb-4">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-2xl">🤔</span>
          <p className="text-base font-bold text-gray-800 leading-snug">{current.question}</p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 flex-1">
        {(current.options ?? ['True', 'False']).map((option) => {
          const isCorrect = option === current.correct_answer
          const isSelected = option === selected
          let btnClass = 'bg-white border-2 border-gray-200 text-gray-700'
          if (selected !== null) {
            if (isCorrect) btnClass = 'bg-green-100 border-2 border-green-500 text-green-800'
            else if (isSelected) btnClass = 'bg-red-100 border-2 border-red-400 text-red-700'
            else btnClass = 'bg-gray-50 border-2 border-gray-200 text-gray-400'
          }

          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selected !== null}
              className={cn('w-full rounded-2xl p-4 text-left font-medium text-sm transition-all active:scale-98', btnClass)}
            >
              {isCorrect && selected !== null ? '✅ ' : isSelected && !isCorrect ? '❌ ' : ''}{option}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="mt-4 space-y-3">
          <div className={cn('rounded-2xl p-4 text-sm', selected === current.correct_answer ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200')}>
            <p className="font-bold mb-1">
              {selected === current.correct_answer ? `🌟 ${encouragement}` : '💪 Okay lang! Try again next time!'}
            </p>
            <p className="text-gray-700">{current.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-2xl transition-colors"
          >
            {currentIdx < questions.length - 1 ? 'Next Question →' : '🏁 See Results!'}
          </button>
        </div>
      )}
    </div>
  )
}
