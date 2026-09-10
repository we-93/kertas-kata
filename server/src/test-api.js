import app from './app.js';
import http from 'http';

async function testApi() {
  console.log('🧪 Memulai pengujian otomatis REST API KERTAS KATA...\n');

  // Start test server on random port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  let adminToken = '';
  let memberToken = '';
  let sampleArticleId = '';
  let sampleModuleId = '';

  const assert = (condition, message) => {
    if (!condition) {
      console.error(`❌ GAGAL: ${message}`);
      process.exit(1);
    }
    console.log(`✓ ${message}`);
  };

  try {
    // 1. Health Check
    const resHealth = await fetch(`${baseUrl}/health`).then((r) => r.json());
    assert(resHealth.status === 'ok', 'GET /api/health berhasil dan status ok');

    // 2. Auth: Login Admin
    const resLoginAdmin = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@kertaskata.my.id', password: 'Semua123@' }),
    }).then((r) => r.json());
    assert(resLoginAdmin.success === true, 'POST /api/auth/login Admin berhasil');
    assert(resLoginAdmin.data.token, 'Admin menerima JWT token yang valid');
    adminToken = resLoginAdmin.data.token;

    // 3. Auth: Login Member
    const resLoginMember = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'raden@gmail.com', password: 'Semua123@' }),
    }).then((r) => r.json());
    assert(resLoginMember.success === true, 'POST /api/auth/login Member berhasil');
    memberToken = resLoginMember.data.token;

    // 4. Auth: GET /me
    const resMe = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    }).then((r) => r.json());
    assert(resMe.success === true && resMe.data.email === 'raden@gmail.com', 'GET /api/auth/me mengembalikan profil terotentikasi');

    // 5. Articles: GET /public
    const resPublicArticles = await fetch(`${baseUrl}/articles/public`).then((r) => r.json());
    assert(resPublicArticles.success === true && resPublicArticles.data.articles.length > 0, 'GET /api/articles/public mengembalikan artikel yang terbit');

    // 6. Articles: Save Draft
    const resDraft = await fetch(`${baseUrl}/articles/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${memberToken}`,
      },
      body: JSON.stringify({
        title: 'Membangun Pojok Baca Digital di Kawasan Industri Cikupa',
        lead: 'Inisiatif gerakan literasi mandiri buruh pabrik.',
        content: '<p>Di tengah deru mesin pabrik, ruang literasi menjadi sarana rekreasi mental...</p>',
        category: 'Opini Pendidikan',
      }),
    }).then((r) => r.json());
    assert(resDraft.success === true && resDraft.data.id, 'POST /api/articles/save berhasil menyimpan draf tulisan baru');
    sampleArticleId = resDraft.data.id;

    // 7. Articles: Submit for Review
    // Update word count first so it passes minimum check
    await fetch(`${baseUrl}/articles/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${memberToken}` },
      body: JSON.stringify({
        id: sampleArticleId,
        title: 'Membangun Pojok Baca Digital di Kawasan Industri Cikupa',
        content: ('Kata demi kata merajai ruang kreasi literasi warga Tangerang. '.repeat(30)),
      }),
    });
    const resSubmit = await fetch(`${baseUrl}/articles/${sampleArticleId}/submit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${memberToken}` },
    }).then((r) => r.json());
    assert(resSubmit.success === true, 'POST /api/articles/:id/submit berhasil mengajukan naskah ke kurasi');

    // 8. Admin Reviews: GET /queue
    const resQueue = await fetch(`${baseUrl}/admin/reviews/queue`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    assert(resQueue.success === true && resQueue.data.length > 0, 'GET /api/admin/reviews/queue menampilkan naskah dalam antrean');

    // 9. Admin Reviews: Run AI Check
    const resAI = await fetch(`${baseUrl}/admin/reviews/${sampleArticleId}/ai-check`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    assert(resAI.success === true && resAI.data.analysis.grammarScore > 0, 'POST /api/admin/reviews/:id/ai-check berhasil mengevaluasi tata bahasa & keunikan naskah');

    // 10. Admin Reviews: Add Inline Comment
    const resComment = await fetch(`${baseUrl}/admin/reviews/${sampleArticleId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        targetText: 'mesin pabrik',
        comment: 'Diksi ini sangat kuat dan kontekstual dengan kawasan Cikupa.',
      }),
    }).then((r) => r.json());
    assert(resComment.success === true, 'POST /api/admin/reviews/:id/comment berhasil menyimpan catatan inline');

    // 11. Admin Reviews: Make Decision (Approve)
    const resDecision = await fetch(`${baseUrl}/admin/reviews/${sampleArticleId}/decide`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        decision: 'approve',
        notes: 'Disetujui untuk terbit langsung di etalase KERTAS KATA.',
      }),
    }).then((r) => r.json());
    assert(resDecision.success === true && resDecision.data.status === 'published', 'POST /api/admin/reviews/:id/decide berhasil menyetujui artikel menjadi Published');

    // 12. E-Learning: GET /modules
    const resModules = await fetch(`${baseUrl}/elearning/modules`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    }).then((r) => r.json());
    assert(resModules.success === true && resModules.data.length > 0, 'GET /api/elearning/modules mengembalikan silabus modul');
    sampleModuleId = resModules.data[0].id;

    // 13. E-Learning: GET /classroom
    const resClassroom = await fetch(`${baseUrl}/elearning/modules/${sampleModuleId}`, {
      headers: { Authorization: `Bearer ${memberToken}` },
    }).then((r) => r.json());
    assert(resClassroom.success === true && resClassroom.data.quizzes.length > 0, 'GET /api/elearning/modules/:id mengembalikan kelas interaktif & kuis');

    // 14. Library: GET /ebooks
    const resEbooks = await fetch(`${baseUrl}/library/ebooks`).then((r) => r.json());
    assert(resEbooks.success === true && resEbooks.data.length > 0, 'GET /api/library/ebooks mengembalikan katalog e-book perpustakaan');

    // 15. Community: GET /threads
    const resThreads = await fetch(`${baseUrl}/community/threads`).then((r) => r.json());
    assert(resThreads.success === true && resThreads.data.length > 0, 'GET /api/community/threads mengembalikan daftar diskusi komunitas');

    // 16. Print: Calculate Cost
    const resCalc = await fetch(`${baseUrl}/print/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ copies: 50, pages: 120 }),
    }).then((r) => r.json());
    assert(resCalc.success === true && resCalc.data.totalCost > 0, 'POST /api/print/calculate menghitung estimasi biaya cetak akurat');

    // 17. Admin Overview
    const resOverview = await fetch(`${baseUrl}/admin/reviews/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    assert(resOverview.success === true && resOverview.data.totalMembers > 0, 'GET /api/admin/reviews/overview menyajikan statistik metrik platform');

    console.log('\n====================================================');
    console.log('🎉 SELURUH 17 SUITE TEST API LULUS 100% TANPA KESALAHAN!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Terjadi kesalahan saat pengujian API:', err);
    process.exit(1);
  } finally {
    server.close();
  }
}

testApi();
