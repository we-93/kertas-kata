import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

/**
 * Memverifikasi JSON Web Token (JWT) dari request header
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token otentikasi tidak ditemukan.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kertas_kata_jwt_secret');

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        originRegion: true,
        specialization: true,
        photoUrl: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna dengan token ini tidak lagi terdaftar.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda sedang disuspend. Silakan hubungi admin komunitas.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau telah kedaluwarsa. Silakan login kembali.',
    });
  }
};

/**
 * Middleware untuk membatasi akses berdasarkan peran (Role-Based Access Control)
 * @param  {...string} allowedRoles - Contoh: 'admin', 'mentor'
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses terlarang. Anda tidak memiliki izin untuk mengakses fitur ini.',
      });
    }
    next();
  };
};

/**
 * Optional Authentication: Jika ada token, pasang req.user. Jika tidak ada, lanjut tanpa error.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kertas_kata_jwt_secret');
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, role: true, photoUrl: true },
      });
      if (user && user.status !== 'suspended') {
        req.user = user;
      }
    }
    next();
  } catch (err) {
    next();
  }
};
