import prisma from '../config/prisma.js';

/**
 * Mengambil Daftar Sertifikat Milik Anggota
 */
export const getMyCertificates = async (req, res, next) => {
  try {
    const certs = await prisma.certificate.findMany({
      where: { userId: req.user.id },
      orderBy: { issueDate: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: certs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUBLIK: Verifikasi Keaslian Nomor Registrasi Sertifikat
 */
export const verifyCertificate = async (req, res, next) => {
  try {
    const { certNumber } = req.params;

    const cert = await prisma.certificate.findUnique({
      where: { certNumber },
      include: {
        user: { select: { name: true, originRegion: true } },
      },
    });

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Nomor registrasi sertifikat tidak ditemukan atau tidak valid.',
      });
    }

    res.status(200).json({
      success: true,
      message: '✓ Sertifikat resmi terverifikasi dalam database KERTAS KATA Kabupaten Tangerang.',
      data: {
        certNumber: cert.certNumber,
        recipient: cert.user.name,
        region: cert.user.originRegion,
        title: cert.title,
        category: cert.category,
        issueDate: cert.issueDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Terbitkan Sertifikat Baru untuk Anggota (kelola-sertifikat.html)
 */
export const generateCertificate = async (req, res, next) => {
  try {
    const { userId, title, category } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Anggota tidak ditemukan.' });
    }

    const year = new Date().getFullYear();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const certNumber = `KK-TGR/${year}/${randomCode}`;

    const cert = await prisma.certificate.create({
      data: {
        userId,
        certNumber,
        title: title || 'Sertifikat Kelulusan Literasi Menulis Terpadu',
        category: category || 'E-Learning',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Sertifikat resmi berhasil diterbitkan.',
      data: cert,
    });
  } catch (error) {
    next(error);
  }
};
