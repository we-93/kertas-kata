/**
 * KERTAS KATA - Kelola Publikasi (Publication Curation & Management) Logic
 * Handles article listing, search, category filtering, featured toggling,
 * unpublish moderation, preview modal, and mobile drawer toggle.
 */

(function () {
  'use strict';

  // 1. Data 12 Artikel Terbit Komunitas (Mewakili 6 Kategori & Kabupaten Tangerang)
  const publicationsData = [
    {
      id: 'art-1',
      title: 'Strategi Diferensiasi Pembelajaran Digital Berbasis Portofolio Anggota di Kecamatan Curug',
      category: 'Best Practice',
      categoryClass: 'best-practice',
      author: 'Rahmat Hidayat, S.Pd.',
      school: 'Kecamatan Curug',
      kecamatan: 'Curug',
      date: '06 Sep 2026',
      views: 3420,
      likes: 215,
      comments: 48,
      status: 'featured',
      statusLabel: 'Featured ⭐',
      thumb: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100&auto=format&fit=crop&q=80',
      excerpt: 'Tantangan literasi digital menuntut anggota untuk senantiasa mengubah paradigma pengajaran yang seragam menjadi pendekatan yang lebih adaptif dan responsif terhadap gaya belajar anggota di Kabupaten Tangerang.'
    },
    {
      id: 'art-2',
      title: 'Kajian Historis Komunitas Tionghoa Benteng di Sepanjang Aliran Sungai Cisadane',
      category: 'Artikel Ilmiah',
      categoryClass: 'ilmiah',
      author: 'Siti Aminah, M.Pd.',
      school: 'Kecamatan Teluknaga',
      kecamatan: 'Teluknaga',
      date: '06 Sep 2026',
      views: 2840,
      likes: 184,
      comments: 32,
      status: 'featured',
      statusLabel: 'Featured ⭐',
      thumb: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=100&auto=format&fit=crop&q=80',
      excerpt: 'Riset etnografi mengenai akulturasi budaya Tionghoa Benteng dan tradisi lokal Sunda Banten yang membentuk identitas kultural toleran di sepanjang hilir sungai Cisadane.'
    },
    {
      id: 'art-3',
      title: 'Pengembangan Modul Ajar IPAS Berbasis Kearifan Lokal Hutan Mangrove Ketapang',
      category: 'Best Practice',
      categoryClass: 'best-practice',
      author: 'Dewi Sartika, S.Pd.SD',
      school: 'Kecamatan Mauk',
      kecamatan: 'Mauk',
      date: '05 Sep 2026',
      views: 1980,
      likes: 142,
      comments: 26,
      status: 'featured',
      statusLabel: 'Featured ⭐',
      thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=100&auto=format&fit=crop&q=80',
      excerpt: 'Pemanfaatan kawasan ekowisata mangrove Ketapang Mauk sebagai laboratorium alam pembelajaran sains untuk membangun kesadaran mitigasi abrasi sejak usia dini.'
    },
    {
      id: 'art-4',
      title: 'Optimalisasi Ruang Belajar Mandiri untuk Literasi Coding Anggota Pesisir',
      category: 'Opini Pendidikan',
      categoryClass: 'opini',
      author: 'Ahmad Fauzi, S.Pd.I',
      school: 'Kecamatan Kronjo',
      kecamatan: 'Kronjo',
      date: '05 Sep 2026',
      views: 1450,
      likes: 98,
      comments: 18,
      status: 'published',
      statusLabel: 'Tayang Publik',
      thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80',
      excerpt: 'Bagaimana meretas kesenjangan teknologi di wilayah pesisir utara melalui pelatihan logika pemrograman blok sederhana yang memicu kreativitas anggota komunitas.'
    },
    {
      id: 'art-5',
      title: 'Lentera Pesisir Kronjo: Narasi Perjuangan dan Ketangguhan Nelayan Tradisional',
      category: 'Cerpen Sastra',
      categoryClass: 'sastra',
      author: 'Nurul Fajriah, S.S.',
      school: 'Komunitas Sastra Sukamulya',
      kecamatan: 'Sukamulya',
      date: '04 Sep 2026',
      views: 3120,
      likes: 275,
      comments: 54,
      status: 'featured',
      statusLabel: 'Featured ⭐',
      thumb: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop&q=80',
      excerpt: 'Kisah fiksi berlatar kehidupan malam di pelabuhan Kronjo, tentang seorang pemuda nelayan yang bertekad membawa perubahan di desanya.'
    },
    {
      id: 'art-6',
      title: 'Efektivitas Gamifikasi Kuis Interaktif dalam Meningkatkan Keterlibatan Belajar IPA',
      category: 'Best Practice',
      categoryClass: 'best-practice',
      author: 'Budi Santoso, M.Pd.',
      school: 'Kecamatan Tigaraksa',
      kecamatan: 'Tigaraksa',
      date: '04 Sep 2026',
      views: 2210,
      likes: 160,
      comments: 29,
      status: 'published',
      statusLabel: 'Tayang Publik',
      thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&auto=format&fit=crop&q=80',
      excerpt: 'Integrasi kuis berbasis aplikasi dalam pembelajaran fisika dasar yang terbukti meningkatkan skor pemahaman anggota hingga 31% di Kecamatan Tigaraksa.'
    },
    {
      id: 'art-7',
      title: 'Penerapan Model Problem Based Learning pada Materi Konservasi Alam Pedesaan',
      category: 'Artikel Ilmiah',
      categoryClass: 'ilmiah',
      author: 'Ratna Dewi, S.Pd.',
      school: 'Kecamatan Cisoka',
      kecamatan: 'Cisoka',
      date: '03 Sep 2026',
      views: 1120,
      likes: 76,
      comments: 14,
      status: 'published',
      statusLabel: 'Tayang Publik',
      thumb: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=100&auto=format&fit=crop&q=80',
      excerpt: 'Studi tindakan di Cisoka dalam mengidentifikasi pencemaran air dan merumuskan solusi berbasis aksi nyata daur ulang limbah komunitas.'
    },
    {
      id: 'art-8',
      title: 'Implementasi Literasi Finansial Sejak Dini Melalui Pengelolaan Koperasi Komunitas',
      category: 'Best Practice',
      categoryClass: 'best-practice',
      author: 'Hendra Gunawan, S.E.',
      school: 'Kecamatan Cikupa',
      kecamatan: 'Cikupa',
      date: '03 Sep 2026',
      views: 1890,
      likes: 135,
      comments: 21,
      status: 'featured',
      statusLabel: 'Featured ⭐',
      thumb: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=100&auto=format&fit=crop&q=80',
      excerpt: 'Membangun kebiasaan menabung dan etika kewirausahaan bagi anggota muda dengan platform kasir digital koperasi komunitas.'
    },
    {
      id: 'art-9',
      title: 'Menggali Khazanah Tenun Tradisional Kresek Melalui Karya Tulis Feature Warga',
      category: 'Esai Budaya',
      categoryClass: 'budaya',
      author: 'Sri Wahyuni, S.Pd.',
      school: 'Kecamatan Kresek',
      kecamatan: 'Kresek',
      date: '02 Sep 2026',
      views: 980,
      likes: 64,
      comments: 11,
      status: 'published',
      statusLabel: 'Tayang Publik',
      thumb: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=100&auto=format&fit=crop&q=80',
      excerpt: 'Dokumentasi naratif mengenai perajin tenun gendong di pedesaan Kresek yang dirangkum menjadi materi pengayaan literasi budaya lokal Komunitas.'
    },
    {
      id: 'art-10',
      title: 'Transformasi Ruang Pojok Literasi Komunitas Ramah Anak di Kawasan Solear',
      category: 'Opini Pendidikan',
      categoryClass: 'opini',
      author: 'Agus Supriyadi, S.Pd.',
      school: 'Kecamatan Solear',
      kecamatan: 'Solear',
      date: '02 Sep 2026',
      views: 820,
      likes: 45,
      comments: 9,
      status: 'unpublished',
      statusLabel: 'Diturunkan',
      thumb: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=100&auto=format&fit=crop&q=80',
      excerpt: 'Naskah dalam peninjauan ulang kurator terkait pembaruan data dokumentasi kegiatan ruang baca ramah anak di wilayah Solear.'
    },
    {
      id: 'art-11',
      title: 'Kumpulan Sajak Pesisir: Denyut Kehidupan dan Harapan Nelayan Tanjung Pasir',
      category: 'Puisi Sastra',
      categoryClass: 'puisi',
      author: 'Maya Anggraeni, S.Pd.',
      school: 'Kecamatan Cisauk',
      kecamatan: 'Cisauk',
      date: '01 Sep 2026',
      views: 2450,
      likes: 198,
      comments: 37,
      status: 'featured',
      statusLabel: 'Featured ⭐',
      thumb: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=100&auto=format&fit=crop&q=80',
      excerpt: 'Bait-bait puisi lirih yang merekam pasang surut kehidupan pesisir utara Tangerang, tentang ombak yang setia mengantar doa para penjala ikan.'
    },
    {
      id: 'art-12',
      title: 'Strategi Penguatan Profil Literasi Komunitas Melalui Gerakan Menulis Buku Bersama',
      category: 'Best Practice',
      categoryClass: 'best-practice',
      author: 'Wahyu Hidayat, M.Pd.',
      school: 'Kecamatan Pasar Kemis',
      kecamatan: 'Pasar Kemis',
      date: '01 Sep 2026',
      views: 1670,
      likes: 110,
      comments: 19,
      status: 'published',
      statusLabel: 'Tayang Publik',
      thumb: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=100&auto=format&fit=crop&q=80',
      excerpt: 'Model kolaborasi antar-anggota dalam membimbing penulisan antologi pengalaman gotong royong di lingkungan komunitas.'
    }
  ];

  let currentPubList = [...publicationsData];
  let currentActionArticle = null;

  // 2. Render Publication Table
  function renderPublicationTable(items) {
    const tbody = document.getElementById('publicationTableBody');
    const countEl = document.getElementById('filteredPubCount');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (countEl) countEl.textContent = items.length;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            Tidak ditemukan artikel dengan kriteria filter tersebut.
          </td>
        </tr>
      `;
      return;
    }

    items.forEach(article => {
      const tr = document.createElement('tr');
      tr.id = `pub-row-${article.id}`;

      let statusBadgeClass = 'published';
      if (article.status === 'featured') statusBadgeClass = 'featured';
      if (article.status === 'unpublished') statusBadgeClass = 'unpublished';

      const isFeatured = article.status === 'featured';

      tr.innerHTML = `
        <td><input type="checkbox" class="pub-check-item" data-id="${article.id}" aria-label="Pilih ${article.title}"></td>
        <td>
          <div class="article-item-cell">
            <img src="${article.thumb}" alt="Sampul" class="article-thumb-mini">
            <div>
              <div class="article-headline-text">${article.title}</div>
              <span class="category-tag-pill ${article.categoryClass}">${article.category}</span>
            </div>
          </div>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.8125rem;">${article.author}</div>
          <span style="font-size: 0.6875rem; color: var(--text-muted);">${article.school}</span>
        </td>
        <td style="white-space: nowrap; color: var(--text-muted); font-size: 0.75rem;">${article.date}</td>
        <td>
          <div class="engagement-metrics-cell">
            <span class="engagement-item" title="Pembaca">👁️ ${article.views.toLocaleString('id-ID')}</span>
            <span class="engagement-item" title="Apresiasi Suka">❤️ ${article.likes}</span>
            <span class="engagement-item" title="Komentar">💬 ${article.comments}</span>
          </div>
        </td>
        <td>
          <span class="badge-pub-status ${statusBadgeClass}">
            ${article.statusLabel}
          </span>
        </td>
        <td style="text-align: right;">
          <div class="action-btns-group">
            <button type="button" class="btn-toggle-featured ${isFeatured ? 'is-featured' : ''}" onclick="toggleFeaturedArticle('${article.id}')" title="${isFeatured ? 'Hapus dari Pilihan' : 'Jadikan Artikel Pilihan'}">
              ⭐ ${isFeatured ? 'Pilihan' : 'Pilih'}
            </button>
            <button type="button" class="btn-icon-action" title="Preview Tampilan Pembaca" onclick="openArticlePreview('${article.id}')">
              👁️
            </button>
            <button type="button" class="btn-icon-action" title="${article.status === 'unpublished' ? 'Tayangkan Kembali' : 'Turunkan Artikel'}" onclick="triggerUnpublishArticle('${article.id}')" style="color: ${article.status === 'unpublished' ? '#059669' : '#dc2626'};">
              ${article.status === 'unpublished' ? '✓' : '⛔'}
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  // 3. Filter & Sort Logic
  function filterPublications() {
    const searchVal = (document.getElementById('pubSearchInput').value || '').toLowerCase().trim();
    const categoryVal = document.getElementById('filterPubCategory').value;
    const statusVal = document.getElementById('filterPubStatus').value;
    const sortVal = document.getElementById('sortPub').value;

    currentPubList = publicationsData.filter(article => {
      // Search
      const matchesSearch = !searchVal ||
        article.title.toLowerCase().includes(searchVal) ||
        article.author.toLowerCase().includes(searchVal) ||
        article.school.toLowerCase().includes(searchVal);

      // Category
      const matchesCategory = (categoryVal === 'all') || (article.category === categoryVal);

      // Status
      const matchesStatus = (statusVal === 'all') || (article.status === statusVal);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    if (sortVal === 'views') {
      currentPubList.sort((a, b) => b.views - a.views);
    } else if (sortVal === 'likes') {
      currentPubList.sort((a, b) => b.likes - a.likes);
    } else {
      // Newest (default)
      currentPubList.sort((a, b) => b.id.localeCompare(a.id));
    }

    renderPublicationTable(currentPubList);
  }

  function initFilters() {
    const searchInput = document.getElementById('pubSearchInput');
    const filterCat = document.getElementById('filterPubCategory');
    const filterStat = document.getElementById('filterPubStatus');
    const sortPub = document.getElementById('sortPub');
    const btnReset = document.getElementById('btnResetPubFilter');
    const btnFeaturedOnly = document.getElementById('btnFilterFeaturedOnly');

    if (searchInput) searchInput.addEventListener('input', filterPublications);
    if (filterCat) filterCat.addEventListener('change', filterPublications);
    if (filterStat) filterStat.addEventListener('change', filterPublications);
    if (sortPub) sortPub.addEventListener('change', filterPublications);

    if (btnReset) {
      btnReset.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        if (filterCat) filterCat.value = 'all';
        if (filterStat) filterStat.value = 'all';
        if (sortPub) sortPub.value = 'newest';
        filterPublications();
        showToast('Filter publikasi direset.');
      });
    }

    if (btnFeaturedOnly) {
      btnFeaturedOnly.addEventListener('click', function () {
        if (filterStat) filterStat.value = 'featured';
        filterPublications();
        showToast('Menampilkan 6 Artikel Pilihan (Featured) Komunitas.');
      });
    }

    const checkAll = document.getElementById('checkAllPub');
    if (checkAll) {
      checkAll.addEventListener('change', function () {
        const checks = document.querySelectorAll('.pub-check-item');
        checks.forEach(c => { c.checked = checkAll.checked; });
      });
    }
  }

  // 4. Toggle Featured Status
  window.toggleFeaturedArticle = function (articleId) {
    const article = publicationsData.find(a => a.id === articleId);
    if (!article) return;

    if (article.status === 'featured') {
      article.status = 'published';
      article.statusLabel = 'Tayang Publik';
      showToast(`⭐ Artikel "${article.title}" diturunkan dari daftar pilihan utama.`);
    } else {
      article.status = 'featured';
      article.statusLabel = 'Featured ⭐';
      showToast(`🌟 Artikel "${article.title}" berhasil disematkan sebagai Artikel Pilihan Komunitas!`);
    }

    filterPublications();
  };

  // 5. Article Preview Modal
  window.openArticlePreview = function (articleId) {
    const article = publicationsData.find(a => a.id === articleId);
    if (!article) return;

    document.getElementById('previewArticleTitle').textContent = article.title;
    document.getElementById('previewAuthorName').textContent = `Oleh: ${article.author}`;
    document.getElementById('previewPublishedDate').textContent = `Diterbitkan: ${article.date}`;
    document.getElementById('previewSchoolRegion').textContent = `${article.school}, Kab. Tangerang`;

    const catBadge = document.getElementById('previewCategoryBadge');
    catBadge.className = `category-tag-pill ${article.categoryClass}`;
    catBadge.textContent = article.category;

    const featuredTag = document.getElementById('previewFeaturedTag');
    if (article.status === 'featured') {
      featuredTag.style.display = 'inline-block';
    } else {
      featuredTag.style.display = 'none';
    }

    const contentBox = document.getElementById('previewArticleContent');
    contentBox.innerHTML = `
      <p style="font-weight:600; font-size:1.1rem; color:#334155; line-height:1.7;">
        ${article.excerpt}
      </p>
      <p>
        Penerapan di lingkungan satuan pendidikan menunjukkan respons yang sangat positif dari para siswa dan pendidik lainnya. Kolaborasi antar-anggota komunitas literasi menjadi kunci keberhasilan dalam mendistribusikan praktik baik ini ke berbagai kecamatan lain di Kabupaten Tangerang.
      </p>
      <p>
        Melalui ekosistem KERTAS KATA, artikel ini telah dibaca sebanyak <strong>${article.views.toLocaleString('id-ID')} kali</strong> dan mendapatkan <strong>${article.likes} apresiasi suka</strong> dari rekan-rekan pendidik Komunitas.
      </p>
    `;

    const modal = document.getElementById('articlePreviewModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  // 6. Unpublish Article Moderation
  window.triggerUnpublishArticle = function (articleId) {
    const article = publicationsData.find(a => a.id === articleId);
    if (!article) return;

    currentActionArticle = article;

    if (article.status === 'unpublished') {
      // Re-publish directly
      article.status = 'published';
      article.statusLabel = 'Tayang Publik';
      filterPublications();
      showToast(`✓ Artikel "${article.title}" berhasil ditayangkan kembali.`);
      return;
    }

    const modal = document.getElementById('unpublishConfirmModal');
    if (modal) {
      document.getElementById('unpublishReasonInput').value = '';
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  function initUnpublishConfirm() {
    const btnConfirm = document.getElementById('btnConfirmUnpublish');
    if (btnConfirm) {
      btnConfirm.addEventListener('click', function () {
        if (!currentActionArticle) return;

        const reason = document.getElementById('unpublishReasonInput').value.trim() || 'Perbaikan data oleh kurator.';
        currentActionArticle.status = 'unpublished';
        currentActionArticle.statusLabel = 'Diturunkan';

        filterPublications();
        closeModal('unpublishConfirmModal');
        showToast(`⛔ Artikel berhasil diturunkan dari publikasi. Alasan: "${reason}"`);
      });
    }

    const btnExportReport = document.getElementById('btnExportPubReport');
    if (btnExportReport) {
      btnExportReport.addEventListener('click', function () {
        showToast('📥 Mengunduh laporan analitik keterlibatan 856 karya publikasi Komunitas format CSV...');
      });
    }
  }

  // 7. Mobile Drawer Navigation Toggle
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

  // 8. Modal & Toast Helpers
  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  };

  window.openPreviewModal = function (articleId) {
    window.openArticlePreview(articleId);
  };

  window.closePreviewModal = function () {
    window.closeModal('articlePreviewModal');
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.inline-review-modal-overlay.show');
      openModals.forEach(m => m.classList.remove('show'));
      document.body.style.overflow = '';
    }
  });

  function showToast(message) {
    let toast = document.getElementById('adminToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'adminToast';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.right = '24px';
      toast.style.background = '#0f172a';
      toast.style.color = '#ffffff';
      toast.style.padding = '0.875rem 1.25rem';
      toast.style.borderRadius = '12px';
      toast.style.fontSize = '0.8125rem';
      toast.style.fontWeight = '600';
      toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      toast.style.zIndex = '9999';
      toast.style.display = 'flex';
      toast.style.alignItems = 'center';
      toast.style.gap = '0.5rem';
      toast.style.transition = 'all 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>ℹ️</span> <span>${message}</span>`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 3800);
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    renderPublicationTable(publicationsData);
    initFilters();
    initUnpublishConfirm();
    initMobileDrawer();
  });

})();
