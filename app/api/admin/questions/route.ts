import { createQuestion } from "@/lib/admin"
import { NextResponse } from "next/server"
import type { Category, Difficulty } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, explanation, category, difficulty, examTag, isActive, answers } = body

    // Validation
    if (!text || !category || !difficulty || !answers || answers.length < 2) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const validAnswers = answers.filter((a: any) => a.text.trim())
    const correctAnswers = validAnswers.filter((a: any) => a.isCorrect)

    if (correctAnswers.length === 0) {
      return NextResponse.json({ error: "At least one correct answer is required" }, { status: 400 })
    }

    const question = await createQuestion({
      text,
      explanation: explanation || undefined,
      category: category as Category,
      difficulty: difficulty as Difficulty,
      examTag: examTag || undefined,
      isActive: isActive ?? true,
      answers: validAnswers,
    })

    return NextResponse.json({ question })
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 })
  }
}
