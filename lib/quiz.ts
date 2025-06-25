import { prisma } from "./prisma"
import { type Category, type Difficulty, QuizMode, ReviewDifficulty } from "@prisma/client"

export async function getRandomQuestions(
  count = 60,
  options: {
    examTag?: string
    category?: Category
    difficulty?: Difficulty
    userId?: string
    mode?: QuizMode
  } = {},
) {
  const { examTag, category, difficulty, userId, mode } = options

  const whereClause: any = { isActive: true }

  if (examTag) whereClause.examTag = examTag
  if (category) whereClause.category = category
  if (difficulty) whereClause.difficulty = difficulty

  // For review mode, get questions that need review
  if (mode === QuizMode.REVIEW && userId) {
    const questionsToReview = await prisma.userProgress.findMany({
      where: {
        userId,
        nextReview: {
          lte: new Date(),
        },
      },
      include: {
        question: {
          include: {
            answers: true,
          },
        },
      },
      take: count,
    })

    return questionsToReview.map((p) => p.question)
  }

  const questions = await prisma.question.findMany({
    where: whereClause,
    include: {
      answers: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Shuffle and take the requested count
  const shuffled = questions.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export async function saveQuizSubmission(
  answers: Array<{ questionId: string; selectedAnswerIds: string[]; timeSpent?: number }>,
  options: {
    examTag?: string
    category?: Category
    difficulty?: Difficulty
    mode?: QuizMode
    userId?: string
    timeSpent?: number
  } = {},
) {
  const { examTag, category, difficulty, mode = QuizMode.PRACTICE, userId, timeSpent } = options

  // Calculate score
  let correctAnswers = 0
  const processedAnswers = []

  for (const answer of answers) {
    const question = await prisma.question.findUnique({
      where: { id: answer.questionId },
      include: { answers: true },
    })

    if (question) {
      const correctAnswerIds = question.answers.filter((a) => a.isCorrect).map((a) => a.id)
      const selectedIds = answer.selectedAnswerIds

      // Check if all correct answers are selected and no wrong answers
      const hasAllCorrect = correctAnswerIds.every((id) => selectedIds.includes(id))
      const hasNoWrong = selectedIds.every((id) => correctAnswerIds.includes(id))
      const isCorrect = hasAllCorrect && hasNoWrong

      if (isCorrect) {
        correctAnswers++
      }

      processedAnswers.push({
        questionId: answer.questionId,
        selectedAnswerIds: answer.selectedAnswerIds,
        isCorrect,
        timeSpent: answer.timeSpent,
      })

      // Update user progress for spaced repetition
      if (userId) {
        await updateUserProgress(userId, answer.questionId, isCorrect)
      }
    }
  }

  // Save submission
  const submission = await prisma.userSubmission.create({
    data: {
      userId,
      score: correctAnswers,
      totalQuestions: answers.length,
      examTag,
      category,
      difficulty,
      mode,
      timeSpent,
      isCompleted: true,
      answers: {
        create: processedAnswers,
      },
    },
    include: {
      answers: {
        include: {
          question: {
            include: {
              answers: true,
            },
          },
        },
      },
    },
  })

  // Check for achievements
  if (userId) {
    await checkAndUnlockAchievements(userId)
  }

  return submission
}

async function updateUserProgress(userId: string, questionId: string, isCorrect: boolean) {
  const existing = await prisma.userProgress.findUnique({
    where: {
      userId_questionId: {
        userId,
        questionId,
      },
    },
  })

  const now = new Date()
  let nextReview: Date | null = null
  let difficulty = ReviewDifficulty.NORMAL

  if (isCorrect) {
    // Spaced repetition algorithm
    const correctCount = (existing?.correctCount || 0) + 1
    if (correctCount === 1) {
      nextReview = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000) // 1 day
    } else if (correctCount === 2) {
      nextReview = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days
    } else {
      nextReview = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 1 week
    }
    difficulty = ReviewDifficulty.EASY
  } else {
    // Review again tomorrow if incorrect
    nextReview = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)
    difficulty = ReviewDifficulty.HARD
  }

  await prisma.userProgress.upsert({
    where: {
      userId_questionId: {
        userId,
        questionId,
      },
    },
    update: {
      correctCount: isCorrect ? { increment: 1 } : undefined,
      incorrectCount: !isCorrect ? { increment: 1 } : undefined,
      lastAttempt: now,
      nextReview,
      difficulty,
    },
    create: {
      userId,
      questionId,
      correctCount: isCorrect ? 1 : 0,
      incorrectCount: isCorrect ? 0 : 1,
      lastAttempt: now,
      nextReview,
      difficulty,
    },
  })
}

async function checkAndUnlockAchievements(userId: string) {
  // Get user stats
  const totalSubmissions = await prisma.userSubmission.count({
    where: { userId },
  })

  const totalCorrectAnswers = await prisma.userAnswer.count({
    where: {
      submission: { userId },
      isCorrect: true,
    },
  })

  // Check various achievement conditions
  const achievementChecks = [
    { condition: totalSubmissions >= 1, achievementName: "first_quiz" },
    { condition: totalSubmissions >= 10, achievementName: "quiz_veteran" },
    { condition: totalCorrectAnswers >= 100, achievementName: "hundred_correct" },
    { condition: totalCorrectAnswers >= 500, achievementName: "five_hundred_correct" },
  ]

  for (const check of achievementChecks) {
    if (check.condition) {
      const achievement = await prisma.achievement.findUnique({
        where: { name: check.achievementName },
      })

      if (achievement) {
        await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId,
              achievementId: achievement.id,
            },
          },
          update: {},
          create: {
            userId,
            achievementId: achievement.id,
          },
        })
      }
    }
  }
}

