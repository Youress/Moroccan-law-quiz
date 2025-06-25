import QuestionForm from "@/components/question-form"

export default function NewQuestionPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إضافة سؤال جديد</h1>
        <p className="text-gray-600">أنشئ سؤالاً جديداً مع خيارات الإجابة</p>
      </div>

      <QuestionForm />
    </div>
  )
}
