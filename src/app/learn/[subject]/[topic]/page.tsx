'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getStoredProfile, cn } from '@/lib/utils'
import { CURRICULUM, type SubjectId } from '@/lib/curriculum'

interface Message {
  role: 'user' | 'zapphi'
  text: string
}

export default function TopicPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = params.subject as SubjectId
  const topicId = params.topic as string
  const [profile, setProfile] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const subject = CURRICULUM[subjectId]
  const topic = subject?.topics.find(t => t.id === topicId)

  useEffect(() => {
    const stored = getStoredProfile()
    if (!stored) { router.push('/'); return }
    setProfile(stored)
    // Start with Zapphi introducing the topic
    startLesson(stored.name)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function startLesson(studentName: string) {
    setInitialLoading(true)
    const intro = `Hi ${studentName}! Today we are going to learn about "${topic?.name}" in ${subject?.name}! 😊
${topic?.description}.
Do you have any questions, or are you ready to start? Ask me anything! 🌟`
    setMessages([{ role: 'zapphi', text: intro }])
    setInitialLoading(false)
  }

  async function sendMessage() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject?.name,
          topic: topicId,
          topicName: topic?.name,
          message: userMsg,
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'zapphi', text: data.response ?? 'Sorry, something went wrong. Try again! 😅' }])
    } catch {
      setMessages(prev => [...prev, { role: 'zapphi', text: 'Oops! Something went wrong. Try again! 😅' }])
    }
    setLoading(false)
  }

  if (!topic) return null

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-purple-600 text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.push(`/learn/${subjectId}`)} className="text-white/80">←</button>
        <div className="text-2xl">{topic.emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{topic.name}</p>
          <p className="text-white/70 text-xs">{subject?.name} · Ask Zapphi anything!</p>
        </div>
        <button
          onClick={() => router.push(`/quiz/${subjectId}/${topicId}`)}
          className="bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-xl text-sm font-bold"
        >
          🎮 Quiz
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={cn('flex gap-2 max-w-xs', msg.role === 'user' ? 'ml-auto flex-row-reverse' : '')}>
            {msg.role === 'zapphi' && (
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm shrink-0">⭐</div>
            )}
            <div className={cn(
              'rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
              msg.role === 'zapphi'
                ? 'bg-white border border-purple-100 text-gray-800 rounded-tl-sm'
                : 'bg-purple-500 text-white rounded-tr-sm'
            )}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 max-w-xs">
            <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm">⭐</div>
            <div className="bg-white border border-purple-100 rounded-2xl rounded-tl-sm px-4 py-2.5">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            'Can you explain that?',
            'Give me an example!',
            "I don't understand...",
            'Can you repeat that?',
            'One more example!',
          ].map(q => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              className="shrink-0 bg-purple-100 text-purple-700 text-xs px-3 py-1.5 rounded-full font-medium hover:bg-purple-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask Zapphi anything... 💬"
          className="flex-1 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="w-11 h-11 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-200 text-white rounded-xl flex items-center justify-center transition-colors"
        >
          →
        </button>
      </div>
    </div>
  )
}
