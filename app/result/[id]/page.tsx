"use client"

import { getSubmissionById } from "@/lib/quiz"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Home, Download } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ResultPage({
  params,
}: {
  params: { id: string }
}) {
  const submission = await getSubmissionById(params.id)

  if (!submission) {
    notFound()
  }

  const scorePercentage = Math.round((submission.score! / submission.totalQuestions) * 100)
  const passed = scorePercentage >= 60

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Score Summary */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">نتيجة الاختبار</CardTitle>
          <div className="space-y-2">
            <div className={`text-4xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
              {submission.score} / {submission.totalQuestions}
            </div>
            <div className={`text-xl ${passed ? "text-green-600" : "text-red-600"}`}>{scorePercentage}%</div>
            <Badge variant={passed ? "default" : "destructive"} className="text-sm">
              {passed ? "نجح" : "راسب"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <CardDescription>
            تاريخ الاختبار: {new Date(submission.createdAt).toLocaleDateString("ar-MA")}
            {submission.examTag && <span className="mr-4">• امتحان: {submission.examTag}</span>}
          </CardDescription>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Link href="/quiz">
              <Button>
                <RotateCcw className="ml-2 h-4 w-4" />
                إعادة الاختبار
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                <Home className="ml-2 h-4 w-4" />
                الرئيسية
              </Button>
            </Link>
            <div className="flex space-x-2 space-x-reverse">
              <Button variant="outline" onClick={() => window.open(`/api/export/pdf/${submission.id}`, "_blank")}>
                <Download className="ml-2 h-4 w-4" />
                تصدير PDF
              </Button>
              <Button variant="outline" onClick={() => window.open(`/api/export/word/${submission.id}`, "_blank")}>
                <Download className="ml-2 h-4 w-4" />
                تصدير Word
              </Button>
              <Button variant="outline" onClick={() => window.open(`/api/export/csv/${submission.id}`, "_blank")}>
                <Download className="ml-2 h-4 w-4" />
                تصدير CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">مراجعة الإجابات التفصيلية</h2>

        {submission.answers.map((userAnswer, index) => {
          const question = userAnswer.question
          const correctAnswers = question.answers.filter((a) => a.isCorrect)
          const selectedAnswers = question.answers.filter((a) => userAnswer.selectedAnswerIds.includes(a.id))

          // Check if answer is correct
          const correctAnswerIds = correctAnswers.map((a) => a.id)
          const selectedIds = userAnswer.selectedAnswerIds
          const hasAllCorrect = correctAnswerIds.every((id) => selectedIds.includes(id))
          const hasNoWrong = selectedIds.every((id) => correctAnswerIds.includes(id))
          const isCorrect = hasAllCorrect && hasNoWrong

          return (
            <Card key={userAnswer.id} className={`border-r-4 ${isCorrect ? "border-r-green-500" : "border-r-red-500"}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-relaxed flex-1">
                    السؤال {index + 1}: {question.text}
                  </CardTitle>
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 mt-1" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* All answer options */}
                <div className="space-y-2">
                  {question.answers.map((answer) => {
                    const isSelected = selectedIds.includes(answer.id)
                    const isCorrectAnswer = answer.isCorrect

                    let bgColor = ""
                    let textColor = ""
                    let icon = null

                    if (isCorrectAnswer && isSelected) {
                      bgColor = "bg-green-100"
                      textColor = "text-green-800"
                      icon = <CheckCircle className="h-4 w-4 text-green-600" />
                    } else if (isCorrectAnswer && !isSelected) {
                      bgColor = "bg-green-50"
                      textColor = "text-green-700"
                      icon = <CheckCircle className="h-4 w-4 text-green-600" />
                    } else if (!isCorrectAnswer && isSelected) {
                      bgColor = "bg-red-100"
                      textColor = "text-red-800"
                      icon = <XCircle className="h-4 w-4 text-red-600" />
                    } else {
                      bgColor = "bg-gray-50"
                      textColor = "text-gray-700"
                    }

                    return (
                      <div
                        key={answer.id}
                        className={`p-3 rounded-lg ${bgColor} ${textColor} flex items-center space-x-3 space-x-reverse`}
                      >
                        {icon}
                        <span className="flex-1">{answer.text}</span>
                        <div className="flex space-x-2 space-x-reverse">
                          {isSelected && (
                            <Badge variant="outline" className="text-xs">
                              اخترت
                            </Badge>
                          )}
                          {isCorrectAnswer && (
                            <Badge variant="default" className="text-xs bg-green-600">
                              صحيح
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
