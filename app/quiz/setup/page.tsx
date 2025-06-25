"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Target, Zap, RotateCcw, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"
import { type Category, type Difficulty, QuizMode } from "@prisma/client"

export default function QuizSetupPage() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<QuizMode>(QuizMode.PRACTICE)
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "">("")
  const [selectedExamTag, setSelectedExamTag] = useState("")
  const [questionCount, setQuestionCount] = useState(60)
  const [timeLimit, setTimeLimit] = useState<number | "">("")
  const [enableTimer, setEnableTimer] = useState(false)

  const categories = [
    { value: "GENERAL", label: "عام", icon: "📚" },
    { value: "FAMILY", label: "أسرة", icon: "👨‍👩‍👧‍👦" },
    { value: "CIVIL", label: "مدني", icon: "🏛️" },
    { value: "CRIMINAL", label: "جنائي", icon: "⚖️" },
    { value: "COMMERCIAL", label: "تجاري", icon: "💼" },
    { value: "ADMINISTRATIVE", label: "إداري", icon: "🏢" },
    { value: "LABOR", label: "شغل", icon: "👷" },
    { value: "CONSTITUTIONAL", label: "دستوري", icon: "📜" },
    { value: "PROCEDURE", label: "مسطرة", icon: "📋" },
  ]

  const difficulties = [
    { value: "EASY", label: "سهل", color: "bg-green-100 text-green-800" },
    { value: "MEDIUM", label: "متوسط", color: "bg-yellow-100 text-yellow-800" },
    { value: "HARD", label: "صعب", color: "bg-red-100 text-red-800" },
  ]

  const modes = [
    {
      value: QuizMode.PRACTICE,
      label: "تدريب",
      description: "تدريب مع إظهار التعليل والإجابات",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: QuizMode.EXAM,
      label: "امتحان",
      description: "محاكاة امتحان حقيقي بدون تعليل",
      icon: Target,
      color: "bg-red-100 text-red-800",
    },
    {
      value: QuizMode.REVIEW,
      label: "مراجعة",
      description: "مراجعة الأسئلة التي أخطأت فيها سابقاً",
      icon: RotateCcw,
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: QuizMode.CHALLENGE,
      label: "تحدي يومي",
      description: "تحدي يومي قصير لبناء عادة التعلم",
      icon: Zap,
      color: "bg-orange-100 text-orange-800",
    },
  ]

  const examTags = ["Exam2025", "Exam2024", "Exam2023", "Exam2022", "Exam2021"]

  const handleStartQuiz = () => {
    const params = new URLSearchParams()

    params.set("mode", selectedMode)
    if (selectedCategory) params.set("category", selectedCategory)
    if (selectedDifficulty) params.set("difficulty", selectedDifficulty)
    if (selectedExamTag) params.set("examTag", selectedExamTag)
    if (questionCount !== 60) params.set("count", questionCount.toString())
    if (enableTimer && timeLimit) params.set("timeLimit", timeLimit.toString())

    router.push(`/quiz?${params.toString()}`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إعداد الاختبار</h1>
        <p className="text-gray-600">اختر المعايير المناسبة لبدء اختبارك</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quiz Mode Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="ml-2 h-5 w-5" />
              نوع الاختبار
            </CardTitle>
            <CardDescription>اختر نوع الاختبار المناسب لأهدافك</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {modes.map((mode) => (
              <div
                key={mode.value}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedMode === mode.value ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedMode(mode.value)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <mode.icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="font-semibold">{mode.label}</h3>
                      <p className="text-sm text-gray-600">{mode.description}</p>
                    </div>
                  </div>
                  <Badge className={mode.color}>{mode.label}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>المرشحات والإعدادات</CardTitle>
            <CardDescription>حدد المعايير لتخصيص اختبارك</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category */}
            <div className="space-y-2">
              <Label>التخصص</Label>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر التخصص (اختياري)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">جميع التخصصات</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label>مستوى الصعوبة</Label>
              <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مستوى الصعوبة (اختياري)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">جميع المستويات</SelectItem>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff.value} value={diff.value}>
                      {diff.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exam Tag */}
            <div className="space-y-2">
              <Label>امتحان محدد</Label>
              <Select value={selectedExamTag} onValueChange={setSelectedExamTag}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر امتحان محدد (اختياري)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">جميع الامتحانات</SelectItem>
                  {examTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Question Count */}
            <div className="space-y-2">
              <Label>عدد الأسئلة</Label>
              <Input
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number.parseInt(e.target.value) || 60)}
                min={5}
                max={100}
              />
            </div>

            {/* Timer */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="enable-timer"
                  checked={enableTimer}
                  onCheckedChange={(checked) => setEnableTimer(checked as boolean)}
                />
                <Label htmlFor="enable-timer" className="flex items-center">
                  <Clock className="ml-2 h-4 w-4" />
                  تفعيل المؤقت
                </Label>
              </div>
              {enableTimer && (
                <div className="space-y-2">
                  <Label>المدة بالدقائق</Label>
                  <Input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number.parseInt(e.target.value) || "")}
                    placeholder="مثال: 120 دقيقة"
                    min={5}
                    max={300}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Start Button */}
      <div className="mt-8 text-center">
        <Button onClick={handleStartQuiz} size="lg" className="bg-blue-600 hover:bg-blue-700">
          <BookOpen className="ml-2 h-5 w-5" />
          بدء الاختبار
        </Button>
      </div>
    </div>
  )
}
