import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Category, Difficulty } from "@prisma/client"

export async function POST() {
  try {
    console.log("🌱 Seeding database...")

    // Check if questions already exist
    const existingQuestions = await prisma.question.count()
    if (existingQuestions > 0) {
      return NextResponse.json({
        message: "Database already seeded",
        questionsCount: existingQuestions,
      })
    }

    // Enhanced sample questions with categories, difficulties, and explanations
    const sampleQuestions = [
      {
        text: "ما هو المبدأ الأساسي في القانون الجنائي المغربي فيما يتعلق بقرينة البراءة؟",
        explanation:
          "قرينة البراءة مبدأ أساسي في القانون الجنائي المغربي، حيث يعتبر المتهم بريئاً حتى تثبت إدانته بحكم قضائي نهائي. هذا المبدأ منصوص عليه في الدستور المغربي والقانون الجنائي.",
        category: Category.CRIMINAL,
        difficulty: Difficulty.EASY,
        examTag: "Exam2025",
        answers: [
          { text: "المتهم بريء حتى تثبت إدانته", isCorrect: true },
          { text: "المتهم مذنب حتى يثبت براءته", isCorrect: false },
          { text: "لا توجد قرينة في القانون المغربي", isCorrect: false },
          { text: "القاضي يقرر القرينة", isCorrect: false },
        ],
      },
      {
        text: "ما هي مدة التقادم في الجرائم الجنائية حسب القانون الجنائي المغربي؟",
        explanation:
          "حسب الفصل 5 من قانون المسطرة الجنائية المغربي، تتقادم الدعوى العمومية في الجنايات بمرور 15 سنة من يوم ارتكاب الجريمة.",
        category: Category.CRIMINAL,
        difficulty: Difficulty.MEDIUM,
        examTag: "Exam2025",
        answers: [
          { text: "5 سنوات", isCorrect: false },
          { text: "10 سنوات", isCorrect: false },
          { text: "15 سنة", isCorrect: true },
          { text: "20 سنة", isCorrect: false },
        ],
      },
      {
        text: "في القانون التجاري المغربي، ما هو الحد الأدنى لرأس مال الشركة المساهمة؟",
        explanation:
          "حسب قانون الشركات المغربي رقم 17.95، الحد الأدنى لرأس مال الشركة المساهمة هو 300,000 درهم إذا لم تدع الجمهور للاكتتاب، و3,000,000 درهم إذا دعت الجمهور للاكتتاب.",
        category: Category.COMMERCIAL,
        difficulty: Difficulty.MEDIUM,
        examTag: "Exam2025",
        answers: [
          { text: "100,000 درهم", isCorrect: false },
          { text: "300,000 درهم", isCorrect: true },
          { text: "500,000 درهم", isCorrect: false },
          { text: "1,000,000 درهم", isCorrect: false },
        ],
      },
      {
        text: "حسب مدونة الأسرة المغربية، ما هو السن القانوني للزواج؟",
        explanation:
          "حسب المادة 19 من مدونة الأسرة المغربية، أهلية الزواج تكتمل بإتمام الفتى والفتاة المتمتعين بقواهما العقلية ثماني عشرة سنة شمسية.",
        category: Category.FAMILY,
        difficulty: Difficulty.EASY,
        examTag: "Exam2025",
        answers: [
          { text: "16 سنة للذكر والأنثى", isCorrect: false },
          { text: "18 سنة للذكر و16 سنة للأنثى", isCorrect: false },
          { text: "18 سنة للذكر والأنثى", isCorrect: true },
          { text: "21 سنة للذكر و18 سنة للأنثى", isCorrect: false },
        ],
      },
      {
        text: "في القانون الإداري المغربي، ما هي المدة القانونية للطعن في القرارات الإدارية؟",
        explanation:
          "حسب قانون المحاكم الإدارية، مدة الطعن في القرارات الإدارية هي 60 يوماً من تاريخ التبليغ أو النشر، وهذه المدة من النظام العام.",
        category: Category.ADMINISTRATIVE,
        difficulty: Difficulty.MEDIUM,
        examTag: "Exam2025",
        answers: [
          { text: "30 يوماً", isCorrect: false },
          { text: "60 يوماً", isCorrect: true },
          { text: "90 يوماً", isCorrect: false },
          { text: "120 يوماً", isCorrect: false },
        ],
      },
      {
        text: "ما هي الشروط الأساسية لصحة العقد في القانون المدني المغربي؟",
        explanation:
          "حسب قانون الالتزامات والعقود المغربي، الشروط الأساسية لصحة العقد هي: الرضا (التراضي)، والمحل (موضوع العقد)، والسبب (الغرض المشروع من العقد).",
        category: Category.CIVIL,
        difficulty: Difficulty.EASY,
        examTag: "Exam2025",
        answers: [
          { text: "الرضا والمحل والسبب", isCorrect: true },
          { text: "الكتابة والشهود", isCorrect: false },
          { text: "التوقيع فقط", isCorrect: false },
          { text: "الموافقة الشفهية", isCorrect: false },
        ],
      },
      {
        text: "في قانون الشغل المغربي، ما هي مدة فترة التجربة القصوى للإطارات؟",
        explanation:
          "حسب المادة 13 من مدونة الشغل المغربية، مدة فترة التجربة للإطارات والمستخدمين المماثلين لا يمكن أن تتجاوز ثلاثة أشهر.",
        category: Category.LABOR,
        difficulty: Difficulty.MEDIUM,
        examTag: "Exam2025",
        answers: [
          { text: "شهر واحد", isCorrect: false },
          { text: "شهرين", isCorrect: false },
          { text: "ثلاثة أشهر", isCorrect: true },
          { text: "ستة أشهر", isCorrect: false },
        ],
      },
      {
        text: "حسب القانون الجنائي المغربي، ما هي عقوبة جريمة السرقة البسيطة؟",
        explanation:
          "حسب الفصل 505 من القانون الجنائي المغربي، عقوبة السرقة البسيطة هي الحبس من شهر واحد إلى سنة وغرامة من 200 إلى 500 درهم.",
        category: Category.CRIMINAL,
        difficulty: Difficulty.MEDIUM,
        examTag: "Exam2025",
        answers: [
          { text: "الحبس من شهر إلى سنة", isCorrect: true },
          { text: "الحبس من سنة إلى خمس سنوات", isCorrect: false },
          { text: "غرامة مالية فقط", isCorrect: false },
          { text: "الأشغال الشاقة", isCorrect: false },
        ],
      },
      {
        text: "في القانون التجاري المغربي، متى يعتبر التاجر في حالة توقف عن الدفع؟",
        explanation:
          "حسب قانون صعوبات المقاولة، يعتبر التاجر في حالة توقف عن الدفع عندما يكون غير قادر على أداء ديونه المستحقة الأداء من أصوله المتاحة.",
        category: Category.COMMERCIAL,
        difficulty: Difficulty.HARD,
        examTag: "Exam2025",
        answers: [
          { text: "عند عدم قدرته على دفع ديونه المستحقة", isCorrect: true },
          { text: "عند إغلاق المحل التجاري", isCorrect: false },
          { text: "عند تغيير النشاط التجاري", isCorrect: false },
          { text: "عند انتهاء رخصة التجارة", isCorrect: false },
        ],
      },
      {
        text: "ما هو الحد الأقصى لساعات العمل الأسبوعية في قانون الشغل المغربي؟",
        explanation:
          "حسب المادة 184 من مدونة الشغل، مدة الشغل العادية للأجراء في الأنشطة غير الفلاحية هي 2288 ساعة في السنة أو 44 ساعة في الأسبوع.",
        category: Category.LABOR,
        difficulty: Difficulty.EASY,
        examTag: "Exam2025",
        answers: [
          { text: "40 ساعة", isCorrect: false },
          { text: "44 ساعة", isCorrect: true },
          { text: "48 ساعة", isCorrect: false },
          { text: "50 ساعة", isCorrect: false },
        ],
      },
    ]

    // Create achievements
    const achievements = [
      {
        name: "first_quiz",
        nameAr: "أول اختبار",
        description: "Complete your first quiz",
        descriptionAr: "أكمل اختبارك الأول",
        icon: "trophy",
        condition: JSON.stringify({ type: "quiz_count", value: 1 }),
        points: 10,
      },
      {
        name: "quiz_veteran",
        nameAr: "محارب الاختبارات",
        description: "Complete 10 quizzes",
        descriptionAr: "أكمل 10 اختبارات",
        icon: "medal",
        condition: JSON.stringify({ type: "quiz_count", value: 10 }),
        points: 50,
      },
      {
        name: "hundred_correct",
        nameAr: "مئة إجابة صحيحة",
        description: "Answer 100 questions correctly",
        descriptionAr: "أجب على 100 سؤال بشكل صحيح",
        icon: "target",
        condition: JSON.stringify({ type: "correct_answers", value: 100 }),
        points: 100,
      },
      {
        name: "five_hundred_correct",
        nameAr: "خمسمئة إجابة صحيحة",
        description: "Answer 500 questions correctly",
        descriptionAr: "أجب على 500 سؤال بشكل صحيح",
        icon: "star",
        condition: JSON.stringify({ type: "correct_answers", value: 500 }),
        points: 250,
      },
      {
        name: "perfect_score",
        nameAr: "النتيجة الكاملة",
        description: "Get 100% score on a quiz",
        descriptionAr: "احصل على نتيجة 100% في اختبار",
        icon: "crown",
        condition: JSON.stringify({ type: "perfect_score", value: 1 }),
        points: 200,
      },
    ]

    // Create achievements first
    for (const achievement of achievements) {
      await prisma.achievement.create({
        data: achievement,
      })
    }

    // Create questions with answers
    let createdCount = 0
    for (const questionData of sampleQuestions) {
      await prisma.question.create({
        data: {
          text: questionData.text,
          explanation: questionData.explanation,
          category: questionData.category,
          difficulty: questionData.difficulty,
          examTag: questionData.examTag,
          answers: {
            create: questionData.answers,
          },
        },
      })
      createdCount++
    }

    // Add more sample questions to reach 60+ for testing
    const additionalQuestions = Array.from({ length: 50 }, (_, i) => ({
      text: `سؤال قانوني رقم ${i + 11}: ما هو الحكم القانوني في هذه الحالة؟`,
      explanation: `هذا تعليل نموذجي للسؤال رقم ${i + 11}. يجب مراجعة النصوص القانونية ذات الصلة لفهم الحكم بشكل كامل.`,
      category: Object.values(Category)[i % Object.values(Category).length],
      difficulty: Object.values(Difficulty)[i % Object.values(Difficulty).length],
      examTag: "Exam2025",
      answers: [
        { text: `الخيار الأول للسؤال ${i + 11}`, isCorrect: i % 4 === 0 },
        { text: `الخيار الثاني للسؤال ${i + 11}`, isCorrect: i % 4 === 1 },
        { text: `الخيار الثالث للسؤال ${i + 11}`, isCorrect: i % 4 === 2 },
        { text: `الخيار الرابع للسؤال ${i + 11}`, isCorrect: i % 4 === 3 },
      ],
    }))

    for (const questionData of additionalQuestions) {
      await prisma.question.create({
        data: {
          text: questionData.text,
          explanation: questionData.explanation,
          category: questionData.category,
          difficulty: questionData.difficulty,
          examTag: questionData.examTag,
          answers: {
            create: questionData.answers,
          },
        },
      })
      createdCount++
    }

    return NextResponse.json({
      message: "Database seeded successfully!",
      questionsCreated: createdCount,
      achievementsCreated: achievements.length,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
