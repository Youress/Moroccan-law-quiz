import { getAllQuestions, getQuestionsCount } from "@/lib/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Edit } from "lucide-react"
import Link from "next/link"

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Number(searchParams.page) || 1
  const limit = 20
  const offset = (page - 1) * limit

  const questions = await getAllQuestions(limit, offset)
  const totalCount = await getQuestionsCount()
  const totalPages = Math.ceil(totalCount / limit)

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة الأسئلة</h1>
          <p className="text-gray-600">عرض وإدارة جميع الأسئلة ({totalCount} سؤال)</p>
        </div>
        <Link href="/admin/questions/new">
          <Button>
            <Plus className="ml-2 h-4 w-4" />
            إضافة سؤال جديد
          </Button>
        </Link>
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>لا توجد أسئلة</CardTitle>
            <CardDescription>لم يتم إنشاء أي أسئلة بعد</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/questions/new">
              <Button>
                <Plus className="ml-2 h-4 w-4" />
                إضافة أول سؤال
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {questions.map((question) => (
              <Card key={question.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 leading-relaxed mb-3">{question.text}</h3>
                      <div className="flex items-center space-x-2 space-x-reverse mb-3">
                        <Badge variant="outline">{getCategoryLabel(question.category)}</Badge>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {getDifficultyLabel(question.difficulty)}
                        </Badge>
                        {question.examTag && <Badge className="bg-blue-600">{question.examTag}</Badge>}
                        <Badge variant={question.isActive ? "default" : "secondary"}>
                          {question.isActive ? "نشط" : "معطل"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {question.answers.length} خيارات •{question.answers.filter((a) => a.isCorrect).length} إجابة
                        صحيحة • تم الإنشاء: {new Date(question.createdAt).toLocaleDateString("ar-MA")}
                      </div>
                    </div>
                    <div className="flex space-x-2 space-x-reverse ml-4">
                      <Link href={`/admin/questions/${question.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/questions/${question.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {question.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border-r-4 border-blue-400">
                      <h4 className="font-semibold text-blue-900 text-sm mb-1">التعليل:</h4>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        {question.explanation.length > 200
                          ? `${question.explanation.substring(0, 200)}...`
                          : question.explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 space-x-reverse">
              {page > 1 && (
                <Link href={`/admin/questions?page=${page - 1}`}>
                  <Button variant="outline">السابق</Button>
                </Link>
              )}

              <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                صفحة {page} من {totalPages}
              </span>

              {page < totalPages && (
                <Link href={`/admin/questions?page=${page + 1}`}>
                  <Button variant="outline">التالي</Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
