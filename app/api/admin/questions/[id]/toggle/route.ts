import { toggleQuestionStatus } from "@/lib/admin"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const question = await toggleQuestionStatus(params.id)
    return NextResponse.json({ question })
  } catch (error) {
    console.error("Error toggling question status:", error)
    return NextResponse.json({ error: "Failed to toggle question status" }, { status: 500 })
  }
}
