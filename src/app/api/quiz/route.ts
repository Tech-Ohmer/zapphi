import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const { subject, topic, topicName, count = 5 } = await req.json()

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `Generate ${count} quiz questions for a Grade 3 student in the Philippines following the DepEd K-12 curriculum.

Subject: ${subject}
Topic: ${topicName}

Requirements:
- Questions must be appropriate for Grade 3 level (age 8-9)
- Use simple English or Taglish (mix of Filipino and English)
- Mix of question types: multiple choice (4 options), true/false
- For multiple choice: always have exactly 4 options labeled A, B, C, D
- Each question must have a brief Taglish explanation of the correct answer
- Make it educational and interesting

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "questions": [
    {
      "type": "multiple_choice",
      "question": "Question text here?",
      "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
      "correct_answer": "A. option1",
      "explanation": "Tama! Because... (brief Taglish explanation)"
    },
    {
      "type": "true_false",
      "question": "Statement that is true or false.",
      "options": ["True", "False"],
      "correct_answer": "True",
      "explanation": "Tama! Because... (brief Taglish explanation)"
    }
  ]
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    
    // Clean up the response in case Gemini adds markdown
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const data = JSON.parse(cleanText)

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Quiz API error:', err)
    return NextResponse.json(
      { error: 'Hindi ma-generate ang quiz ngayon. Try again!' },
      { status: 500 }
    )
  }
}
