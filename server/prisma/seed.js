import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`🌱 Memulai proses seeding database KERTAS KATA [Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}]...`);

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

  // Bersihkan semua data dummy lama (relasi bertingkat)
  console.log('🧹 Menghapus seluruh data lama, artikel, draf, review, dan akun pengguna...');
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
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();

  for (const b of defaultBadges) {
    await prisma.badge.create({ data: b });
  }
  console.log('✅ Master Badges / Lencana Gamifikasi siap.');

  // 2. Akun Super Admin Baru (Bersih tanpa data dummy)
  const adminEmail = 'admin@kertaskata.my.id';
  const adminPasswordHash = await bcrypt.hash('Semua123@', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Administrator Kurasi',
      email: adminEmail,
      password: adminPasswordHash,
      role: 'admin',
      originRegion: 'Kabupaten Tangerang',
      specialization: 'Kurasi Editorial & Manajemen Platform',
      bio: 'Administrator Utama Platform Literasi KERTAS KATA Kabupaten Tangerang.',
    },
  });
  console.log(`✅ Akun Admin Baru Bersih dibuat: ${adminEmail} (Password: Semua123@)`);

  // 3. Akun Anggota Baru (Bersih tanpa data dummy)
  const memberEmail = 'raden@gmail.com';
  const memberPasswordHash = await bcrypt.hash('Semua123@', 10);
  const memberUser = await prisma.user.create({
    data: {
      name: 'Raden',
      email: memberEmail,
      password: memberPasswordHash,
      role: 'anggota',
      originRegion: 'Kecamatan Tigaraksa',
      specialization: 'Literasi Umum',
      bio: 'Penulis dan anggota komunitas literasi KERTAS KATA Kabupaten Tangerang.',
    },
  });
  console.log(`✅ Akun Anggota Baru Bersih dibuat: ${memberEmail} (Password: Semua123@)`);

  console.log('------------------------------------------------------------');
  console.log('🚀 SEEDING BERSIH SELESAI:');
  console.log('   - Seluruh data dummy dan akun lama (termasuk Rahmat Hidayat) berhasil dihapus.');
  console.log(`   - Akun Admin: ${adminEmail} | Password: Semua123@`);
  console.log(`   - Akun Anggota: ${memberEmail} | Password: Semua123@`);
  console.log('   - Database 100% bersih tanpa artikel palsu / review palsu.');
  console.log('------------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
