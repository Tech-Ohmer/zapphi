import Groq from 'groq-sdk'
import { NextResponse } from 'next/server'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function POST(req: Request) {
  try {
    const { subject, topic, topicName, count = 5 } = await req.json()

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

Return ONLY valid JSON in this exact format:
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

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    })

    const text = completion.choices[0]?.message?.content?.trim() || '{}'
    const data = JSON.parse(text)

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Quiz API error:', err)
    return NextResponse.json(
      { error: 'Hindi ma-generate ang quiz ngayon. Try again!' },
      { status: 500 }
    )
  }
}
