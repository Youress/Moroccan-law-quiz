import { getQuestionById } from "@/lib/admin"
import QuestionForm from "@/components/question-form"
import { notFound } from "next/navigation"

export default async function EditQuestionPage({
  params,
}: {
  params: { id: string }
}) {
  const question = await getQuestionById(params.id)

  if (!question) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">تعديل السؤال</h1>
        <p className="text-gray-600">تعديل السؤال وخيارات الإجابة</p>
      </div>

      <QuestionForm question={question} />
    </div>
  )
}
