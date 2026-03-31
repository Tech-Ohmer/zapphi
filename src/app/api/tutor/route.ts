import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const { subject, topic, message, topicName } = await req.json()

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const systemPrompt = `You are Zapphi, a super friendly and patient AI tutor for Zapphira, a Grade 3 student in the Philippines. 

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
Topic: ${topicName}

Current question from student: "${message}"`

    const result = await model.generateContent(systemPrompt)
    const response = result.response.text()

    return NextResponse.json({ response })
  } catch (err: any) {
    console.error('Tutor API error:', err)
    return NextResponse.json(
      { error: 'Si Zapphi ay hindi available ngayon. Try again later!' },
      { status: 500 }
    )
  }
}
