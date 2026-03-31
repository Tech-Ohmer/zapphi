import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { starsFromScore } from '@/types'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

// Save quiz result
export async function POST(req: Request) {
  try {
    const { profileName, subjectId, topicId, score, totalQuestions, mode } = await req.json()
    const supabase = getClient()
    const stars = starsFromScore(score)

    // Save quiz session
    await supabase.from('quiz_sessions').insert({
      profile_name: profileName,
      subject_id: subjectId,
      topic_id: topicId,
      score,
      total_questions: totalQuestions,
      stars_earned: stars,
      mode,
    })

    // Upsert topic progress
    const { data: existing } = await supabase
      .from('topic_progress')
      .select('*')
      .eq('profile_name', profileName)
      .eq('subject_id', subjectId)
      .eq('topic_id', topicId)
      .single()

    const newBestScore = Math.max(score, existing?.best_score ?? 0)
    const newStars = Math.max(stars, existing?.stars ?? 0)

    await supabase.from('topic_progress').upsert({
      profile_name: profileName,
      subject_id: subjectId,
      topic_id: topicId,
      stars: newStars,
      best_score: newBestScore,
      times_attempted: (existing?.times_attempted ?? 0) + 1,
      completed: newBestScore >= 50,
      last_attempted: new Date().toISOString(),
    }, { onConflict: 'profile_name,subject_id,topic_id' })

    // Update daily session
    await supabase.from('daily_sessions').upsert({
      profile_name: profileName,
      session_date: new Date().toISOString().split('T')[0],
      stars_earned: stars,
    }, { onConflict: 'profile_name,session_date' })

    return NextResponse.json({ success: true, stars })
  } catch (err: any) {
    console.error('Progress API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// Get progress for parent dashboard
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const profileName = searchParams.get('profile')
    if (!profileName) return NextResponse.json({ error: 'Profile required' }, { status: 400 })

    const supabase = getClient()

    const [progress, sessions, achievements, daily] = await Promise.all([
      supabase.from('topic_progress').select('*').eq('profile_name', profileName),
      supabase.from('quiz_sessions').select('*').eq('profile_name', profileName).order('created_at', { ascending: false }).limit(20),
      supabase.from('achievements').select('*').eq('profile_name', profileName),
      supabase.from('daily_sessions').select('*').eq('profile_name', profileName).order('session_date', { ascending: false }).limit(14),
    ])

    return NextResponse.json({
      progress: progress.data ?? [],
      sessions: sessions.data ?? [],
      achievements: achievements.data ?? [],
      daily: daily.data ?? [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
