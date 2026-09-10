import prisma from '../config/prisma.js';

// Helper slug generator
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
    .slice(0, 80) + '-' + Math.floor(1000 + Math.random() * 9000);
};

/**
 * Buat Draf Baru atau Simpan Tulisan (Writing Studio)
 */
export const saveDraft = async (req, res, next) => {
  try {
    const { id, title, lead, content, category, coverUrl, tags = [] } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Judul tulisan wajib diisi.',
      });
    }

    const words = (content || '').replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    let article;

    if (id) {
      // Update tulisan yang sudah ada
      const existing = await prisma.article.findUnique({ where: { id } });
      if (!existing || existing.userId !== req.user.id) {
        return res.status(404).json({
          success: false,
          message: 'Draf tidak ditemukan atau Anda tidak memiliki hak akses.',
        });
      }

      article = await prisma.article.update({
        where: { id },
        data: {
          title,
          lead,
          content: content || '',
          category: category || 'Opini Pendidikan',
          coverUrl: coverUrl || existing.coverUrl,
          wordCount,
          status: existing.status === 'revision' ? 'revision' : 'draft',
        },
      });
    } else {
      // Buat naskah baru
      const slug = createSlug(title);
      article = await prisma.article.create({
        data: {
          userId: req.user.id,
          title,
          slug,
          lead,
          content: content || '',
          category: category || 'Opini Pendidikan',
          coverUrl: coverUrl || null,
          wordCount,
          status: 'draft',
        },
      });
    }

    // Tangani tags jika ada
    if (Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        const cleanTag = tagName.trim().toLowerCase();
        if (!cleanTag) continue;

        let tag = await prisma.tag.findUnique({ where: { name: cleanTag } });
        if (!tag) {
          tag = await prisma.tag.create({ data: { name: cleanTag } });
        }

        await prisma.articleTag.upsert({
          where: {
            articleId_tagId: { articleId: article.id, tagId: tag.id },
          },
          update: {},
          create: { articleId: article.id, tagId: tag.id },
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Draf tulisan berhasil disimpan otomatis.',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit Naskah ke Antrean Kurasi Admin / Mentor
 */
export const submitForReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article || article.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Naskah tidak ditemukan.',
      });
    }

    const minWords = process.env.NODE_ENV === 'production' ? 100 : 5;
    if (article.wordCount < minWords) {
      return res.status(400).json({
        success: false,
        message: `Naskah minimal harus memiliki ${minWords} kata sebelum dapat diajukan ke kurasi (saat ini: ${article.wordCount} kata).`,
      });
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        status: 'in_review',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Naskah berhasil dikirim ke antrean kurasi editor dan mentor.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mengambil Semua Tulisan Penulis yang Sedang Login (Publikasi Saya)
 */
export const getMyArticles = async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = { userId: req.user.id };
    if (status && status !== 'all') {
      where.status = status;
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        tags: {
          include: { tag: true },
        },
      },
    });

    // Hitung ringkasan status
    const counts = await prisma.article.groupBy({
      by: ['status'],
      where: { userId: req.user.id },
      _count: { status: true },
    });

    const statusMap = {
      all: articles.length,
      published: 0,
      in_review: 0,
      revision: 0,
      draft: 0,
    };
    counts.forEach(c => {
      if (statusMap[c.status] !== undefined) {
        statusMap[c.status] = c._count.status;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        counts: statusMap,
        articles,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mengambil Tulisan Tertentu untuk Diedit di Writing Studio
 */
export const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        reviews: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!article || article.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: 'Naskah tidak ditemukan.',
      });
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUBLIK: Mengambil Tulisan yang Sudah Terbit (Landing Page & Jelajah)
 */
export const getPublicArticles = async (req, res, next) => {
  try {
    const { search, category, region, page = 1, limit = 12 } = req.query;

    const where = { status: 'published' };
    if (category && category !== 'Semua') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { lead: { contains: search } },
      ];
    }
    if (region) {
      where.user = { originRegion: { contains: region } };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        skip,
        take,
        orderBy: { publishedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              photoUrl: true,
              originRegion: true,
            },
          },
          tags: {
            include: { tag: true },
          },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / take),
        articles,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUBLIK: Baca Detail Artikel Lengkap (baca-artikel.html)
 */
export const getArticleBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
            bio: true,
            originRegion: true,
            specialization: true,
          },
        },
        tags: { include: { tag: true } },
      },
    });

    if (!article || article.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Artikel belum terbit atau tidak ditemukan.',
      });
    }

    // Tambah jumlah view counter secara asinkron
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });

    // Ambil artikel terkait dengan kategori sama
    const related = await prisma.article.findMany({
      where: {
        category: article.category,
        status: 'published',
        NOT: { id: article.id },
      },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        coverUrl: true,
        category: true,
        publishedAt: true,
        user: { select: { name: true, originRegion: true } },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        ...article,
        viewCount: article.viewCount + 1,
        relatedArticles: related,
      },
    });
  } catch (error) {
    next(error);
  }
};
