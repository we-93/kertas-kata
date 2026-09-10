import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`🌱 Memulai proses seeding database KERTAS KATA [Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}]...`);

  const adminPass = process.env.ADMIN_SEED_PASSWORD || 'AdminPassword2026!';
  const adminPasswordHash = await bcrypt.hash(adminPass, 10);

  // 1. Master Badges (Diperlukan di Production & Development)
  const defaultBadges = [
    {
      title: 'Penulis Pemula Aktif',
      description: 'Diberikan setelah menerbitkan karya artikel pertama yang lolos kurasi.',
      icon: '✍️',
      criteria: '1_article_published',
    },
    {
      title: 'Pembelajar Tangguh',
      description: 'Menyelesaikan modul e-learning pertama dengan nilai kuis di atas 80.',
      icon: '🎓',
      criteria: '1_module_completed',
    },
    {
      title: 'Pegiat Komunitas Aktif',
      description: 'Aktif berdiskusi dan berbagi wawasan bermakna di forum literasi.',
      icon: '💬',
      criteria: 'community_contributor',
    },
  ];

  for (const b of defaultBadges) {
    const existing = await prisma.badge.findFirst({ where: { criteria: b.criteria } });
    if (!existing) {
      await prisma.badge.create({ data: b });
    }
  }
  console.log('✅ Master Badges / Lencana Gamifikasi siap.');

  // 2. Akun Super Admin Utama (Diperlukan di Production & Development)
  const adminEmail = 'admin@kertaskata.my.id';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  let adminUser;
  if (!existingAdmin) {
    adminUser = await prisma.user.create({
      data: {
        name: 'Administrator Kurasi KERTAS KATA',
        email: adminEmail,
        password: adminPasswordHash,
        role: 'admin',
        originRegion: 'Kabupaten Tangerang',
        specialization: 'Kurasi Editorial & Manajemen Platform',
        bio: 'Kepala Tim Kurasi dan Administrator Utama Platform KERTAS KATA Kabupaten Tangerang.',
      },
    });
    console.log(`✅ Super Admin berhasil dibuat: ${adminEmail} (Password: ${adminPass})`);
  } else {
    adminUser = existingAdmin;
    console.log(`ℹ️ Super Admin sudah ada: ${adminEmail}`);
  }

  // =========================================================================
  // JIKA PRODUCTION: HENTIKAN DI SINI (BERSIH DARI DATA DUMMY / MOCK DATA)
  // =========================================================================
  if (isProduction) {
    console.log('------------------------------------------------------------');
    console.log('🚀 SEEDING PRODUCTION SELESAI:');
    console.log('   - Database BERSIH dari akun dummy, artikel palsu, & ebook dummy.');
    console.log('   - Super Admin aktif & master badge siap digunakan.');
    console.log('------------------------------------------------------------');
    return;
  }

  // =========================================================================
  // JIKA DEVELOPMENT (LOKAL): GENERATE MOCK DATA LENGKAP UNTUK UJI COBA
  // =========================================================================
  console.log('🧪 Mempersiapkan data dummy untuk lingkungan lokal (development)...');

  // Bersihkan data dummy lama (hanya di lokal)
  await prisma.articleReview.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.module.deleteMany();
  await prisma.ebookPurchase.deleteMany();
  await prisma.ebook.deleteMany();
  await prisma.forumReply.deleteMany();
  await prisma.forumInvite.deleteMany();
  await prisma.forumThread.deleteMany();
  await prisma.printOrder.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.user.deleteMany({ where: { email: { not: adminEmail } } });

  const mentorPassword = await bcrypt.hash('MentorPassword2026!', 10);
  const memberPassword = await bcrypt.hash('MemberPassword2026!', 10);

  const mentor = await prisma.user.create({
    data: {
      name: 'Mentor Dian Prasetyo',
      email: 'mentor.dian@kertaskata.my.id',
      password: mentorPassword,
      role: 'mentor',
      originRegion: 'Kecamatan Curug',
      specialization: 'Artikel Ilmiah Populer & Riset Sosial',
      bio: 'Mentor penulisan esai kritis dan riset literasi lokal.',
    },
  });

  const member = await prisma.user.create({
    data: {
      name: 'Rahmat Hidayat',
      email: 'rahmat.hidayat@gmail.com',
      password: memberPassword,
      role: 'participant',
      originRegion: 'Kecamatan Tigaraksa',
      specialization: 'Inovasi Pembelajaran (Best Practice)',
      bio: 'Pendidik dan penggerak literasi di lingkungan Kabupaten Tangerang.',
    },
  });

  const firstBadge = await prisma.badge.findFirst({ where: { criteria: '1_article_published' } });
  if (firstBadge) {
    await prisma.userBadge.create({
      data: {
        userId: member.id,
        badgeId: firstBadge.id,
      },
    });
  }

  // Modul E-Learning Contoh
  const mod1 = await prisma.module.create({
    data: {
      title: 'Fondasi Menulis Kritis: Menemukan Ide & Merumuskan Masalah',
      slug: 'fondasi-menulis-kritis-menemukan-ide',
      description: 'Panduan langkah demi langkah menggali fenomena sosial di Kabupaten Tangerang menjadi gagasan tulisan yang berbobot.',
      orderIndex: 1,
      duration: '45 Menit',
      passingScore: 80,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      lessons: {
        create: [
          {
            title: 'Mengenal Ragam Tulisan Publik: Dari Opini Hingga Best Practice',
            orderIndex: 1,
            type: 'text',
            textBody: `
              <h3>Mengapa Menulis Kritis Itu Penting?</h3>
              <p>Menulis bukan sekadar merangkai kata-kata indah, melainkan proses mengurai fenomena, menyaring fakta, dan menyajikan solusi alternatif yang bernas bagi masyarakat pembaca.</p>
              <p>Di Kabupaten Tangerang dengan dinamika wilayah yang luas—mulai dari pesisir Teluknaga hingga kawasan industri Cikupa—banyak cerita dan inovasi lokal yang membutuhkan pena para penulis lokal agar terartikulasi secara luas.</p>
            `,
          },
          {
            title: 'Teknik Observasi Lapangan & Dokumentasi Fakta Empiris',
            orderIndex: 2,
            type: 'text',
            textBody: `
              <h3>Mengumpulkan Bukti dan Data Pendukung</h3>
              <p>Tulisan yang kuat selalu ditopang oleh data yang valid. Jangan hanya mengandalkan asumsi pribadi; sertakan data statistik kecamatan, wawancara warga, atau dokumentasi visual kegiatan.</p>
            `,
          },
        ],
      },
      quizzes: {
        create: [
          {
            question: 'Apa langkah pertama yang paling tepat dalam merumuskan topik tulisan opini publik?',
            optionsJson: JSON.stringify([
              'A. Langsung menulis kesimpulan tanpa outline',
              'B. Mengidentifikasi masalah nyata yang terjadi di lingkungan sekitar',
              'C. Menyalin artikel orang lain yang sedang viral',
              'D. Menggunakan kata-kata asing yang rumit agar terlihat cerdas',
            ]),
            correctAnswer: 'B',
            explanation: 'Topik tulisan opini yang berbobot selalu berakar dari identifikasi masalah faktual yang relevan dengan kebutuhan publik.',
          },
        ],
      },
    },
  });

  await prisma.userProgress.create({
    data: {
      userId: member.id,
      moduleId: mod1.id,
      isCompleted: true,
      quizScore: 100,
      completedAt: new Date(),
    },
  });

  // Artikel Sampel
  const art1 = await prisma.article.create({
    data: {
      userId: member.id,
      title: 'Strategi Diferensiasi Pembelajaran Digital Berbasis Portofolio Karya di Kabupaten Tangerang',
      slug: 'strategi-diferensiasi-pembelajaran-digital-tangerang',
      lead: 'Menelaah implementasi kurikulum mandiri dengan memadukan platform literasi digital dan portofolio karya kreatif.',
      content: `
        <p>Tantangan pendidikan di era disrupsi digital menuntut pendekatan yang tidak seragam. Setiap siswa memiliki ritme dan modalitas belajar yang berbeda. Melalui strategi diferensiasi, pendidik di Kabupaten Tangerang berupaya menghadirkan ruang belajar yang responsif terhadap keunikan setiap individu.</p>
        <p>Di ruang kelas kami di Tigaraksa, penerapan portofolio tulisan digital telah mengubah dinamika pembelajaran. Siswa tidak lagi sekadar menjadi konsumen informasi, melainkan produsen karya yang bangga atas tulisan mereka sendiri.</p>
      `,
      category: 'Inovasi Pembelajaran (Best Practice)',
      coverUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
      status: 'published',
      wordCount: 380,
      plagiarismScore: 8,
      viewCount: 420,
      isFeatured: true,
      publishedAt: new Date(),
    },
  });

  const art2 = await prisma.article.create({
    data: {
      userId: member.id,
      title: 'Kajian Historis Komunitas Tionghoa Benteng di Sepanjang Aliran Sungai Cisadane',
      slug: 'kajian-historis-komunitas-tionghoa-benteng-cisadane',
      lead: 'Menelusuri jejak akulturasi budaya, denyut perdagangan, dan warisan kuliner khas di tepian sungai bersejarah Tangerang.',
      content: `
        <p>Sungai Cisadane bukan sekadar urat nadi geografis bagi Kabupaten Tangerang, melainkan saksi bisu jalinan peradaban dan akulturasi multikultural selama berabad-abad. Sejak abad ke-15, gelombang kedatangan etnis Tionghoa telah berbaur harmonis dengan masyarakat lokal Sunda dan Banten.</p>
      `,
      category: 'Artikel Ilmiah Sejarah',
      coverUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80',
      status: 'in_review',
      wordCount: 520,
      plagiarismScore: 12,
      viewCount: 0,
      publishedAt: null,
    },
  });

  await prisma.articleReview.create({
    data: {
      articleId: art2.id,
      reviewerId: mentor.id,
      targetText: 'Sungai Cisadane bukan sekadar urat nadi geografis',
      comment: 'Paragraf pembuka sangat menggugah dan deskriptif. Tambahkan rujukan arsip kolonial untuk memperkuat data historis.',
    },
  });

  // E-Book Sampel
  await prisma.ebook.create({
    data: {
      title: 'Antologi Praktik Baik Literasi Komunitas Kabupaten Tangerang 2026',
      slug: 'antologi-praktik-baik-literasi-tangerang-2026',
      author: 'Tim Kurasi Komunitas KERTAS KATA',
      authorOrg: 'Komunitas Literasi Tigaraksa',
      category: 'Pendidikan & Modul',
      isbn: '978-623-01-2026-1',
      accessType: 'free',
      price: 0,
      downloads: 1420,
      rating: 4.9,
      pages: 184,
      fileFormat: 'PDF',
      fileSize: '14.2 MB',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
      synopsis: 'Kumpulan dokumentasi praktik baik literasi bermakna yang ditulis oleh para pegiat literasi dari 28 kecamatan di Kabupaten Tangerang.',
      sampleChapter: '<h3>Bab 1: Menghidupkan Budaya Baca di Ruang Komunitas</h3><p>Literasi adalah gerbang pembuka imajinasi manusia di era modern...</p>',
      status: 'published',
    },
  });

  // Forum Thread Sampel
  await prisma.forumThread.create({
    data: {
      userId: mentor.id,
      title: 'Tips Menyusun Lead Paragraf yang Memikat Perhatian Pembaca dalam 5 Detik Pertama',
      content: 'Halo rekan-rekan penulis! Mari berbagi teknik bagaimana cara membuka artikel opini atau cerpen agar pembaca langsung terpikat sejak kalimat pertama...',
      category: 'Diskusi Menulis',
      isPinned: true,
      replies: {
        create: [
          {
            userId: member.id,
            content: 'Saya biasanya memakai teknik in media res, langsung menyajikan konflik di kalimat pembuka!',
          },
        ],
      },
    },
  });

  console.log('🎉 Seeding database development lokal selesai dengan sukses!');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
