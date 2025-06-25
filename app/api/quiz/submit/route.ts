import { saveQuizSubmission } from "@/lib/quiz"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { answers, examTag } = body

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid answers format" }, { status: 400 })
    }

    const submission = await saveQuizSubmission(answers, examTag)

    return NextResponse.json({
      submissionId: submission.id,
      score: submission.score,
      totalQuestions: submission.totalQuestions,
    })
  } catch (error) {
    console.error("Error submitting quiz:", error)
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
