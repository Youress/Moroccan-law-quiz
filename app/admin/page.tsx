import { getAllQuestions, getQuestionsCount } from "@/lib/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Database, Edit, Eye, Trash2, Search } from "lucide-react"
import Link from "next/link"
import SeedDatabaseClient from "@/components/seed-database-client"
import QuestionSearch from "@/components/question-search"

export default async function AdminPage() {
  const questions = await getAllQuestions(20) // Get first 20 questions
  const totalCount = await getQuestionsCount()

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">لوحة الإدارة</h1>
        <p className="text-gray-600">إدارة الأسئلة وقاعدة البيانات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأسئلة</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">سؤال في قاعدة البيانات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأسئلة النشطة</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{questions.filter((q) => q.isActive).length}</div>
            <p className="text-xs text-muted-foreground">سؤال نشط</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأسئلة المعطلة</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{questions.filter((q) => !q.isActive).length}</div>
            <p className="text-xs text-muted-foreground">سؤال معطل</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4 space-x-reverse">
          <Link href="/admin/questions/new">
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة سؤال جديد
            </Button>
          </Link>
          <Link href="/admin/questions">
            <Button variant="outline">
              <Search className="ml-2 h-4 w-4" />
              عرض جميع الأسئلة
            </Button>
          </Link>
        </div>
      </div>

      {/* Database Seeding */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>إضافة البيانات النموذجية</CardTitle>
          <CardDescription>إضافة أسئلة نموذجية لاختبار النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <SeedDatabaseClient />
        </CardContent>
      </Card>

      {/* Search Component */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>البحث في الأسئلة</CardTitle>
          <CardDescription>ابحث عن الأسئلة حسب النص أو التصنيف</CardDescription>
        </CardHeader>
        <CardContent>
          <QuestionSearch />
        </CardContent>
      </Card>

      {/* Recent Questions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>الأسئلة الحديثة</CardTitle>
              <CardDescription>آخر 20 سؤال تم إضافتهم</CardDescription>
            </div>
            <Link href="/admin/questions">
              <Button variant="outline" size="sm">
                عرض الكل
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد أسئلة في قاعدة البيانات</p>
              <p className="text-sm">ابدأ بإضافة أسئلة جديدة أو استخدم البيانات النموذجية</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 leading-relaxed mb-2">
                        {question.text.length > 100 ? `${question.text.substring(0, 100)}...` : question.text}
                      </h3>
                      <div className="flex items-center space-x-2 space-x-reverse">
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
                  <div className="text-sm text-gray-600">
                    {question.answers.length} خيارات •{question.answers.filter((a) => a.isCorrect).length} إجابة صحيحة •
                    تم الإنشاء: {new Date(question.createdAt).toLocaleDateString("ar-MA")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
