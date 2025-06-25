import { getRandomQuestions } from "@/lib/quiz"
import QuizInterface from "@/components/quiz-interface"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { type Category, type Difficulty, QuizMode } from "@prisma/client"

export default async function QuizPage({
  searchParams,
}: {
  searchParams: {
    examTag?: string
    category?: Category
    difficulty?: Difficulty
    mode?: QuizMode
    count?: string
    timeLimit?: string
  }
}) {
  const { examTag, category, difficulty, mode, count, timeLimit } = searchParams
  const questionCount = count ? Number.parseInt(count) : 60
  const timeLimitMinutes = timeLimit ? Number.parseInt(timeLimit) : undefined

  const questions = await getRandomQuestions(questionCount, {
    examTag,
    category,
    difficulty,
    mode: mode || QuizMode.PRACTICE,
  })

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>لا توجد أسئلة متاحة</CardTitle>
            <CardDescription>عذراً، لا توجد أسئلة متاحة بالمعايير المحددة</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quiz/setup">
              <Button>اختيار معايير أخرى</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getCategoryLabel = (cat: Category) => {
    const labels = {
      GENERAL: "عام",
      FAMILY: "أسرة",
      CIVIL: "مدني",
      CRIMINAL: "جنائي",
      COMMERCIAL: "تجاري",
      ADMINISTRATIVE: "إداري",
      LABOR: "شغل",
      CONSTITUTIONAL: "دستوري",
      PROCEDURE: "مسطرة",
    }
    return labels[cat] || cat
  }

  const getDifficultyLabel = (diff: Difficulty) => {
    const labels = {
      EASY: "سهل",
      MEDIUM: "متوسط",
      HARD: "صعب",
    }
    return labels[diff] || diff
  }

  const getModeLabel = (m: QuizMode) => {
    const labels = {
      PRACTICE: "تدريب",
      EXAM: "امتحان",
      CHALLENGE: "تحدي يومي",
      REVIEW: "مراجعة",
    }
    return labels[m] || m
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">اختبار القانون المغربي</h1>
          <div className="flex space-x-2 space-x-reverse">
            {mode && <Badge variant="secondary">{getModeLabel(mode)}</Badge>}
            {category && <Badge variant="outline">{getCategoryLabel(category)}</Badge>}
            {difficulty && <Badge variant="outline">{getDifficultyLabel(difficulty)}</Badge>}
            {examTag && <Badge className="bg-blue-600">{examTag}</Badge>}
          </div>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
          <span>{questions.length} سؤال</span>
          {timeLimitMinutes && <span>• {timeLimitMinutes} دقيقة</span>}
          <span>• اختر جميع الإجابات الصحيحة لكل سؤال</span>
        </div>
      </div>

      <QuizInterface
        questions={questions}
        examTag={examTag}
        category={category}
        difficulty={difficulty}
        mode={mode || QuizMode.PRACTICE}
        timeLimit={timeLimitMinutes}
      />
    </div>
  )
}
