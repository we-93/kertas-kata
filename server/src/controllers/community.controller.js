import prisma from '../config/prisma.js';

/**
 * Mengambil Thread Komunitas (komunitas.html)
 */
export const getThreads = async (req, res, next) => {
  try {
    const { category, type, search } = req.query;

    const where = {};

    if (type === 'public') {
      where.isPrivate = false;
    } else if (type === 'private') {
      where.isPrivate = true;
      if (req.user) {
        // Admin bisa lihat semua private thread untuk moderasi, peserta hanya thread miliknya atau yang diundang
        if (req.user.role !== 'admin') {
          where.OR = [
            { userId: req.user.id },
            { invites: { some: { invitedUserId: req.user.id } } },
          ];
        }
      } else {
        return res.status(200).json({ success: true, data: [] });
      }
    } else {
      // Default gabungan
      if (req.user && req.user.role === 'admin') {
        // Admin lihat semua
      } else if (req.user) {
        where.OR = [
          { isPrivate: false },
          { isPrivate: true, userId: req.user.id },
          { isPrivate: true, invites: { some: { invitedUserId: req.user.id } } },
        ];
      } else {
        where.isPrivate = false;
      }
    }

    if (category && category !== 'Semua') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        ...(where.OR || []),
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const threads = await prisma.forumThread.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      include: {
        user: {
          select: { id: true, name: true, photoUrl: true, originRegion: true, role: true },
        },
        _count: {
          select: { replies: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: threads,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mengambil Detail Thread Diskusi beserta Balasan
 */
export const getThreadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const thread = await prisma.forumThread.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, photoUrl: true, originRegion: true, role: true },
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, name: true, photoUrl: true, originRegion: true, role: true },
            },
          },
        },
        invites: true,
      },
    });

    if (!thread) {
      return res.status(404).json({ success: false, message: 'Diskusi tidak ditemukan.' });
    }

    // Proteksi private thread
    if (thread.isPrivate) {
      if (!req.user) {
        return res.status(403).json({ success: false, message: 'Ruang diskusi private ini memerlukan login.' });
      }
      const isOwner = thread.userId === req.user.id;
      const isInvited = thread.invites.some(inv => inv.invitedUserId === req.user.id);
      const isAdmin = req.user.role === 'admin';
      if (!isOwner && !isInvited && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Anda belum diundang ke ruang diskusi private ini.' });
      }
    }

    // Increment views
    await prisma.forumThread.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    res.status(200).json({
      success: true,
      data: { ...thread, viewCount: thread.viewCount + 1 },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Buat Thread Diskusi Baru (Publik / Private)
 */
export const createThread = async (req, res, next) => {
  try {
    const { title, content, category, isPrivate = false, invitedUserIds = [] } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Judul dan isi topik diskusi wajib diisi.' });
    }

    const thread = await prisma.forumThread.create({
      data: {
        userId: req.user.id,
        title,
        content,
        category: category || 'Diskusi Menulis',
        isPrivate: Boolean(isPrivate),
        ...(Boolean(isPrivate) && Array.isArray(invitedUserIds) && {
          invites: {
            create: invitedUserIds.map(uid => ({ invitedUserId: uid })),
          },
        }),
      },
      include: {
        user: { select: { id: true, name: true, photoUrl: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Topik diskusi baru berhasil diterbitkan.',
      data: thread,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Balas Thread Diskusi
 */
export const replyThread = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Isi balasan tidak boleh kosong.' });
    }

    const reply = await prisma.forumReply.create({
      data: {
        threadId: id,
        userId: req.user.id,
        content,
      },
      include: {
        user: { select: { id: true, name: true, photoUrl: true, originRegion: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Tanggapan berhasil dikirim.',
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};
