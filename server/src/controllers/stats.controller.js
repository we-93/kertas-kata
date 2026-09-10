import prisma from '../config/prisma.js';

/**
 * GET /api/stats/overview
 * Mengambil ringkasan statistik platform publik secara riil dari database.
 */
export const getPlatformStats = async (req, res, next) => {
  try {
    const [
      publishedArticlesCount,
      totalMembersCount,
      totalEbooksCount,
      featuredArticle,
      topAuthorsRaw,
    ] = await Promise.all([
      prisma.article.count({ where: { status: 'published' } }),
      prisma.user.count({ where: { role: 'participant' } }),
      prisma.ebook.count({ where: { status: 'published' } }),
      // Artikel Spotlight: Utamakan isFeatured, atau artikel published terbaru
      prisma.article.findFirst({
        where: { status: 'published' },
        orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
        include: {
          user: {
            select: { id: true, name: true, originRegion: true, photoUrl: true },
          },
        },
      }),
      // Hall of fame: Penulis teraktif yang memiliki artikel published
      prisma.article.groupBy({
        by: ['userId'],
        where: { status: 'published' },
        _count: { id: true },
        _sum: { viewCount: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
    ]);

    // Ambil detail profil penulis di Hall of Fame
    let hallOfFame = [];
    if (topAuthorsRaw.length > 0) {
      const userIds = topAuthorsRaw.map(a => a.userId);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, originRegion: true, photoUrl: true },
      });
      const userMap = new Map(users.map(u => [u.id, u]));

      hallOfFame = topAuthorsRaw.map((item, idx) => {
        const u = userMap.get(item.userId) || {};
        const initials = (u.name || 'P')
          .split(' ')
          .map(n => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();

        return {
          rank: idx + 1,
          name: u.name || 'Penulis Komunitas',
          region: u.originRegion || 'Kabupaten Tangerang',
          initials,
          photoUrl: u.photoUrl,
          articleCount: item._count.id,
          totalViews: item._sum.viewCount || 0,
        };
      });
    }

    res.status(200).json({
      success: true,
      data: {
        counts: {
          articles: publishedArticlesCount,
          members: totalMembersCount,
          ebooks: totalEbooksCount,
          districts: 28, // 28 Kecamatan Kabupaten Tangerang
        },
        spotlight: featuredArticle,
        hallOfFame,
      },
    });
  } catch (error) {
    next(error);
  }
};
