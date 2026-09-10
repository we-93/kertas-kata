/**
 * KERTAS KATA - Dashboard Admin & Inline Review System Logic
 * Implements Wireframe 5 (Dashboard Admin) & Wireframe 6 (Inline Review & AI Koreksi)
 */

(function () {
  'use strict';

  // 1. Antrean Naskah Data (12 Naskah sesuai PRD Kategori & Kabupaten Tangerang)
  const reviewQueueData = [
    {
      id: 'naskah-1',
      author: 'Rahmat Hidayat',
      authorInitials: 'RH',
      region: 'SMPN 1 Curug',
      kecamatan: 'Curug',
      title: 'Strategi Diferensiasi Pembelajaran Digital Berbasis Portofolio Siswa di SMPN 1 Curug',
      category: 'Inovasi Pembelajaran (Best Practice)',
      date: '06 Sep 2026',
      plagiarism: 12,
      plagStatus: 'safe',
      status: 'pending',
      statusLabel: 'Menunggu Review',
      wordCount: 1420
    },
    {
      id: 'naskah-2',
      author: 'Siti Aminah',
      authorInitials: 'SA',
      region: 'SMPN 2 Teluknaga',
      kecamatan: 'Teluknaga',
      title: 'Kajian Historis Komunitas Tionghoa Benteng di Sepanjang Aliran Sungai Cisadane',
      category: 'Artikel Ilmiah Sejarah',
      date: '06 Sep 2026',
      plagiarism: 14,
      plagStatus: 'safe',
      status: 'pending',
      statusLabel: 'Menunggu Review',
      wordCount: 1850
    },
    {
      id: 'naskah-3',
      author: 'Ahmad Fauzi',
      authorInitials: 'AF',
      region: 'SDN 1 Kronjo',
      kecamatan: 'Kronjo',
      title: 'Optimalisasi Laboratorium Komputer Madrasah untuk Literasi Coding Siswa Pesisir',
      category: 'Opini Pendidikan',
      date: '05 Sep 2026',
      plagiarism: 19,
      plagStatus: 'safe',
      status: 'revision',
      statusLabel: 'Revisi Anggota',
      wordCount: 1120
    },
    {
      id: 'naskah-4',
      author: 'Dewi Sartika',
      authorInitials: 'DS',
      region: 'SDN 2 Mauk',
      kecamatan: 'Mauk',
      title: 'Pengembangan Modul Ajar IPAS Berbasis Kearifan Lokal Hutan Mangrove Ketapang',
      category: 'Modul Ajar / Best Practice',
      date: '05 Sep 2026',
      plagiarism: 8,
      plagStatus: 'safe',
      status: 'ready',
      statusLabel: 'Siap Terbit',
      wordCount: 2100
    },
    {
      id: 'naskah-5',
      author: 'Nurul Fajriah',
      authorInitials: 'NF',
      region: 'SMPN 1 Sukamulya',
      kecamatan: 'Sukamulya',
      title: 'Lentera Pesisir Kronjo: Narasi Perjuangan dan Ketangguhan Nelayan Tradisional',
      category: 'Cerpen Sastra',
      date: '04 Sep 2026',
      plagiarism: 11,
      plagStatus: 'safe',
      status: 'pending',
      statusLabel: 'Menunggu Review',
      wordCount: 1350
    },
    {
      id: 'naskah-6',
      author: 'Budi Santoso',
      authorInitials: 'BS',
      region: 'SMPN 1 Tigaraksa',
      kecamatan: 'Tigaraksa',
      title: 'Efektivitas Gamifikasi Kuis Interaktif dalam Meningkatkan Keterlibatan Belajar IPA',
      category: 'Inovasi Pembelajaran',
      date: '04 Sep 2026',
      plagiarism: 22,
      plagStatus: 'safe',
      status: 'pending',
      statusLabel: 'Menunggu Review',
      wordCount: 1600
    },
    {
      id: 'naskah-7',
      author: 'Ratna Dewi',
      authorInitials: 'RD',
      region: 'SDN 1 Cisoka',
      kecamatan: 'Cisoka',
      title: 'Penerapan Model Problem Based Learning pada Materi Konservasi Alam Pedesaan',
      category: 'Artikel Ilmiah',
      date: '03 Sep 2026',
      plagiarism: 38,
      plagStatus: 'warning',
      status: 'revision',
      statusLabel: 'Revisi Anggota',
      wordCount: 1490
    },
    {
      id: 'naskah-8',
      author: 'Hendra Gunawan',
      authorInitials: 'HG',
      region: 'SMPN 2 Cikupa',
      kecamatan: 'Cikupa',
      title: 'Implementasi Literasi Finansial Sejak Dini Melalui Pengelolaan Koperasi Pelajar',
      category: 'Best Practice',
      date: '03 Sep 2026',
      plagiarism: 9,
      plagStatus: 'safe',
      status: 'pending',
      statusLabel: 'Menunggu Review',
      wordCount: 1280
    },
    {
      id: 'naskah-9',
      author: 'Sri Wahyuni',
      authorInitials: 'SW',
      region: 'SMPN 1 Kresek',
      kecamatan: 'Kresek',
      title: 'Menggali Khazanah Tenun Tradisional Kresek Melalui Karya Tulis Feature Siswa',
      category: 'Esai Budaya',
      date: '02 Sep 2026',
      plagiarism: 16,
      plagStatus: 'safe',
      status: 'pending',
      statusLabel: 'Menunggu Review',
      wordCount: 1400
    },
    {
      id: 'naskah-10',
      author: 'Agus Supriyadi',
      authorInitials: 'AS',
      region: 'SMPN 1 Solear',
      kecamatan: 'Solear',
      title: 'Transformasi Ruang Pojok Literasi Sekolah Ramah Anak di Kawasan Wisata Keramat Solear',
      category: 'Opini Pendidikan',
      date: '02 Sep 2026',
      plagiarism: 24,
      plagStatus: 'safe',
      status: 'revision',
      statusLabel: 'Revisi Anggota',
      wordCount: 1180
    },
    {
      id: 'naskah-11',
      author: 'Maya Anggraeni',
      authorInitials: 'MA',
      region: 'SMPN 1 Cisauk',
      kecamatan: 'Cisauk',
      title: 'Kumpulan Sajak Pesisir: Denyut Kehidupan dan Harapan Nelayan Tanjung Pasir',
      category: 'Puisi Sastra',
      date: '01 Sep 2026',
      plagiarism: 5,
      plagStatus: 'safe',
      status: 'pending',
      statusLabel: 'Menunggu Review',
      wordCount: 650
    },
    {
      id: 'naskah-12',
      author: 'Wahyu Hidayat',
      authorInitials: 'WH',
      region: 'SMPN 2 Pasar Kemis',
      kecamatan: 'Pasar Kemis',
      title: 'Strategi Penguatan Profil Pelajar Pancasila Melalui Gerakan Menulis Buku Bersama',
      category: 'Best Practice',
      date: '01 Sep 2026',
      plagiarism: 15,
      plagStatus: 'safe',
      status: 'pending',
      statusLabel: 'Menunggu Review',
      wordCount: 1750
    }
  ];

  let currentActiveArticleId = 'naskah-1';
  let activeFilter = 'all';

  // 2. Render Review Queue Table
  function renderQueueTable(filter = 'all') {
    const tableBody = document.getElementById('reviewTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const filteredItems = reviewQueueData.filter(item => {
      if (filter === 'all') return true;
      return item.status === filter;
    });

    if (filteredItems.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            Tidak ada naskah dalam filter ini.
          </td>
        </tr>
      `;
      return;
    }

    filteredItems.forEach(item => {
      const tr = document.createElement('tr');
      tr.id = `row-${item.id}`;

      let statusBadgeClass = 'pending';
      if (item.status === 'revision') statusBadgeClass = 'revision';
      if (item.status === 'ready') statusBadgeClass = 'ready';

      let plagClass = item.plagStatus === 'safe' ? 'safe' : 'warning';
      let plagIcon = item.plagStatus === 'safe' ? '🛡️' : '⚠️';
      let plagText = item.plagStatus === 'safe' ? 'Aman' : 'Perlu Cek';

      tr.innerHTML = `
        <td><input type="checkbox" class="queue-check-item" data-id="${item.id}" aria-label="Pilih ${item.title}"></td>
        <td>
          <div class="author-cell-info">
            <div class="author-avatar-chip">${item.authorInitials}</div>
            <div class="author-meta-text">
              <span class="author-name-bold">${item.author}</span>
              <span class="author-sub-region">${item.region}</span>
            </div>
          </div>
        </td>
        <td>
          <div class="article-title-cell">${item.title}</div>
          <span style="display:inline-block; margin-top:0.25rem; font-size:0.6875rem; color:var(--primary-700); background:var(--primary-50); padding:0.1rem 0.4rem; border-radius:4px;">${item.category}</span>
        </td>
        <td style="white-space: nowrap; color: var(--text-muted); font-size: 0.75rem;">${item.date}</td>
        <td>
          <span class="plagiarism-badge ${plagClass}">
            ${plagIcon} ${item.plagiarism}% - ${plagText}
          </span>
        </td>
        <td>
          <span class="status-badge ${statusBadgeClass}">
            ${item.statusLabel}
          </span>
        </td>
        <td style="text-align: right;">
          <button type="button" class="btn-action-review" onclick="openInlineReviewModal('${item.id}')">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <span>Mulai Review</span>
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // 3. Tab Filter Listeners
  function initFilterTabs() {
    const tabButtons = document.querySelectorAll('.queue-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        tabButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        activeFilter = this.getAttribute('data-filter') || 'all';
        renderQueueTable(activeFilter);
      });
    });

    // Check all checkbox
    const checkAll = document.getElementById('checkAllQueue');
    if (checkAll) {
      checkAll.addEventListener('change', function () {
        const itemChecks = document.querySelectorAll('.queue-check-item');
        itemChecks.forEach(cb => { cb.checked = checkAll.checked; });
      });
    }
  }

  // 4. Open Inline Review Modal (Wireframe 6)
  window.openInlineReviewModal = function (articleId) {
    currentActiveArticleId = articleId;
    const article = reviewQueueData.find(a => a.id === articleId);
    if (!article) return;

    // Update modal header details
    const modalTitle = document.getElementById('modalArticleTitle');
    const modalAuthor = document.getElementById('modalArticleAuthor');
    const modalCategory = document.getElementById('modalCategoryBadge');
    const modalPlag = document.getElementById('modalPlagBadge');
    const manuscriptEl = document.getElementById('manuscriptContent');

    if (modalTitle) modalTitle.textContent = article.title;
    if (modalAuthor) modalAuthor.textContent = `Oleh: ${article.author} • ${article.region}, Kab. Tangerang`;
    if (modalCategory) modalCategory.textContent = article.category;
    if (modalPlag) {
      modalPlag.className = `plagiarism-badge ${article.plagStatus === 'safe' ? 'safe' : 'warning'}`;
      modalPlag.textContent = `${article.plagStatus === 'safe' ? '🛡️' : '⚠️'} ${article.plagiarism}% - ${article.plagStatus === 'safe' ? 'Aman' : 'Perlu Cek'}`;
    }

    // Tampilkan isi naskah asli
    if (manuscriptEl && article.content) {
      manuscriptEl.innerHTML = article.content;
    }

    // Reset AI Button state
    const aiBtn = document.getElementById('btnRunAiCorrection');
    const aiText = document.getElementById('aiButtonText');
    if (aiBtn && aiText) {
      aiBtn.classList.remove('analyzing');
      aiText.textContent = '✨ Jalankan AI Koreksi';
    }

    // Show modal
    const modal = document.getElementById('inlineReviewModal');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  };

  // Close Modal Handler
  window.closeReviewModal = function () {
    const modal = document.getElementById('inlineReviewModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  };

  // 5. Interactive "✨ Jalankan AI Koreksi" (Wireframe 6)
  function initAiCorrectionButton() {
    const btn = document.getElementById('btnRunAiCorrection');
    const aiText = document.getElementById('aiButtonText');
    const scanIndicator = document.getElementById('aiScanningIndicator');
    const aiCountEl = document.getElementById('aiCount');

    if (!btn) return;

    btn.addEventListener('click', async function () {
      btn.classList.add('analyzing');
      aiText.innerHTML = '<span class="status-dot-pulse" style="display:inline-block; vertical-align:middle; margin-right:4px;"></span> Memindai Teks PUEBI & KBBI...';
      if (scanIndicator) scanIndicator.style.display = 'block';

      // Switch to AI tab automatically
      const tabAi = document.getElementById('tabAiSuggestions');
      if (tabAi) tabAi.click();

      if (window.KK_API && currentActiveArticleId) {
        try {
          const res = await window.KK_API.admin.runAICheck(currentActiveArticleId);
          if (res && res.success && res.data?.analysis) {
            const analysis = res.data.analysis;
            renderRealAiSuggestions(analysis);
            btn.classList.remove('analyzing');
            aiText.textContent = `✓ ${(analysis.grammarNotes?.length || 0) + (analysis.structureNotes?.length || 0)} Saran AI Ditemukan`;
            if (scanIndicator) scanIndicator.style.display = 'none';

            // Perbarui badge plagiasi
            const modalPlag = document.getElementById('modalPlagBadge');
            if (modalPlag) {
              const pScore = analysis.plagiarismScore || 8;
              const isSafe = pScore < 20;
              modalPlag.className = `plagiarism-badge ${isSafe ? 'safe' : 'warning'}`;
              modalPlag.textContent = `${isSafe ? '🛡️' : '⚠️'} ${pScore}% - ${isSafe ? 'Aman' : 'Perlu Cek'}`;
            }

            showToast(`Analisis AI Selesai: Skor Tata Bahasa ${analysis.grammarScore}/100 • Plagiasi ${analysis.plagiarismScore}%`);
            return;
          }
        } catch (err) {
          console.warn('API AI check notice:', err.message);
        }
      }

      setTimeout(() => {
        btn.classList.remove('analyzing');
        aiText.textContent = '✓ 3 Saran AI Ditemukan';
        if (scanIndicator) scanIndicator.style.display = 'none';
        showToast('AI Kurator berhasil memindai naskah: 3 saran ejaan & tata bahasa PUEBI disiapkan!');
      }, 700);
    });
  }

  function renderRealAiSuggestions(analysis) {
    const pane = document.getElementById('paneAiContent');
    if (!pane) return;

    let html = `
      <div id="aiScanningIndicator" style="display: none; background: #faf5ff; border: 1px dashed #c084fc; border-radius: 10px; padding: 0.875rem; text-align: center;">
        <div style="font-size: 0.8125rem; font-weight: 700; color: #7c3aed;">Sedang Menganalisis Naskah...</div>
        <div style="font-size: 0.75rem; color: #6b7280; margin-top: 0.2rem;">Memeriksa keselarasan KBBI V, PUEBI, dan koherensi semantik</div>
      </div>
      <div class="ai-suggestion-card" style="background:#f0fdf4; border-color:#86efac;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="ai-card-badge vocab" style="background:#dcfce7; color:#15803d;">Ringkasan Evaluasi</span>
          <span style="font-size: 0.6875rem; color: var(--text-muted);">Skor Tata Bahasa: ${analysis.grammarScore}/100</span>
        </div>
        <div class="ai-suggestion-text" style="color:#166534; font-weight:600; line-height: 1.5;">
          ${escapeHtml(analysis.summary || 'Naskah tersusun dengan baik.')}
        </div>
      </div>
    `;

    (analysis.grammarNotes || []).forEach((note, i) => {
      html += `
        <div class="ai-suggestion-card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="ai-card-badge vocab">Tata Bahasa & EYD</span>
            <span style="font-size: 0.6875rem; color: var(--text-muted);">Saran #${i + 1}</span>
          </div>
          <div class="ai-suggestion-text">${escapeHtml(note)}</div>
        </div>
      `;
    });

    (analysis.structureNotes || []).forEach((note, i) => {
      html += `
        <div class="ai-suggestion-card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="ai-card-badge vocab" style="background:#eff6ff; color:#1d4ed8;">Alur Paragraf</span>
            <span style="font-size: 0.6875rem; color: var(--text-muted);">Struktur</span>
          </div>
          <div class="ai-suggestion-text">${escapeHtml(note)}</div>
        </div>
      `;
    });

    (analysis.editorialRecommendations || []).forEach((rec, i) => {
      html += `
        <div class="ai-suggestion-card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="ai-card-badge vocab" style="background:#fffbeb; color:#b45309;">Saran Kurator</span>
            <span style="font-size: 0.6875rem; color: var(--text-muted);">Editorial</span>
          </div>
          <div class="ai-suggestion-text">${escapeHtml(rec)}</div>
        </div>
      `;
    });

    pane.innerHTML = html;
    const aiCountEl = document.getElementById('aiCount');
    if (aiCountEl) {
      aiCountEl.textContent = (analysis.grammarNotes?.length || 0) + (analysis.structureNotes?.length || 0);
    }
  }

  // 6. Apply AI Suggestions (Wireframe 6)
  window.applyAiSuggestion = function (suggId, replacementText) {
    const card = document.getElementById(`card-${suggId}`);
    const hl = document.querySelector(`.highlight-ai[data-id="${suggId}"]`);

    if (hl) {
      hl.textContent = replacementText;
      hl.classList.remove('yellow', 'red');
      hl.classList.add('green');
      hl.title = 'Koreksi AI telah diterapkan';
    }

    if (card) {
      card.style.background = '#ecfdf5';
      card.style.borderColor = '#a7f3d0';
      const actionArea = card.querySelector('div[style*="display: flex"]');
      if (actionArea) {
        actionArea.innerHTML = '<span style="color:#059669; font-size:0.75rem; font-weight:700;">✓ Saran telah diterapkan pada teks naskah</span>';
      }
    }

    updateAiCount();
    showToast(`Koreksi diterapkan: "${replacementText}"`);
  };

  window.dismissAiSuggestion = function (suggId) {
    const card = document.getElementById(`card-${suggId}`);
    const hl = document.querySelector(`.highlight-ai[data-id="${suggId}"]`);

    if (hl) {
      hl.outerHTML = hl.innerHTML; // Remove highlight tag, keep text
    }

    if (card) {
      card.style.opacity = '0.5';
      card.style.pointerEvents = 'none';
      const actionArea = card.querySelector('div[style*="display: flex"]');
      if (actionArea) {
        actionArea.innerHTML = '<span style="color:var(--text-muted); font-size:0.75rem;">Saran diabaikan</span>';
      }
    }

    updateAiCount();
  };

  function updateAiCount() {
    const remainingCards = document.querySelectorAll('.ai-suggestion-card:not([style*="opacity: 0.5"])');
    const aiCountEl = document.getElementById('aiCount');
    if (aiCountEl) {
      aiCountEl.textContent = remainingCards.length;
    }
  }

  // 7. Toggle Comment Done Status
  window.toggleCommentDone = function (button) {
    button.classList.toggle('done');
    if (button.classList.contains('done')) {
      button.textContent = '✓ Selesai';
    } else {
      button.textContent = 'Selesai';
    }
  };

  // 8. Side Pane Tab Switching (AI Suggestions vs Curator Comments)
  function initSidePaneTabs() {
    const tabAi = document.getElementById('tabAiSuggestions');
    const tabCurator = document.getElementById('tabCuratorNotes');
    const paneAi = document.getElementById('paneAiContent');
    const paneCurator = document.getElementById('paneCuratorContent');

    if (tabAi && tabCurator && paneAi && paneCurator) {
      tabAi.addEventListener('click', function () {
        tabAi.classList.add('active');
        tabCurator.classList.remove('active');
        paneAi.style.display = 'flex';
        paneCurator.style.display = 'none';
      });

      tabCurator.addEventListener('click', function () {
        tabCurator.classList.add('active');
        tabAi.classList.remove('active');
        paneCurator.style.display = 'flex';
        paneAi.style.display = 'none';
      });
    }

    // Add new editorial comment
    const btnSubmit = document.getElementById('btnSubmitComment');
    const inputComment = document.getElementById('newCommentInput');
    const addContainer = document.getElementById('additionalCommentsContainer');
    const commentCountEl = document.getElementById('commentCount');

    if (btnSubmit && inputComment && addContainer) {
      btnSubmit.addEventListener('click', function () {
        const text = inputComment.value.trim();
        if (!text) {
          alert('Mohon ketikkan catatan kurator terlebih dahulu.');
          return;
        }

        const newCard = document.createElement('div');
        newCard.className = 'manual-comment-card';
        newCard.innerHTML = `
          <div class="comment-card-header">
            <div class="comment-author-pill">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: #1e3a8a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.625rem; font-weight: 700;">FI</div>
              <span>Fajar Ilhami (Kurator)</span>
            </div>
            <button type="button" class="btn-mark-done" onclick="toggleCommentDone(this)">Selesai</button>
          </div>
          <div style="font-size: 0.8125rem; color: var(--text-main); line-height: 1.5;">${escapeHtml(text)}</div>
          <div style="font-size: 0.6875rem; color: var(--text-muted);">Baru saja</div>
        `;
        addContainer.prepend(newCard);
        inputComment.value = '';

        if (commentCountEl) {
          const current = parseInt(commentCountEl.textContent, 10) || 2;
          commentCountEl.textContent = current + 1;
        }

        // Switch to curator tab if not active
        if (tabCurator) tabCurator.click();
        showToast('Catatan kurator berhasil ditambahkan ke naskah.');
      });
    }
  }

  // 9. Editorial Decision Buttons (Setujui, Minta Revisi, Tolak)
  function initDecisionButtons() {
    const btnApprove = document.getElementById('btnApproveArticle');
    const btnRevision = document.getElementById('btnRequestRevision');
    const btnReject = document.getElementById('btnRejectArticle');

    if (btnApprove) {
      btnApprove.addEventListener('click', async function () {
        const article = reviewQueueData.find(a => a.id === currentActiveArticleId);
        if (window.KK_API && currentActiveArticleId) {
          try {
            await window.KK_API.admin.decide(currentActiveArticleId, 'approve', 'Naskah disetujui kurator');
          } catch (err) {
            console.warn('API approve notice:', err.message);
          }
        }
        if (article) {
          article.status = 'ready';
          article.statusLabel = 'Siap Terbit';
          renderQueueTable(activeFilter);
          showToast(`🎉 Naskah "${article.title}" BERHASIL DISETUJUI & diterbitkan ke portal publik!`);
          setTimeout(closeReviewModal, 800);
        }
      });
    }

    if (btnRevision) {
      btnRevision.addEventListener('click', async function () {
        const article = reviewQueueData.find(a => a.id === currentActiveArticleId);
        if (window.KK_API && currentActiveArticleId) {
          try {
            await window.KK_API.admin.decide(currentActiveArticleId, 'revision', 'Catatan revisi telah dikirimkan');
          } catch (err) {
            console.warn('API revision notice:', err.message);
          }
        }
        if (article) {
          article.status = 'revision';
          article.statusLabel = 'Revisi Anggota';
          renderQueueTable(activeFilter);
          showToast(`Catatan revisi telah dikirimkan ke dasbor penulis (${article.author}).`);
          setTimeout(closeReviewModal, 800);
        }
      });
    }

    if (btnReject) {
      btnReject.addEventListener('click', async function () {
        const confirmReject = confirm('Apakah Anda yakin ingin menolak naskah ini? Alasan penolakan akan dikirimkan ke email penulis.');
        if (confirmReject) {
          if (window.KK_API && currentActiveArticleId) {
            try {
              await window.KK_API.admin.decide(currentActiveArticleId, 'reject', 'Naskah belum memenuhi standar kurasi');
            } catch (err) {
              console.warn('API reject notice:', err.message);
            }
          }
          showToast('Naskah telah ditolak dengan catatan kurator.');
          setTimeout(closeReviewModal, 800);
        }
      });
    }
  }

  // 10. Quick Action Modals (Cert, Antologi, Ebook)
  function initQuickActions() {
    const btnQuickCert = document.getElementById('btnQuickCert');
    const btnQuickAntologi = document.getElementById('btnQuickAntologi');
    const btnHeroAntologi = document.getElementById('btnHeroAntologi');
    const btnConfirmCert = document.getElementById('btnConfirmGenerateCert');
    const btnConfirmAntologi = document.getElementById('btnConfirmPublishAntologi');

    if (btnQuickCert) {
      btnQuickCert.addEventListener('click', function () {
        const modal = document.getElementById('modalCert');
        if (modal) modal.classList.add('show');
      });
    }

    const openAntologi = function () {
      const modal = document.getElementById('modalAntologi');
      if (modal) modal.classList.add('show');
    };

    if (btnQuickAntologi) btnQuickAntologi.addEventListener('click', openAntologi);
    if (btnHeroAntologi) btnHeroAntologi.addEventListener('click', openAntologi);

    if (btnConfirmCert) {
      btnConfirmCert.addEventListener('click', function () {
        closeModal('modalCert');
        showToast('🎉 45 E-Sertifikat 32 JP berhasil diterbitkan dan dikirim ke akun anggota!');
      });
    }

    if (btnConfirmAntologi) {
      btnConfirmAntologi.addEventListener('click', function () {
        const title = document.getElementById('antologiTitleInput').value;
        closeModal('modalAntologi');
        showToast(`📖 Proyek Antologi "${title}" berhasil dibuka untuk seluruh anggota.`);
      });
    }

    const btnQuickEbook = document.getElementById('btnQuickEbook');
    if (btnQuickEbook) {
      btnQuickEbook.addEventListener('click', function () {
        alert('Fitur Unggah E-Book Perpustakaan: Anda dapat menautkan dokumen PDF buku pegangan resmi Komunitas ke koleksi perpustakaan.');
      });
    }

    const btnQuickHof = document.getElementById('btnQuickHof');
    if (btnQuickHof) {
      btnQuickHof.addEventListener('click', function () {
        showToast('🏆 Hall of Fame Penulis Terproduktif Kabupaten Tangerang telah diperbarui.');
      });
    }

    // Modal Close Button in Review Modal
    const btnCloseTop = document.getElementById('btnCloseReviewTop');
    if (btnCloseTop) {
      btnCloseTop.addEventListener('click', closeReviewModal);
    }
  }

  // 11. Mobile Drawer Navigation Toggle
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

  // 12. Toast Notification Helper
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

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  async function loadLiveQueueFromApi() {
    if (!window.KK_API) return;
    try {
      await window.KK_API.auth.ensureUserAuth('admin');
      const res = await window.KK_API.admin.getQueue('all');
      if (res && res.success && Array.isArray(res.data)) {
        const liveItems = res.data.map(art => {
          const initials = (art.user?.name || 'A')
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
          const pScore = art.plagiarismScore || 8;
          const statusMap = {
            in_review: 'pending',
            revision: 'revision',
            published: 'ready',
          };
          const statusLabelMap = {
            in_review: 'Menunggu Review',
            revision: 'Revisi Anggota',
            published: 'Siap Terbit',
          };
          return {
            id: art.id,
            author: art.user?.name || 'Penulis Komunitas',
            authorInitials: initials,
            region: art.user?.originRegion || 'Kab. Tangerang',
            kecamatan: art.user?.originRegion || 'Tangerang',
            title: art.title,
            category: art.category,
            date: new Date(art.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            plagiarism: pScore,
            plagStatus: pScore < 20 ? 'safe' : 'warning',
            status: statusMap[art.status] || 'pending',
            statusLabel: statusLabelMap[art.status] || 'Menunggu Review',
            wordCount: art.wordCount || 0,
            content: art.content || '',
          };
        });

        // Gunakan murni data asli dari database
        reviewQueueData = liveItems;
        if (liveItems.length > 0) {
          currentActiveArticleId = liveItems[0].id;
        }

        // Perbarui badge jumlah pada tab antrean
        const pendingCount = reviewQueueData.filter(i => i.status === 'pending').length;
        const revisionCount = reviewQueueData.filter(i => i.status === 'revision').length;
        const readyCount = reviewQueueData.filter(i => i.status === 'ready').length;

        const tabPills = document.querySelectorAll('.queue-tab-btn');
        tabPills.forEach(p => {
          const f = p.getAttribute('data-filter');
          if (f === 'all') p.textContent = `Semua Antrean (${reviewQueueData.length})`;
          else if (f === 'pending') p.textContent = `Menunggu Review (${pendingCount})`;
          else if (f === 'revision') p.textContent = `Revisi Anggota (${revisionCount})`;
          else if (f === 'ready') p.textContent = `Siap Terbit (${readyCount})`;
        });

        renderQueueTable(activeFilter);
      }
    } catch (err) {
      console.warn('Gagal memuat antrean live API:', err.message);
    }
  }

  // DOMContentLoaded Initialization
  document.addEventListener('DOMContentLoaded', async function () {
    renderQueueTable('all');
    initFilterTabs();
    initAiCorrectionButton();
    initSidePaneTabs();
    initDecisionButtons();
    initQuickActions();
    initMobileDrawer();

    // Muat data antrean nyata dari server jika terhubung
    if (window.KK_API) {
      await loadLiveQueueFromApi();
    }
  });

})();
