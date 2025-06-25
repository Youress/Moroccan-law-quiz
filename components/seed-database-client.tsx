"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database, CheckCircle, AlertCircle } from "lucide-react"

export default function SeedDatabaseClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSeed = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
      } else {
        setResult({ success: false, message: data.error || "حدث خطأ" })
      }
    } catch (error) {
      setResult({ success: false, message: "فشل في الاتصال بالخادم" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleSeed} disabled={isLoading} className="w-full">
        <Database className="ml-2 h-4 w-4" />
        {isLoading ? "جاري الإضافة..." : "إضافة الأسئلة النموذجية"}
      </Button>

      {result && (
        <div
          className={`p-3 rounded-lg flex items-center space-x-2 space-x-reverse ${
            result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span className="text-sm">{result.message}</span>
        </div>
      )}
    </div>
  )
}
