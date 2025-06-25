"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Eye, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import Link from "next/link"
import type { Category, Difficulty } from "@prisma/client"

interface Question {
  id: string
  text: string
  explanation?: string
  category: Category
  difficulty: Difficulty
  examTag?: string
  isActive: boolean
  createdAt: Date
  answers: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
}

export default function QuestionSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "">("")
  const [selectedExamTag, setSelectedExamTag] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"active" | "inactive" | "">("")
  const [results, setResults] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    { value: "GENERAL", label: "عام" },
    { value: "FAMILY", label: "أسرة" },
    { value: "CIVIL", label: "مدني" },
    { value: "CRIMINAL", label: "جنائي" },
    { value: "COMMERCIAL", label: "تجاري" },
    { value: "ADMINISTRATIVE", label: "إداري" },
    { value: "LABOR", label: "شغل" },
    { value: "CONSTITUTIONAL", label: "دستوري" },
    { value: "PROCEDURE", label: "مسطرة" },
  ]

  const difficulties = [
    { value: "EASY", label: "سهل" },
    { value: "MEDIUM", label: "متوسط" },
    { value: "HARD", label: "صعب" },
  ]

  const examTags = ["Exam2025", "Exam2024", "Exam2023", "Exam2022", "Exam2021"]

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.set("query", searchQuery)
      if (selectedCategory) params.set("category", selectedCategory)
      if (selectedDifficulty) params.set("difficulty", selectedDifficulty)
      if (selectedExamTag) params.set("examTag", selectedExamTag)
      if (selectedStatus) params.set("isActive", selectedStatus === "active" ? "true" : "false")

      const response = await fetch(`/api/admin/questions/search?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.questions)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleStatus = async (questionId: string) => {
    try {
      const response = await fetch(`/api/admin/questions/${questionId}/toggle`, {
        method: "POST",
      })
      if (response.ok) {
        // Refresh search results
        handleSearch()
      }
    } catch (error) {
      console.error("Toggle error:", error)
    }
  }

  const handleDelete = async (questionId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا السؤال؟ هذا الإجراء لا يمكن التراجع عنه.")) {
      try {
        const response = await fetch(`/api/admin/questions/${questionId}`, {
          method: "DELETE",
        })
        if (response.ok) {
          // Refresh search results
          handleSearch()
        }
      } catch (error) {
        console.error("Delete error:", error)
      }
    }
  }

  const getCategoryLabel = (category: string) => {
    return categories.find((c) => c.value === category)?.label || category
  }

  const getDifficultyLabel = (difficulty: string) => {
    return difficulties.find((d) => d.value === difficulty)?.label || difficulty
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
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          placeholder="البحث في نص السؤال..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category)}>
          <SelectTrigger>
            <SelectValue placeholder="التصنيف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع التصنيفات</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}>
          <SelectTrigger>
            <SelectValue placeholder="مستوى الصعوبة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المستويات</SelectItem>
            {difficulties.map((diff) => (
              <SelectItem key={diff.value} value={diff.value}>
                {diff.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedExamTag} onValueChange={setSelectedExamTag}>
          <SelectTrigger>
            <SelectValue placeholder="امتحان محدد" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الامتحانات</SelectItem>
            {examTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as "active" | "inactive" | "")}
        >
          <SelectTrigger>
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="inactive">معطل</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="ml-2 h-4 w-4" />
          {isLoading ? "جاري البحث..." : "بحث"}
        </Button>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">نتائج البحث ({results.length})</h3>
          {results.map((question) => (
            <Card key={question.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 leading-relaxed mb-2">{question.text}</h4>
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
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(question.id)}>
                      {question.isActive ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {question.answers.length} خيارات •{question.answers.filter((a) => a.isCorrect).length} إجابة صحيحة •
                  تم الإنشاء: {new Date(question.createdAt).toLocaleDateString("ar-MA")}
                </div>
                {question.explanation && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-800">
                    <strong>التعليل:</strong> {question.explanation.substring(0, 100)}...
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
