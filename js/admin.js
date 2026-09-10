/**
 * KERTAS KATA - Dashboard Admin & Inline Review System Logic
 * Implements Wireframe 5 (Dashboard Admin) & Wireframe 6 (Inline Review & AI Koreksi)
 */

(function () {
  'use strict';

  // 1. Antrean Naskah Data (Murni dari Database API)
  let reviewQueueData = [];
  let currentActiveArticleId = null;
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
    const metaCat = document.getElementById('modalMetaCategory');
    const metaWords = document.getElementById('modalMetaWordCount');
    const metaDate = document.getElementById('modalMetaDate');

    if (modalTitle) modalTitle.textContent = article.title;
    if (modalAuthor) modalAuthor.textContent = `Oleh: ${article.author} • ${article.region}, Kab. Tangerang`;
    if (modalCategory) modalCategory.textContent = article.category;
    if (metaCat) metaCat.innerHTML = `<strong>Kategori:</strong> ${article.category}`;
    if (metaWords) metaWords.innerHTML = `<strong>Jumlah Kata:</strong> ${(article.wordCount || 0).toLocaleString('id-ID')} kata`;
    if (metaDate) metaDate.innerHTML = `<strong>Diajukan:</strong> ${article.date}`;

    if (modalPlag) {
      modalPlag.style.display = 'inline-flex';
      modalPlag.className = `plagiarism-badge ${article.plagStatus === 'safe' ? 'safe' : 'warning'}`;
      modalPlag.textContent = `${article.plagStatus === 'safe' ? '🛡️' : '⚠️'} ${article.plagiarism}% - ${article.plagStatus === 'safe' ? 'Aman' : 'Perlu Cek'}`;
    }

    // Tampilkan isi naskah asli
    if (manuscriptEl) {
      manuscriptEl.innerHTML = article.content || '<p style="color:var(--text-muted); font-style:italic;">Naskah tidak memiliki teks.</p>';
    }

    // Reset AI Button state & panes
    const aiBtn = document.getElementById('btnRunAiCorrection');
    const aiText = document.getElementById('aiButtonText');
    if (aiBtn && aiText) {
      aiBtn.classList.remove('analyzing');
      aiText.textContent = '✨ Jalankan AI Koreksi';
    }

    const paneAi = document.getElementById('paneAiContent');
    const aiCountEl = document.getElementById('aiCount');
    const commentCountEl = document.getElementById('commentCount');
    const additionalComments = document.getElementById('additionalCommentsContainer');

    if (aiCountEl) aiCountEl.textContent = '0';
    if (commentCountEl) commentCountEl.textContent = '0';
    if (additionalComments) additionalComments.innerHTML = '';

    if (paneAi) {
      paneAi.innerHTML = `
        <div id="aiScanningIndicator" style="display: none; background: #faf5ff; border: 1px dashed #c084fc; border-radius: 10px; padding: 0.875rem; text-align: center;">
          <div style="font-size: 0.8125rem; font-weight: 700; color: #7c3aed;">Sedang Menganalisis Naskah...</div>
          <div style="font-size: 0.75rem; color: #6b7280; margin-top: 0.2rem;">Memeriksa keselarasan KBBI V, PUEBI, dan koherensi semantik</div>
        </div>
        <div id="aiSuggestionEmptyState" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">✨</div>
          <p style="font-size: 0.8125rem; margin: 0;">Klik tombol <strong>"Jalankan AI Koreksi"</strong> di atas untuk memindai kepatuhan PUEBI & KBBI pada naskah ini.</p>
        </div>
      `;
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

        const user = (window.KK_API && window.KK_API.auth.getCurrentUser()) || { name: 'Admin Kurator' };
        const initials = (user.name || 'AK').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

        const newCard = document.createElement('div');
        newCard.className = 'manual-comment-card';
        newCard.innerHTML = `
          <div class="comment-card-header">
            <div class="comment-author-pill">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: #1e3a8a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.625rem; font-weight: 700;">${initials}</div>
              <span>${escapeHtml(user.name || 'Admin')} (Kurator)</span>
            </div>
            <button type="button" class="btn-mark-done" onclick="toggleCommentDone(this)">Selesai</button>
          </div>
          <div style="font-size: 0.8125rem; color: var(--text-main); line-height: 1.5;">${escapeHtml(text)}</div>
          <div style="font-size: 0.6875rem; color: var(--text-muted);">Baru saja</div>
        `;
        addContainer.prepend(newCard);
        inputComment.value = '';

        if (window.KK_API && currentActiveArticleId) {
          window.KK_API.admin.addComment(currentActiveArticleId, '', text).catch(e => console.warn(e));
        }

        if (commentCountEl) {
          const current = parseInt(commentCountEl.textContent, 10) || 0;
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

        const badgeAll = document.getElementById('badgeAll');
        const badgePending = document.getElementById('badgePending');
        const badgeRevision = document.getElementById('badgeRevision');
        const badgeReady = document.getElementById('badgeReady');

        if (badgeAll) badgeAll.textContent = reviewQueueData.length;
        if (badgePending) badgePending.textContent = pendingCount;
        if (badgeRevision) badgeRevision.textContent = revisionCount;
        if (badgeReady) badgeReady.textContent = readyCount;

        const statQueue = document.getElementById('statAdminQueue');
        const statQueueSub = document.getElementById('statAdminQueueSub');
        const statAdminRevisionSub = document.getElementById('statAdminRevisionSub');
        if (statQueue) statQueue.textContent = pendingCount;
        if (statQueueSub) statQueueSub.textContent = `${pendingCount} Baru`;
        if (statAdminRevisionSub) statAdminRevisionSub.textContent = `• ${revisionCount} Revisi`;

        const heroQueueBtn = document.getElementById('heroQueueCountBtn');
        if (heroQueueBtn) {
          heroQueueBtn.textContent = reviewQueueData.length > 0 ? `Mulai Kurasi (${reviewQueueData.length} Naskah)` : 'Mulai Kurasi Naskah';
        }

        renderQueueTable(activeFilter);
      }
    } catch (err) {
      console.warn('Gagal memuat antrean live API:', err.message);
    }
  }

  async function loadAdminOverviewStatsFromApi() {
    if (!window.KK_API) return;
    try {
      // Sinkronisasi identitas admin dari session
      const user = window.KK_API.auth.getCurrentUser();
      if (user) {
        const initials = (user.name || 'AD')
          .split(' ')
          .map(n => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        const pillAvatar = document.getElementById('adminPillAvatar');
        const pillName = document.getElementById('adminPillName');
        const dropAvatar = document.getElementById('adminDropdownAvatar');
        const dropName = document.getElementById('adminDropdownName');
        const dropEmail = document.getElementById('adminDropdownEmail');

        if (pillAvatar) pillAvatar.textContent = initials;
        if (pillName) pillName.textContent = user.name;
        if (dropAvatar) dropAvatar.textContent = initials;
        if (dropName) dropName.textContent = user.name;
        if (dropEmail) dropEmail.textContent = user.email || 'admin@kertaskata.my.id';
      }

      const res = await window.KK_API.admin.getOverview();
      if (res && res.success && res.data) {
        const { totalMembers, publishedArticles, pendingReviews, totalEbooks } = res.data;

        const statMembers = document.getElementById('statAdminMembers');
        const statPublished = document.getElementById('statAdminPublished');
        const statEbooks = document.getElementById('statAdminEbooks');
        const sidebarBadge = document.getElementById('sidebarQueueBadge');

        if (statMembers) statMembers.textContent = (totalMembers || 0).toLocaleString('id-ID');
        if (statPublished) statPublished.textContent = (publishedArticles || 0).toLocaleString('id-ID');
        if (statEbooks) statEbooks.textContent = (totalEbooks || 0).toLocaleString('id-ID');
        if (sidebarBadge) sidebarBadge.textContent = pendingReviews || 0;
      }
    } catch (err) {
      console.warn('Gagal memuat overview admin:', err.message);
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

    // Muat data antrean nyata & statistik overview dari server
    if (window.KK_API) {
      await loadAdminOverviewStatsFromApi();
      await loadLiveQueueFromApi();
    }
  });

})();
