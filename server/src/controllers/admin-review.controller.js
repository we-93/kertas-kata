import prisma from '../config/prisma.js';
import { analyzeArticleWithAI } from '../services/ai.service.js';

/**
 * ADMIN: Mengambil Antrean Naskah yang Butuh Kurasi (admin.html)
 */
export const getReviewQueue = async (req, res, next) => {
  try {
    const { status = 'in_review', search } = req.query;

    const where = {};
    if (status === 'all') {
      where.status = { in: ['in_review', 'revision', 'published', 'draft'] };
    } else if (status === 'pending') {
      where.status = 'in_review';
    } else if (status === 'ready') {
      where.status = 'published';
    } else if (status === 'revision') {
      where.status = 'revision';
    } else {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { user: { name: { contains: search } } },
      ];
    }

    const queue = await prisma.article.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            photoUrl: true,
            originRegion: true,
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: queue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Jalankan AI Koreksi Otomatis terhadap Naskah
 */
export const runAICheck = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Naskah tidak ditemukan.',
      });
    }

    // Jalankan analisis AI
    const aiResult = await analyzeArticleWithAI({
      title: article.title,
      content: article.content,
      category: article.category,
    });

    // Perbarui skor plagiasi pada artikel
    await prisma.article.update({
      where: { id },
      data: {
        plagiarismScore: aiResult.plagiarismScore || 0,
      },
    });

    // Simpan riwayat evaluasi AI ke tabel article_reviews
    const reviewRecord = await prisma.articleReview.create({
      data: {
        articleId: article.id,
        reviewerId: req.user.id,
        comment: aiResult.summary || 'Analisis AI otomatis dilakukan.',
        aiAnalysis: JSON.stringify(aiResult),
      },
    });

    res.status(200).json({
      success: true,
      message: 'AI Koreksi berhasil menganalisis naskah secara komprehensif.',
      data: {
        reviewId: reviewRecord.id,
        analysis: aiResult,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Tambahkan Catatan Inline Feedback / Komentar Review
 */
export const addInlineComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { targetText, comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Catatan review tidak boleh kosong.',
      });
    }

    const review = await prisma.articleReview.create({
      data: {
        articleId: id,
        reviewerId: req.user.id,
        targetText: targetText || null,
        comment,
      },
      include: {
        reviewer: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Catatan koreksi editorial berhasil disimpan.',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Ambil Keputusan Kurasi (Approve / Request Revision / Reject)
 */
export const makeReviewDecision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision, notes, isFeatured = false } = req.body;

    if (!['approve', 'revision', 'reject'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: 'Keputusan tidak valid. Pilihan: approve, revision, atau reject.',
      });
    }

    let newStatus = 'published';
    let publishedAt = new Date();

    if (decision === 'revision') {
      newStatus = 'revision';
      publishedAt = null;
    } else if (decision === 'reject') {
      newStatus = 'rejected';
      publishedAt = null;
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt,
        isFeatured: decision === 'approve' ? isFeatured : false,
      },
    });

    // Simpan catatan keputusan di riwayat review
    if (notes) {
      await prisma.articleReview.create({
        data: {
          articleId: id,
          reviewerId: req.user.id,
          comment: `[Keputusan: ${decision.toUpperCase()}] ${notes}`,
          statusDecision: decision,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: `Naskah berhasil ditandai sebagai ${newStatus.toUpperCase()}.`,
      data: updatedArticle,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Statistik Metrik Dashboard Overview (admin.html)
 */
export const getPlatformOverview = async (req, res, next) => {
  try {
    const [
      totalMembers,
      publishedArticles,
      pendingReviews,
      totalEbooks,
      totalPrintOrders,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'participant' } }),
      prisma.article.count({ where: { status: 'published' } }),
      prisma.article.count({ where: { status: 'in_review' } }),
      prisma.ebook.count({ where: { status: 'published' } }),
      prisma.printOrder.count(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        publishedArticles,
        pendingReviews,
        totalEbooks,
        totalPrintOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
