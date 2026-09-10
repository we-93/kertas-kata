import prisma from '../config/prisma.js';

/**
 * Kalkulator Biaya Cetak Naskah
 */
export const calculatePrintCost = (req, res) => {
  const { copies = 50, pages = 100, paperType = 'Bookpaper 72gsm', coverFinishing = 'Doff Lamination' } = req.body;

  const basePageCost = paperType.includes('HVS') ? 120 : 150; // per halaman
  const coverCost = coverFinishing.includes('Spot UV') ? 12000 : 9000; // per eksemplar
  const bindingCost = 5000; // jilid lem panas

  const costPerBook = (parseInt(pages) * basePageCost) + coverCost + bindingCost;
  const totalCost = costPerBook * parseInt(copies);

  res.status(200).json({
    success: true,
    data: {
      copies: parseInt(copies),
      pages: parseInt(pages),
      costPerBook,
      totalCost,
      estimatedDays: parseInt(copies) > 100 ? '7-10 Hari Kerja' : '3-5 Hari Kerja',
    },
  });
};

/**
 * Mengajukan Cetak Mandiri / Submit Bunga Rampai (cetak-naskah.html)
 */
export const submitPrintOrder = async (req, res, next) => {
  try {
    const {
      type = 'mandiri',
      programTitle,
      bookTitle,
      authorName,
      bookSize = 'A5',
      paperType = 'Bookpaper 72gsm',
      coverFinishing = 'Doff Lamination',
      copies = 50,
      totalPages = 100,
      estimatedPrice = 0,
      manuscriptFileUrl,
      coverFileUrl,
      shippingAddress,
    } = req.body;

    if (!bookTitle) {
      return res.status(400).json({ success: false, message: 'Judul buku wajib diisi.' });
    }

    const order = await prisma.printOrder.create({
      data: {
        userId: req.user.id,
        type,
        programTitle,
        bookTitle,
        authorName: authorName || req.user.name,
        bookSize,
        paperType,
        coverFinishing,
        copies: parseInt(copies),
        totalPages: parseInt(totalPages),
        estimatedPrice: parseFloat(estimatedPrice),
        manuscriptFileUrl,
        coverFileUrl,
        shippingAddress,
        status: 'submitted',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Pengajuan pesanan cetak naskah berhasil dikirim. Tim KERTAS KATA akan menghubungi Anda untuk konfirmasi proof naskah.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mengambil Riwayat Pesanan Cetak Anggota
 */
export const getMyPrintOrders = async (req, res, next) => {
  try {
    const orders = await prisma.printOrder.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Mengambil Seluruh Antrean Cetak & Bunga Rampai (kelola-cetak.html)
 */
export const getAllPrintOrders = async (req, res, next) => {
  try {
    const orders = await prisma.printOrder.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, originRegion: true } },
      },
    });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ADMIN: Perbarui Status Produksi / Kirim Resi
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, courier } = req.body;

    const updated = await prisma.printOrder.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(trackingNumber && { trackingNumber }),
        ...(courier && { courier }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Status pesanan cetak berhasil diperbarui.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
