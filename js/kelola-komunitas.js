/**
 * KERTAS KATA - Kelola Komunitas (Forum & Discussion Moderation) Logic
 * Handles real-time search, multi-criteria filtering, thread pinning,
 * comment moderation, violation handling, and event announcement creation.
 */

(function () {
  'use strict';

  // 1. Dataset 10 Topik Diskusi Komunitas Literasi Kabupaten Tangerang
  // Mematuhi instruksi khusus:
  // - Tanpa kata "Guru" -> diganti "Anggota"
  // - Tanpa nama sekolah -> diganti nama kecamatan atau organisasi asal
  // - Tanpa kata "Disdik" -> diganti "Komunitas"
  // - Tanpa kata "Peserta" -> diganti "Anggota"
  const threadsData = [
    {
      id: 'th-101',
      title: 'Klinik Naskah: Optimalisasi Diksi Tradisi Maritim dalam Cerpen Pesisir',
      snippet: 'Mohon masukan dan koreksi para kurator mengenai keotentikan istilah jaring dan perahu tradisional Pantura...',
      fullContent: 'Halo rekan-rekan anggota komunitas penulis. Saya sedang merampungkan bab ketiga novel fiksi sejarah yang berlatar di pesisir Kronjo dan Tanjung Pasir. Terdapat beberapa istilah alat tangkap tradisional dan ritual laut yang ingin saya pastikan akurasinya agar tidak terasa anakronistis. Mohon masukan dan bedah naskah dari para kurator dan rekan anggota.',
      author: 'Nurul Fajriah, S.S.',
      authorInitials: 'NF',
      authorOrg: 'Forum Literasi Sukamulya',
      kecamatan: 'Sukamulya',
      category: 'Klinik Menulis',
      categoryClass: 'klinik',
      status: 'pinned',
      date: '08 Sep 2026',
      repliesCount: 24,
      likesCount: 68,
      viewsCount: 610,
      comments: [
        { id: 'c-1', author: 'Siti Aminah, M.Pd.', org: 'Forum Literasi Teluknaga', date: '08 Sep 2026, 14:20', text: 'Untuk istilah perahu nelayan setempat biasa disebut perahu jukung atau soang-soang. Sangat bagus diangkat!' },
        { id: 'c-2', author: 'Ahmad Fauzi, S.Pd.I', org: 'Pegiat Pustaka Kronjo', date: '08 Sep 2026, 15:45', text: 'Saya ada dokumentasi foto wawancara dengan tetua nelayan Kronjo, nanti bisa saya kirimkan via portal arsip.' }
      ]
    },
    {
      id: 'th-102',
      title: 'PENGUMUMAN RESMI: Pembukaan Kurasi Antologi Cerpen Komunitas Literasi 2026',
      snippet: 'Batas akhir pengumpulan karya tanggal 15 Oktober 2026. Target kuota 35 karya terpilih untuk dicetak ber-ISBN...',
      fullContent: 'Dewan Kurasi KERTAS KATA secara resmi membuka pendaftaran submisi naskah antologi cerpen bertema "Merajut Asa di Ujung Barat Tangerang". Seluruh anggota komunitas yang telah menuntaskan minimal Modul 3 E-Learning berhak mengajukan 1 naskah cerpen orisinal.',
      author: 'Fajar Ilhami',
      authorInitials: 'FI',
      authorOrg: 'Tim Kurasi Komunitas',
      kecamatan: 'Tigaraksa',
      category: 'Agenda Literasi',
      categoryClass: 'agenda',
      status: 'pinned',
      date: '05 Sep 2026',
      repliesCount: 42,
      likesCount: 156,
      viewsCount: 1840,
      comments: [
        { id: 'c-3', author: 'Dewi Sartika, S.Pd.', org: 'Komunitas Literasi Mauk', date: '05 Sep 2026, 19:10', text: 'Apakah naskah harus berlatar Kabupaten Tangerang atau bebas fiksi umum?' },
        { id: 'c-4', author: 'Fajar Ilhami', org: 'Admin Kurator', date: '05 Sep 2026, 19:30', text: 'Diutamakan naskah yang mengeksplorasi nilai kearifan lokal, dinamika sosial, atau budaya Kabupaten Tangerang.' }
      ]
    },
    {
      id: 'th-103',
      title: 'Bedah Karya: Efektivitas Penulisan Artikel Best Practice Pembelajaran Portofolio',
      snippet: 'Mendiskusikan struktur baku Bab Tantangan dan Aksi Nyata agar naskah layak terbit ke jurnal ber-ISSN...',
      fullContent: 'Bagaimana merumuskan indikator keberhasilan pada artikel best practice tanpa terkesan seperti laporan teknis yang kaku? Di sini saya menyajikan draf awal artikel saya untuk dicermati bersama.',
      author: 'Rahmat Hidayat, S.Pd.',
      authorInitials: 'RH',
      authorOrg: 'Komunitas Literasi Curug',
      kecamatan: 'Curug',
      category: 'Bedah Karya',
      categoryClass: 'bedah',
      status: 'active',
      date: '07 Sep 2026',
      repliesCount: 18,
      likesCount: 45,
      viewsCount: 490,
      comments: [
        { id: 'c-5', author: 'Budi Santoso, M.Pd.', org: 'Komunitas Penulis Tigaraksa', date: '07 Sep 2026, 21:00', text: 'Sajikan grafik tren nilai sebelum dan sesudah intervensi, lalu berikan narasi kualitatif respon anggota.' }
      ]
    },
    {
      id: 'th-104',
      title: 'Peluang Kolaborasi Penulisan Buku Sejarah Lisan Jalur Sutra Cisadane',
      snippet: 'Mengajak anggota di wilayah Cisauk, Legok, dan Curug untuk riset arsip kolonial dan cerita tutur sesepuh...',
      fullContent: 'Bagi rekan anggota di bantaran Sungai Cisadane yang tertarik meneliti jalur niaga tempo dulu, mari kita bentuk tim kepenulisan buku kolaboratif ber-ISBN resmi.',
      author: 'Maya Anggraeni, S.Pd.',
      authorInitials: 'MA',
      authorOrg: 'Komunitas Sastra Cisauk',
      kecamatan: 'Cisauk',
      category: 'Inspirasi Komunitas',
      categoryClass: 'inspirasi',
      status: 'active',
      date: '06 Sep 2026',
      repliesCount: 12,
      likesCount: 38,
      viewsCount: 320,
      comments: [
        { id: 'c-6', author: 'Hendra Gunawan, S.E.', org: 'Pegiat Literasi Cikupa', date: '06 Sep 2026, 17:15', text: 'Sangat menarik! Komunitas kami siap berkontribusi pada data sejarah pabrik tenun tua.' }
      ]
    },
    {
      id: 'th-105',
      title: 'Laporan Pelanggaran: Indikasi Promosi Layanan Berbayar di Luar Standar Komunitas',
      snippet: 'Pengguna mengunggah tawaran sertifikat instan tanpa proses pembelajaran e-learning resmi...',
      fullContent: 'Terdeteksi komentar yang membagikan tautan eksternal mencurigakan terkait jaminan penerbitan instan berbayar tanpa melalui tahap kurasi dewan kurator KERTAS KATA.',
      author: 'Sistem Deteksi Kurator',
      authorInitials: 'SDK',
      authorOrg: 'Moderator Otomatis Platform',
      kecamatan: 'Tigaraksa',
      category: 'Seputar Publikasi',
      categoryClass: 'publikasi',
      status: 'reported',
      date: '09 Sep 2026',
      repliesCount: 5,
      likesCount: 8,
      viewsCount: 210,
      comments: [
        { id: 'c-7', author: 'Wahyu Hidayat, M.Pd.', org: 'Forum Literasi Pasar Kemis', date: '09 Sep 2026, 11:00', text: 'Akun tersebut perlu diverifikasi ulang atau ditangguhkan demi menjaga integritas platform.' }
      ]
    },
    {
      id: 'th-106',
      title: 'Tanya Jawab: Berapa Lama Pengurusan Nomor ISBN Perpusnas Setelah Naskah Lolos?',
      snippet: 'Klarifikasi alur pendaftaran naskah cetak mandiri dari pengajuan sampai penerbitan barcode resmi...',
      fullContent: 'Bagi anggota yang baru pertama kali mengajukan cetak mandiri buku solo, proses di Perpusnas rata-rata memakan waktu 7 hingga 14 hari kerja setelah proofread layout disetujui kurator.',
      author: 'Budi Santoso, M.Pd.',
      authorInitials: 'BS',
      authorOrg: 'Komunitas Penulis Tigaraksa',
      kecamatan: 'Tigaraksa',
      category: 'Seputar Publikasi',
      categoryClass: 'publikasi',
      status: 'active',
      date: '04 Sep 2026',
      repliesCount: 16,
      likesCount: 52,
      viewsCount: 780,
      comments: []
    },
    {
      id: 'th-107',
      title: 'Agenda Lokakarya Menulis Esai Populer Bersama Sastrawan Banten (Sabtu Depan)',
      snippet: 'Pelaksanaan secara daring melalui ruang pertemuan virtual portal, terbuka untuk seluruh anggota...',
      fullContent: 'Lokakarya virtual ini akan membedah teknik menyusun hook pembuka artikel esai yang memikat redaktur media massa nasional dan dewan kurasi daerah.',
      author: 'Sri Wahyuni, S.Pd.',
      authorInitials: 'SW',
      authorOrg: 'Komunitas Tenun & Literasi Kresek',
      kecamatan: 'Kresek',
      category: 'Agenda Literasi',
      categoryClass: 'agenda',
      status: 'active',
      date: '03 Sep 2026',
      repliesCount: 28,
      likesCount: 94,
      viewsCount: 920,
      comments: []
    },
    {
      id: 'th-108',
      title: 'Klinik Bahasa: Kapan Wajib Menggunakan Tanda Hubung (-) pada Kata Ulang Berimbuhan?',
      snippet: 'Kajian praktis kaidah EYD V mengenai reduplikasi kata berimbuhan me-kan dan ber-kan...',
      fullContent: 'Masih banyak ditemukan salah kaprah pada kalimat naskah anggota yang menuliskan "ber-jalan-jalan" atau "berlarian-larian". Mari kita bahas tuntas kaidah baku PUEBI.',
      author: 'Rahmat Hidayat, S.Pd.',
      authorInitials: 'RH',
      authorOrg: 'Komunitas Literasi Curug',
      kecamatan: 'Curug',
      category: 'Klinik Menulis',
      categoryClass: 'klinik',
      status: 'active',
      date: '02 Sep 2026',
      repliesCount: 31,
      likesCount: 77,
      viewsCount: 840,
      comments: []
    },
    {
      id: 'th-109',
      title: 'Diskusi Naskah Lama: Dokumentasi Cerita Rakyat Kramat Solear (Telah Selesai)',
      snippet: 'Proyek penulisan antologi babad lokal kawasan Solear telah resmi ditutup dan masuk percetakan...',
      fullContent: 'Seluruh naskah cerita rakyat seputar monyet ekor panjang Solear dan makam keramat telah disunting oleh kurator dan nomor ISBN sudah terbit.',
      author: 'Agus Supriyadi, S.Pd.',
      authorInitials: 'AS',
      authorOrg: 'Pojok Literasi Solear',
      kecamatan: 'Solear',
      category: 'Bedah Karya',
      categoryClass: 'bedah',
      status: 'closed',
      date: '28 Agu 2026',
      repliesCount: 19,
      likesCount: 42,
      viewsCount: 510,
      comments: []
    },
    {
      id: 'th-110',
      title: 'Inspirasi: Cara Mengelola Waktu Menulis 30 Menit Sehari di Tengah Kesibukan',
      snippet: 'Tips konsistensi menulis tanpa menunggu inspirasi datang, menggunakan metode pomodoro cerdas...',
      fullContent: 'Menulis artikel best practice atau esai tidak butuh waktu berjam-jam sekaligus. Dengan komitmen 30 menit per sub-bab setelah waktu belajar, naskah 1.500 kata selesai dalam 4 hari.',
      author: 'Ratna Dewi, S.Pd.',
      authorInitials: 'RD',
      authorOrg: 'Komunitas Baca Cisoka',
      kecamatan: 'Cisoka',
      category: 'Inspirasi Komunitas',
      categoryClass: 'inspirasi',
      status: 'active',
      date: '01 Sep 2026',
      repliesCount: 22,
      likesCount: 65,
      viewsCount: 670,
      comments: []
    }
  ];

  let currentThreads = [...threadsData];
  let activeCategory = 'all';

  // 2. Render Threads Table
  function renderThreadsTable(data) {
    const tbody = document.getElementById('forumTableBody');
    const totalCountEl = document.getElementById('totalThreadCount');
    if (totalCountEl) totalCountEl.textContent = `${data.length} Topik Ditampilkan`;
    if (!tbody) return;

    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
            <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
            <div style="font-weight:700; font-size:1rem; color:var(--text-main);">Tidak Ada Diskusi yang Sesuai</div>
            <div style="font-size:0.8125rem;">Coba sesuaikan kata kunci pencarian atau reset filter kategori.</div>
          </td>
        </tr>
      `;
      return;
    }

    data.forEach(item => {
      const tr = document.createElement('tr');

      const isPinned = item.status === 'pinned';
      const isReported = item.status === 'reported';
      const isClosed = item.status === 'closed';

      let statusBadge = `<span class="badge-moderation active">● Aktif</span>`;
      if (isPinned) statusBadge = `<span class="badge-moderation pinned">📌 Pinned</span>`;
      if (isReported) statusBadge = `<span class="badge-moderation reported">⚠️ Butuh Moderasi</span>`;
      if (isClosed) statusBadge = `<span class="badge-moderation closed">🔒 Ditutup</span>`;

      tr.innerHTML = `
        <td style="width: 40px; text-align: center;">
          <input type="checkbox" class="thread-select-cb" data-id="${item.id}" aria-label="Pilih topik ${item.title}">
        </td>
        <td>
          <div class="forum-title-cell">
            <div class="thread-subject" onclick="window.openThreadDetailModal('${item.id}')">
              ${isPinned ? '<span class="pinned-badge">📌 PINNED</span>' : ''}
              ${item.title}
            </div>
            <div class="thread-snippet">${item.snippet}</div>
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <div style="width:30px; height:30px; border-radius:8px; background:#e0e7ff; color:#3730a3; font-weight:700; font-size:0.75rem; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              ${item.authorInitials}
            </div>
            <div>
              <div style="font-weight:700; font-size:0.8125rem; color:var(--text-main);">${item.author}</div>
              <div style="font-size:0.6875rem; color:var(--text-muted);">${item.authorOrg}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge-forum-cat ${item.categoryClass}">${item.category}</span>
          <div style="font-size:0.6875rem; color:var(--text-muted); margin-top:0.25rem;">Kec. ${item.kecamatan}</div>
        </td>
        <td>
          <div class="forum-metrics-box">
            <span class="metric-item" title="${item.repliesCount} Balasan">💬 ${item.repliesCount}</span>
            <span class="metric-item" title="${item.likesCount} Suka">❤️ ${item.likesCount}</span>
            <span class="metric-item" title="${item.viewsCount} Dilihat">👁️ ${item.viewsCount}</span>
          </div>
          <div style="font-size:0.6875rem; color:var(--text-muted); margin-top:0.25rem;">${item.date}</div>
        </td>
        <td>
          ${statusBadge}
        </td>
        <td style="text-align: right;">
          <div style="display:flex; gap:0.35rem; justify-content:flex-end;">
            <button type="button" class="btn-forum-action pin ${isPinned ? 'active' : ''}" onclick="window.togglePinThread('${item.id}')" title="${isPinned ? 'Copot Pin' : 'Sematkan ke Puncak'}">
              📌
            </button>
            <button type="button" class="btn-forum-action" onclick="window.openThreadDetailModal('${item.id}')" title="Lihat Diskusi & Komentar">
              👁️
            </button>
            <button type="button" class="btn-forum-action ${isReported ? 'danger' : ''}" onclick="window.toggleModerateThread('${item.id}')" title="Moderasi Diskusi">
              ⚠️
            </button>
            <button type="button" class="btn-forum-action danger" onclick="window.deleteThread('${item.id}')" title="Hapus Topik">
              🗑️
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  // 3. Multi-Criteria Filter Logic
  function applyFilters() {
    const searchVal = (document.getElementById('forumSearchInput')?.value || '').toLowerCase().trim();
    const statusVal = document.getElementById('filterModerationStatus')?.value || 'all';
    const kecVal = document.getElementById('filterKecamatan')?.value || 'all';
    const sortVal = document.getElementById('sortForumSelect')?.value || 'latest';

    currentThreads = threadsData.filter(item => {
      // Category filter
      if (activeCategory !== 'all' && item.categoryClass !== activeCategory) {
        return false;
      }

      // Moderation Status filter
      if (statusVal !== 'all' && item.status !== statusVal) {
        return false;
      }

      // Kecamatan filter
      if (kecVal !== 'all' && item.kecamatan !== kecVal) {
        return false;
      }

      // Search keyword filter (title, snippet, author, authorOrg)
      if (searchVal) {
        const matchTitle = item.title.toLowerCase().includes(searchVal);
        const matchSnippet = item.snippet.toLowerCase().includes(searchVal);
        const matchAuthor = item.author.toLowerCase().includes(searchVal);
        const matchOrg = item.authorOrg.toLowerCase().includes(searchVal);
        if (!matchTitle && !matchSnippet && !matchAuthor && !matchOrg) {
          return false;
        }
      }

      return true;
    });

    // Sort order
    if (sortVal === 'replies') {
      currentThreads.sort((a, b) => b.repliesCount - a.repliesCount);
    } else if (sortVal === 'views') {
      currentThreads.sort((a, b) => b.viewsCount - a.viewsCount);
    } else if (sortVal === 'likes') {
      currentThreads.sort((a, b) => b.likesCount - a.likesCount);
    } // default: order by id / dataset

    renderThreadsTable(currentThreads);
  }

  // 4. Modal Detail Thread & Komentar
  window.openThreadDetailModal = function (threadId) {
    const thread = threadsData.find(t => t.id === threadId);
    if (!thread) return;

    const modal = document.getElementById('threadDetailModal');
    if (!modal) return;

    document.getElementById('modalThreadTitle').textContent = thread.title;
    document.getElementById('modalThreadAuthor').textContent = thread.author;
    document.getElementById('modalThreadOrg').textContent = `${thread.authorOrg} • Kec. ${thread.kecamatan}`;
    document.getElementById('modalThreadDate').textContent = thread.date;
    document.getElementById('modalThreadCategory').textContent = thread.category;
    document.getElementById('modalThreadCategory').className = `badge-forum-cat ${thread.categoryClass}`;
    document.getElementById('modalThreadContent').textContent = thread.fullContent;

    const commentsContainer = document.getElementById('modalCommentsList');
    if (commentsContainer) {
      if (thread.comments.length === 0) {
        commentsContainer.innerHTML = '<div style="font-size:0.8125rem; color:var(--text-muted); font-style:italic;">Belum ada balasan komentar dari anggota.</div>';
      } else {
        commentsContainer.innerHTML = thread.comments.map(c => `
          <div class="comment-mod-item" id="comment-${c.id}">
            <div class="comment-avatar-mini">${c.author.substring(0, 2).toUpperCase()}</div>
            <div class="comment-mod-content">
              <div class="comment-author-name">
                <span>${c.author}</span>
                <span class="comment-author-meta">${c.org} • ${c.date}</span>
              </div>
              <div class="comment-text">${c.text}</div>
            </div>
            <div class="comment-mod-actions">
              <button type="button" class="btn-mod-mini danger" onclick="window.deleteComment('${thread.id}', '${c.id}')" title="Hapus Komentar">
                ✕ Hapus
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    modal.classList.add('show');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  window.openThreadDetail = window.openThreadDetailModal;

  // 5. Toggle Pin Thread
  window.togglePinThread = function (threadId) {
    const thread = threadsData.find(t => t.id === threadId);
    if (!thread) return;

    if (thread.status === 'pinned') {
      thread.status = 'active';
      showToast(`📌 Sematan topik "${thread.title.substring(0, 32)}..." dicopot.`);
    } else {
      thread.status = 'pinned';
      showToast(`📌 Topik "${thread.title.substring(0, 32)}..." berhasil disematkan ke puncak forum.`);
    }
    applyFilters();
  };

  // 6. Moderasi Thread (Sembunyikan / Buka)
  window.toggleModerateThread = function (threadId) {
    const thread = threadsData.find(t => t.id === threadId);
    if (!thread) return;

    if (thread.status === 'reported') {
      thread.status = 'active';
      showToast(`✅ Status moderasi topik dipulihkan menjadi Aktif.`);
    } else {
      thread.status = 'reported';
      showToast(`⚠️ Topik ditandai butuh peninjauan kurator.`);
    }
    applyFilters();
  };

  // 7. Hapus Thread
  window.deleteThread = function (threadId) {
    const idx = threadsData.findIndex(t => t.id === threadId);
    if (idx !== -1) {
      const title = threadsData[idx].title;
      threadsData.splice(idx, 1);
      showToast(`🗑️ Topik "${title.substring(0, 30)}..." berhasil dihapus dari forum.`);
      applyFilters();
    }
  };

  // 8. Hapus Komentar
  window.deleteComment = function (threadId, commentId) {
    const thread = threadsData.find(t => t.id === threadId);
    if (!thread) return;

    thread.comments = thread.comments.filter(c => c.id !== commentId);
    thread.repliesCount = Math.max(0, thread.repliesCount - 1);
    const commentEl = document.getElementById(`comment-${commentId}`);
    if (commentEl) commentEl.remove();
    showToast('🗑️ Komentar anggota berhasil dihapus oleh kurator.');
    applyFilters();
  };

  // 9. Modal Buat Pengumuman / Event Baru
  window.openNewAnnouncementModal = function () {
    const modal = document.getElementById('newAnnouncementModal');
    if (modal) modal.classList.add('active');
  };

  window.submitNewAnnouncement = function (e) {
    e.preventDefault();
    const title = document.getElementById('announcementTitleInput').value.trim();
    const cat = document.getElementById('announcementCategoryInput').value;
    const kec = document.getElementById('announcementKecamatanInput').value;
    const content = document.getElementById('announcementContentInput').value.trim();

    if (!title || !content) {
      showToast('⚠️ Harap isi judul dan konten pengumuman.');
      return;
    }

    const newTopic = {
      id: `th-${Date.now().toString().slice(-4)}`,
      title: title,
      snippet: content.substring(0, 100) + '...',
      fullContent: content,
      author: 'Fajar Ilhami',
      authorInitials: 'FI',
      authorOrg: 'Admin Kurator',
      kecamatan: kec === 'all' ? 'Seluruh Wilayah' : kec,
      category: cat,
      categoryClass: cat.toLowerCase().includes('agenda') ? 'agenda' : 'publikasi',
      status: 'pinned',
      date: 'Hari Ini',
      repliesCount: 0,
      likesCount: 1,
      viewsCount: 10,
      comments: []
    };

    threadsData.unshift(newTopic);
    closeModal('newAnnouncementModal');
    e.target.reset();
    showToast('📢 Pengumuman kurator berhasil diterbitkan dan disematkan ke forum!');
    applyFilters();
  };

  // 10. Helper Modal Closer
  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // 11. Toast Notifications
  function showToast(message) {
    let toast = document.getElementById('globalAdminToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalAdminToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #1e293b;
        color: #ffffff;
        padding: 0.85rem 1.35rem;
        border-radius: 12px;
        font-size: 0.8125rem;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        opacity: 0;
        transform: translateY(15px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
    }, 3200);
  }

  // 12. Initialize Page Event Listeners
  document.addEventListener('DOMContentLoaded', () => {
    // Initial Table Render
    applyFilters();

    // Search Input
    const searchInput = document.getElementById('forumSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    // Filter Selects
    const statusSelect = document.getElementById('filterModerationStatus');
    if (statusSelect) {
      statusSelect.addEventListener('change', applyFilters);
    }

    const kecSelect = document.getElementById('filterKecamatan');
    if (kecSelect) {
      kecSelect.addEventListener('change', applyFilters);
    }

    const sortSelect = document.getElementById('sortForumSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', applyFilters);
    }

    // Reset Button
    const resetBtn = document.getElementById('btnResetForumFilter');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (statusSelect) statusSelect.value = 'all';
        if (kecSelect) kecSelect.value = 'all';
        if (sortSelect) sortSelect.value = 'latest';
        activeCategory = 'all';

        document.querySelectorAll('.category-tab-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.category === 'all');
        });

        applyFilters();
        showToast('🔄 Filter forum berhasil disetel ulang.');
      });
    }

    // Category Tabs
    document.querySelectorAll('.category-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category || 'all';
        applyFilters();
      });
    });

    // Form Pengumuman Baru
    const announcementForm = document.getElementById('newAnnouncementForm');
    if (announcementForm) {
      announcementForm.addEventListener('submit', window.submitNewAnnouncement);
    }

    // Checkbox Select All
    const selectAllCb = document.getElementById('selectAllThreadsCb');
    if (selectAllCb) {
      selectAllCb.addEventListener('change', (e) => {
        const checked = e.target.checked;
        document.querySelectorAll('.thread-select-cb').forEach(cb => {
          cb.checked = checked;
        });
      });
    }

    // Export Report Button
    const exportBtn = document.getElementById('btnExportForumReport');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        showToast('📥 Mengunduh rekap moderasi diskusi komunitas (Format CSV)...');
      });
    }

    // Init Mobile Drawer
    initMobileDrawer();
  });

  // Mobile Drawer Navigation Toggle
  function initMobileDrawer() {
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const sidebarLeft = document.getElementById('sidebarLeft');

    if (menuToggleBtn && sidebarLeft) {
      menuToggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        sidebarLeft.classList.toggle('open');
      });

      document.addEventListener('click', function (e) {
        if (sidebarLeft.classList.contains('open')) {
          if (!sidebarLeft.contains(e.target) && !menuToggleBtn.contains(e.target)) {
            sidebarLeft.classList.remove('open');
          }
        }
      });
    }
  }

  // Keyboard accessibility: ESC closes open modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.inline-review-modal-overlay.show, .inline-review-modal-overlay.active').forEach(m => {
        m.classList.remove('show');
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });

})();
