import { getBookmarkedQuestions } from "@/lib/quiz"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bookmark, BookOpen, Trash2 } from "lucide-react"
import Link from "next/link"

export default async function BookmarksPage() {
  // For demo purposes, using a dummy user ID
  const userId = "dummy-user-id"

  const bookmarkedQuestions = await getBookmarkedQuestions(userId)

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
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
    return labels[category] || category
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      EASY: "سهل",
      MEDIUM: "متوسط",
      HARD: "صعب",
    }
    return labels[difficulty] || difficulty
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      EASY: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HARD: "bg-red-100 text-red-800",
    }
    return colors[difficulty] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Bookmark className="ml-2 h-6 w-6" />
          الأسئلة المحفوظة
        </h1>
        <p className="text-gray-600">راجع الأسئلة التي حفظتها للمراجعة لاحقاً</p>
      </div>

      {bookmarkedQuestions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>لا توجد أسئلة محفوظة</CardTitle>
            <CardDescription>لم تقم بحفظ أي أسئلة بعد. احفظ الأسئلة المهمة أثناء حل الاختبارات</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quiz/setup">
              <Button>
                <BookOpen className="ml-2 h-4 w-4" />
                بدء اختبار جديد
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">{bookmarkedQuestions.length} سؤال محفوظ</p>
            <Link href={`/quiz?mode=PRACTICE&bookmarked=true`}>
              <Button variant="outline">
                <BookOpen className="ml-2 h-4 w-4" />
                تدريب على الأسئلة المحفوظة
              </Button>
            </Link>
          </div>

          {bookmarkedQuestions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg leading-relaxed flex-1">
                    السؤال {index + 1}: {question.text}
                  </CardTitle>
                  <div className="flex space-x-2 space-x-reverse ml-4">
                    <Badge variant="outline">{getCategoryLabel(question.category)}</Badge>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {getDifficultyLabel(question.difficulty)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Answer options */}
                <div className="space-y-2">
                  {question.answers.map((answer) => (
                    <div
                      key={answer.id}
                      className={`p-3 rounded-lg ${
                        answer.isCorrect ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex-1">{answer.text}</span>
                        {answer.isCorrect && (
                          <Badge variant="default" className="bg-green-600">
                            صحيح
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="p-4 bg-blue-50 rounded-lg border-r-4 border-blue-400">
                    <h4 className="font-semibold text-blue-900 mb-2">تعليل الجواب:</h4>
                    <p className="text-blue-800 leading-relaxed">{question.explanation}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-2 space-x-reverse pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Trash2 className="ml-2 h-4 w-4" />
                    إزالة من المحفوظات
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
