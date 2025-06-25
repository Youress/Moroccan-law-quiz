import { toggleBookmark } from "@/lib/quiz"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { questionId } = await request.json()

    // For now, we'll use a dummy user ID since we don't have auth yet
    // In a real app, you'd get this from the session
    const userId = "dummy-user-id"

    if (!questionId) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 })
    }

    const bookmarked = await toggleBookmark(userId, questionId)

    return NextResponse.json({ bookmarked })
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 })
  }
}
