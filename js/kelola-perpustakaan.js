/**
 * KERTAS KATA - Kelola Perpustakaan (Digital Library & E-Book Management) Logic
 * Handles e-book catalogue listing, search, category & access filtering,
 * upload new e-book, reader preview simulator, edit metadata, and archive moderation.
 */

(function () {
  'use strict';

  // 1. Dataset 12 Koleksi E-Book Digital Komunitas KERTAS KATA
  // Mematuhi instruksi pengguna:
  // - Tanpa kata "Guru" -> diganti "Anggota"
  // - Tanpa nama sekolah -> diganti nama kecamatan atau organisasi asal
  // - Tanpa kata "Disdik" -> diganti "Komunitas"
  // - Tanpa kata "Peserta" -> diganti "Anggota"
  const ebooksData = [
    {
      id: 'eb-1',
      title: 'Antologi Praktik Baik Literasi Komunitas Kabupaten Tangerang 2026',
      author: 'Tim Kurasi Komunitas',
      authorOrg: 'Komunitas Literasi Tigaraksa',
      category: 'Pendidikan & Modul',
      categoryClass: 'pendidikan',
      isbn: '978-623-01-2026-1',
      access: 'free',
      accessLabel: 'Gratis (Public)',
      price: 0,
      downloads: 4820,
      rating: 4.9,
      fileFormat: 'PDF',
      fileSize: '14.2 MB',
      pages: 184,
      status: 'published',
      statusLabel: 'Aktif Tayang',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&auto=format&fit=crop&q=80',
      synopsis: 'Kumpulan dokumentasi praktik baik pembelajaran bermakna dan inovasi pengajaran yang ditulis oleh anggota komunitas literasi dari 28 kecamatan di Kabupaten Tangerang.',
      sampleChapter: `
        <h3>Bab 1: Menghidupkan Budaya Baca di Ruang Komunitas</h3>
        <p>Literasi bukan sekadar keterampilan mengeja huruf dan merangkai kata, melainkan gerbang pembuka wawasan berpikir kritis dan daya imajinasi manusia. Di tengah arus digitalisasi yang masif, peran ruang baca komunitas menjadi oase penumbuh minat baca bagi generasi muda.</p>
        <p>Melalui inisiatif KERTAS KATA di Kabupaten Tangerang, para penggerak literasi di tingkat kecamatan telah merintis pojok baca interaktif yang memadukan buku fisik dengan katalog perpustakaan digital mandiri.</p>
      `
    },
    {
      id: 'eb-2',
      title: 'Menelusuri Jejak Etnografi Tionghoa Benteng di Sepanjang Cisadane',
      author: 'Siti Aminah, M.Pd.',
      authorOrg: 'Kecamatan Teluknaga',
      category: 'Sejarah & Riset',
      categoryClass: 'sejarah',
      isbn: '978-623-01-2026-2',
      access: 'premium',
      accessLabel: 'Eksklusif (Rp 35.000)',
      price: 35000,
      downloads: 1420,
      rating: 4.8,
      fileFormat: 'PDF & EPUB',
      fileSize: '22.8 MB',
      pages: 240,
      status: 'published',
      statusLabel: 'Aktif Tayang',
      cover: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=120&auto=format&fit=crop&q=80',
      synopsis: 'Riset mendalam mengenai perbauran budaya, sejarah kuliner, arsitektur kelenteng kuno, dan dialek khas komunitas Benteng di pesisir utara Tangerang.',
      sampleChapter: `
        <h3>Bab 1: Riwayat Permukiman Tepi Sungai Cisadane</h3>
        <p>Aliran sungai Cisadane membentang tenang, menjadi saksi bisu denyut peradaban perniagaan sejak abad ke-15. Komunitas Tionghoa Benteng telah menempati kawasan ini selama berabad-abad, menjalin harmoni dengan tradisi masyarakat lokal Banten dan Sunda.</p>
        <p>Buku ini menguraikan artefak sejarah, arsip lisan, dan kekayaan folklor yang lestari hingga era modern.</p>
      `
    },
    {
      id: 'eb-3',
      title: 'Panduan Modul Belajar Berbasis Ekologi Mangrove Ketapang Mauk',
      author: 'Dewi Sartika, S.Pd.',
      authorOrg: 'Kecamatan Mauk',
      category: 'Pendidikan & Modul',
      categoryClass: 'pendidikan',
      isbn: '978-623-01-2026-3',
      access: 'free',
      accessLabel: 'Gratis (Public)',
      price: 0,
      downloads: 3650,
      rating: 4.7,
      fileFormat: 'PDF',
      fileSize: '18.5 MB',
      pages: 120,
      status: 'published',
      statusLabel: 'Aktif Tayang',
      cover: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=120&auto=format&fit=crop&q=80',
      synopsis: 'Buku ajar kontekstual yang mengintegrasikan ekosistem hutan bakau Ketapang Mauk ke dalam muatan sains, mitigasi bencana abrasi, dan kesadaran lingkungan.',
      sampleChapter: `
        <h3>Bab 1: Ekosistem Hutan Bakau sebagai Laboratorium Terbuka</h3>
        <p>Kawasan pesisir Mauk memiliki kekayaan biodiversitas bakau yang sangat strategis. Membawa anak didik ke alam terbuka memungkinkan mereka mengamati secara langsung simbiosis antara kepiting bakau, akar napas, dan gelombang pasang surut air laut.</p>
      `
    },
    {
      id: 'eb-4',
      title: 'Lentera Pesisir Kronjo: Kumpulan Cerpen Sastra Bahari',
      author: 'Nurul Fajriah, S.S.',
      authorOrg: 'Komunitas Sastra Sukamulya',
      category: 'Sastra & Antologi',
      categoryClass: 'sastra',
      isbn: '978-623-01-2026-4',
      access: 'premium',
      accessLabel: 'Eksklusif (Rp 25.000)',
      price: 25000,
      downloads: 2180,
      rating: 4.9,
      fileFormat: 'EPUB',
      fileSize: '8.4 MB',
      pages: 160,
      status: 'published',
      statusLabel: 'Aktif Tayang',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&auto=format&fit=crop&q=80',
      synopsis: 'Antologi cerita pendek bertema kearifan lokal pesisir utara Banten, melukiskan ketangguhan nelayan tradisional, hembusan angin laut, dan harapan keluarga pesisir.',
      sampleChapter: `
        <h3>Cerpen 1: Menunggu Fajar di Ujung Dermaga</h3>
        <p>Bau anyir garam dan solar bercampur menjadi aroma yang karib di hidung Bahar. Kapal-kapal kayu tertambat berderit pelan diterpa ombak dini hari. Dari kejauhan, mercusuar Kronjo berkedip ritmis, membimbing pulang mereka yang berlayar menjemput nafkah.</p>
      `
    },
    {
      id: 'eb-5',
      title: 'Dasar Pemrograman Blok untuk Literasi Digital Anak Pesisir',
      author: 'Ahmad Fauzi, S.Pd.I',
      authorOrg: 'Kecamatan Kronjo',
      category: 'Pendidikan & Modul',
      categoryClass: 'pendidikan',
      isbn: '978-623-01-2026-5',
      access: 'free',
      accessLabel: 'Gratis (Public)',
      price: 0,
      downloads: 5120,
      rating: 4.9,
      fileFormat: 'PDF',
      fileSize: '16.1 MB',
      pages: 96,
      status: 'published',
      statusLabel: 'Aktif Tayang',
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
      synopsis: 'Panduan visual pengenalan logika pemrograman komputer dasar tanpa perlu koneksi internet berkecepatan tinggi, cocok untuk sanggar belajar anak.',
      sampleChapter: `
        <h3>Bab 1: Logika Pemrograman Berbasis Blok Warna</h3>
        <p>Coding bukan sekadar menghafal sintaks bahasa mesin yang rumit. Inti dari pemrograman adalah kemampuan memecahkan masalah besar menjadi langkah-langkah kecil yang logis dan teratur.</p>
      `
    },
    {
      id: 'eb-6',
      title: 'Katalog Warisan Kuliner Tradisional Kabupaten Tangerang',
      author: 'Bambang Supriyadi, S.Pd.',
      authorOrg: 'Komunitas Literasi Balaraja',
      category: 'Seni & Budaya',
      categoryClass: 'seni',
      isbn: '978-623-01-2026-6',
      access: 'premium',
      accessLabel: 'Eksklusif (Rp 30.000)',
      price: 30000,
      downloads: 1890,
      rating: 4.8,
      fileFormat: 'PDF',
      fileSize: '32.4 MB',
      pages: 176,
      status: 'published',
      statusLabel: 'Aktif Tayang',
      cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&auto=format&fit=crop&q=80',
      synopsis: 'Eksplorasi kuliner autentik Kabupaten Tangerang dari laksa khas Tangerang, pindang bandeng kronjo, hingga ketan bintul yang sarat filosofi sejarah.',
      sampleChapter: `
        <h3>Bab 1: Filosofi Rasa Laksa Tangerang</h3>
        <p>Kuah kental berwarna kuning keemasan mengepul harum, berasal dari perpaduan santan kelapa, parutan kelapa sangrai, dan rempah kunyit lokal. Disajikan bersama bihun tepung beras putih dan suwiran ayam kampung empuk.</p>
      `
    },
    {
      id: 'eb-7',
      title: 'Jurnalistik Komunitas: Panduan Menulis Opini dan Liputan Warga',
      author: 'Dian Permana, S.Sos.',
      authorOrg: 'Komunitas Penulis Cikupa',
      category: 'Jurnalistik & Opini',
      categoryClass: 'jurnalistik',
      isbn: '978-623-01-2026-7',
      access: 'free',
      accessLabel: 'Gratis (Public)',
      price: 0,
      downloads: 4100,
      rating: 4.7,
      fileFormat: 'PDF',
      fileSize: '11.8 MB',
      pages: 112,
      status: 'published',
      statusLabel: 'Aktif Tayang',
      cover: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=120&auto=format&fit=crop&q=80',
      synopsis: 'Teknik dasar peliputan berita warga, verifikasi fakta anti-hoaks, kode etik jurnalisme warga, dan cara mengirimkan opini tajam ke media digital.',
      sampleChapter: `
        <h3>Bab 1: Menemukan Sudut Pandang di Sekitar Kita</h3>
        <p>Setiap gang, pasar rakyat, dan balai warga menyimpan kisah yang layak diberitakan. Kunci utama jurnalisme warga adalah kepekaan menangkap dampak peristiwa terhadap kehidupan masyarakat kecil.</p>
      `
    },
    {
      id: 'eb-8',
      title: 'Melukis Langit Cisoka: Kumpulan Puisi Kidung Telaga Biru',
      author: 'Indah Kusuma, M.Pd.',
      authorOrg: 'Kecamatan Cisoka',
      category: 'Sastra & Antologi',
      categoryClass: 'sastra',
      isbn: '978-623-01-2026-8',
      access: 'premium',
      accessLabel: 'Eksklusif (Rp 20.000)',
      price: 20000,
      downloads: 1650,
      rating: 4.9,
      fileFormat: 'EPUB',
      fileSize: '6.2 MB',
      pages: 88,
      status: 'published',
      statusLabel: 'Aktif Tayang',
      cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=120&auto=format&fit=crop&q=80',
      synopsis: 'Buku antologi puisi liris bertema kedamaian danau bekas galian kapur Cisoka yang bertransformasi menjadi telaga biru nan memikat.',
      sampleChapter: `
        <h3>Kidung Telaga Biru</h3>
        <p>Air tenang memantulkan Mega sore,<br>
        Batu kapur berdiri bisu menjaga rahasia bukit,<br>
        Di sini waktu mengalir luruh bagai gerimis,<br>
        Menghapus riuh jalan raya yang jauh di seberang.</p>
      `
    },
    {
      id: 'eb-9',
      title: 'Panduan Praktis Menulis Karya Tulis Ilmiah Populer untuk Anggota',
      author: 'Rahmat Hidayat, S.Pd.',
      authorOrg: 'Kecamatan Curug',
      category: 'Pendidikan & Modul',
      categoryClass: 'pendidikan',
      isbn: '978-623-01-2026-9',
      access: 'free',
      accessLabel: 'Gratis (Public)',
      price: 0,
      downloads: 6240,
      rating: 5.0,
      fileFormat: 'PDF',
      fileSize: '15.4 MB',
      pages: 144,
      status: 'published',
      statusLabel: 'Aktif Tayang',
      cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=120&auto=format&fit=crop&q=80',
      synopsis: 'Buku pegangan anggota komunitas dalam menyusun artikel opini ilmiah populer, mengubah laporan penelitian teknis menjadi bacaan yang mudah dicerna publik.',
      sampleChapter: `
        <h3>Bab 1: Menjembatani Sains dengan Publik</h3>
        <p>Banyak gagasan cemerlang terkubur di lemari dokumen karena ditulis dengan bahasa yang terlalu kaku dan penuh jargon teknis. Menulis populer adalah seni menerjemahkan kebenaran ilmiah menjadi obrolan hangat di beranda rumah.</p>
      `
    },
    {
      id: 'eb-10',
      title: 'Dokumentasi Motif Batik Khas Tangerang Gemilang',
      author: 'Hj. Ratna Wulandari, S.Sn.',
      authorOrg: 'Komunitas Seni Kriya Tigaraksa',
      category: 'Seni & Budaya',
      categoryClass: 'seni',
      isbn: '978-623-01-2026-10',
      access: 'premium',
      accessLabel: 'Eksklusif (Rp 40.000)',
      price: 40000,
      downloads: 980,
      rating: 4.8,
      fileFormat: 'PDF',
      fileSize: '28.9 MB',
      pages: 156,
      status: 'published',
      statusLabel: 'Aktif Tayang',
      cover: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=120&auto=format&fit=crop&q=80',
      synopsis: 'Katalog visual filosofi dan ragam hias motif batik khas Kabupaten Tangerang seperti motif perahu kano pesisir, kacang tanah, dan tugu kramat.',
      sampleChapter: `
        <h3>Bab 1: Filosofi Ragam Hias Perahu Pesisir</h3>
        <p>Garis lengkung yang tegas merepresentasikan haluan perahu nelayan tradisional yang membelah ombak Laut Jawa. Warna biru indigo melambangkan kedalaman kesabaran dan harapan hasil laut yang melimpah.</p>
      `
    },
    {
      id: 'eb-11',
      title: 'Statistik Perkembangan Gerakan Literasi Komunitas 2024-2026',
      author: 'Tim Riset Data KERTAS KATA',
      authorOrg: 'Sekretariat Komunitas Pusat',
      category: 'Sejarah & Riset',
      categoryClass: 'sejarah',
      isbn: '978-623-01-2026-11',
      access: 'free',
      accessLabel: 'Gratis (Public)',
      price: 0,
      downloads: 2450,
      rating: 4.6,
      fileFormat: 'PDF',
      fileSize: '9.5 MB',
      pages: 82,
      status: 'published',
      statusLabel: 'Aktif Tayang',
      cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
      synopsis: 'Laporan komprehensif data pertumbuhan pembaca aktif, sebaran 28 kecamatan, dan produktivitas penulisan karya anggota platform KERTAS KATA.',
      sampleChapter: `
        <h3>Bab 1: Pemetaan Ekosistem Membaca Komunitas</h3>
        <p>Data menunjukkan lonjakan partisipasi anggota sebesar 340% sejak modul e-learning 32 JP dan portal antologi digital diluncurkan di wilayah kabupaten.</p>
      `
    },
    {
      id: 'eb-12',
      title: 'Bunga Rampai Pantun dan Pepatah Daerah Tangerang',
      author: 'K.H. Masduki, M.A.',
      authorOrg: 'Lembaga Kebudayaan Kronjo',
      category: 'Seni & Budaya',
      categoryClass: 'seni',
      isbn: '978-623-01-2026-12',
      access: 'free',
      accessLabel: 'Gratis (Public)',
      price: 0,
      downloads: 3210,
      rating: 4.9,
      fileFormat: 'PDF',
      fileSize: '7.8 MB',
      pages: 104,
      status: 'published',
      statusLabel: 'Aktif Tayang',
      cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=120&auto=format&fit=crop&q=80',
      synopsis: 'Kumpulan tradisi lisan pantun palang pintu, nasihat orang tua, dan petuah bijak dalam dialek Melayu Betawi dan Sunda Banten pesisir.',
      sampleChapter: `
        <h3>Bab 1: Pantun Palang Pintu Pernikahan</h3>
        <p>Pohon kelapa tumbuh berjajar,<br>
        Bawa ketan di dalam bakul.<br>
        Kami datang dengan niat belajar,<br>
        Menjunjung adat yang tak boleh pudar.</p>
      `
    }
  ];

  let currentEbooksList = [...ebooksData];
  let currentReaderFontSize = 1.05;

  // 2. Render E-Book Table
  function renderEbooksTable(items) {
    const tbody = document.getElementById('ebooksTableBody');
    const countEl = document.getElementById('filteredEbooksCount');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (countEl) countEl.textContent = items.length;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            Tidak ditemukan e-book dengan kriteria pencarian tersebut.
          </td>
        </tr>
      `;
      return;
    }

    items.forEach(book => {
      const tr = document.createElement('tr');
      tr.id = `book-row-${book.id}`;

      let accessBadge = '';
      if (book.access === 'free') {
        accessBadge = `<span class="badge-access-type free">🎁 Gratis</span>`;
      } else {
        accessBadge = `<span class="badge-access-type premium">⭐ Rp ${book.price.toLocaleString('id-ID')}</span>`;
      }

      let statusBadge = '';
      if (book.status === 'published') {
        statusBadge = `<span class="badge-pub-status published">Aktif</span>`;
      } else if (book.status === 'draft') {
        statusBadge = `<span class="badge-pub-status draft">Draf</span>`;
      } else {
        statusBadge = `<span class="badge-pub-status archived">Arsip</span>`;
      }

      tr.innerHTML = `
        <td><input type="checkbox" class="book-check-item" data-id="${book.id}" aria-label="Pilih ${book.title}"></td>
        <td>
          <div class="ebook-item-cell">
            <img src="${book.cover}" alt="Sampul" class="ebook-cover-thumb">
            <div class="ebook-info-wrap">
              <div class="ebook-title-text">${book.title}</div>
              <div class="ebook-isbn-badge">ISBN: ${book.isbn}</div>
            </div>
          </div>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.8125rem;">${book.author}</div>
          <span style="font-size: 0.6875rem; color: var(--text-muted);">${book.authorOrg}</span>
        </td>
        <td>
          <span class="category-tag-pill ${book.categoryClass}">${book.category}</span>
          <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 0.2rem;">${book.fileFormat} • ${book.fileSize}</div>
        </td>
        <td>
          ${accessBadge}
        </td>
        <td>
          <div style="font-size: 0.8125rem; font-weight: 700; color: var(--text-main);">
            📥 ${book.downloads.toLocaleString('id-ID')}
          </div>
          <div style="font-size: 0.6875rem; color: #f59e0b; font-weight: 600;">
            ★ ${book.rating} (${book.pages} Hlm)
          </div>
        </td>
        <td>
          ${statusBadge}
        </td>
        <td style="text-align: right;">
          <div class="action-btns-group" style="display: inline-flex; gap: 0.35rem;">
            <button type="button" class="btn-icon-action" title="Pratinjau Simulator Pembaca" onclick="openEbookReaderModal('${book.id}')">
              👁️
            </button>
            <button type="button" class="btn-icon-action" title="Edit Metadata E-Book" onclick="openEbookEditModal('${book.id}')">
              ✏️
            </button>
            <button type="button" class="btn-icon-action" title="${book.status === 'archived' ? 'Aktifkan Kembali' : 'Arsipkan E-Book'}" onclick="triggerArchiveEbook('${book.id}')" style="color: ${book.status === 'archived' ? '#059669' : '#dc2626'};">
              ${book.status === 'archived' ? '✓' : '📦'}
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  // 3. Filter Logic
  function filterEbooks() {
    const searchVal = (document.getElementById('libSearchInput').value || '').toLowerCase().trim();
    const accessVal = document.getElementById('filterLibAccess').value;
    const catVal = document.getElementById('filterLibCategory').value;
    const sortVal = document.getElementById('sortLib').value;

    currentEbooksList = ebooksData.filter(book => {
      // Search
      const matchesSearch = !searchVal ||
        book.title.toLowerCase().includes(searchVal) ||
        book.author.toLowerCase().includes(searchVal) ||
        book.isbn.toLowerCase().includes(searchVal) ||
        book.authorOrg.toLowerCase().includes(searchVal);

      // Access
      const matchesAccess = (accessVal === 'all') || (book.access === accessVal);

      // Category
      const matchesCat = (catVal === 'all') || (book.category === catVal);

      return matchesSearch && matchesAccess && matchesCat;
    });

    // Sort
    if (sortVal === 'downloads') {
      currentEbooksList.sort((a, b) => b.downloads - a.downloads);
    } else if (sortVal === 'rating') {
      currentEbooksList.sort((a, b) => b.rating - a.rating);
    } else if (sortVal === 'title') {
      currentEbooksList.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Newest
      currentEbooksList.sort((a, b) => b.id.localeCompare(a.id));
    }

    renderEbooksTable(currentEbooksList);
  }

  function initFilters() {
    const searchInput = document.getElementById('libSearchInput');
    const filterAccess = document.getElementById('filterLibAccess');
    const filterCat = document.getElementById('filterLibCategory');
    const sortLib = document.getElementById('sortLib');
    const btnReset = document.getElementById('btnResetLibFilter');
    const checkAll = document.getElementById('checkAllEbooks');

    if (searchInput) searchInput.addEventListener('input', filterEbooks);
    if (filterAccess) filterAccess.addEventListener('change', filterEbooks);
    if (filterCat) filterCat.addEventListener('change', filterEbooks);
    if (sortLib) sortLib.addEventListener('change', filterEbooks);

    if (btnReset) {
      btnReset.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        if (filterAccess) filterAccess.value = 'all';
        if (filterCat) filterCat.value = 'all';
        if (sortLib) sortLib.value = 'downloads';
        filterEbooks();
        showToast('Filter katalog e-book berhasil direset.');
      });
    }

    if (checkAll) {
      checkAll.addEventListener('change', function () {
        const checks = document.querySelectorAll('.book-check-item');
        checks.forEach(c => { c.checked = checkAll.checked; });
      });
    }

    const btnExport = document.getElementById('btnExportLibReport');
    if (btnExport) {
      btnExport.addEventListener('click', function () {
        showToast('📥 Mengunduh Laporan Distribusi & Royalti E-Book Komunitas (format .xlsx)...');
      });
    }
  }

  // 4. Modal Handlers
  window.openEbookUploadModal = function () {
    const modal = document.getElementById('ebookUploadModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeEbookUploadModal = function () {
    window.closeModal('ebookUploadModal');
  };

  window.openEbookReaderModal = function (bookId) {
    const book = ebooksData.find(b => b.id === bookId);
    if (!book) return;

    document.getElementById('readerBookTitle').textContent = book.title;
    document.getElementById('readerBookAuthor').textContent = `Karya: ${book.author} (${book.authorOrg})`;
    document.getElementById('readerContentBody').innerHTML = book.sampleChapter;

    const modal = document.getElementById('ebookReaderModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeEbookReaderModal = function () {
    window.closeModal('ebookReaderModal');
  };

  window.openEbookEditModal = function (bookId) {
    const book = ebooksData.find(b => b.id === bookId);
    if (!book) return;

    document.getElementById('editEbookId').value = book.id;
    document.getElementById('editEbookTitle').value = book.title;
    document.getElementById('editEbookAuthor').value = book.author;
    document.getElementById('editEbookOrg').value = book.authorOrg;
    document.getElementById('editEbookCategory').value = book.category;
    document.getElementById('editEbookIsbn').value = book.isbn;
    document.getElementById('editEbookAccess').value = book.access;
    document.getElementById('editEbookPrice').value = book.price;
    document.getElementById('editEbookSynopsis').value = book.synopsis;

    const modal = document.getElementById('ebookEditModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeEbookEditModal = function () {
    window.closeModal('ebookEditModal');
  };

  window.triggerArchiveEbook = function (bookId) {
    const book = ebooksData.find(b => b.id === bookId);
    if (!book) return;

    if (book.status === 'archived') {
      book.status = 'published';
      book.statusLabel = 'Aktif Tayang';
      showToast(`✓ E-Book "${book.title}" berhasil diaktifkan kembali ke katalog perpustakaan.`);
    } else {
      book.status = 'archived';
      book.statusLabel = 'Diarsipkan';
      showToast(`📦 E-Book "${book.title}" telah dipindahkan ke daftar arsip.`);
    }

    filterEbooks();
  };

  // 5. Reader Controls (Font Size & Themes)
  function initReaderControls() {
    const btnDec = document.getElementById('btnReaderFontDec');
    const btnInc = document.getElementById('btnReaderFontInc');
    const content = document.getElementById('readerContentBody');
    const container = document.getElementById('readerModalContainer');

    if (btnDec && content) {
      btnDec.addEventListener('click', function () {
        if (currentReaderFontSize > 0.85) {
          currentReaderFontSize -= 0.1;
          content.style.fontSize = `${currentReaderFontSize}rem`;
        }
      });
    }

    if (btnInc && content) {
      btnInc.addEventListener('click', function () {
        if (currentReaderFontSize < 1.45) {
          currentReaderFontSize += 0.1;
          content.style.fontSize = `${currentReaderFontSize}rem`;
        }
      });
    }

    // Theme switchers
    const themeLight = document.getElementById('themeLightBtn');
    const themeSepia = document.getElementById('themeSepiaBtn');
    const themeDark = document.getElementById('themeDarkBtn');

    if (themeLight && container) {
      themeLight.addEventListener('click', function () {
        container.className = 'reader-modal-container';
        setActiveThemeBtn(themeLight);
      });
    }

    if (themeSepia && container) {
      themeSepia.addEventListener('click', function () {
        container.className = 'reader-modal-container reader-theme-sepia';
        setActiveThemeBtn(themeSepia);
      });
    }

    if (themeDark && container) {
      themeDark.addEventListener('click', function () {
        container.className = 'reader-modal-container reader-theme-dark';
        setActiveThemeBtn(themeDark);
      });
    }

    function setActiveThemeBtn(activeBtn) {
      [themeLight, themeSepia, themeDark].forEach(b => {
        if (b) b.classList.remove('active');
      });
      activeBtn.classList.add('active');
    }
  }

  // 6. Form Submissions
  function initForms() {
    const uploadForm = document.getElementById('formUploadEbook');
    if (uploadForm) {
      uploadForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('uploadTitle').value.trim();
        const author = document.getElementById('uploadAuthor').value.trim();
        const authorOrg = document.getElementById('uploadOrg').value.trim();
        const category = document.getElementById('uploadCategory').value;
        const isbn = document.getElementById('uploadIsbn').value.trim() || '978-623-01-2026-X';
        const access = document.getElementById('uploadAccess').value;
        const price = access === 'premium' ? parseInt(document.getElementById('uploadPrice').value) || 25000 : 0;
        const synopsis = document.getElementById('uploadSynopsis').value.trim();

        if (!title || !author || !authorOrg) {
          alert('Mohon lengkapi judul e-book, nama penulis, dan kecamatan/organisasi asal.');
          return;
        }

        const newBook = {
          id: `eb-${ebooksData.length + 1}`,
          title,
          author,
          authorOrg,
          category,
          categoryClass: category.toLowerCase().split(' ')[0],
          isbn,
          access,
          accessLabel: access === 'free' ? 'Gratis (Public)' : `Eksklusif (Rp ${price.toLocaleString('id-ID')})`,
          price,
          downloads: 0,
          rating: 5.0,
          fileFormat: 'PDF',
          fileSize: '12.0 MB',
          pages: 100,
          status: 'published',
          statusLabel: 'Aktif Tayang',
          cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=120&auto=format&fit=crop&q=80',
          synopsis,
          sampleChapter: `<h3>Bab 1: Pendahuluan</h3><p>${synopsis}</p>`
        };

        ebooksData.unshift(newBook);
        filterEbooks();
        window.closeModal('ebookUploadModal');
        uploadForm.reset();
        showToast(`🎉 E-Book "${title}" berhasil diunggah dan terbit di perpustakaan digital.`);
      });
    }

    const editForm = document.getElementById('formEditEbook');
    if (editForm) {
      editForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = document.getElementById('editEbookId').value;
        const book = ebooksData.find(b => b.id === id);
        if (book) {
          book.title = document.getElementById('editEbookTitle').value.trim();
          book.author = document.getElementById('editEbookAuthor').value.trim();
          book.authorOrg = document.getElementById('editEbookOrg').value.trim();
          book.category = document.getElementById('editEbookCategory').value;
          book.isbn = document.getElementById('editEbookIsbn').value.trim();
          book.access = document.getElementById('editEbookAccess').value;
          book.price = book.access === 'premium' ? parseInt(document.getElementById('editEbookPrice').value) || 25000 : 0;
          book.accessLabel = book.access === 'free' ? 'Gratis (Public)' : `Eksklusif (Rp ${book.price.toLocaleString('id-ID')})`;
          book.synopsis = document.getElementById('editEbookSynopsis').value.trim();

          filterEbooks();
          window.closeModal('ebookEditModal');
          showToast(`✓ Metadata e-book "${book.title}" berhasil diperbarui.`);
        }
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
    renderEbooksTable(ebooksData);
    initFilters();
    initReaderControls();
    initForms();
    initMobileDrawer();
  });

})();
