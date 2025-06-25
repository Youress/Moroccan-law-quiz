import { searchQuestions } from "@/lib/admin"
import { NextResponse } from "next/server"
import type { Category, Difficulty } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const category = searchParams.get("category") as Category | undefined
    const difficulty = searchParams.get("difficulty") as Difficulty | undefined
    const examTag = searchParams.get("examTag") || undefined
    const isActiveParam = searchParams.get("isActive")
    const isActive = isActiveParam ? isActiveParam === "true" : undefined

    const questions = await searchQuestions(query, category, difficulty, examTag, isActive)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Error searching questions:", error)
    return NextResponse.json({ error: "Failed to search questions" }, { status: 500 })
  }
}
