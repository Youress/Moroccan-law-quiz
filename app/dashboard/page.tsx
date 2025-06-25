import { getUserStats } from "@/lib/quiz"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Clock, BookOpen, TrendingUp, Award, Calendar, RotateCcw } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  // For demo purposes, using a dummy user ID
  // In a real app, you'd get this from the session
  const userId = "dummy-user-id"

  try {
    const stats = await getUserStats(userId)

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

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
          <p className="text-gray-600">تتبع تقدمك وإحصائياتك في تعلم القانون المغربي</p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الاختبارات</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">اختبار مكتمل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الأسئلة</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuestions}</div>
              <p className="text-xs text-muted-foreground">سؤال تم حله</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الإجابات الصحيحة</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.correctAnswers}</div>
              <p className="text-xs text-muted-foreground">إجابة صحيحة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المعدل العام</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <Progress value={stats.averageScore} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="ml-2 h-5 w-5" />
                الأداء حسب التخصص
              </CardTitle>
              <CardDescription>نتائجك في مختلف فروع القانون</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.categoryStats.length > 0 ? (
                <div className="space-y-4">
                  {stats.categoryStats.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{getCategoryLabel(category.category || "")}</span>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Badge variant="outline">{category._count.id} اختبار</Badge>
                          <span className="text-sm font-bold">
                            {Math.round(((category._avg.score || 0) * 100) / 60)}%
                          </span>
                        </div>
                      </div>
                      <Progress value={Math.round(((category._avg.score || 0) * 100) / 60)} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد بيانات كافية بعد</p>
                  <p className="text-sm">ابدأ بحل بعض الاختبارات لرؤية إحصائياتك</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="ml-2 h-5 w-5" />
                إجراءات سريعة
              </CardTitle>
              <CardDescription>ابدأ التعلم والممارسة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/quiz/setup">
                <Button className="w-full justify-start" size="lg">
                  <BookOpen className="ml-2 h-4 w-4" />
                  بدء اختبار جديد
                </Button>
              </Link>

              <Link href="/quiz?mode=REVIEW">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <RotateCcw className="ml-2 h-4 w-4" />
                  مراجعة الأسئلة الخاطئة
                </Button>
              </Link>

              <Link href="/quiz?mode=CHALLENGE&count=10">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Trophy className="ml-2 h-4 w-4" />
                  التحدي اليومي
                </Button>
              </Link>

              <Link href="/bookmarks">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <BookOpen className="ml-2 h-4 w-4" />
                  الأسئلة المحفوظة
                </Button>
              </Link>

              <Link href="/history">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Clock className="ml-2 h-4 w-4" />
                  سجل الاختبارات
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Study Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>توصيات للدراسة</CardTitle>
            <CardDescription>نصائح مخصصة لتحسين أدائك</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {stats.averageScore < 60 && (
                <div className="p-4 bg-red-50 rounded-lg border-r-4 border-red-400">
                  <h4 className="font-semibold text-red-900 mb-2">تحسين الأداء العام</h4>
                  <p className="text-red-800 text-sm">
                    معدلك الحالي {stats.averageScore}%. ننصح بالتركيز على المراجعة والتدريب المكثف.
                  </p>
                </div>
              )}

              {stats.totalSubmissions < 5 && (
                <div className="p-4 bg-blue-50 rounded-lg border-r-4 border-blue-400">
                  <h4 className="font-semibold text-blue-900 mb-2">المزيد من التدريب</h4>
                  <p className="text-blue-800 text-sm">
                    لديك {stats.totalSubmissions} اختبارات فقط. حاول حل المزيد من الاختبارات لتحسين مستواك.
                  </p>
                </div>
              )}

              {stats.averageScore >= 80 && (
                <div className="p-4 bg-green-50 rounded-lg border-r-4 border-green-400">
                  <h4 className="font-semibold text-green-900 mb-2">أداء ممتاز!</h4>
                  <p className="text-green-800 text-sm">
                    معدلك {stats.averageScore}% ممتاز. جرب الأسئلة الصعبة أو امتحانات سنوات سابقة.
                  </p>
                </div>
              )}

              <div className="p-4 bg-purple-50 rounded-lg border-r-4 border-purple-400">
                <h4 className="font-semibold text-purple-900 mb-2">التحدي اليومي</h4>
                <p className="text-purple-800 text-sm">حل 10 أسئلة يومياً لبناء عادة التعلم المستمر وتحسين الذاكرة.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>خطأ في تحميل البيانات</CardTitle>
            <CardDescription>عذراً، حدث خطأ في تحميل إحصائياتك</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quiz/setup">
              <Button>بدء اختبار جديد</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
}
