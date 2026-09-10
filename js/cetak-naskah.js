/**
 * KERTAS KATA - Cetak Naskah & Bunga Rampai Logic
 * PRD v1.0 (Fitur CN-01 s/d CN-08) & Wireframe 6
 */

document.addEventListener('DOMContentLoaded', () => {
  // Published articles dataset (12 articles from Dr. Rahmat Hidayat)
  const publishedArticles = [
    { id: 1, title: 'Revitalisasi Bahasa Daerah di Era Digital', date: '01 Sep 2026', words: '1.450 kata' },
    { id: 2, title: 'Meneguhkan Literasi Kritis Generasi Muda Menghadapi Post-Truth', date: '28 Agu 2026', words: '1.620 kata' },
    { id: 3, title: 'Tinjauan Sejarah Lokal: Jejak Peradaban Cisadane dan Kearifan Pesisir', date: '25 Agu 2026', words: '2.100 kata' },
    { id: 4, title: 'Inovasi Pembelajaran Abad 21: Transformasi Pendidik Komunitas', date: '20 Agu 2026', words: '1.850 kata' },
    { id: 5, title: 'Strategi Membangun Perpustakaan Komunitas yang Berdaya Guna', date: '15 Agu 2026', words: '1.340 kata' },
    { id: 6, title: 'Esai Budaya: Membaca Makna Tradisi Bekel dalam Kearifan Warga', date: '10 Agu 2026', words: '1.580 kata' },
    { id: 7, title: 'Masa Depan Industri Kreatif Berbasis Potensi Desa Mandiri', date: '05 Agu 2026', words: '1.720 kata' },
    { id: 8, title: 'Menjaga Akurasi Berita Warga di Tengah Arus Disinformasi Medsos', date: '29 Jul 2026', words: '1.290 kata' },
    { id: 9, title: 'Kritik Sastra: Eksplorasi Metafora Urban dalam Cerpen Tangerang', date: '22 Jul 2026', words: '1.920 kata' },
    { id: 10, title: 'Refleksi Satu Dasawarsa Kebijakan Fasilitasi Minat Baca Komunitas', date: '16 Jul 2026', words: '2.250 kata' },
    { id: 11, title: 'Pemanfaatan Arsip Publik untuk Penguatan Esai Sejarah Komunitas', date: '09 Jul 2026', words: '1.810 kata' },
    { id: 12, title: 'Menulis Sebagai Terapi Jiwa dan Sarana Advokasi Sosial', date: '02 Jul 2026', words: '1.400 kata' }
  ];

  // State
  let currentFormat = 'a5'; // 'a5' | 'b5'
  let currentPaper = 'bookpaper'; // 'bookpaper' | 'hvs'
  let currentCover = 'soft'; // 'soft' | 'hard'
  let exemplarCount = 25;
  let selectedArticles = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 10 initial

  // DOM Elements
  const tabs = document.querySelectorAll('.cetak-tab-btn');
  const panes = document.querySelectorAll('.cetak-pane');
  const articleListContainer = document.getElementById('articleListContainer');
  const selectedArticlesCountEl = document.getElementById('selectedArticlesCount');
  const specRadioCards = document.querySelectorAll('.spec-radio-card');
  const qtyInput = document.getElementById('exemplarInput');
  const btnQtyMinus = document.getElementById('btnQtyMinus');
  const btnQtyPlus = document.getElementById('btnQtyPlus');
  const presetPills = document.querySelectorAll('.preset-pill');

  // Summary Elements
  const summaryUnitFormatEl = document.getElementById('summaryUnitFormat');
  const summaryExemplarQtyEl = document.getElementById('summaryExemplarQty');
  const summarySubtotalProductionEl = document.getElementById('summarySubtotalProduction');
  const summarySubsidyDiscountEl = document.getElementById('summarySubsidyDiscount');
  const summaryShippingCostEl = document.getElementById('summaryShippingCost');
  const summaryTotalPriceEl = document.getElementById('summaryTotalPrice');
  const btnSubmitMandiri = document.getElementById('btnSubmitMandiri');

  // Upload Dropzone Elements
  const fileUploadInput = document.getElementById('fileUploadInput');
  const uploadDropzone = document.getElementById('uploadDropzone');
  const uploadedFileTag = document.getElementById('uploadedFileTag');
  const uploadedFileName = document.getElementById('uploadedFileName');

  // Toast Element
  const toastEl = document.getElementById('cetakToast');
  const toastMsg = document.getElementById('toastMessage');

  // Modals
  const modalJoinAnthology = document.getElementById('modalJoinAnthology');
  const modalTrackShipping = document.getElementById('modalTrackShipping');
  const anthologyArticlesList = document.getElementById('anthologyArticlesList');
  const anthologyForm = document.getElementById('formJoinAnthology');
  const targetAnthologyTitle = document.getElementById('targetAnthologyTitle');

  // Mobile menu elements
  const btnMobileMenu = document.getElementById('menuToggleBtn') || document.getElementById('btnMobileMenu');
  const sidebarLeft = document.getElementById('sidebarLeft');
  const mobileBackdrop = document.getElementById('mobileBackdrop');

  // Helper: Toast
  function showToast(message, duration = 3500) {
    if (!toastEl) return;
    toastMsg.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  }

  // Helper: Format IDR Currency
  function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // 1. Render Published Articles Checklist
  function renderArticlesList() {
    if (!articleListContainer) return;
    articleListContainer.innerHTML = publishedArticles.map(art => {
      const isChecked = selectedArticles.has(art.id);
      return `
        <label class="article-check-item ${isChecked ? 'checked' : ''}" data-id="${art.id}">
          <input type="checkbox" class="article-check-input" value="${art.id}" ${isChecked ? 'checked' : ''}>
          <div class="article-check-info">
            <div class="article-check-title">${art.title}</div>
            <div class="article-check-meta">
              <span>📅 ${art.date}</span>
              <span>📝 ${art.words}</span>
              <span style="color: #059669; font-weight: 600;">✓ Terbit</span>
            </div>
          </div>
        </label>
      `;
    }).join('');

    // Attach listeners
    articleListContainer.querySelectorAll('.article-check-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = parseInt(e.target.value);
        const parent = e.target.closest('.article-check-item');
        if (e.target.checked) {
          selectedArticles.add(id);
          parent.classList.add('checked');
        } else {
          selectedArticles.delete(id);
          parent.classList.remove('checked');
        }
        updateArticleCountUI();
      });
    });

    updateArticleCountUI();
  }

  function updateArticleCountUI() {
    const count = selectedArticles.size;
    if (selectedArticlesCountEl) {
      selectedArticlesCountEl.innerHTML = `Terpilih <strong>${count}</strong> dari Min. 10 Naskah`;
      if (count < 10) {
        selectedArticlesCountEl.style.color = '#dc2626';
      } else {
        selectedArticlesCountEl.style.color = '#059669';
      }
    }

    if (btnSubmitMandiri) {
      if (count < 10) {
        btnSubmitMandiri.disabled = true;
        btnSubmitMandiri.style.opacity = '0.6';
        btnSubmitMandiri.style.cursor = 'not-allowed';
      } else {
        btnSubmitMandiri.disabled = false;
        btnSubmitMandiri.style.opacity = '1';
        btnSubmitMandiri.style.cursor = 'pointer';
      }
    }
  }

  // 2. Pricing & Cost Calculator (CN-03)
  function calculateTotal() {
    let unitBase = currentFormat === 'a5' ? 38000 : 46000;
    if (currentPaper === 'hvs') unitBase += 4000;
    if (currentCover === 'hard') unitBase += 15000;

    const subtotal = unitBase * exemplarCount;

    // Subsidy discount: >=20 eks -> 15%, >=10 eks -> 10%
    let discountPercent = 0;
    if (exemplarCount >= 20) discountPercent = 0.15;
    else if (exemplarCount >= 10) discountPercent = 0.10;
    const discountAmount = Math.round(subtotal * discountPercent);

    // Shipping cost
    const shipping = exemplarCount >= 50 ? 0 : 25000;
    const grandTotal = subtotal - discountAmount + shipping;

    // Update DOM
    if (summaryUnitFormatEl) {
      const formatName = currentFormat === 'a5' ? 'A5' : 'B5/UNESCO';
      summaryUnitFormatEl.textContent = `${formatIDR(unitBase)} / eks (${formatName})`;
    }
    if (summaryExemplarQtyEl) {
      summaryExemplarQtyEl.textContent = `${exemplarCount} Eksemplar`;
    }
    if (summarySubtotalProductionEl) {
      summarySubtotalProductionEl.textContent = formatIDR(subtotal);
    }
    if (summarySubsidyDiscountEl) {
      summarySubsidyDiscountEl.textContent = discountAmount > 0 ? `- ${formatIDR(discountAmount)} (${discountPercent * 100}%)` : 'Rp 0';
    }
    if (summaryShippingCostEl) {
      summaryShippingCostEl.textContent = shipping === 0 ? 'Gratis (Subsidi ≥50 Eks)' : formatIDR(shipping);
    }
    if (summaryTotalPriceEl) {
      summaryTotalPriceEl.textContent = formatIDR(grandTotal);
    }
  }

  // 3. Radio Option Handlers
  specRadioCards.forEach(card => {
    card.addEventListener('click', () => {
      const group = card.dataset.group;
      const value = card.dataset.value;

      // Deselect siblings in same group
      document.querySelectorAll(`.spec-radio-card[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      if (group === 'format') currentFormat = value;
      if (group === 'paper') currentPaper = value;
      if (group === 'cover') currentCover = value;

      calculateTotal();
    });
  });

  // 4. Quantity Counter Handlers
  if (btnQtyMinus) {
    btnQtyMinus.addEventListener('click', () => {
      if (exemplarCount > 5) {
        exemplarCount -= 5;
        qtyInput.value = exemplarCount;
        updatePresetActive();
        calculateTotal();
      }
    });
  }

  if (btnQtyPlus) {
    btnQtyPlus.addEventListener('click', () => {
      if (exemplarCount < 500) {
        exemplarCount += 5;
        qtyInput.value = exemplarCount;
        updatePresetActive();
        calculateTotal();
      }
    });
  }

  if (qtyInput) {
    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value) || 5;
      if (val < 5) val = 5;
      if (val > 500) val = 500;
      exemplarCount = val;
      qtyInput.value = val;
      updatePresetActive();
      calculateTotal();
    });
  }

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const val = parseInt(pill.dataset.qty);
      exemplarCount = val;
      if (qtyInput) qtyInput.value = val;
      updatePresetActive();
      calculateTotal();
    });
  });

  function updatePresetActive() {
    presetPills.forEach(p => {
      if (parseInt(p.dataset.qty) === exemplarCount) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }

  // 5. File Upload Simulation
  if (uploadDropzone && fileUploadInput) {
    uploadDropzone.addEventListener('click', () => {
      fileUploadInput.click();
    });

    fileUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (uploadedFileName) uploadedFileName.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        if (uploadedFileTag) uploadedFileTag.style.display = 'flex';
        showToast(`Berkas "${file.name}" berhasil diunggah!`);
      }
    });
  }

  // 6. Tabs Navigation
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPaneId = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // 7. Submit Cetak Mandiri
  if (btnSubmitMandiri) {
    btnSubmitMandiri.addEventListener('click', () => {
      const titleInput = document.getElementById('bookTitleInput');
      const addressInput = document.getElementById('shippingAddressInput');
      const waInput = document.getElementById('whatsappInput');

      if (!titleInput.value.trim()) {
        showToast('Mohon masukkan judul buku naskah Anda!');
        titleInput.focus();
        return;
      }

      if (selectedArticles.size < 10) {
        showToast('Syarat minimum cetak mandiri: Pilih minimal 10 naskah terbit!');
        return;
      }

      if (!addressInput.value.trim()) {
        showToast('Mohon masukkan alamat lengkap pengiriman buku!');
        addressInput.focus();
        return;
      }

      // Success
      showToast('🎉 Pengajuan cetak naskah mandiri berhasil dikirim ke Dewan Kurasi!');
      
      // Switch to Tab Riwayat
      setTimeout(() => {
        const tabRiwayat = document.querySelector('.cetak-tab-btn[data-tab="paneRiwayat"]');
        if (tabRiwayat) tabRiwayat.click();
      }, 1200);
    });
  }

  // 8. Bunga Rampai Actions
  document.querySelectorAll('.btn-join-anthology').forEach(btn => {
    btn.addEventListener('click', () => {
      const progTitle = btn.dataset.title || 'Antologi Bersama';
      if (targetAnthologyTitle) targetAnthologyTitle.textContent = progTitle;

      // Populate articles for selection in modal
      if (anthologyArticlesList) {
        anthologyArticlesList.innerHTML = publishedArticles.map((art, idx) => `
          <label class="article-check-item" style="cursor: pointer; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.65rem;">
            <input type="radio" name="anthologyArticle" value="${art.id}" ${idx === 0 ? 'checked' : ''} style="accent-color: #2563eb;">
            <div style="font-size: 0.85rem; font-weight: 600; color: #1e293b;">${art.title}</div>
          </label>
        `).join('');
      }

      if (modalJoinAnthology) modalJoinAnthology.classList.add('open');
    });
  });

  if (anthologyForm) {
    anthologyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (modalJoinAnthology) modalJoinAnthology.classList.remove('open');
      showToast('✅ 1 Naskah Anda berhasil didaftarkan ke proyek Bunga Rampai!');
      
      setTimeout(() => {
        const tabRiwayat = document.querySelector('.cetak-tab-btn[data-tab="paneRiwayat"]');
        if (tabRiwayat) tabRiwayat.click();
      }, 1000);
    });
  }

  // Close modals
  document.querySelectorAll('.cetak-modal-close, .btn-modal-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cetak-modal-overlay').forEach(m => m.classList.remove('open'));
    });
  });

  // Track buttons in Riwayat
  document.querySelectorAll('.btn-track-courier').forEach(btn => {
    btn.addEventListener('click', () => {
      const resi = btn.dataset.resi || 'JNE-TGR-882910401';
      const resiNumEl = document.getElementById('trackingModalResi');
      if (resiNumEl) resiNumEl.textContent = resi;
      if (modalTrackShipping) modalTrackShipping.classList.add('open');
    });
  });

  // Mobile menu toggle
  if (btnMobileMenu && sidebarLeft) {
    btnMobileMenu.addEventListener('click', () => {
      sidebarLeft.classList.toggle('open');
      sidebarLeft.classList.toggle('active');
      if (mobileBackdrop) {
        mobileBackdrop.classList.toggle('show');
        mobileBackdrop.classList.toggle('active');
      }
    });

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', () => {
        sidebarLeft.classList.remove('open', 'active');
        mobileBackdrop.classList.remove('show', 'active');
      });
    }
  }

  // Close overlay on outside click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('cetak-modal-overlay')) {
      e.target.classList.remove('open');
    }
  });

  // Initialize
  renderArticlesList();
  calculateTotal();
});
