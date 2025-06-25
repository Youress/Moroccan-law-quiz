"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Send, Clock, Bookmark, BookmarkCheck, Flag, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { type Category, type Difficulty, QuizMode } from "@prisma/client"

interface Question {
  id: string
  text: string
  explanation?: string
  category: Category
  difficulty: Difficulty
  answers: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
}

interface QuizInterfaceProps {
  questions: Question[]
  examTag?: string
  category?: Category
  difficulty?: Difficulty
  mode?: QuizMode
  userId?: string
  timeLimit?: number // in minutes
}

export default function QuizInterface({
  questions,
  examTag,
  category,
  difficulty,
  mode = QuizMode.PRACTICE,
  userId,
  timeLimit,
}: QuizInterfaceProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({})
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<string>>(new Set())
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [showExplanations, setShowExplanations] = useState(mode === QuizMode.PRACTICE)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Timer setup
  useEffect(() => {
    if (timeLimit) {
      setTimeLeft(timeLimit * 60) // Convert to seconds
    }
  }, [timeLimit])

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev && prev <= 1) {
            handleSubmit() // Auto-submit when time runs out
            return 0
          }
          return prev ? prev - 1 : 0
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeLeft])

  // Track time spent on each question
  useEffect(() => {
    setQuestionStartTime(Date.now())
  }, [currentQuestionIndex])

  const handleAnswerChange = (questionId: string, answerId: string, checked: boolean) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || []
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, answerId],
        }
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((id) => id !== answerId),
        }
      }
    })
  }

  const goToNext = () => {
    // Record time spent on current question
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    setQuestionTimes((prev) => ({
      ...prev,
      [currentQuestion.id]: (prev[currentQuestion.id] || 0) + timeSpent,
    }))

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const toggleBookmark = async (questionId: string) => {
    if (!userId) return

    try {
      const response = await fetch("/api/bookmarks/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId }),
      })

      if (response.ok) {
        const { bookmarked } = await response.json()
        setBookmarkedQuestions((prev) => {
          const newSet = new Set(prev)
          if (bookmarked) {
            newSet.add(questionId)
          } else {
            newSet.delete(questionId)
          }
          return newSet
        })
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    }
  }

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const submissionData = questions.map((question) => ({
        questionId: question.id,
        selectedAnswerIds: answers[question.id] || [],
        timeSpent: questionTimes[question.id] || 0,
      }))

      const totalTimeSpent = timeLimit ? timeLimit * 60 - (timeLeft || 0) : undefined

      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: submissionData,
          examTag,
          category,
          difficulty,
          mode,
          timeSpent: totalTimeSpent,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/result/${result.submissionId}`)
      } else {
        throw new Error("Failed to submit quiz")
      }
    } catch (error) {
      console.error("Error submitting quiz:", error)
      alert("حدث خطأ في إرسال الاختبار. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
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

  const getDifficultyColor = (diff: Difficulty) => {
    const colors = {
      EASY: "bg-green-100 text-green-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HARD: "bg-red-100 text-red-800",
    }
    return colors[diff] || "bg-gray-100 text-gray-800"
  }

  const answeredQuestions = Object.keys(answers).length
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  return (
    <div className="space-y-6">
      {/* Header with Timer and Stats */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 space-x-reverse">
          {timeLeft !== null && (
            <div
              className={`flex items-center space-x-2 space-x-reverse ${timeLeft < 300 ? "text-red-600" : "text-gray-600"}`}
            >
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          )}
          <Badge variant="outline">{getCategoryLabel(currentQuestion.category)}</Badge>
          <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
            {getDifficultyLabel(currentQuestion.difficulty)}
          </Badge>
        </div>

        {mode === QuizMode.PRACTICE && (
          <Button variant="outline" size="sm" onClick={() => setShowExplanations(!showExplanations)}>
            {showExplanations ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showExplanations ? "إخفاء التعليل" : "إظهار التعليل"}
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            السؤال {currentQuestionIndex + 1} من {questions.length}
          </span>
          <span>
            {answeredQuestions} إجابة من {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg leading-relaxed flex-1">{currentQuestion.text}</CardTitle>
            <div className="flex space-x-2 space-x-reverse ml-4">
              {userId && (
                <Button variant="ghost" size="sm" onClick={() => toggleBookmark(currentQuestion.id)}>
                  {bookmarkedQuestions.has(currentQuestion.id) ? (
                    <BookmarkCheck className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => toggleFlag(currentQuestion.id)}>
                <Flag className={`h-4 w-4 ${flaggedQuestions.has(currentQuestion.id) ? "text-red-600" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.answers.map((answer) => (
            <div key={answer.id} className="flex items-start space-x-3 space-x-reverse">
              <Checkbox
                id={answer.id}
                checked={(answers[currentQuestion.id] || []).includes(answer.id)}
                onCheckedChange={(checked) => handleAnswerChange(currentQuestion.id, answer.id, checked as boolean)}
                className="mt-1"
              />
              <label htmlFor={answer.id} className="text-sm leading-relaxed cursor-pointer flex-1">
                {answer.text}
              </label>
            </div>
          ))}

          {/* Show explanation in practice mode */}
          {showExplanations && currentQuestion.explanation && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-r-4 border-blue-400">
              <h4 className="font-semibold text-blue-900 mb-2">تعليل الجواب:</h4>
              <p className="text-blue-800 leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={goToPrevious} disabled={currentQuestionIndex === 0}>
          <ChevronRight className="ml-2 h-4 w-4" />
          السابق
        </Button>

        <div className="flex space-x-2 space-x-reverse">
          {!isLastQuestion ? (
            <Button onClick={goToNext}>
              التالي
              <ChevronLeft className="mr-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? (
                "جاري الإرسال..."
              ) : (
                <>
                  <Send className="ml-2 h-4 w-4" />
                  إرسال الاختبار
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">التنقل السريع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((question, index) => {
              const isAnswered = answers[question.id]
              const isFlagged = flaggedQuestions.has(question.id)
              const isBookmarked = bookmarkedQuestions.has(question.id)

              return (
                <Button
                  key={index}
                  variant={index === currentQuestionIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`h-8 w-8 p-0 relative ${isAnswered ? "bg-green-100 border-green-300 text-green-700" : ""}`}
                >
                  {index + 1}
                  {isFlagged && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>}
                  {isBookmarked && <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
