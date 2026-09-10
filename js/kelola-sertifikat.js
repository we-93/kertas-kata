/**
 * KELOLA SERTIFIKAT & HALL OF FAME - KERTAS KATA ADMIN
 * Mengelola penerbitan e-sertifikat 32 JP ber-QR code, papan peringkat (Hall of Fame),
 * dan sistem lencana gamifikasi anggota.
 */

(function () {
  'use strict';

  // 1. Dataset Sertifikat Anggota
  const certsData = [
    {
      id: 'SRT-2026-001',
      regNo: 'SRT/KT-TNG/2026/001',
      memberName: 'Rahmat Hidayat, S.Pd.',
      memberInitials: 'RH',
      memberOrg: 'Komunitas Literasi Tigaraksa',
      kecamatan: 'Tigaraksa',
      programName: 'Pelatihan Literasi & Menulis Kreatif 32 JP',
      type: 'elearning',
      typeLabel: 'E-Learning 32 JP',
      date: '02 Sep 2026',
      status: 'terbit',
      statusLabel: '✓ Terbit (Aktif)',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=VERIFY-SRT-2026-001-RAHMAT',
      signer: 'Fajar Ilhami',
      signerRole: 'Ketua Tim Kurator Komunitas Literasi'
    },
    {
      id: 'SRT-2026-002',
      regNo: 'SRT/KT-TNG/2026/002',
      memberName: 'Nurul Fajriah, S.S.',
      memberInitials: 'NF',
      memberOrg: 'Forum Literasi Sukamulya',
      kecamatan: 'Sukamulya',
      programName: 'Apresiasi Penulis Terproduktif Triwulan III',
      type: 'produktif',
      typeLabel: 'Penulis Produktif',
      date: '28 Agu 2026',
      status: 'terbit',
      statusLabel: '✓ Terbit (Aktif)',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=VERIFY-SRT-2026-002-NURUL',
      signer: 'Fajar Ilhami',
      signerRole: 'Ketua Tim Kurator Komunitas Literasi'
    },
    {
      id: 'SRT-2026-003',
      regNo: 'SRT/KT-TNG/2026/003',
      memberName: 'Hendra Gunawan, M.Pd.',
      memberInitials: 'HG',
      memberOrg: 'Komunitas Menulis Curug',
      kecamatan: 'Curug',
      programName: 'Pelatihan Literasi & Menulis Kreatif 32 JP',
      type: 'elearning',
      typeLabel: 'E-Learning 32 JP',
      date: '01 Sep 2026',
      status: 'terbit',
      statusLabel: '✓ Terbit (Aktif)',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=VERIFY-SRT-2026-003-HENDRA',
      signer: 'Fajar Ilhami',
      signerRole: 'Ketua Tim Kurator Komunitas Literasi'
    },
    {
      id: 'SRT-2026-004',
      regNo: 'SRT/KT-TNG/2026/004',
      memberName: 'Siti Aminah, M.Pd.',
      memberInitials: 'SA',
      memberOrg: 'Sahabat Literasi Teluknaga',
      kecamatan: 'Teluknaga',
      programName: 'Kontributor Kurasi Naskah Sejarah Lokal',
      type: 'kontributor',
      typeLabel: 'Kontributor Kurator',
      date: '25 Agu 2026',
      status: 'terbit',
      statusLabel: '✓ Terbit (Aktif)',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=VERIFY-SRT-2026-004-SITI',
      signer: 'Fajar Ilhami',
      signerRole: 'Ketua Tim Kurator Komunitas Literasi'
    },
    {
      id: 'SRT-2026-005',
      regNo: 'SRT/KT-TNG/2026/005',
      memberName: 'Ahmad Fauzi, S.Pd.I',
      memberInitials: 'AF',
      memberOrg: 'Pegiat Pustaka Kronjo',
      kecamatan: 'Kronjo',
      programName: 'Juara 1 Sayembara Cerita Rakyat Pesisir 2026',
      type: 'sayembara',
      typeLabel: 'Pemenang Sayembara',
      date: '15 Agu 2026',
      status: 'terbit',
      statusLabel: '✓ Terbit (Aktif)',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=VERIFY-SRT-2026-005-AHMAD',
      signer: 'Fajar Ilhami',
      signerRole: 'Ketua Tim Kurator Komunitas Literasi'
    },
    {
      id: 'SRT-2026-006',
      regNo: 'SRT/KT-TNG/2026/006',
      memberName: 'Ratna Dewi, S.Pd.',
      memberInitials: 'RD',
      memberOrg: 'Komunitas Baca Cisoka',
      kecamatan: 'Cisoka',
      programName: 'Pelatihan Literasi & Menulis Kreatif 32 JP',
      type: 'elearning',
      typeLabel: 'E-Learning 32 JP',
      date: '04 Sep 2026',
      status: 'pending',
      statusLabel: '⏳ Menunggu Verifikasi',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=VERIFY-SRT-2026-006-RATNA',
      signer: 'Fajar Ilhami',
      signerRole: 'Ketua Tim Kurator Komunitas Literasi'
    },
    {
      id: 'SRT-2026-007',
      regNo: 'SRT/KT-TNG/2026/007',
      memberName: 'Agus Supriyadi, S.Pd.',
      memberInitials: 'AS',
      memberOrg: 'Pojok Literasi Solear',
      kecamatan: 'Solear',
      programName: 'Pelatihan Literasi & Menulis Kreatif 32 JP',
      type: 'elearning',
      typeLabel: 'E-Learning 32 JP',
      date: '05 Sep 2026',
      status: 'pending',
      statusLabel: '⏳ Menunggu Verifikasi',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=VERIFY-SRT-2026-007-AGUS',
      signer: 'Fajar Ilhami',
      signerRole: 'Ketua Tim Kurator Komunitas Literasi'
    },
    {
      id: 'SRT-2026-008',
      regNo: 'SRT/KT-TNG/2026/008',
      memberName: 'Tri Wahyuni, M.Pd.',
      memberInitials: 'TW',
      memberOrg: 'Komunitas Literasi Cikupa',
      kecamatan: 'Cikupa',
      programName: 'Pelatihan Literasi & Menulis Kreatif 32 JP',
      type: 'elearning',
      typeLabel: 'E-Learning 32 JP',
      date: '06 Sep 2026',
      status: 'draft',
      statusLabel: '📝 Draf / Antrean',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=VERIFY-SRT-2026-008-TRI',
      signer: 'Fajar Ilhami',
      signerRole: 'Ketua Tim Kurator Komunitas Literasi'
    },
    {
      id: 'SRT-2026-009',
      regNo: 'SRT/KT-TNG/2026/009',
      memberName: 'Budi Santoso, S.Kom.',
      memberInitials: 'BS',
      memberOrg: 'Komunitas Literasi Mauk',
      kecamatan: 'Mauk',
      programName: 'Pelatihan Literasi & Menulis Kreatif 32 JP',
      type: 'elearning',
      typeLabel: 'E-Learning 32 JP',
      date: '06 Sep 2026',
      status: 'draft',
      statusLabel: '📝 Draf / Antrean',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=VERIFY-SRT-2026-009-BUDI',
      signer: 'Fajar Ilhami',
      signerRole: 'Ketua Tim Kurator Komunitas Literasi'
    },
    {
      id: 'SRT-2026-010',
      regNo: 'SRT/KT-TNG/2026/010',
      memberName: 'Maya Indah, S.Pd.',
      memberInitials: 'MI',
      memberOrg: 'Lingkar Sastra Kresek',
      kecamatan: 'Kresek',
      programName: 'Apresiasi Penulis Terproduktif Triwulan III',
      type: 'produktif',
      typeLabel: 'Penulis Produktif',
      date: '29 Agu 2026',
      status: 'terbit',
      statusLabel: '✓ Terbit (Aktif)',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=VERIFY-SRT-2026-010-MAYA',
      signer: 'Fajar Ilhami',
      signerRole: 'Ketua Tim Kurator Komunitas Literasi'
    }
  ];

  // 2. Dataset Hall of Fame (Penulis & Komunitas Kecamatan)
  const hofAuthorsData = [
    {
      rank: 1,
      badgeClass: 'first',
      avatarBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
      name: 'Rahmat Hidayat, S.Pd.',
      initials: 'RH',
      org: 'Komunitas Literasi Tigaraksa',
      kecamatan: 'Tigaraksa',
      publishedCount: 12,
      viewsCount: 42800,
      badgesCount: 5,
      points: 3450
    },
    {
      rank: 2,
      badgeClass: 'second',
      avatarBg: 'linear-gradient(135deg, #64748b, #475569)',
      name: 'Nurul Fajriah, S.S.',
      initials: 'NF',
      org: 'Forum Literasi Sukamulya',
      kecamatan: 'Sukamulya',
      publishedCount: 9,
      viewsCount: 31200,
      badgesCount: 4,
      points: 2890
    },
    {
      rank: 3,
      badgeClass: 'third',
      avatarBg: 'linear-gradient(135deg, #b45309, #78350f)',
      name: 'Hendra Gunawan, M.Pd.',
      initials: 'HG',
      org: 'Komunitas Menulis Curug',
      kecamatan: 'Curug',
      publishedCount: 8,
      viewsCount: 27400,
      badgesCount: 4,
      points: 2610
    },
    {
      rank: 4,
      badgeClass: 'standard',
      avatarBg: '#3b82f6',
      name: 'Siti Aminah, M.Pd.',
      initials: 'SA',
      org: 'Sahabat Literasi Teluknaga',
      kecamatan: 'Teluknaga',
      publishedCount: 7,
      viewsCount: 22100,
      badgesCount: 3,
      points: 2150
    },
    {
      rank: 5,
      badgeClass: 'standard',
      avatarBg: '#8b5cf6',
      name: 'Ahmad Fauzi, S.Pd.I',
      initials: 'AF',
      org: 'Pegiat Pustaka Kronjo',
      kecamatan: 'Kronjo',
      publishedCount: 6,
      viewsCount: 19800,
      badgesCount: 3,
      points: 1920
    }
  ];

  const hofKecamatanData = [
    { rank: 1, name: 'Kecamatan Tigaraksa', writersCount: 68, worksCount: 184, discussions: 512, score: 98.4 },
    { rank: 2, name: 'Kecamatan Curug', writersCount: 54, worksCount: 142, discussions: 420, score: 92.1 },
    { rank: 3, name: 'Kecamatan Teluknaga', writersCount: 48, worksCount: 126, discussions: 388, score: 88.6 },
    { rank: 4, name: 'Kecamatan Mauk', writersCount: 42, worksCount: 110, discussions: 315, score: 84.0 },
    { rank: 5, name: 'Kecamatan Sukamulya', writersCount: 38, worksCount: 96, discussions: 270, score: 80.5 }
  ];

  // 3. Dataset Lencana Gamifikasi (Selaras 100% dengan profil.html & dashboard.html)
  const badgesData = [
    {
      id: 'bdg-01',
      icon: '🎖️',
      colorClass: 'gold',
      title: 'Penulis Produktif',
      desc: 'Menerbitkan minimal 3 karya lolos kurasi resmi redaksi KERTAS KATA.',
      requirement: 'Min. 3 Karya Terbit',
      holdersCount: 142,
      isActive: true
    },
    {
      id: 'bdg-02',
      icon: '📖',
      colorClass: 'blue',
      title: 'Top Reader',
      desc: 'Menyelesaikan 4 modul pembelajaran literasi dan lulus kuis evaluasi.',
      requirement: 'Lulus 4 Modul Kuis',
      holdersCount: 388,
      isActive: true
    },
    {
      id: 'bdg-03',
      icon: '💬',
      colorClass: 'purple',
      title: 'Kritikus Aktif',
      desc: 'Memberikan 10+ ulasan dan tanggapan berbobot di forum komunitas.',
      requirement: '10+ Ulasan Forum',
      holdersCount: 215,
      isActive: true
    },
    {
      id: 'bdg-04',
      icon: '🌟',
      colorClass: 'green',
      title: 'Riset Sejarah Tangerang',
      desc: 'Mendapatkan skor 95 pada Modul 3: Riset Budaya & Sejarah Lokal.',
      requirement: 'Skor 95 Modul 3',
      holdersCount: 84,
      isActive: true
    },
    {
      id: 'bdg-05',
      icon: '🎓',
      colorClass: 'orange',
      title: 'Lulusan Terbaik 32 JP',
      desc: 'Selesaikan seluruh modul Pembelajaran dengan nilai rata-rata min. 80.',
      requirement: 'Tuntas 5 Modul Rerata ≥80',
      holdersCount: 96,
      isActive: true
    },
    {
      id: 'bdg-06',
      icon: '📚',
      colorClass: 'blue',
      title: 'Cetak Mandiri Perdana',
      desc: 'Terbitkan 10 tulisan resmi untuk membuka hak cetak buku mandiri ber-ISBN.',
      requirement: 'Min. 10 Tulisan Terbit',
      holdersCount: 28,
      isActive: true
    }
  ];

  let currentCerts = [...certsData];
  let activeSelectedCert = null;

  // 4. Render Certificates Table
  function renderCertsTable(data) {
    const tbody = document.getElementById('certsTableBody');
    const countEl = document.getElementById('totalCertsCount');
    if (countEl) countEl.textContent = `${data.length} Sertifikat Ditampilkan`;
    if (!tbody) return;

    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
            <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
            <div style="font-weight:700; font-size:1rem; color:var(--text-main);">Tidak Ada Sertifikat yang Sesuai</div>
            <div style="font-size:0.8125rem;">Coba sesuaikan kata kunci atau reset filter pencarian.</div>
          </td>
        </tr>
      `;
      return;
    }

    data.forEach(item => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td style="width: 40px; text-align: center;">
          <input type="checkbox" class="cert-select-cb" data-id="${item.id}" aria-label="Pilih sertifikat ${item.regNo}">
        </td>
        <td>
          <div class="cert-reg-badge">${item.regNo}</div>
          <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 0.25rem;">Ditetapkan: ${item.date}</div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <div class="user-avatar-small" style="background:#4338ca; color:#ffffff; font-size:0.75rem;">${item.memberInitials}</div>
            <div>
              <div style="font-weight: 700; color: var(--text-main); font-size: 0.875rem;">${item.memberName}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${item.memberOrg} • Kec. ${item.kecamatan}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge-cert-type ${item.type}">${item.typeLabel}</span>
          <div style="font-size: 0.75rem; color: var(--text-main); margin-top: 0.25rem; font-weight: 500;">
            ${item.programName}
          </div>
        </td>
        <td>
          <span class="badge-cert-status ${item.status}">
            ${item.status === 'terbit' ? '● ' : ''}${item.statusLabel}
          </span>
          <div style="font-size: 0.6875rem; color: #6366f1; margin-top: 0.25rem; font-weight: 600;">
            QR Validator: Aktif 🛡️
          </div>
        </td>
        <td>
          <div style="display: flex; gap: 0.35rem;">
            <button type="button" class="btn-cert-action primary" onclick="window.openCertPreviewModal('${item.id}')" title="Pratinjau Lembar Sertifikat">
              👁️ Pratinjau
            </button>
            <button type="button" class="btn-cert-action secondary" onclick="window.downloadCertPdf('${item.id}')" title="Unduh File PDF">
              📥 PDF
            </button>
          </div>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  // 5. Render Hall of Fame
  function renderHallOfFame() {
    // Top 3 Podium
    const podiumContainer = document.getElementById('hofPodiumGrid');
    if (podiumContainer) {
      const top3 = hofAuthorsData.slice(0, 3);
      podiumContainer.innerHTML = top3.map(a => {
        let rankIcon = '🥇';
        if (a.rank === 2) rankIcon = '🥈';
        if (a.rank === 3) rankIcon = '🥉';

        return `
          <div class="hof-podium-card ${a.badgeClass}">
            <div class="hof-rank-badge">${rankIcon}</div>
            <div class="hof-avatar" style="background: ${a.avatarBg}">${a.initials}</div>
            <div class="hof-author-name">${a.name}</div>
            <div class="hof-author-org">${a.org} • Kec. ${a.kecamatan}</div>
            <div class="hof-author-stats">
              <div>
                <strong>${a.publishedCount}</strong>
                <span>Karya Terbit</span>
              </div>
              <div>
                <strong>${a.viewsCount.toLocaleString('id-ID')}</strong>
                <span>Total Views</span>
              </div>
              <div>
                <strong>${a.points}</strong>
                <span>XP Poin</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Kecamatan Table
    const kecTbody = document.getElementById('hofKecamatanTableBody');
    if (kecTbody) {
      kecTbody.innerHTML = hofKecamatanData.map(k => `
        <tr>
          <td style="font-weight: 800; color: #4338ca; width: 40px; text-align: center;">#${k.rank}</td>
          <td style="font-weight: 700; color: var(--text-main);">${k.name}</td>
          <td>${k.writersCount} Anggota Aktif</td>
          <td>${k.worksCount} Naskah Terbit</td>
          <td>${k.discussions} Diskusi Komunitas</td>
          <td>
            <strong style="color: #059669; font-size: 0.875rem;">${k.score} Pts</strong>
          </td>
        </tr>
      `).join('');
    }
  }

  // 6. Render Badges Management
  function renderBadges() {
    const badgesContainer = document.getElementById('badgesGridContainer');
    if (!badgesContainer) return;

    badgesContainer.innerHTML = badgesData.map(b => `
      <div class="badge-manage-card" id="badge-card-${b.id}">
        <div class="badge-manage-bubble ${b.colorClass}">
          ${b.icon}
        </div>
        <div class="badge-manage-info">
          <div class="badge-manage-title">
            <span>${b.title}</span>
            <label style="font-size:0.75rem; cursor:pointer; display:flex; align-items:center; gap:0.25rem;">
              <input type="checkbox" ${b.isActive ? 'checked' : ''} onchange="window.toggleBadgeStatus('${b.id}', this.checked)">
              <span style="font-size:0.6875rem; color:${b.isActive ? '#059669' : '#94a3b8'}; font-weight:700;">
                ${b.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </label>
          </div>
          <div class="badge-manage-desc">${b.desc}</div>
          <div class="badge-manage-meta">
            <span>Syarat: <strong>${b.requirement}</strong></span>
            <span>${b.holdersCount} Anggota Meraih</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 7. Multi-Criteria Filter Logic
  function applyCertFilters() {
    const searchVal = (document.getElementById('certSearchInput')?.value || '').toLowerCase().trim();
    const typeVal = document.getElementById('filterCertType')?.value || 'all';
    const statusVal = document.getElementById('filterCertStatus')?.value || 'all';
    const kecVal = document.getElementById('filterCertKecamatan')?.value || 'all';

    currentCerts = certsData.filter(item => {
      if (typeVal !== 'all' && item.type !== typeVal) return false;
      if (statusVal !== 'all' && item.status !== statusVal) return false;
      if (kecVal !== 'all' && item.kecamatan !== kecVal) return false;

      if (searchVal) {
        const matchName = item.memberName.toLowerCase().includes(searchVal);
        const matchReg = item.regNo.toLowerCase().includes(searchVal);
        const matchOrg = item.memberOrg.toLowerCase().includes(searchVal);
        const matchProg = item.programName.toLowerCase().includes(searchVal);
        if (!matchName && !matchReg && !matchOrg && !matchProg) {
          return false;
        }
      }

      return true;
    });

    renderCertsTable(currentCerts);
  }

  // 8. Modal Pratinjau Sertifikat Resmi
  window.openCertPreviewModal = function (certId) {
    const cert = certsData.find(c => c.id === certId);
    if (!cert) return;

    activeSelectedCert = cert;
    const modal = document.getElementById('certPreviewModal');
    if (!modal) return;

    document.getElementById('pvCertRegNo').textContent = `No. Registrasi: ${cert.regNo}`;
    document.getElementById('pvCertRecipient').textContent = cert.memberName;
    document.getElementById('pvCertOrg').textContent = `${cert.memberOrg} • Kec. ${cert.kecamatan}`;
    document.getElementById('pvCertProgram').textContent = cert.programName;
    document.getElementById('pvCertDate').textContent = `Ditetapkan di Tangerang, ${cert.date}`;
    document.getElementById('pvCertSigner').textContent = cert.signer;
    document.getElementById('pvCertSignerRole').textContent = cert.signerRole;
    document.getElementById('pvCertQrImg').src = cert.qrCodeUrl;

    modal.classList.add('show');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // 9. Modal Generate Kolektif
  window.openGenerateCertModal = function () {
    const modal = document.getElementById('generateCertModal');
    if (modal) {
      modal.classList.add('show');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  // 10. Submit Generate Sertifikat Kolektif
  window.submitGenerateCert = function (e) {
    e.preventDefault();
    const program = document.getElementById('genCertProgramInput')?.value || 'Pelatihan Literasi & Menulis Kreatif 32 JP';
    const skNo = document.getElementById('genCertSkInput')?.value || 'SK-KUR/2026/09';

    showToast(`🎓 Menerbitkan 45 sertifikat bernomor resmi untuk program: ${program}...`);

    closeModal('generateCertModal');
    e.target.reset();

    setTimeout(() => {
      showToast('🎉 Berhasil! 45 E-Sertifikat 32 JP telah diterbitkan dan dikirim ke akun anggota.');
    }, 1200);
  };

  // 11. Unduh File PDF
  window.downloadCertPdf = function (certId) {
    const cert = certsData.find(c => c.id === certId);
    if (!cert) return;
    showToast(`📥 Mengunduh dokumen E-Sertifikat resmi (${cert.regNo}.pdf)...`);
  };

  // 12. Toggle Lencana Gamifikasi
  window.toggleBadgeStatus = function (badgeId, isChecked) {
    const badge = badgesData.find(b => b.id === badgeId);
    if (badge) {
      badge.isActive = isChecked;
      showToast(`🏆 Lencana "${badge.title}" kini ${isChecked ? 'Aktif' : 'Dinonaktifkan'}.`);
    }
  };

  // 13. Helper Modal Closer
  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // 14. Toast Notification
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

  // 15. Mobile Drawer Navigation Toggle
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

  // 16. Event Listeners Initialization
  document.addEventListener('DOMContentLoaded', () => {
    renderCertsTable(certsData);
    renderHallOfFame();
    renderBadges();

    // Search Input
    const searchInput = document.getElementById('certSearchInput');
    if (searchInput) searchInput.addEventListener('input', applyCertFilters);

    // Select Filters
    const typeSelect = document.getElementById('filterCertType');
    if (typeSelect) typeSelect.addEventListener('change', applyCertFilters);

    const statusSelect = document.getElementById('filterCertStatus');
    if (statusSelect) statusSelect.addEventListener('change', applyCertFilters);

    const kecSelect = document.getElementById('filterCertKecamatan');
    if (kecSelect) kecSelect.addEventListener('change', applyCertFilters);

    // Reset Button
    const resetBtn = document.getElementById('btnResetCertFilter');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (typeSelect) typeSelect.value = 'all';
        if (statusSelect) statusSelect.value = 'all';
        if (kecSelect) kecSelect.value = 'all';
        applyCertFilters();
        showToast('🔄 Filter sertifikat berhasil disetel ulang.');
      });
    }

    // Main Tab Switcher (Sertifikat vs Hall of Fame)
    const tabCertsBtn = document.getElementById('tabCertsViewBtn');
    const tabHofBtn = document.getElementById('tabHofViewBtn');
    const certsViewSection = document.getElementById('certsViewSection');
    const hofViewSection = document.getElementById('hofViewSection');

    if (tabCertsBtn && tabHofBtn && certsViewSection && hofViewSection) {
      tabCertsBtn.addEventListener('click', () => {
        tabCertsBtn.classList.add('active');
        tabHofBtn.classList.remove('active');
        certsViewSection.style.display = 'block';
        hofViewSection.style.display = 'none';
      });

      tabHofBtn.addEventListener('click', () => {
        tabHofBtn.classList.add('active');
        tabCertsBtn.classList.remove('active');
        certsViewSection.style.display = 'none';
        hofViewSection.style.display = 'block';
      });
    }

    // Form Generate
    const genForm = document.getElementById('generateCertForm');
    if (genForm) genForm.addEventListener('submit', window.submitGenerateCert);

    // Select All Checkbox
    const selectAllCb = document.getElementById('selectAllCertsCb');
    if (selectAllCb) {
      selectAllCb.addEventListener('change', (e) => {
        const checked = e.target.checked;
        document.querySelectorAll('.cert-select-cb').forEach(cb => {
          cb.checked = checked;
        });
      });
    }

    // Init Mobile Drawer
    initMobileDrawer();
  });

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
