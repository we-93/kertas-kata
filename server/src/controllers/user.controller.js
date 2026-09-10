import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

/**
 * Update Profil Pengguna Sendiri
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, originRegion, specialization, photoUrl } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(originRegion && { originRegion }),
        ...(specialization && { specialization }),
        ...(photoUrl && { photoUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        originRegion: true,
        specialization: true,
        photoUrl: true,
        role: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Profil Anda berhasil diperbarui.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ganti Kata Sandi
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Kata sandi baru minimal harus 6 karakter.',
      });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (user.password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Kata sandi lama Anda tidak sesuai.',
        });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: 'Kata sandi Anda berhasil diubah.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Mengambil Semua Anggota dengan Filter & Pencarian
 */
export const getAllMembers = async (req, res, next) => {
  try {
    const { search, region, role, status, page = 1, limit = 20 } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (region) where.originRegion = { contains: region };
    if (role) where.role = role;
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [total, members] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              articles: true,
              progress: { where: { isCompleted: true } },
            },
          },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / take),
        members,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Ubah Status atau Role Anggota
 */
export const updateMemberStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(status && { status }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Status anggota berhasil diperbarui.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
