/**
 * KERTAS KATA - Kelola E-Learning Management Logic
 * Handles curriculum management, module editing, quiz question CRUD,
 * progress evaluation, and mobile drawer responsiveness.
 */

(function () {
  'use strict';

  // 1. Data 5 Modul E-Learning Resmi Komunitas
  const modulesData = [
    {
      id: 1,
      title: 'Fondasi Literasi Digital & Etika Kepenulisan Anggota',
      jp: 4,
      order: 1,
      status: 'active',
      desc: 'Pemahaman landasan literasi digital, hak kekayaan intelektual (HAKI), pencegahan plagiarisme, dan etika publikasi digital bagi anggota Komunitas.',
      videosCount: 4,
      readingsCount: 8,
      quizCount: 10,
      completedMembers: 1140,
      quizzes: [
        {
          q: 'Manakah dari tindakan berikut yang melanggar etika publikasi karya tulis ilmiah?',
          options: ['Mencantumkan sumber kutipan dengan format APA', 'Melakukan parafrase kalimat dengan rujukan jelas', 'Menyalin lebih dari 30% teks tanpa tanda petik dan rujukan (Plagiarisme)', 'Menyertakan dokumentasi foto kegiatan kelas atas izin siswa'],
          correct: 2
        },
        {
          q: 'Dalam standar lisensi Creative Commons, atribusi (BY) mewajibkan pengguna untuk...',
          options: ['Membayar royalti tunai', 'Mencantumkan nama pencipta asli karya', 'Dilarang mengubah format teks', 'Hanya digunakan untuk keperluan komersial'],
          correct: 1
        }
      ]
    },
    {
      id: 2,
      title: 'Teknik Riset Ide & Kerangka Tulisan Ilmiah Populer',
      jp: 6,
      order: 2,
      status: 'active',
      desc: 'Mengubah pengalaman praktik baik (best practice) mengajar di ruang kelas menjadi artikel reflektif dan esai pendidikan yang inspiratif.',
      videosCount: 5,
      readingsCount: 10,
      quizCount: 10,
      completedMembers: 1025,
      quizzes: [
        {
          q: 'Struktur baku sebuah artikel best practice pendidikan yang baik meliputi...',
          options: ['Latar belakang, Tantangan, Aksi nyata, dan Refleksi dampak', 'Hanya rangkuman teori para ahli', 'Deskripsi tantangan pembelajaran di ruang kelas', 'Daftar nilai evaluasi anggota lengkap'],
          correct: 0
        }
      ]
    },
    {
      id: 3,
      title: 'Struktur Kalimat Efektif & Standar PUEBI Terkini',
      jp: 8,
      order: 3,
      status: 'active',
      desc: 'Pendalaman kaidah bahasa Indonesia baku, pencegahan pleonasme, tanda baca konjungsi, dan teknik menyunting naskah secara mandiri.',
      videosCount: 6,
      readingsCount: 12,
      quizCount: 15,
      completedMembers: 950,
      quizzes: [
        {
          q: 'Penulisan kata serapan yang tepat menurut KBBI dan PUEBI adalah...',
          options: ['merubah', 'mengubah', 'merobah', 'mengobah'],
          correct: 1
        },
        {
          q: 'Manakah contoh kalimat yang tidak mengalami pleonasme (mubazir)?',
          options: ['Dia adalah merupakan anggota berprestasi.', 'Banyak anggota yang hadir pada lokakarya.', 'Para tamu undangan memasuki ruangan.', 'Penulis tersebut sangat tekun belajar.'],
          correct: 2
        }
      ]
    },
    {
      id: 4,
      title: 'Pemanfaatan AI Copilot sebagai Mitra Berpikir Anggota',
      jp: 8,
      order: 4,
      status: 'active',
      desc: 'Panduan etis penggunaan kecerdasan buatan untuk merangsang ide naskah, memeriksa tata bahasa, dan memetakan struktur tulisan ilmiah tanpa kehilangan orisinalitas.',
      videosCount: 5,
      readingsCount: 10,
      quizCount: 10,
      completedMembers: 890,
      quizzes: [
        {
          q: 'Peran paling etis kecerdasan buatan (AI) dalam penulisan ilmiah anggota adalah...',
          options: ['Menulis seluruh isi artikel secara otomatis tanpa diedit', 'Sebagai mitra diskusi, pengecek kesalahan ejaan, dan pemantik ide', 'Memalsukan data hasil observasi lapangan', 'Menghindari proses berpikir kritis anggota'],
          correct: 1
        }
      ]
    },
    {
      id: 5,
      title: 'Persiapan Penerbitan Buku Cetak Ber-ISBN Resmi',
      jp: 6,
      order: 5,
      status: 'active',
      desc: 'Syarat kurasi naskah antologi bunga rampai, pengajuan cetak mandiri 10 artikel, pendaftaran nomor ISBN Perpusnas, dan tata letak cover buku.',
      videosCount: 4,
      readingsCount: 8,
      quizCount: 10,
      completedMembers: 842,
      quizzes: [
        {
          q: 'Berapa jumlah minimal karya artikel ilmiah/sastra yang harus diterbitkan anggota untuk mengajukan cetak buku mandiri ber-ISBN?',
          options: ['3 Artikel', '5 Artikel', '10 Artikel', '25 Artikel'],
          correct: 2
        }
      ]
    }
  ];

  // 2. Data Pemantauan Progres Belajar Anggota
  const memberProgressData = [
    { name: 'Rahmat Hidayat, S.Pd.', school: 'Komunitas Literasi Curug', kecamatan: 'Curug', lastModule: 'Modul 5 (Tuntas)', quizScore: 92.5, percent: 100, certStatus: 'Siap Terbit', certClass: 'active' },
    { name: 'Siti Aminah, M.Pd.', school: 'Forum Literasi Teluknaga', kecamatan: 'Teluknaga', lastModule: 'Modul 4', quizScore: 88.0, percent: 80, certStatus: 'Proses Modul 5', certClass: 'pending' },
    { name: 'Dewi Sartika, S.Pd.SD', school: 'Komunitas Literasi Mauk', kecamatan: 'Mauk', lastModule: 'Modul 5 (Tuntas)', quizScore: 94.0, percent: 100, certStatus: 'Siap Terbit', certClass: 'active' },
    { name: 'Ahmad Fauzi, S.Pd.I', school: 'Pegiat Pustaka Kronjo', kecamatan: 'Kronjo', lastModule: 'Modul 2', quizScore: 82.0, percent: 40, certStatus: 'Proses Modul 3', certClass: 'pending' },
    { name: 'Nurul Fajriah, S.S.', school: 'Forum Literasi Sukamulya', kecamatan: 'Sukamulya', lastModule: 'Modul 3', quizScore: 86.5, percent: 60, certStatus: 'Proses Modul 4', certClass: 'pending' },
    { name: 'Budi Santoso, M.Pd.', school: 'Komunitas Literasi Tigaraksa', kecamatan: 'Tigaraksa', lastModule: 'Modul 5 (Tuntas)', quizScore: 96.0, percent: 100, certStatus: 'Siap Terbit', certClass: 'active' },
    { name: 'Ratna Dewi, S.Pd.', school: 'Komunitas Baca Cisoka', kecamatan: 'Cisoka', lastModule: 'Modul 3', quizScore: 84.0, percent: 60, certStatus: 'Proses Modul 4', certClass: 'pending' },
    { name: 'Hendra Gunawan, S.E.', school: 'Pegiat Literasi Cikupa', kecamatan: 'Cikupa', lastModule: 'Modul 5 (Tuntas)', quizScore: 90.0, percent: 100, certStatus: 'Siap Terbit', certClass: 'active' }
  ];

  // 3. Render Progress Table
  function renderProgressTable() {
    const tbody = document.getElementById('elearningProgressTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    memberProgressData.forEach(item => {
      const tr = document.createElement('tr');
      const isCompleted = item.percent === 100;

      tr.innerHTML = `
        <td>
          <div style="font-weight: 700; color: var(--text-main);">${item.name}</div>
          <span style="font-size: 0.6875rem; color: var(--text-muted);">${item.school}</span>
        </td>
        <td><span style="font-size: 0.75rem; color: var(--text-muted);">Kec. ${item.kecamatan}</span></td>
        <td><span style="font-weight: 600; font-size: 0.8125rem;">${item.lastModule}</span></td>
        <td>
          <span style="font-weight: 800; font-size: 0.875rem; color: ${item.quizScore >= 80 ? '#059669' : '#dc2626'};">
            ${item.quizScore} Poin
          </span>
        </td>
        <td>
          <div class="elearning-progress-wrap">
            <div class="progress-label-mini">
              <span>${item.percent}%</span>
              <span style="color:${isCompleted ? '#059669' : 'var(--text-muted)'};">${isCompleted ? '✓ Tuntas' : 'Berjalan'}</span>
            </div>
            <div class="progress-track-mini">
              <div class="progress-fill-mini ${isCompleted ? 'completed' : ''}" style="width: ${item.percent}%;"></div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge-status ${isCompleted ? 'active' : 'pending'}">
            ${isCompleted ? '✓ Siap E-Sertifikat' : 'Belum Tuntas'}
          </span>
        </td>
        <td style="text-align: right;">
          <button type="button" class="btn-detail-profile" onclick="viewMemberDetail('${item.name}')">
            <span>Rincian</span>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // 4. Modal Handlers
  let currentEditingModuleId = null;

  window.openModuleFormModal = function (moduleId) {
    currentEditingModuleId = moduleId;
    const mod = modulesData.find(m => m.id === moduleId);
    if (!mod) return;

    document.getElementById('moduleModalTitle').textContent = `✏️ Edit Materi: Modul ${mod.id}`;
    document.getElementById('inputModuleTitle').value = mod.title;
    document.getElementById('inputModuleJp').value = mod.jp;
    document.getElementById('inputModuleOrder').value = mod.order;
    document.getElementById('inputModuleDesc').value = mod.desc;

    const modal = document.getElementById('moduleFormModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  window.openQuizManageModal = function (moduleId) {
    const mod = modulesData.find(m => m.id === moduleId);
    if (!mod) return;

    document.getElementById('quizModalHeading').textContent = `📝 Butir Soal Kuis Modul ${mod.id}: ${mod.title}`;
    const container = document.getElementById('quizQuestionsContainer');
    container.innerHTML = '';

    mod.quizzes.forEach((quiz, idx) => {
      const qBox = document.createElement('div');
      qBox.className = 'quiz-item-box';
      
      let optionsHtml = '';
      quiz.options.forEach((opt, optIdx) => {
        const isCorrect = optIdx === quiz.correct;
        optionsHtml += `
          <div class="quiz-option-row ${isCorrect ? 'correct' : ''}">
            <span style="font-weight:700;">${String.fromCharCode(65 + optIdx)}.</span>
            <span>${opt}</span>
            ${isCorrect ? '<span style="margin-left:auto; font-size:0.6875rem; font-weight:800;">✓ KUNCI JAWABAN</span>' : ''}
          </div>
        `;
      });

      qBox.innerHTML = `
        <div class="quiz-item-header">
          <span class="quiz-number-badge">Soal #${idx + 1}</span>
          <button type="button" class="btn-filter-reset" style="padding:0.25rem 0.5rem; font-size:0.6875rem;" onclick="showToast('Fitur edit soal dibuka')">Edit Butir</button>
        </div>
        <div style="font-size:0.875rem; font-weight:600; color:var(--text-main); line-height:1.5;">${quiz.q}</div>
        <div class="quiz-options-list">
          ${optionsHtml}
        </div>
      `;
      container.appendChild(qBox);
    });

    const modal = document.getElementById('quizManageModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  window.openProgressModal = function (moduleId) {
    const mod = modulesData.find(m => m.id === moduleId);
    if (mod) {
      showToast(`📊 Menampilkan statistik ketuntasan Modul ${mod.id}: ${mod.completedMembers} anggota telah lulus kuis.`);
    }
  };

  window.saveQuizChanges = function () {
    closeModal('quizManageModal');
    showToast('✓ Seluruh butir soal kuis berhasil disimpan dan disinkronkan ke bank soal Komunitas.');
  };

  window.viewMemberDetail = function (memberName) {
    showToast(`Membuka rincian evaluasi ketuntasan untuk ${memberName}.`);
  };

  // 5. Form Submissions
  function initForms() {
    const editForm = document.getElementById('moduleEditForm');
    if (editForm) {
      editForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('inputModuleTitle').value.trim();
        const jp = parseInt(document.getElementById('inputModuleJp').value, 10);
        const desc = document.getElementById('inputModuleDesc').value.trim();

        const mod = modulesData.find(m => m.id === currentEditingModuleId);
        if (mod) {
          mod.title = title;
          mod.jp = jp;
          mod.desc = desc;

          // Update card in DOM
          const card = document.getElementById(`card-modul-${mod.id}`);
          if (card) {
            const h3 = card.querySelector('h3');
            const jpBadge = card.querySelector('.badge-jp');
            const p = card.querySelector('p');
            if (h3) h3.textContent = title;
            if (jpBadge) jpBadge.textContent = `${jp} JP`;
            if (p) p.textContent = desc;
          }
        }

        closeModal('moduleFormModal');
        showToast(`✓ Modul ${currentEditingModuleId} berhasil diperbarui.`);
      });
    }

    const btnAddMod = document.getElementById('btnOpenAddModule');
    if (btnAddMod) {
      btnAddMod.addEventListener('click', function () {
        document.getElementById('moduleModalTitle').textContent = '➕ Tambah Modul Baru Komunitas';
        document.getElementById('inputModuleTitle').value = '';
        document.getElementById('inputModuleJp').value = 4;
        document.getElementById('inputModuleOrder').value = modulesData.length + 1;
        document.getElementById('inputModuleDesc').value = '';

        const modal = document.getElementById('moduleFormModal');
        if (modal) {
          modal.classList.add('show');
          document.body.style.overflow = 'hidden';
        }
      });
    }

    const btnReorder = document.getElementById('btnReorderModules');
    if (btnReorder) {
      btnReorder.addEventListener('click', function () {
        showToast('ℹ️ Mode pengurutan modul aktif: Seret kartu modul ke urutan kurikulum yang diinginkan.');
      });
    }
  }

  // 6. Mobile Drawer Navigation Toggle
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

  // 7. Modal & Toast Helpers
  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  };

  window.closeQuizModal = function () {
    window.closeModal('quizManageModal');
  };

  window.closeModuleModal = function () {
    window.closeModal('moduleFormModal');
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
    renderProgressTable();
    initForms();
    initMobileDrawer();
  });

})();
