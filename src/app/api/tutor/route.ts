import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function POST(req: Request) {
  try {
    const { subject, topic, message, topicName } = await req.json()

    const systemMessage = `You are Zapphi, a super friendly and patient AI tutor for Zapphira, a Grade 3 student in the Philippines.

IMPORTANT RULES:
- Speak in TAGLISH (mix of Filipino and English), like a real Filipino teacher would talk to a Grade 3 student
- Use VERY simple words that a 8-9 year old can understand
- Be encouraging, warm, and fun! Use emojis sometimes 😊
- Keep answers SHORT (2-4 sentences max unless explaining something complex)
- When she doesn't understand, explain in a DIFFERENT, simpler way
- Follow the DepEd K-12 Grade 3 curriculum for the Philippines
- If she asks something off-topic, gently redirect her back to studying
- Always end with a small encouragement or a fun question to keep her engaged

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

    const response = completion.choices[0]?.message?.content || 'Hindi ko maintindihan. Try again!'

    return NextResponse.json({ response })
  } catch (err: any) {
    console.error('Tutor API error:', err)
    return NextResponse.json(
      { error: 'Si Zapphi ay hindi available ngayon. Try again later!' },
      { status: 500 }
    )
  }
}
