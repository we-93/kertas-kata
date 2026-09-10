import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../config/prisma.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'kertas_kata_jwt_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Login / Registrasi Otomatis via Google OAuth 2.0
 */
export const googleAuth = async (req, res, next) => {
  try {
    const { idToken, mockData } = req.body;

    let email, name, photoUrl, googleId;

    // Support pengujian mode mock jika Google Client ID belum diset
    if (mockData) {
      email = mockData.email;
      name = mockData.name || 'Anggota Literasi';
      photoUrl = mockData.photoUrl || null;
      googleId = mockData.googleId || `google-mock-${Date.now()}`;
    } else if (idToken) {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      photoUrl = payload.picture;
      googleId = payload.sub;
    } else {
      return res.status(400).json({
        success: false,
        message: 'idToken Google atau data akun diperlukan.',
      });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId,
          photoUrl,
          role: 'participant',
          originRegion: req.body.originRegion || 'Kabupaten Tangerang',
          specialization: req.body.specialization || 'Literasi Umum',
          status: 'active',
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, photoUrl: user.photoUrl || photoUrl },
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda sedang dinonaktifkan oleh administrator.',
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login Google berhasil!',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          photoUrl: user.photoUrl,
          originRegion: user.originRegion,
          specialization: user.specialization,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login Kredensial Email & Password (Admin / Mentor / Akun Manual)
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan kata sandi wajib diisi.',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Kredensial login salah atau akun terdaftar melalui Google OAuth.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau kata sandi tidak cocok.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Akun Anda sedang disuspend oleh administrator.',
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          photoUrl: user.photoUrl,
          originRegion: user.originRegion,
          specialization: user.specialization,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Registrasi Manual Peserta Baru
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, originRegion, specialization } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan kata sandi wajib diisi.',
      });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email ini sudah terdaftar. Silakan login langsung.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        originRegion: originRegion || 'Kabupaten Tangerang',
        specialization: specialization || 'Literasi Umum',
        role: 'participant',
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Pendaftaran anggota baru berhasil!',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          originRegion: user.originRegion,
          specialization: user.specialization,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mengambil Profil Pengguna Saat Ini berdasarkan JWT
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        badges: {
          include: { badge: true },
        },
        _count: {
          select: {
            articles: true,
            progress: { where: { isCompleted: true } },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
