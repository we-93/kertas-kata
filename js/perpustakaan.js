/**
 * KERTAS KATA - Perpustakaan Digital (Ebook) Logic
 * Handles filtering (free/premium/rak buku), categories, reader modal with custom themes/font sizes,
 * bookmark toggling, and checkout payment simulation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Dynamic Ebook Data from API ---
  let ebooksData = [];

  async function loadEbooksFromApi() {
    if (!window.KK_API) return;
    try {
      const res = await window.KK_API.library.getEbooks();
      if (res && res.success && Array.isArray(res.data)) {
        ebooksData = res.data.map(item => ({
          id: item.id,
          title: item.title,
          author: item.author || 'Tim Penulis KERTAS KATA',
          category: (item.category || 'pendidikan').toLowerCase().replace(/[^a-z]/g, ''),
          categoryLabel: item.category || 'Pendidikan & Modul',
          type: item.accessType || 'free',
          price: item.price || 0,
          priceLabel: item.price > 0 ? `Rp ${item.price.toLocaleString('id-ID')}` : 'GRATIS',
          rating: item.rating || 5.0,
          reviewsCount: item.downloads || 0,
          pages: item.pages || 120,
          fileSize: item.fileSize || '4.5 MB',
          isBookmarked: false,
          coverGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          coverPattern: '📚',
          summary: item.synopsis || 'Dokumentasi karya dan modul literasi digital Kabupaten Tangerang.',
          chapterTitle: 'Bab 1: Sampel Bacaan Naskah',
          sampleContent: [
            item.sampleChapter ? item.sampleChapter.replace(/<[^>]*>?/gm, ' ') : 'Bab pratinjau buku digital ini akan segera diperbarui oleh dewan kurator.'
          ],
        }));

        updateBookmarkCounters();
        renderEbooks();
      }
    } catch (err) {
      console.warn('Gagal memuat e-book dari API:', err.message);
    }
  }

  // --- State Variables ---
  let activeTabFilter = 'all'; // 'all' | 'free' | 'premium' | 'bookmark'
  let activeCategoryFilter = 'all';
  let activeReaderFontSize = 16;
  let currentActiveBook = null;

  // --- DOM Elements ---
  const gridContainer = document.getElementById('ebooksGrid');
  const filterPills = document.querySelectorAll('.lib-filter-pill');
  const categorySelect = document.getElementById('categoryFilter');
  const bookmarkPillCount = document.getElementById('bookmarkPillCount');
  const statBookmarkedEbooks = document.getElementById('statBookmarkedEbooks');
  const libToast = document.getElementById('libToast');
  const toastMessage = document.getElementById('toastMessage');

  // Reader Modal DOM
  const readerModal = document.getElementById('readerModal');
  const readerModalClose = document.getElementById('readerModalClose');
  const readerModalTitle = document.getElementById('readerModalTitle');
  const readerChapterTitle = document.getElementById('readerChapterTitle');
  const readerContentBody = document.getElementById('readerContentBody');
  const fontDecBtn = document.getElementById('btnFontDec');
  const fontIncBtn = document.getElementById('btnFontInc');
  const themeLightBtn = document.getElementById('themeLight');
  const themeSepiaBtn = document.getElementById('themeSepia');
  const themeDarkBtn = document.getElementById('themeDark');

  // Checkout Modal DOM
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutModalClose = document.getElementById('checkoutModalClose');
  const checkoutBookTitle = document.getElementById('checkoutBookTitle');
  const checkoutBookAuthor = document.getElementById('checkoutBookAuthor');
  const checkoutBookPrice = document.getElementById('checkoutBookPrice');
  const checkoutBookThumb = document.getElementById('checkoutBookThumb');
  const btnSubmitPayment = document.getElementById('btnSubmitPayment');
  const btnCancelPayment = document.getElementById('btnCancelPayment');
  const paymentOptions = document.querySelectorAll('.payment-option-card');
  const bankAccNumber = document.getElementById('bankAccNumber');
  const btnCopyAcc = document.getElementById('btnCopyAcc');
  const proofDropzone = document.getElementById('proofDropzone');
  const proofFileInput = document.getElementById('proofFileInput');
  const uploadStatusText = document.getElementById('uploadStatusText');

  // Bank Account Numbers mapping
  const bankAccounts = {
    'bjb': { number: '0012-9843-2109-001', name: 'Kasda KERTAS KATA' },
    'bca': { number: '7310-8890-41', name: 'Yayasan Literasi KERTAS KATA' },
    'mandiri': { number: '156-00-1928374-5', name: 'Koleksi Digital Mandiri' },
    'qris': { number: 'NMID: ID1020304050601', name: 'QRIS Literasi KERTAS KATA' }
  };

  // --- Functions ---

  // Toast Notification
  function showToast(msg, duration = 3000) {
    if (!libToast) return;
    toastMessage.textContent = msg;
    libToast.classList.add('active');
    setTimeout(() => {
      libToast.classList.remove('active');
    }, duration);
  }

  // Update All Counters & Stats (Real-time dari Database)
  function updateBookmarkCounters() {
    const totalCount = ebooksData.length;
    const freeCount = ebooksData.filter(b => b.type === 'free').length;
    const premiumCount = ebooksData.filter(b => b.type === 'premium').length;
    const bookmarkedCount = ebooksData.filter(b => b.isBookmarked).length;

    // Stat Cards
    const statTotal = document.getElementById('statTotalEbooks');
    const statFree = document.getElementById('statFreeEbooks');
    const statPremium = document.getElementById('statPremiumEbooks');
    if (statTotal) statTotal.textContent = totalCount;
    if (statFree) statFree.textContent = freeCount;
    if (statPremium) statPremium.textContent = premiumCount;
    if (statBookmarkedEbooks) statBookmarkedEbooks.textContent = bookmarkedCount;

    // Filter Pills
    const pillAll = document.getElementById('pillCountAll');
    const pillFree = document.getElementById('pillCountFree');
    const pillPremium = document.getElementById('pillCountPremium');
    if (pillAll) pillAll.textContent = totalCount;
    if (pillFree) pillFree.textContent = freeCount;
    if (pillPremium) pillPremium.textContent = premiumCount;
    if (bookmarkPillCount) bookmarkPillCount.textContent = bookmarkedCount;
  }

  // Render Ebook Cards
  function renderEbooks() {
    if (!gridContainer) return;

    // Filter data
    const filtered = ebooksData.filter(item => {
      // Tab filter
      if (activeTabFilter === 'free' && item.type !== 'free') return false;
      if (activeTabFilter === 'premium' && item.type !== 'premium') return false;
      if (activeTabFilter === 'bookmark' && !item.isBookmarked) return false;

      // Category filter
      if (activeCategoryFilter !== 'all' && item.category !== activeCategoryFilter) return false;

      return true;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: #ffffff; border-radius: 18px; border: 1.5px dashed var(--border-medium); box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">📚</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">Koleksi Buku Sedang Disiapkan</h3>
          <p style="font-size: 0.875rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 1rem; line-height: 1.6;">
            Belum ada koleksi buku digital pada kategori ini. Tim kurator dan pengelola perpustakaan akan segera memperbarui koleksi buku digital resmi.
          </p>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(book => {
      const isFree = book.type === 'free';
      const badgeClass = isFree ? 'free' : 'premium';
      const badgeText = isFree ? 'GRATIS' : '⭐ PREMIUM';
      const bookmarkedClass = book.isBookmarked ? 'bookmarked' : '';
      const bookmarkIconFill = book.isBookmarked ? 'currentColor' : 'none';

      return `
        <article class="ebook-card" data-id="${book.id}">
          <div class="ebook-cover-container" style="background: ${book.coverGradient};">
            <span class="ebook-badge-type ${badgeClass}">${badgeText}</span>
            <button class="btn-bookmark-toggle ${bookmarkedClass}" data-book-id="${book.id}" title="${book.isBookmarked ? 'Hapus dari Rak Buku' : 'Simpan ke Rak Buku'}" aria-label="Toggle Bookmark">
              <svg width="18" height="18" fill="${bookmarkIconFill}" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ffffff; padding: 1.5rem; text-align: center;">
              <span style="font-size: 3rem; margin-bottom: 0.5rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">${book.coverPattern}</span>
              <div style="font-family: var(--font-heading); font-weight: 800; font-size: 1.05rem; line-height: 1.3; text-shadow: 0 2px 4px rgba(0,0,0,0.4);">${book.title}</div>
              <div style="font-size: 0.75rem; opacity: 0.9; margin-top: 0.35rem;">${book.author}</div>
            </div>
          </div>

          <div class="ebook-card-body">
            <span class="ebook-category-tag">${book.categoryLabel}</span>
            <h2 class="ebook-title">${book.title}</h2>
            <div class="ebook-author">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>${book.author}</span>
            </div>
            <p style="font-size: 0.8125rem; color: #64748b; line-height: 1.5; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${book.summary}
            </p>

            <div class="ebook-meta-row">
              <div class="ebook-rating-wrap">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>${book.rating}</span>
                <span style="color: #94a3b8; font-weight: normal;">(${book.reviewsCount})</span>
              </div>
              <div>
                ${isFree 
                  ? `<span class="ebook-price-free">GRATIS</span>` 
                  : `<span class="ebook-price-tag">${book.priceLabel}</span>`
                }
              </div>
            </div>
          </div>

          <div class="ebook-card-footer">
            ${isFree ? `
              <button class="btn-card-action btn-read-online" data-action="read" data-book-id="${book.id}">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Baca Online</span>
              </button>
              <button class="btn-card-action btn-download-pdf" data-action="download" data-book-id="${book.id}">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Unduh PDF</span>
              </button>
            ` : `
              <button class="btn-card-action btn-preview-sample" data-action="preview" data-book-id="${book.id}">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Preview Bab 1</span>
              </button>
              <button class="btn-card-action btn-buy-ebook" data-action="buy" data-book-id="${book.id}">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Beli Ebook</span>
              </button>
            `}
          </div>
        </article>
      `;
    }).join('');

    attachCardEventListeners();
  }

  // Attach dynamic event listeners to cards
  function attachCardEventListeners() {
    // Bookmark toggles
    document.querySelectorAll('.btn-bookmark-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookId = btn.getAttribute('data-book-id');
        const book = ebooksData.find(b => b.id === bookId);
        if (book) {
          book.isBookmarked = !book.isBookmarked;
          updateBookmarkCounters();
          showToast(book.isBookmarked 
            ? `"${book.title}" disimpan ke Rak Buku Saya.` 
            : `"${book.title}" dihapus dari Rak Buku Saya.`
          );
          renderEbooks();
        }
      });
    });

    // Card Action Buttons
    document.querySelectorAll('.btn-card-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        const bookId = btn.getAttribute('data-book-id');
        const book = ebooksData.find(b => b.id === bookId);
        if (!book) return;

        if (action === 'read') {
          openReaderModal(book, false);
        } else if (action === 'download') {
          showToast(`Mengunduh file PDF "${book.title}" (${book.fileSize})...`);
        } else if (action === 'preview') {
          openReaderModal(book, true);
        } else if (action === 'buy') {
          openCheckoutModal(book);
        }
      });
    });
  }

  // Filter Tabs Event Listeners
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeTabFilter = pill.getAttribute('data-filter');
      renderEbooks();
    });
  });

  // Category Dropdown Filter
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      activeCategoryFilter = e.target.value;
      renderEbooks();
    });
  }

  // --- READER PREVIEW MODAL LOGIC ---
  function openReaderModal(book, isSamplePreview) {
    currentActiveBook = book;
    if (readerModalTitle) readerModalTitle.textContent = book.title;
    if (readerChapterTitle) readerChapterTitle.textContent = book.chapterTitle;

    // Content build
    let contentHtml = book.sampleContent.map(para => {
      if (para.startsWith('Kutipan Pembuka:')) {
        return `<blockquote class="reader-pull-quote">${para.replace('Kutipan Pembuka:', '').trim()}</blockquote>`;
      }
      return `<p style="margin-bottom: 1.25rem;">${para}</p>`;
    }).join('');

    // If Premium Preview, append the paywall gate box
    if (isSamplePreview) {
      contentHtml += `
        <div class="reader-premium-gate-box">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔒</div>
          <h4 style="font-size: 1.125rem; font-weight: 800; margin-bottom: 0.5rem;">Pratinjau Bab 1 Selesai</h4>
          <p style="font-size: 0.875rem; margin-bottom: 1.25rem; line-height: 1.5; color: #78350f;">
            Anda baru saja membaca bab pratinjau gratis. Untuk mengakses 11 bab lanjutan, pembahasan lengkap, dan mendapatkan file PDF orisinal, silakan miliki edisi penuh seharga <strong>${book.priceLabel}</strong>.
          </p>
          <button id="btnUnlockFromReader" class="btn-card-action btn-buy-ebook" style="padding: 0.75rem 1.75rem; font-size: 0.9375rem; display: inline-flex; width: auto;">
            <span>Miliki Edisi Lengkap Sekarang</span>
          </button>
        </div>
      `;
    } else {
      contentHtml += `
        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px dashed var(--border-subtle); display: flex; align-items: center; justify-content: space-between; flex-wrap: gap: 1rem;">
          <span style="font-size: 0.8125rem; color: #64748b;">Halaman 1 dari ${book.pages} • Versi Digital Lengkap</span>
          <button id="btnDownloadFromReader" class="btn-card-action btn-download-pdf" style="width: auto; padding: 0.5rem 1.25rem;">
            <span>Unduh Ebook PDF (${book.fileSize})</span>
          </button>
        </div>
      `;
    }

    if (readerContentBody) {
      readerContentBody.innerHTML = contentHtml;
      readerContentBody.style.fontSize = `${activeReaderFontSize}px`;
    }

    // Attach unlock/download listener inside reader
    const btnUnlock = document.getElementById('btnUnlockFromReader');
    if (btnUnlock) {
      btnUnlock.addEventListener('click', () => {
        closeReaderModal();
        openCheckoutModal(book);
      });
    }

    const btnDownloadReader = document.getElementById('btnDownloadFromReader');
    if (btnDownloadReader) {
      btnDownloadReader.addEventListener('click', () => {
        showToast(`Mengunduh file PDF "${book.title}" (${book.fileSize})...`);
      });
    }

    if (readerModal) readerModal.classList.add('active');
  }

  function closeReaderModal() {
    if (readerModal) readerModal.classList.remove('active');
  }

  if (readerModalClose) {
    readerModalClose.addEventListener('click', closeReaderModal);
  }

  // Reader Font Size Controls
  if (fontDecBtn) {
    fontDecBtn.addEventListener('click', () => {
      if (activeReaderFontSize > 13) {
        activeReaderFontSize -= 1.5;
        if (readerContentBody) readerContentBody.style.fontSize = `${activeReaderFontSize}px`;
      }
    });
  }

  if (fontIncBtn) {
    fontIncBtn.addEventListener('click', () => {
      if (activeReaderFontSize < 24) {
        activeReaderFontSize += 1.5;
        if (readerContentBody) readerContentBody.style.fontSize = `${activeReaderFontSize}px`;
      }
    });
  }

  // Reader Theme Toggles
  function setReaderTheme(theme) {
    if (!readerContentBody) return;
    readerContentBody.classList.remove('sepia-theme', 'dark-theme');
    if (theme === 'sepia') readerContentBody.classList.add('sepia-theme');
    if (theme === 'dark') readerContentBody.classList.add('dark-theme');
  }

  if (themeLightBtn) themeLightBtn.addEventListener('click', () => setReaderTheme('light'));
  if (themeSepiaBtn) themeSepiaBtn.addEventListener('click', () => setReaderTheme('sepia'));
  if (themeDarkBtn) themeDarkBtn.addEventListener('click', () => setReaderTheme('dark'));

  // --- CHECKOUT & PEMBAYARAN MODAL LOGIC (LB-05) ---
  function openCheckoutModal(book) {
    currentActiveBook = book;
    if (checkoutBookTitle) checkoutBookTitle.textContent = book.title;
    if (checkoutBookAuthor) checkoutBookAuthor.textContent = `Oleh: ${book.author}`;
    if (checkoutBookPrice) checkoutBookPrice.textContent = book.priceLabel;

    if (checkoutBookThumb) {
      checkoutBookThumb.style.background = book.coverGradient;
      checkoutBookThumb.innerHTML = `
        <div style="height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
          ${book.coverPattern}
        </div>
      `;
    }

    // Reset upload status
    if (uploadStatusText) {
      uploadStatusText.innerHTML = `
        <span style="font-weight: 700; color: var(--primary-700);">Klik untuk unggah</span> atau seret foto bukti transfer
      `;
    }

    if (checkoutModal) checkoutModal.classList.add('active');
  }

  function closeCheckoutModal() {
    if (checkoutModal) checkoutModal.classList.remove('active');
  }

  if (checkoutModalClose) checkoutModalClose.addEventListener('click', closeCheckoutModal);
  if (btnCancelPayment) btnCancelPayment.addEventListener('click', closeCheckoutModal);

  // Payment Method Switching
  paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      const method = opt.getAttribute('data-method');
      const accountData = bankAccounts[method];
      if (accountData && bankAccNumber) {
        bankAccNumber.textContent = accountData.number;
      }
    });
  });

  // Copy Account Number
  if (btnCopyAcc) {
    btnCopyAcc.addEventListener('click', () => {
      const textToCopy = bankAccNumber ? bankAccNumber.textContent.trim() : '';
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Nomor rekening ${textToCopy} disalin ke clipboard!`);
        }).catch(() => {
          showToast(`Nomor rekening disalin!`);
        });
      }
    });
  }

  // Upload proof simulation
  if (proofDropzone && proofFileInput) {
    proofDropzone.addEventListener('click', () => {
      proofFileInput.click();
    });

    proofFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (uploadStatusText) {
          uploadStatusText.innerHTML = `
            <span style="color: #059669; font-weight: 700;">✅ Bukti Terlampir:</span> ${file.name}
          `;
        }
      }
    });
  }

  // Submit Payment Confirmation
  if (btnSubmitPayment) {
    btnSubmitPayment.addEventListener('click', () => {
      btnSubmitPayment.disabled = true;
      btnSubmitPayment.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="spin-icon" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span>Memverifikasi...</span>
      `;

      setTimeout(() => {
        btnSubmitPayment.disabled = false;
        btnSubmitPayment.innerHTML = `
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Konfirmasi & Beli Sekarang</span>
        `;
        closeCheckoutModal();

        // Mark as purchased / bookmarked
        if (currentActiveBook) {
          currentActiveBook.isBookmarked = true;
          updateBookmarkCounters();
          showToast(`Pembayaran berhasil! "${currentActiveBook.title}" telah ditambahkan ke Rak Buku Saya.`);
          renderEbooks();
        }
      }, 1200);
    });
  }

  // Close modals on overlay backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === readerModal) closeReaderModal();
    if (e.target === checkoutModal) closeCheckoutModal();
  });

  // Mobile menu toggle
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const sidebar = document.getElementById('sidebarLeft');
  const backdrop = document.getElementById('mobileBackdrop');
  if (menuToggleBtn && sidebar && backdrop) {
    menuToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      backdrop.classList.toggle('show');
    });
    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      backdrop.classList.remove('show');
    });
  }

  // Sync user profile if logged in
  if (window.KK_API && window.KK_API.auth.isLoggedIn()) {
    const user = window.KK_API.auth.getCurrentUser();
    if (user) {
      const uName = user.name || 'Anggota Komunitas';
      const initials = uName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const region = user.originRegion || 'Kabupaten Tangerang';
      const role = user.role === 'admin' ? 'Administrator' : user.role === 'mentor' ? 'Mentor' : 'Anggota';

      const userPillAvatar = document.getElementById('userPillAvatar');
      const userPillName = document.getElementById('userPillName');
      const userPillRole = document.getElementById('userPillRole');
      const dropdownAvatar = document.getElementById('dropdownAvatar');
      const dropdownUserName = document.getElementById('dropdownUserName');
      const dropdownUserRole = document.getElementById('dropdownUserRole');
      const dropdownUserEmail = document.getElementById('dropdownUserEmail');

      if (userPillAvatar) userPillAvatar.textContent = initials;
      if (userPillName) userPillName.textContent = uName;
      if (userPillRole) userPillRole.textContent = `${role} (${region})`;
      if (dropdownAvatar) dropdownAvatar.textContent = initials;
      if (dropdownUserName) dropdownUserName.textContent = uName;
      if (dropdownUserRole) dropdownUserRole.textContent = `${role} (${region})`;
      if (dropdownUserEmail) dropdownUserEmail.textContent = user.email || '';
    }
  }

  // Initial render & API load
  updateBookmarkCounters();
  renderEbooks();
  if (window.KK_API) {
    loadEbooksFromApi();
  }
});
