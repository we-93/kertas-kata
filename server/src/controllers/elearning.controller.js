import prisma from '../config/prisma.js';

/**
 * Mengambil Daftar Modul E-Learning & Status Progres Pengguna (elearning.html)
 */
export const getModules = async (req, res, next) => {
  try {
    const modules = await prisma.module.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: { lessons: true, quizzes: true },
        },
        progress: req.user ? { where: { userId: req.user.id } } : false,
      },
    });

    const formatted = modules.map(m => {
      const userProgress = m.progress?.[0] || null;
      return {
        id: m.id,
        title: m.title,
        slug: m.slug,
        description: m.description,
        orderIndex: m.orderIndex,
        videoUrl: m.videoUrl,
        duration: m.duration,
        passingScore: m.passingScore,
        lessonsCount: m._count.lessons,
        quizzesCount: m._count.quizzes,
        isCompleted: userProgress?.isCompleted || false,
        quizScore: userProgress?.quizScore ?? null,
      };
    });

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mengambil Detail Kelas Modul (Materi & Kuis) untuk elearning-classroom.html
 */
export const getModuleClassroom = async (req, res, next) => {
  try {
    const { id } = req.params;

    const moduleData = await prisma.module.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        lessons: { orderBy: { orderIndex: 'asc' } },
        quizzes: true,
        progress: req.user ? { where: { userId: req.user.id } } : false,
      },
    });

    if (!moduleData) {
      return res.status(404).json({
        success: false,
        message: 'Modul pembelajaran tidak ditemukan.',
      });
    }

    // Parse optionsJson kuis untuk client
    const quizzesFormatted = moduleData.quizzes.map(q => ({
      id: q.id,
      question: q.question,
      options: JSON.parse(q.optionsJson || '[]'),
      // Jangan kirim kunci jawaban ke peserta sebelum mereka submit!
      explanation: moduleData.progress?.[0]?.isCompleted ? q.explanation : null,
    }));

    res.status(200).json({
      success: true,
      data: {
        id: moduleData.id,
        title: moduleData.title,
        slug: moduleData.slug,
        description: moduleData.description,
        orderIndex: moduleData.orderIndex,
        videoUrl: moduleData.videoUrl,
        duration: moduleData.duration,
        passingScore: moduleData.passingScore,
        lessons: moduleData.lessons,
        quizzes: quizzesFormatted,
        userProgress: moduleData.progress?.[0] || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit Jawaban Kuis & Evaluasi Kelulusan Modul
 */
export const submitQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers = {} } = req.body; // Format: { "quiz-id-1": "A", "quiz-id-2": "B" }

    const moduleData = await prisma.module.findUnique({
      where: { id },
      include: { quizzes: true },
    });

    if (!moduleData) {
      return res.status(404).json({
        success: false,
        message: 'Modul tidak ditemukan.',
      });
    }

    const quizzes = moduleData.quizzes;
    if (quizzes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Modul ini tidak memiliki kuis.',
      });
    }

    let correctCount = 0;
    const feedback = [];

    quizzes.forEach(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer && userAnswer.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase();
      if (isCorrect) correctCount++;
      feedback.push({
        quizId: q.id,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const finalScore = Math.round((correctCount / quizzes.length) * 100);
    const isPassed = finalScore >= moduleData.passingScore;

    // Simpan atau update UserProgress
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_moduleId: {
          userId: req.user.id,
          moduleId: moduleData.id,
        },
      },
      update: {
        quizScore: finalScore,
        isCompleted: isPassed,
        ...(isPassed && { completedAt: new Date() }),
      },
      create: {
        userId: req.user.id,
        moduleId: moduleData.id,
        quizScore: finalScore,
        isCompleted: isPassed,
        ...(isPassed && { completedAt: new Date() }),
      },
    });

    res.status(200).json({
      success: true,
      message: isPassed
        ? `🎉 Selamat! Anda LULUS kuis modul ini dengan nilai ${finalScore}/100!`
        : `Nilai Anda ${finalScore}/100. Batas kelulusan adalah ${moduleData.passingScore}. Silakan coba lagi!`,
      data: {
        score: finalScore,
        passingScore: moduleData.passingScore,
        isPassed,
        feedback,
        progress,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Buat Modul Pembelajaran Baru (kelola-elearning.html)
 */
export const createModule = async (req, res, next) => {
  try {
    const { title, description, orderIndex = 1, videoUrl, duration, passingScore = 80 } = req.body;
    const slug = title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') + '-' + Date.now();

    const created = await prisma.module.create({
      data: {
        title,
        slug,
        description,
        orderIndex: parseInt(orderIndex),
        videoUrl,
        duration,
        passingScore: parseInt(passingScore),
      },
    });

    res.status(201).json({
      success: true,
      message: 'Modul pembelajaran baru berhasil ditambahkan.',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};
