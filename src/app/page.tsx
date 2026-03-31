'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredProfile, saveProfile, cn } from '@/lib/utils'
import { AVATAR_EMOJIS, AVATAR_COLORS, AVATAR_COLOR_CLASSES, type AvatarColor } from '@/types'
import { nanoid } from 'nanoid'

export default function WelcomePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showSetup, setShowSetup] = useState(false)
  const [pin, setPin] = useState(['', '', '', ''])
  const [step, setStep] = useState<'name' | 'pin' | 'avatar'>('name')
  const [name, setName] = useState('Zapphira')
  const [selectedColor, setSelectedColor] = useState<AvatarColor>('pink')
  const [selectedEmoji, setSelectedEmoji] = useState('👧')
  const [enterPin, setEnterPin] = useState(['', '', '', ''])
  const [pinError, setPinError] = useState(false)

  useEffect(() => {
    const stored = getStoredProfile()
    setProfile(stored)
    setLoading(false)
    if (!stored) setShowSetup(true)
  }, [])

  function handlePinInput(idx: number, val: string, pinArr: string[], setPinArr: (p: string[]) => void) {
    if (!/^\d?$/.test(val)) return
    const newPin = [...pinArr]
    newPin[idx] = val
    setPinArr(newPin)
    if (val && idx < 3) {
      const next = document.getElementById(`pin-${idx + 1}`)
      next?.focus()
    }
  }

  function handleCreateProfile() {
    const pinStr = pin.join('')
    if (pinStr.length < 4) return
    const newProfile = {
      id: nanoid(),
      name: name || 'Zapphira',
      pin: pinStr,
      avatar_color: selectedColor,
      avatar_emoji: selectedEmoji,
      level: 1,
      total_stars: 0,
      created_at: new Date().toISOString(),
    }
    saveProfile(newProfile)
    setProfile(newProfile)
    setShowSetup(false)
    router.push('/learn')
  }

  function handleLogin() {
    const entered = enterPin.join('')
    if (entered === profile?.pin) {
      router.push('/learn')
    } else {
      setPinError(true)
      setEnterPin(['', '', '', ''])
      setTimeout(() => setPinError(false), 2000)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-5xl animate-bounce">🌟</div>
    </div>
  )

  // SETUP FLOW
  if (showSetup) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-2">⭐</div>
            <h1 className="text-3xl font-black text-purple-600">Zapphi</h1>
            <p className="text-gray-500 text-sm">Your Smart Learning Buddy!</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">
            {step === 'name' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 text-center">Kamusta! What's your name? 😊</h2>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border-2 border-purple-200 rounded-2xl px-4 py-3 text-lg text-center font-medium focus:outline-none focus:border-purple-500"
                  placeholder="Your name"
                  maxLength={20}
                />
                <button
                  onClick={() => name.trim() && setStep('pin')}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-2xl text-lg transition-colors"
                >
                  Susunod → Next
                </button>
              </div>
            )}

            {step === 'pin' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 text-center">Create your 4-digit PIN 🔑</h2>
                <p className="text-center text-sm text-gray-500">Secret PIN para sa iyo lang!</p>
                <div className="flex justify-center gap-3">
                  {pin.map((p, i) => (
                    <input
                      key={i}
                      id={`pin-${i}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={p}
                      onChange={e => handlePinInput(i, e.target.value, pin, setPin)}
                      className="w-14 h-14 border-2 border-purple-200 rounded-xl text-center text-2xl font-bold focus:outline-none focus:border-purple-500"
                    />
                  ))}
                </div>
                <button
                  onClick={() => pin.join('').length === 4 && setStep('avatar')}
                  disabled={pin.join('').length < 4}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-2xl text-lg transition-colors"
                >
                  Susunod → Next
                </button>
              </div>
            )}

            {step === 'avatar' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 text-center">Pick your avatar! 🎨</h2>

                {/* Emoji picker */}
                <div>
                  <p className="text-sm text-gray-500 mb-2 text-center">Pick your character:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {AVATAR_EMOJIS.map(em => (
                      <button
                        key={em}
                        onClick={() => setSelectedEmoji(em)}
                        className={cn('text-3xl p-2 rounded-xl border-2 transition-all', selectedEmoji === em ? 'border-purple-500 bg-purple-50 scale-110' : 'border-gray-200 hover:border-purple-300')}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color picker */}
                <div>
                  <p className="text-sm text-gray-500 mb-2 text-center">Pick your color:</p>
                  <div className="flex justify-center gap-3">
                    {AVATAR_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn('w-10 h-10 rounded-full border-4 transition-all', AVATAR_COLOR_CLASSES[color], selectedColor === color ? 'scale-125' : 'border-transparent')}
                      />
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className={cn('w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl border-4', AVATAR_COLOR_CLASSES[selectedColor])}>
                  {selectedEmoji}
                </div>

                <button
                  onClick={handleCreateProfile}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-2xl text-lg transition-colors"
                >
                  🚀 Let's Go, {name}!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // LOGIN (returning user)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className={cn('w-24 h-24 rounded-full mx-auto flex items-center justify-center text-5xl border-4 mb-3', AVATAR_COLOR_CLASSES[(profile?.avatar_color ?? 'pink') as AvatarColor])}>
            {profile?.avatar_emoji ?? '👧'}
          </div>
          <h1 className="text-2xl font-black text-purple-600">Welcome back!</h1>
          <p className="text-lg font-bold text-gray-700">Hi, {profile?.name}! 👋</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-yellow-500 font-bold">⭐ {profile?.total_stars ?? 0} stars</span>
            <span className="text-gray-400">·</span>
            <span className="text-purple-500 font-bold">Level {profile?.level ?? 1}</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 text-center">Enter your PIN to start! 🔑</h2>

          <div className="flex justify-center gap-3">
            {enterPin.map((p, i) => (
              <input
                key={i}
                id={`epin-${i}`}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={p}
                onChange={e => {
                  handlePinInput(i, e.target.value, enterPin, setEnterPin)
                }}
                onKeyDown={e => e.key === 'Backspace' && !enterPin[i] && i > 0 && document.getElementById(`epin-${i - 1}`)?.focus()}
                className={cn('w-14 h-14 border-2 rounded-xl text-center text-2xl font-bold focus:outline-none transition-colors', pinError ? 'border-red-400 bg-red-50' : 'border-purple-200 focus:border-purple-500')}
              />
            ))}
          </div>

          {pinError && <p className="text-center text-red-500 text-sm font-medium">Mali ang PIN. Try again! 🙈</p>}

          <button
            onClick={handleLogin}
            disabled={enterPin.join('').length < 4}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-2xl text-lg transition-colors"
          >
            🚀 Let's Study!
          </button>

          <div className="text-center">
            <button
              onClick={() => router.push('/parent')}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Parent Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
