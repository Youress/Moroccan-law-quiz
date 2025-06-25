import { getQuestionById } from "@/lib/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function QuestionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const question = await getQuestionById(params.id)

  if (!question) {
    notFound()
  }

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
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Link href="/admin/questions">
            <Button variant="outline" size="sm">
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة للقائمة
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تفاصيل السؤال</h1>
            <p className="text-gray-600">عرض تفاصيل السؤال وخيارات الإجابة</p>
          </div>
        </div>
        <Link href={`/admin/questions/${question.id}/edit`}>
          <Button>
            <Edit className="ml-2 h-4 w-4" />
            تعديل السؤال
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Question Info */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg leading-relaxed flex-1">{question.text}</CardTitle>
              <div className="flex space-x-2 space-x-reverse ml-4">
                <Badge variant="outline">{getCategoryLabel(question.category)}</Badge>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {getDifficultyLabel(question.difficulty)}
                </Badge>
                {question.examTag && <Badge className="bg-blue-600">{question.examTag}</Badge>}
                <Badge variant={question.isActive ? "default" : "secondary"}>
                  {question.isActive ? "نشط" : "معطل"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>تاريخ الإنشاء:</strong> {new Date(question.createdAt).toLocaleDateString("ar-MA")}
              </div>
              <div>
                <strong>آخر تحديث:</strong> {new Date(question.updatedAt).toLocaleDateString("ar-MA")}
              </div>
              <div>
                <strong>عدد الخيارات:</strong> {question.answers.length}
              </div>
              <div>
                <strong>الإجابات الصحيحة:</strong> {question.answers.filter((a) => a.isCorrect).length}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <Card>
          <CardHeader>
            <CardTitle>خيارات الإجابة</CardTitle>
            <CardDescription>جميع خيارات الإجابة مع تحديد الصحيح منها</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.answers.map((answer, index) => (
                <div
                  key={answer.id}
                  className={`p-4 rounded-lg border-2 ${
                    answer.isCorrect ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      {answer.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-600">الخيار {index + 1}:</span>
                      <span className={answer.isCorrect ? "text-green-800" : "text-gray-700"}>{answer.text}</span>
                    </div>
                    {answer.isCorrect && (
                      <Badge variant="default" className="bg-green-600">
                        إجابة صحيحة
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}
        {question.explanation && (
          <Card>
            <CardHeader>
              <CardTitle>تعليل الجواب</CardTitle>
              <CardDescription>الشرح التفصيلي للإجابة الصحيحة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50 rounded-lg border-r-4 border-blue-400">
                <p className="text-blue-800 leading-relaxed">{question.explanation}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