export async function getSubmissionById(id: string) {
  return await prisma.userSubmission.findUnique({
    where: { id },
    include: {
      answers: {
        include: {
          question: {
            include: {
              answers: true,
            },
          },
        },
      },
    },
  })
}

export async function getAllSubmissions(userId?: string) {
  return await prisma.userSubmission.findMany({
    where: userId ? { userId } : {},
    orderBy: { createdAt: "desc" },
    take: 10,
  })
}

export async function getUserStats(userId: string) {
  const totalSubmissions = await prisma.userSubmission.count({
    where: { userId },
  })

  const totalQuestions = await prisma.userAnswer.count({
    where: { submission: { userId } },
  })

  const correctAnswers = await prisma.userAnswer.count({
    where: {
      submission: { userId },
      isCorrect: true,
    },
  })

  const averageScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  // Category performance
  const categoryStats = await prisma.userSubmission.groupBy({
    by: ["category"],
    where: { userId, category: { not: null } },
    _avg: { score: true },
    _count: { id: true },
  })

  return {
    totalSubmissions,
    totalQuestions,
    correctAnswers,
    averageScore,
    categoryStats,
  }
}

export async function getBookmarkedQuestions(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      question: {
        include: {
          answers: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return bookmarks.map((b) => b.question)
}

export async function toggleBookmark(userId: string, questionId: string) {
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_questionId: {
        userId,
        questionId,
      },
    },
  })

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id },
    })
    return false
  } else {
    await prisma.bookmark.create({
      data: {
        userId,
        questionId,
      },
    })
    return true
  }
}

export async function getDailyChallenge(userId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let challenge = await prisma.dailyChallenge.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  })

  if (!challenge) {
    // Create new daily challenge
    challenge = await prisma.dailyChallenge.create({
      data: {
        userId,
        date: today,
      },
    })
  }

  return challenge
}

export async function getQuestionsToReview(userId: string, limit = 20) {
  const questionsToReview = await prisma.userProgress.findMany({
    where: {
      userId,
      nextReview: {
        lte: new Date(),
      },
    },
    include: {
      question: {
        include: {
          answers: true,
        },
      },
    },
    orderBy: {
      nextReview: "asc",
    },
    take: limit,
  })

  return questionsToReview.map((p) => p.question)
}
