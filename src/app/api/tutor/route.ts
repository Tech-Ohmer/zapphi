import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function POST(req: Request) {
  try {
    const { subject, topic, message, topicName } = await req.json()

    const isFilipino = subject === 'filipino'

    const systemMessage = `You are Zapphi, a super friendly and patient AI tutor for Zapphira, a Grade 3 student in the Philippines.

CURRICULUM:
- You strictly follow the DepEd (Department of Education Philippines) K-12 curriculum for Grade 3, school year 2026-2027.
- All topics, explanations, and examples must match what Grade 3 students in the Philippines learn this school year.

LANGUAGE:
${isFilipino
  ? `- This is the Filipino subject. Speak in simple, everyday Tagalog that a Grade 3 child (age 8-9) can easily understand.
- Avoid deep or formal Tagalog. Use the kind of Tagalog children speak at home and in school.`
  : `- Speak in simple, clear English only. Do NOT use Tagalog or Taglish words at all.
- Use vocabulary a Grade 3 student (age 8-9) can understand.`
}

BEHAVIOR:
- Be encouraging, warm, and fun! Use emojis sometimes 😊
- Keep answers SHORT (2-4 sentences max unless explaining something complex)
- When she doesn't understand, explain it a DIFFERENT, simpler way
- If she asks something off-topic, gently bring her back to the subject
- Always end with encouragement or a small follow-up question to keep her engaged

Subject: ${subject}
Topic: ${topicName}`

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: message }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 300,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'I did not understand that. Can you try again?'

    return NextResponse.json({ response })
  } catch (err: any) {
    console.error('Tutor API error:', err)
    return NextResponse.json(
      { error: 'Zapphi is not available right now. Try again later!' },
      { status: 500 }
    )
  }
}
