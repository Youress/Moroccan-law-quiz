import { getAllSubmissions } from "@/lib/quiz"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, RotateCcw } from "lucide-react"
import Link from "next/link"

export default async function HistoryPage() {
  const submissions = await getAllSubmissions()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">سجل الاختبارات</h1>
        <p className="text-gray-600">راجع نتائج اختباراتك السابقة وتتبع تقدمك</p>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>لا توجد اختبارات سابقة</CardTitle>
            <CardDescription>لم تقم بأي اختبار بعد. ابدأ اختبارك الأول الآن!</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quiz">
              <Button>
                <RotateCcw className="ml-2 h-4 w-4" />
                بدء اختبار جديد
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const scorePercentage = Math.round((submission.score! / submission.totalQuestions) * 100)
            const passed = scorePercentage >= 60

            return (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        اختبار {new Date(submission.createdAt).toLocaleDateString("ar-MA")}
                      </CardTitle>
                      <CardDescription>
                        {submission.examTag && <span className="mr-2">امتحان: {submission.examTag}</span>}
                        الوقت: {new Date(submission.createdAt).toLocaleTimeString("ar-MA")}
                      </CardDescription>
                    </div>
                    <Badge variant={passed ? "default" : "destructive"}>{passed ? "نجح" : "راسب"}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className={`text-2xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
                        {submission.score} / {submission.totalQuestions}
                      </div>
                      <div className={`text-sm ${passed ? "text-green-600" : "text-red-600"}`}>{scorePercentage}%</div>
                    </div>
                    <Link href={`/result/${submission.id}`}>
                      <Button variant="outline">
                        <Eye className="ml-2 h-4 w-4" />
                        عرض التفاصيل
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
