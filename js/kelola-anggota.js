/**
 * KERTAS KATA - Kelola Anggota (Member Directory Management) Logic
 * Handles real-time search, multi-criteria filtering, member profile modal,
 * add member form, reset password, suspend/activate account, and CSV export.
 */

(function () {
  'use strict';

  // 1. Dataset Anggota Komunitas & Penulis (12 Anggota Mewakili Wilayah Kab. Tangerang)
  const membersData = [
    {
      id: 'KK-TNG-2026-0042',
      name: 'Rahmat Hidayat, S.Pd.',
      initials: 'RH',
      nip: '19880412 201101 1 002',
      email: 'rahmat.hidayat@anggota.belajar.id',
      school: 'Komunitas Literasi Curug',
      kecamatan: 'Curug',
      subject: 'Bahasa Indonesia & Literasi Digital',
      role: 'Anggota Komunitas',
      status: 'active',
      statusLabel: 'Aktif',
      joinDate: '12 Agustus 2026',
      progressPercent: 100,
      progressLabel: 'Modul 5 (Lulus 32 JP)',
      publishedWorks: [
        { title: 'Strategi Diferensiasi Pembelajaran Digital Berbasis Portofolio Anggota di Curug', category: 'Best Practice', date: '06 Sep 2026' },
        { title: 'Menelusuri Jejak Sejarah Benteng di Tangerang', category: 'Artikel Sejarah', date: '28 Agu 2026' },
        { title: 'Antologi Literasi Penggerak Komunitas (Bab 3: Asesmen Bermakna)', category: 'Bunga Rampai', date: '15 Agu 2026' }
      ],
      bio: 'Pendidik Bahasa Indonesia di Komunitas Literasi Curug, aktif menginisiasi pojok literasi digital dan mendampingi anggota dalam program penerbitan karya antologi cerpen tingkat kabupaten.'
    },
    {
      id: 'KK-TNG-2026-0089',
      name: 'Siti Aminah, M.Pd.',
      initials: 'SA',
      nip: '19850215 200902 2 004',
      email: 'siti.aminah@anggota.belajar.id',
      school: 'Forum Literasi Teluknaga',
      kecamatan: 'Teluknaga',
      subject: 'Ilmu Pengetahuan Sosial (IPS)',
      role: 'Anggota Komunitas',
      status: 'active',
      statusLabel: 'Aktif',
      joinDate: '14 Agustus 2026',
      progressPercent: 80,
      progressLabel: 'Modul 4 (80%)',
      publishedWorks: [
        { title: 'Kajian Historis Komunitas Tionghoa Benteng di Sepanjang Aliran Sungai Cisadane', category: 'Artikel Ilmiah Sejarah', date: '06 Sep 2026' },
        { title: 'Menghidupkan Tradisi Pehcun dalam Kurikulum Muatan Lokal', category: 'Esai Budaya', date: '20 Agu 2026' }
      ],
      bio: 'Pendidik IPS yang berfokus pada riset budaya lokal pesisir Tangerang dan pelestarian cagar budaya komunitas Benteng.'
    },
    {
      id: 'KK-TNG-2026-0112',
      name: 'Dewi Sartika, S.Pd.SD',
      initials: 'DS',
      nip: '19920824 201803 2 001',
      email: 'dewi.sartika@anggota.belajar.id',
      school: 'Komunitas Literasi Mauk',
      kecamatan: 'Mauk',
      subject: 'Fasilitator Kelas / IPAS',
      role: 'Anggota Komunitas',
      status: 'active',
      statusLabel: 'Aktif',
      joinDate: '18 Agustus 2026',
      progressPercent: 100,
      progressLabel: 'Modul 5 (Lulus 32 JP)',
      publishedWorks: [
        { title: 'Pengembangan Modul Ajar IPAS Berbasis Kearifan Lokal Hutan Mangrove Ketapang', category: 'Modul Ajar', date: '05 Sep 2026' },
        { title: 'Optimalisasi Pojok Baca Komunitas dalam Penguatan Literasi Awal di Kawasan Pesisir', category: 'Best Practice', date: '01 Sep 2026' }
      ],
      bio: 'Penggerak literasi dasar di kawasan pesisir utara Tangerang dengan dedikasi pada pelestarian ekosistem mangrove melalui media ajar komik literasi.'
    },
    {
      id: 'KK-TNG-2026-0156',
      name: 'Ahmad Fauzi, S.Pd.I',
      initials: 'AF',
      nip: '19900310 201402 1 003',
      email: 'ahmad.fauzi@anggota.belajar.id',
      school: 'Pegiat Pustaka Kronjo',
      kecamatan: 'Kronjo',
      subject: 'Pendidikan Agama & IT',
      role: 'Anggota Komunitas',
      status: 'pending',
      statusLabel: 'Menunggu Verifikasi',
      joinDate: '01 September 2026',
      progressPercent: 40,
      progressLabel: 'Modul 2 (40%)',
      publishedWorks: [
        { title: 'Optimalisasi Ruang Belajar Digital untuk Literasi Coding Generasi Muda Pesisir', category: 'Opini Pendidikan', date: '05 Sep 2026' }
      ],
      bio: 'Pendidik yang memadukan pendidikan budi pekerti dengan literasi pemrograman visual bagi pemuda di pesisir Kronjo.'
    },
    {
      id: 'KK-TNG-2026-0201',
      name: 'Nurul Fajriah, S.S.',
      initials: 'NF',
      nip: '19931105 202012 2 008',
      email: 'nurul.fajriah@anggota.belajar.id',
      school: 'Forum Literasi Sukamulya',
      kecamatan: 'Sukamulya',
      subject: 'Sastra & Bahasa Inggris',
      role: 'Anggota Komunitas',
      status: 'active',
      statusLabel: 'Aktif',
      joinDate: '22 Agustus 2026',
      progressPercent: 60,
      progressLabel: 'Modul 3 (60%)',
      publishedWorks: [
        { title: 'Lentera Pesisir Kronjo: Narasi Perjuangan dan Ketangguhan Nelayan Tradisional', category: 'Cerpen Sastra', date: '04 Sep 2026' }
      ],
      bio: 'Penulis fiksi dan cerpen edukatif yang aktif membimbing klub jurnalisme muda di Sukamulya.'
    },
    {
      id: 'KK-TNG-2026-0245',
      name: 'Budi Santoso, M.Pd.',
      initials: 'BS',
      nip: '19810719 200604 1 005',
      email: 'budi.santoso@anggota.belajar.id',
      school: 'Komunitas Penulis Tigaraksa',
      kecamatan: 'Tigaraksa',
      subject: 'Ilmu Pengetahuan Alam (IPA)',
      role: 'Mentor Kurator',
      status: 'active',
      statusLabel: 'Aktif',
      joinDate: '10 Agustus 2026',
      progressPercent: 100,
      progressLabel: 'Modul 5 (Lulus 32 JP)',
      publishedWorks: [
        { title: 'Efektivitas Gamifikasi Kuis Interaktif dalam Meningkatkan Keterlibatan Belajar IPA', category: 'Inovasi Pembelajaran', date: '04 Sep 2026' },
        { title: 'Buku Pegangan Anggota: Sains Populer untuk Generasi Z', category: 'Buku Ber-ISBN', date: '19 Agu 2026' }
      ],
      bio: 'Pendidik senior dan kurator sains di Kabupaten Tangerang dengan pengalaman lebih dari 18 tahun dalam inovasi media ajar interaktif.'
    },
    {
      id: 'KK-TNG-2026-0298',
      name: 'Ratna Dewi, S.Pd.',
      initials: 'RD',
      nip: '19950516 202203 2 009',
      email: 'ratna.dewi@anggota.belajar.id',
      school: 'Komunitas Baca Cisoka',
      kecamatan: 'Cisoka',
      subject: 'Tematik & Lingkungan Hidup',
      role: 'Anggota Komunitas',
      status: 'active',
      statusLabel: 'Aktif',
      joinDate: '25 Agustus 2026',
      progressPercent: 60,
      progressLabel: 'Modul 3 (60%)',
      publishedWorks: [
        { title: 'Penerapan Model Problem Based Learning pada Materi Konservasi Alam Pedesaan', category: 'Artikel Ilmiah', date: '03 Sep 2026' }
      ],
      bio: 'Pendidik muda bersemangat tinggi yang mengembangkan pembelajaran sains berbasis eksplorasi lingkungan danau alami Cisoka.'
    },
    {
      id: 'KK-TNG-2026-0334',
      name: 'Hendra Gunawan, S.E.',
      initials: 'HG',
      nip: '19870912 201201 1 001',
      email: 'hendra.gunawan@anggota.belajar.id',
      school: 'Pegiat Literasi Cikupa',
      kecamatan: 'Cikupa',
      subject: 'Ekonomi & Kewirausahaan',
      role: 'Anggota Komunitas',
      status: 'active',
      statusLabel: 'Aktif',
      joinDate: '15 Agustus 2026',
      progressPercent: 100,
      progressLabel: 'Modul 5 (Lulus 32 JP)',
      publishedWorks: [
        { title: 'Implementasi Literasi Finansial Sejak Dini Melalui Pengelolaan Koperasi Pelajar', category: 'Best Practice', date: '03 Sep 2026' }
      ],
      bio: 'Inovator program literasi keuangan yang berhasil mendirikan 12 unit koperasi binaan di kawasan Cikupa.'
    },
    {
      id: 'KK-TNG-2026-0389',
      name: 'Sri Wahyuni, S.Pd.',
      initials: 'SW',
      nip: '19910607 201602 2 002',
      email: 'sri.wahyuni@anggota.belajar.id',
      school: 'Komunitas Tenun & Literasi Kresek',
      kecamatan: 'Kresek',
      subject: 'Seni Budaya & Prakarya',
      role: 'Anggota Komunitas',
      status: 'pending',
      statusLabel: 'Menunggu Verifikasi',
      joinDate: '02 September 2026',
      progressPercent: 20,
      progressLabel: 'Modul 1 (20%)',
      publishedWorks: [
        { title: 'Menggali Khazanah Tenun Tradisional Kresek Melalui Karya Tulis Feature', category: 'Esai Budaya', date: '02 Sep 2026' }
      ],
      bio: 'Pendidik seni budaya yang aktif mendokumentasikan kerajinan tenun tradisional dan kearifan lokal pedesaan Tangerang barat.'
    },
    {
      id: 'KK-TNG-2026-0412',
      name: 'Agus Supriyadi, S.Pd.',
      initials: 'AS',
      nip: '19860101 201001 1 004',
      email: 'agus.supriyadi@anggota.belajar.id',
      school: 'Pojok Literasi Solear',
      kecamatan: 'Solear',
      subject: 'Bimbingan Konseling & Literasi',
      role: 'Anggota Komunitas',
      status: 'suspended',
      statusLabel: 'Ditangguhkan',
      joinDate: '11 Agustus 2026',
      progressPercent: 40,
      progressLabel: 'Modul 2 (40%)',
      publishedWorks: [
        { title: 'Transformasi Ruang Pojok Literasi Ramah Anggota di Kawasan Solear', category: 'Opini Pendidikan', date: '02 Sep 2026' }
      ],
      bio: 'Akun dalam proses audit kurator terkait dugaan duplikasi submisi naskah cetak tanpa izin penerbitan resmi.'
    },
    {
      id: 'KK-TNG-2026-0450',
      name: 'Maya Anggraeni, S.Pd.',
      initials: 'MA',
      nip: '19940428 201903 2 005',
      email: 'maya.anggraeni@anggota.belajar.id',
      school: 'Komunitas Sastra Cisauk',
      kecamatan: 'Cisauk',
      subject: 'Bahasa Indonesia',
      role: 'Anggota Komunitas',
      status: 'active',
      statusLabel: 'Aktif',
      joinDate: '20 Agustus 2026',
      progressPercent: 80,
      progressLabel: 'Modul 4 (80%)',
      publishedWorks: [
        { title: 'Kumpulan Sajak Pesisir: Denyut Kehidupan dan Harapan Nelayan Tanjung Pasir', category: 'Puisi Sastra', date: '01 Sep 2026' }
      ],
      bio: 'Penyair dan pembina komunitas teater, memenangkan penghargaan cipta puisi anggota tingkat provinsi tahun 2025.'
    },
    {
      id: 'KK-TNG-2026-0495',
      name: 'Wahyu Hidayat, M.Pd.',
      initials: 'WH',
      nip: '19830514 200801 1 003',
      email: 'wahyu.hidayat@anggota.belajar.id',
      school: 'Forum Literasi Pasar Kemis',
      kecamatan: 'Pasar Kemis',
      subject: 'PPKn & Kepemimpinan',
      role: 'Anggota Komunitas',
      status: 'active',
      statusLabel: 'Aktif',
      joinDate: '16 Agustus 2026',
      progressPercent: 100,
      progressLabel: 'Modul 5 (Lulus 32 JP)',
      publishedWorks: [
        { title: 'Strategi Penguatan Karakter Melalui Gerakan Menulis Buku Bersama Komunitas', category: 'Best Practice', date: '01 Sep 2026' }
      ],
      bio: 'Penggerak literasi di Forum Literasi Pasar Kemis yang merintis program "Satu Anggota Satu Karya Tulis" per semester.'
    }
  ];

  let currentFilteredList = [...membersData];
  let activeActionMember = null;
  let confirmCallback = null;

  // 2. Render Member Table
  function renderMemberTable(items) {
    const tbody = document.getElementById('memberTableBody');
    const counterEl = document.getElementById('filteredMembersCount');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (counterEl) counterEl.textContent = items.length;

    if (items.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            Tidak ditemukan anggota dengan kriteria pencarian tersebut.
          </td>
        </tr>
      `;
      return;
    }

    items.forEach(member => {
      const tr = document.createElement('tr');
      tr.id = `row-${member.id}`;

      let statusBadgeClass = 'active';
      if (member.status === 'pending') statusBadgeClass = 'pending';
      if (member.status === 'suspended') statusBadgeClass = 'suspended';

      const isCompleted = member.progressPercent === 100;
      const worksCount = member.publishedWorks.length;

      tr.innerHTML = `
        <td><input type="checkbox" class="member-check-item" data-id="${member.id}" aria-label="Pilih ${member.name}"></td>
        <td>
          <div class="author-cell-info">
            <div class="author-avatar-chip" style="background: linear-gradient(135deg, #1e3a8a, #2563eb);">${member.initials}</div>
            <div class="author-meta-text">
              <span class="author-name-bold">${member.name}</span>
              <span class="member-id-pill">${member.id}</span>
            </div>
          </div>
        </td>
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${member.school}</div>
          <span style="font-size: 0.6875rem; color: var(--text-muted);">Kec. ${member.kecamatan}</span>
        </td>
        <td>
          <div class="elearning-progress-wrap">
            <div class="progress-label-mini">
              <span>${member.progressPercent}%</span>
              <span style="color: ${isCompleted ? '#059669' : 'var(--text-muted)'};">${isCompleted ? '✓ 32 JP' : 'Proses'}</span>
            </div>
            <div class="progress-track-mini">
              <div class="progress-fill-mini ${isCompleted ? 'completed' : ''}" style="width: ${member.progressPercent}%;"></div>
            </div>
            <span style="font-size: 0.625rem; color: var(--text-muted);">${member.progressLabel}</span>
          </div>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--text-main); font-size: 0.875rem;">${worksCount} Karya</div>
          <span style="font-size: 0.6875rem; color: var(--primary-700); cursor: pointer;" onclick="openMemberDetailModal('${member.id}', 'karya')">Lihat Portofolio</span>
        </td>
        <td>
          <span class="badge-status ${statusBadgeClass}">
            ${member.statusLabel}
          </span>
        </td>
        <td style="text-align: right;">
          <div class="action-btns-group">
            <button type="button" class="btn-detail-profile" onclick="openMemberDetailModal('${member.id}')">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <span>Detail</span>
            </button>
            <button type="button" class="btn-icon-action" title="Reset Kata Sandi" onclick="triggerResetPassword('${member.id}')">
              🔑
            </button>
            <button type="button" class="btn-icon-action" title="${member.status === 'suspended' ? 'Aktifkan Akun' : 'Tangguhkan Akun'}" onclick="triggerToggleSuspend('${member.id}')" style="color: ${member.status === 'suspended' ? '#059669' : '#dc2626'};">
              ${member.status === 'suspended' ? '✓' : '⛔'}
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  // 3. Filter and Search Logic
  function filterMembers() {
    const searchVal = (document.getElementById('memberSearchInput').value || '').toLowerCase().trim();
    const kecamatanVal = document.getElementById('filterKecamatan').value;
    const statusVal = document.getElementById('filterStatus').value;
    const progressVal = document.getElementById('filterProgress').value;

    currentFilteredList = membersData.filter(member => {
      // Search text match (Name, ID, NIP, School)
      const matchesSearch = !searchVal || 
        member.name.toLowerCase().includes(searchVal) ||
        member.id.toLowerCase().includes(searchVal) ||
        member.nip.toLowerCase().includes(searchVal) ||
        member.school.toLowerCase().includes(searchVal);

      // Kecamatan filter
      const matchesKecamatan = (kecamatanVal === 'all') || (member.kecamatan === kecamatanVal);

      // Status filter
      const matchesStatus = (statusVal === 'all') || (member.status === statusVal);

      // Progress filter
      let matchesProgress = true;
      if (progressVal === 'completed') matchesProgress = (member.progressPercent === 100);
      else if (progressVal === 'learning') matchesProgress = (member.progressPercent > 0 && member.progressPercent < 100);
      else if (progressVal === 'not_started') matchesProgress = (member.progressPercent === 0);

      return matchesSearch && matchesKecamatan && matchesStatus && matchesProgress;
    });

    renderMemberTable(currentFilteredList);
  }

  function initFilterListeners() {
    const searchInput = document.getElementById('memberSearchInput');
    const filterKecamatan = document.getElementById('filterKecamatan');
    const filterStatus = document.getElementById('filterStatus');
    const filterProgress = document.getElementById('filterProgress');
    const btnReset = document.getElementById('btnResetFilter');

    if (searchInput) searchInput.addEventListener('input', filterMembers);
    if (filterKecamatan) filterKecamatan.addEventListener('change', filterMembers);
    if (filterStatus) filterStatus.addEventListener('change', filterMembers);
    if (filterProgress) filterProgress.addEventListener('change', filterMembers);

    if (btnReset) {
      btnReset.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        if (filterKecamatan) filterKecamatan.value = 'all';
        if (filterStatus) filterStatus.value = 'all';
        if (filterProgress) filterProgress.value = 'all';
        filterMembers();
        showToast('Filter pencarian telah direset.');
      });
    }

    // Check all checkbox
    const checkAll = document.getElementById('checkAllMembers');
    if (checkAll) {
      checkAll.addEventListener('change', function () {
        const itemChecks = document.querySelectorAll('.member-check-item');
        itemChecks.forEach(cb => { cb.checked = checkAll.checked; });
      });
    }
  }

  // 4. Member Detail Modal Handling
  window.openMemberDetailModal = function (memberId, defaultTab = 'info') {
    const member = membersData.find(m => m.id === memberId);
    if (!member) return;

    activeActionMember = member;

    // Header values
    document.getElementById('modalMemberAvatar').textContent = member.initials;
    document.getElementById('modalMemberName').textContent = member.name;
    document.getElementById('modalMemberId').textContent = member.id;
    document.getElementById('modalMemberSchool').textContent = `${member.school} (Kec. ${member.kecamatan})`;

    const statusBadge = document.getElementById('modalMemberStatusBadge');
    statusBadge.className = `badge-status ${member.status}`;
    statusBadge.textContent = member.statusLabel;

    // Tab 1: Info values
    document.getElementById('modalMemberNip').textContent = member.nip;
    document.getElementById('modalMemberEmail').textContent = member.email;
    document.getElementById('modalMemberSubject').textContent = member.subject;
    document.getElementById('modalMemberKecamatan').textContent = `Kecamatan ${member.kecamatan}, Kab. Tangerang`;
    document.getElementById('modalMemberJoinDate').textContent = member.joinDate;
    document.getElementById('modalMemberRole').textContent = member.role;
    document.getElementById('modalMemberBio').textContent = member.bio;

    // Tab 2: Learning progress
    document.getElementById('modalLearningPercent').textContent = `${member.progressPercent}% (${member.progressPercent === 100 ? 'Selesai 32 JP' : 'Sedang Berjalan'})`;
    const bar = document.getElementById('modalLearningBar');
    bar.style.width = `${member.progressPercent}%`;
    if (member.progressPercent === 100) bar.classList.add('completed');
    else bar.classList.remove('completed');

    // Tab 3: Works List
    document.getElementById('modalWorksCount').textContent = member.publishedWorks.length;
    const worksListEl = document.getElementById('modalWorksList');
    worksListEl.innerHTML = '';
    if (member.publishedWorks.length === 0) {
      worksListEl.innerHTML = '<div style="color:var(--text-muted); font-size:0.8125rem;">Belum ada naskah yang diterbitkan oleh anggota ini.</div>';
    } else {
      member.publishedWorks.forEach((work, index) => {
        const div = document.createElement('div');
        div.style.cssText = 'background:#ffffff; border:1px solid var(--border-subtle); border-radius:10px; padding:0.875rem 1rem; display:flex; justify-content:space-between; align-items:center; gap:1rem;';
        div.innerHTML = `
          <div>
            <div style="font-weight:700; font-size:0.8125rem; color:var(--text-main); margin-bottom:0.25rem;">${index + 1}. ${work.title}</div>
            <div style="font-size:0.6875rem; color:var(--text-muted);">${work.category} &bull; Diterbitkan: ${work.date}</div>
          </div>
          <span style="font-size:0.6875rem; color:#059669; background:#ecfdf5; padding:0.2rem 0.5rem; border-radius:4px; font-weight:700; white-space:nowrap;">Tayang Publik</span>
        `;
        worksListEl.appendChild(div);
      });
    }

    // Modal Action Buttons state
    const suspendBtn = document.getElementById('btnModalToggleSuspend');
    if (suspendBtn) {
      if (member.status === 'suspended') {
        suspendBtn.textContent = '✓ Pulihkan Akun (Aktifkan)';
        suspendBtn.style.color = '#059669';
        suspendBtn.style.borderColor = '#a7f3d0';
      } else {
        suspendBtn.textContent = '⛔ Tangguhkan Akun';
        suspendBtn.style.color = '#dc2626';
        suspendBtn.style.borderColor = '#fecaca';
      }
    }

    // Switch to requested tab
    switchModalTab(defaultTab);

    // Show modal
    const modal = document.getElementById('memberDetailModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  function switchModalTab(tabKey) {
    const tabInfo = document.getElementById('tabInfoPribadi');
    const tabLearning = document.getElementById('tabProgresBelajar');
    const tabKarya = document.getElementById('tabPortofolio');

    const bodyInfo = document.getElementById('tabBodyInfo');
    const bodyLearning = document.getElementById('tabBodyLearning');
    const bodyKarya = document.getElementById('tabBodyKarya');

    [tabInfo, tabLearning, tabKarya].forEach(t => t.classList.remove('active'));
    [bodyInfo, bodyLearning, bodyKarya].forEach(b => b.style.display = 'none');

    if (tabKey === 'learning') {
      tabLearning.classList.add('active');
      bodyLearning.style.display = 'flex';
    } else if (tabKey === 'karya') {
      tabKarya.classList.add('active');
      bodyKarya.style.display = 'flex';
    } else {
      tabInfo.classList.add('active');
      bodyInfo.style.display = 'flex';
    }
  }

  function initModalTabs() {
    const tabInfo = document.getElementById('tabInfoPribadi');
    const tabLearning = document.getElementById('tabProgresBelajar');
    const tabKarya = document.getElementById('tabPortofolio');

    if (tabInfo) tabInfo.addEventListener('click', () => switchModalTab('info'));
    if (tabLearning) tabLearning.addEventListener('click', () => switchModalTab('learning'));
    if (tabKarya) tabKarya.addEventListener('click', () => switchModalTab('karya'));
  }

  // 5. Reset Password & Suspend Actions
  window.triggerResetPassword = function (memberId) {
    const member = membersData.find(m => m.id === memberId);
    if (!member) return;

    openConfirmModal(
      '🔑 Reset Kata Sandi Akun',
      `Apakah Anda yakin ingin mengatur ulang kata sandi untuk akun <strong>${member.name}</strong> (${member.email})? Tautan verifikasi baru akan dikirimkan ke email terdaftar.`,
      '#2563eb',
      'Kirim Tautan Reset',
      () => {
        showToast(`Tautan reset kata sandi telah dikirim ke ${member.email}`);
      }
    );
  };

  window.triggerToggleSuspend = function (memberId) {
    const member = membersData.find(m => m.id === memberId);
    if (!member) return;

    const isSuspending = member.status !== 'suspended';
    const actionWord = isSuspending ? 'menangguhkan' : 'mengaktifkan kembali';
    const btnColor = isSuspending ? '#dc2626' : '#059669';

    openConfirmModal(
      isSuspending ? '⛔ Konfirmasi Penangguhan Akun' : '✓ Pulihkan Akun Anggota',
      `Apakah Anda yakin ingin <strong>${actionWord}</strong> akun milik <strong>${member.name}</strong> (${member.school})?`,
      btnColor,
      isSuspending ? 'Tangguhkan Sekarang' : 'Aktifkan Akun',
      () => {
        member.status = isSuspending ? 'suspended' : 'active';
        member.statusLabel = isSuspending ? 'Ditangguhkan' : 'Aktif';
        filterMembers();
        updateStatCounters();
        showToast(`Akun ${member.name} berhasil ${isSuspending ? 'ditangguhkan' : 'diaktifkan kembali'}.`);
        closeModal('memberDetailModal');
      }
    );
  };

  function openConfirmModal(title, message, btnColor, btnText, callback) {
    const modal = document.getElementById('confirmActionModal');
    const titleEl = document.getElementById('confirmActionTitle');
    const msgEl = document.getElementById('confirmActionMessage');
    const btnEl = document.getElementById('btnExecuteConfirmAction');
    const iconBox = document.getElementById('confirmIconBox');

    if (titleEl) titleEl.innerHTML = title;
    if (msgEl) msgEl.innerHTML = message;
    if (btnEl) {
      btnEl.textContent = btnText;
      btnEl.style.background = btnColor;
    }
    if (iconBox) {
      iconBox.style.color = btnColor;
      iconBox.style.background = btnColor === '#059669' ? '#ecfdf5' : '#fef2f2';
    }

    confirmCallback = callback;
    if (modal) modal.classList.add('show');
  }

  function initConfirmAction() {
    const btnConfirm = document.getElementById('btnExecuteConfirmAction');
    if (btnConfirm) {
      btnConfirm.addEventListener('click', function () {
        if (typeof confirmCallback === 'function') {
          confirmCallback();
        }
        closeModal('confirmActionModal');
      });
    }

    // Actions inside detail modal
    const modalResetBtn = document.getElementById('btnModalResetPassword');
    const modalSuspendBtn = document.getElementById('btnModalToggleSuspend');

    if (modalResetBtn) {
      modalResetBtn.addEventListener('click', function () {
        if (activeActionMember) triggerResetPassword(activeActionMember.id);
      });
    }

    if (modalSuspendBtn) {
      modalSuspendBtn.addEventListener('click', function () {
        if (activeActionMember) triggerToggleSuspend(activeActionMember.id);
      });
    }
  }

  // 6. Add Member Form Handling
  function initAddMemberForm() {
    const btnOpen = document.getElementById('btnOpenAddMember');
    const modal = document.getElementById('memberFormModal');
    const form = document.getElementById('addMemberForm');

    if (btnOpen && modal) {
      btnOpen.addEventListener('click', function () {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('inputMemberName').value.trim();
        const nip = document.getElementById('inputMemberNip').value.trim();
        const email = document.getElementById('inputMemberEmail').value.trim();
        const school = document.getElementById('inputMemberSchool').value.trim();
        const kecamatan = document.getElementById('inputMemberKecamatan').value;
        const subject = document.getElementById('inputMemberSubject').value.trim() || 'Pendidik';

        // Generate initials
        const parts = name.replace(/[^a-zA-Z\s]/g, '').trim().split(' ');
        let initials = parts[0][0];
        if (parts.length > 1) initials += parts[parts.length - 1][0];
        initials = initials.toUpperCase();

        const newId = `KK-TNG-2026-${String(membersData.length + 43).padStart(4, '0')}`;

        const newMember = {
          id: newId,
          name,
          initials,
          nip,
          email,
          school,
          kecamatan,
          subject,
          role: 'Anggota Pendidik',
          status: 'active',
          statusLabel: 'Aktif',
          joinDate: 'Hari ini, 01 Sep 2026',
          progressPercent: 0,
          progressLabel: 'Modul 1 (0%)',
          publishedWorks: [],
          bio: `Pendidik di ${school}, berdedikasi mengembangkan literasi sekolah di Kecamatan ${kecamatan}.`
        };

        membersData.unshift(newMember);
        filterMembers();
        updateStatCounters();

        form.reset();
        closeModal('memberFormModal');
        showToast(`🎉 Anggota baru "${name}" berhasil didaftarkan dengan ID ${newId}!`);
      });
    }
  }

  // 7. CSV Export
  function initCsvExport() {
    const btnExport = document.getElementById('btnExportCsv');
    if (!btnExport) return;

    btnExport.addEventListener('click', function () {
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'ID Anggota,Nama Lengkap,NIP,Asal Sekolah,Kecamatan,Email,Progres E-Learning,Karya Terbit,Status Akun\r\n';

      currentFilteredList.forEach(m => {
        const row = [
          `"${m.id}"`,
          `"${m.name}"`,
          `"${m.nip}"`,
          `"${m.school}"`,
          `"${m.kecamatan}"`,
          `"${m.email}"`,
          `"${m.progressPercent}%"`,
          `"${m.publishedWorks.length}"`,
          `"${m.statusLabel}"`
        ];
        csvContent += row.join(',') + '\r\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `data_anggota_kertas_kata_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`📥 Berhasil mengekspor ${currentFilteredList.length} data anggota ke berkas CSV.`);
    });
  }

  // 8. Mobile Drawer Navigation Toggle
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

  // 9. Update Stat Counters
  function updateStatCounters() {
    const totalEl = document.getElementById('statTotalMembers');
    const activeEl = document.getElementById('statActiveMembers');
    const pendingEl = document.getElementById('statPendingMembers');
    const suspendedEl = document.getElementById('statSuspendedMembers');

    const total = membersData.length;
    const activeCount = membersData.filter(m => m.status === 'active').length;
    const pendingCount = membersData.filter(m => m.status === 'pending').length;
    const suspendedCount = membersData.filter(m => m.status === 'suspended').length;

    if (totalEl) totalEl.textContent = (1236 + total).toLocaleString('id-ID');
    if (activeEl) activeEl.textContent = (1170 + activeCount).toLocaleString('id-ID');
    if (pendingEl) pendingEl.textContent = pendingCount;
    if (suspendedEl) suspendedEl.textContent = suspendedCount;
  }

  // 10. Close Modal Utility
  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  };

  // Close modals on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.inline-review-modal-overlay.show');
      openModals.forEach(m => m.classList.remove('show'));
      document.body.style.overflow = '';
    }
  });

  // 11. Toast Notification Helper
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

  // Initialization
  document.addEventListener('DOMContentLoaded', function () {
    renderMemberTable(membersData);
    initFilterListeners();
    initModalTabs();
    initConfirmAction();
    initAddMemberForm();
    initCsvExport();
    initMobileDrawer();
  });

})();
