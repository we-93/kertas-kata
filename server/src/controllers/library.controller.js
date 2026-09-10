import prisma from '../config/prisma.js';

/**
 * Mengambil Daftar E-Book Digital (perpustakaan.html)
 */
export const getEbooks = async (req, res, next) => {
  try {
    const { category, accessType, search } = req.query;

    const where = { status: 'published' };
    if (accessType && accessType !== 'all') {
      where.accessType = accessType;
    }
    if (category && category !== 'Semua') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { authorOrg: { contains: search } },
      ];
    }

    const ebooks = await prisma.ebook.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        purchases: req.user ? { where: { userId: req.user.id } } : false,
      },
    });

    const formatted = ebooks.map(eb => ({
      ...eb,
      isPurchased: eb.purchases?.some(p => p.status === 'approved') || false,
      purchaseStatus: eb.purchases?.[0]?.status || null,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mengambil Detail E-Book & Bab Sampel Pembaca
 */
export const getEbookById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ebook = await prisma.ebook.findUnique({
      where: { id },
      include: {
        purchases: req.user ? { where: { userId: req.user.id } } : false,
      },
    });

    if (!ebook) {
      return res.status(404).json({
        success: false,
        message: 'Buku digital tidak ditemukan.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...ebook,
        isPurchased: ebook.purchases?.some(p => p.status === 'approved') || false,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Beli E-Book Premium (Kirim Bukti Pembayaran / Konfirmasi Manual)
 */
export const buyPremiumEbook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentProofUrl } = req.body;

    const ebook = await prisma.ebook.findUnique({ where: { id } });
    if (!ebook || ebook.accessType !== 'premium') {
      return res.status(400).json({
        success: false,
        message: 'Buku ini gratis atau tidak tersedia untuk dibeli.',
      });
    }

    const purchase = await prisma.ebookPurchase.create({
      data: {
        userId: req.user.id,
        ebookId: ebook.id,
        amount: ebook.price,
        paymentProofUrl: paymentProofUrl || null,
        status: 'pending',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Pengajuan pembelian berhasil dikirim. Admin akan memverifikasi bukti transfer Anda.',
      data: purchase,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Tambah Koleksi E-Book Baru (kelola-perpustakaan.html)
 */
export const createEbook = async (req, res, next) => {
  try {
    const {
      title,
      author,
      authorOrg,
      category,
      isbn,
      accessType = 'free',
      price = 0,
      pages = 100,
      fileFormat = 'PDF',
      fileSize = '10 MB',
      coverUrl,
      filePath,
      downloadUrl,
      whatsappUrl,
      synopsis,
      sampleChapter,
    } = req.body;

    const slug = title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') + '-' + Date.now();

    const ebook = await prisma.ebook.create({
      data: {
        title,
        slug,
        author,
        authorOrg,
        category,
        isbn,
        accessType,
        price: parseFloat(price) || 0,
        pages: parseInt(pages) || 100,
        fileFormat,
        fileSize,
        coverUrl,
        filePath,
        downloadUrl,
        whatsappUrl,
        synopsis,
        sampleChapter,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Koleksi e-book baru berhasil ditambahkan ke perpustakaan.',
      data: ebook,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Perbarui Metadata E-Book
 */
export const updateEbook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await prisma.ebook.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json({
      success: true,
      message: 'E-book berhasil diperbarui.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Hapus E-Book dari Perpustakaan
 */
export const deleteEbook = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.ebook.delete({ where: { id } });
    res.status(200).json({
      success: true,
      message: 'E-book berhasil dihapus.',
    });
  } catch (error) {
    next(error);
  }
};

