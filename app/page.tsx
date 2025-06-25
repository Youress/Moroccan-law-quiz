import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Trophy, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">مرحباً بك في منصة اختبار القانون المغربي</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          منصة شاملة لطلاب وممارسي القانون المغربي لممارسة ومراجعة الأسئلة القانونية والاستعداد للامتحانات المهنية
        </p>
        <div className="flex justify-center space-x-4 space-x-reverse">
          <Link href="/quiz">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <BookOpen className="ml-2 h-5 w-5" />
              بدء اختبار جديد
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="outline" size="lg">
              <Trophy className="ml-2 h-5 w-5" />
              عرض النتائج السابقة
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle className="text-lg">60 سؤال عشوائي</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>اختبار شامل يحتوي على 60 سؤالاً عشوائياً من مختلف فروع القانون المغربي</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Clock className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle className="text-lg">حفظ النتائج</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>احفظ نتائجك وراجع إجاباتك السابقة لتتبع تقدمك في التعلم</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Trophy className="h-8 w-8 text-yellow-600 mb-2" />
            <CardTitle className="text-lg">إعادة الاختبار</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>أعد الاختبار عدة مرات بأسئلة مختلفة لتحسين مستواك</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-purple-600 mb-2" />
            <CardTitle className="text-lg">تصنيف الامتحانات</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>أسئلة مصنفة حسب الامتحانات المختلفة مثل امتحان 2025</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">كيف يعمل الاختبار؟</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">ابدأ الاختبار</h3>
            <p className="text-gray-600">اضغط على "بدء اختبار جديد" للحصول على 60 سؤالاً عشوائياً</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">أجب على الأسئلة</h3>
            <p className="text-gray-600">اختر الإجابات الصحيحة وتنقل بين الأسئلة بحرية</p>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-yellow-600">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">راجع النتائج</h3>
            <p className="text-gray-600">احصل على درجتك وراجع الإجابات الصحيحة والخاطئة</p>
          </div>
        </div>
      </div>
    </div>
  )
}
