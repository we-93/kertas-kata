/**
 * KERTAS KATA - PUBLIKASI KARYA (HALAMAN PUBLIKASI) LOGIC
 * Manages article catalog filtering, share modal, review notes timeline, and reading preview
 */

document.addEventListener('DOMContentLoaded', async () => {
  initFilterTabs();
  initCategoryFilter();
  initSearchInput();
  initShareModal();
  initReviewModal();
  initReadingModal();
  initSidebarMobile();

  // Integrasi Backend API: Ambil artikel asli dari database
  if (window.KK_API) {
    loadMyArticlesFromApi();
  }
});

async function loadMyArticlesFromApi() {
  try {
    await window.KK_API.auth.ensureUserAuth('anggota');
    const res = await window.KK_API.articles.getMy();
    if (!res || !res.success || !res.data) return;

    const { counts, articles } = res.data;
    const grid = document.getElementById('articlesCatalogGrid');
    if (!grid) return;

    // Bersihkan isi dummy HTML
    grid.innerHTML = '';

    // Update 4 Metrics Card di Hero Banner
    const statCards = document.querySelectorAll('.pub-stat-card');
    if (statCards.length >= 4 && counts) {
      const totalViews = (articles || []).reduce((acc, a) => acc + (a.viewCount || 0), 0);
      if (statCards[0]?.querySelector('.pub-stat-val')) statCards[0].querySelector('.pub-stat-val').textContent = articles?.length || 0;
      if (statCards[1]?.querySelector('.pub-stat-val')) statCards[1].querySelector('.pub-stat-val').textContent = counts.published || 0;
      if (statCards[2]?.querySelector('.pub-stat-val')) statCards[2].querySelector('.pub-stat-val').textContent = counts.in_review || 0;
      if (statCards[3]?.querySelector('.pub-stat-val')) statCards[3].querySelector('.pub-stat-val').textContent = counts.draft || 0;
      if (statCards[4]?.querySelector('.pub-stat-val')) statCards[4].querySelector('.pub-stat-val').textContent = totalViews > 0 ? totalViews.toLocaleString('id-ID') : '0';
    }

    // Update filter tab badges
    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(p => {
      const s = p.getAttribute('data-status');
      if (s === 'all') p.textContent = `Semua Karya (${articles?.length || 0})`;
      else if (s === 'published') p.textContent = `✓ Terbit (${counts?.published || 0})`;
      else if (s === 'in-review') p.textContent = `🕒 Sedang Review (${counts?.in_review || 0})`;
      else if (s === 'draft') p.textContent = `📝 Draf (${counts?.draft || 0})`;
    });

    if (!articles || articles.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; background: #ffffff; border-radius: 16px; border: 1.5px dashed #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">📝</div>
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">Belum Ada Naskah</h3>
          <p style="font-size: 0.875rem; color: #64748b; max-width: 460px; margin: 0 auto 1.5rem; line-height: 1.6;">
            Anda belum memiliki naskah tulisan di platform. Tulis naskah pertama Anda dan kirimkan ke meja kurator literasi Kabupaten Tangerang!
          </p>
          <a href="menulis.html" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: #2563eb; color: #fff; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 0.875rem;">
            <span>✍️ Mulai Tulis Naskah Baru</span>
          </a>
        </div>
      `;
      return;
    }

    articles.forEach(art => {
      const card = document.createElement('article');
      card.className = 'pub-article-card';
      const statusAttr = art.status === 'in_review' ? 'in-review' : art.status;
      card.setAttribute('data-status', statusAttr);
      card.setAttribute('data-category', art.category);
      card.setAttribute('data-slug', art.slug);

      const statusMap = {
        published: { label: '✓ Terbit', cls: 'published' },
        in_review: { label: '🕒 Sedang Review', cls: 'review' },
        revision: { label: '⚠️ Perlu Revisi', cls: 'revision' },
        draft: { label: '📝 Draf', cls: 'draft' },
      };
      const st = statusMap[art.status] || { label: art.status, cls: 'draft' };
      const cover = art.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
      const dateStr = new Date(art.updatedAt || art.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

      let actionBtns = '';
      if (art.status === 'published') {
        actionBtns = `
          <a href="baca-artikel.html?slug=${art.slug}" class="btn-card-read">Baca Artikel ↗</a>
          <button class="btn-card-action btn-trigger-share" title="Bagikan">🔗</button>
        `;
      } else if (art.status === 'in_review') {
        actionBtns = `
          <button class="btn-card-read" style="background:#f1f5f9; color:#475569; border-color:#cbd5e1; cursor:default;">Dalam Antrean Kurasi</button>
        `;
      } else {
        actionBtns = `
          <a href="menulis.html?id=${art.id}" class="btn-card-read" style="background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe;">Lanjutkan Menulis ✍️</a>
        `;
      }

      card.innerHTML = `
        <div class="card-cover-container">
          <img class="card-cover-img" src="${cover}" alt="${escapeHtml(art.title)}">
          <span class="card-floating-category">${escapeHtml(art.category)}</span>
          <span class="card-status-badge ${st.cls}">${st.label}</span>
        </div>
        <div class="card-body-content">
          <div class="card-meta-row">
            <span>📅 ${dateStr}</span>
            <span>&bull;</span>
            <span>👁️ ${art.viewCount || 0} pembaca</span>
          </div>
          <h3 class="card-title">${escapeHtml(art.title)}</h3>
          <p class="card-excerpt">${escapeHtml(art.lead || art.content.replace(/<[^>]*>?/gm, ' ').slice(0, 140) + '...')}</p>
          <div class="card-footer-actions">
            ${actionBtns}
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    initShareModal();
    initReadingModal();
  } catch (err) {
    console.warn('Gagal memuat artikel dari API:', err.message);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

/* ==========================================================
   1. TAB FILTERING (Semua, Terbit, In Review, Draf)
   ========================================================== */
function initFilterTabs() {
  const pills = document.querySelectorAll('.filter-pill[data-status]');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const status = pill.getAttribute('data-status');
      const cards = document.querySelectorAll('#articlesCatalogGrid .pub-article-card');

      cards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        if (status === 'all' || cardStatus === status) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================
   2. CATEGORY DROPDOWN FILTER
   ========================================================== */
function initCategoryFilter() {
  const select = document.getElementById('categoryFilterSelect');
  if (!select) return;

  select.addEventListener('change', () => {
    const cat = select.value;
    const activeStatus = document.querySelector('.filter-pill.active')?.getAttribute('data-status') || 'all';
    const cards = document.querySelectorAll('#articlesCatalogGrid .pub-article-card');

    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const cardStatus = card.getAttribute('data-status');

      const matchStatus = (activeStatus === 'all' || cardStatus === activeStatus);
      const matchCat = (cat === 'all' || cardCat === cat);

      if (matchStatus && matchCat) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/* ==========================================================
   3. SEARCH INPUT FILTER
   ========================================================== */
function initSearchInput() {
  const input = document.getElementById('publikasiSearchInput');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const cards = document.querySelectorAll('#articlesCatalogGrid .pub-article-card');

    cards.forEach(card => {
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.card-excerpt')?.textContent.toLowerCase() || '';

      if (title.includes(q) || excerpt.includes(q)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

/* ==========================================================
   4. SHARE MODAL (PU-04)
   ========================================================== */
function initShareModal() {
  const modal = document.getElementById('shareModal');
  const closeBtn = document.getElementById('closeShareModal');
  const shareBtns = document.querySelectorAll('.btn-trigger-share');
  const copyBtn = document.getElementById('btnCopyShareLink');
  const copyInput = document.getElementById('shareLinkInput');

  shareBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.pub-article-card');
      const title = card.querySelector('.card-title')?.textContent || 'Artikel KERTAS KATA';
      const slug = card.getAttribute('data-slug') || 'artikel';
      const url = `https://kertaskata.tangerangkab.go.id/artikel/${slug}`;

      document.getElementById('modalShareArticleTitle').textContent = title;
      if (copyInput) copyInput.value = url;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (copyBtn && copyInput) {
    copyBtn.addEventListener('click', () => {
      copyInput.select();
      navigator.clipboard.writeText(copyInput.value).then(() => {
        showToast('✓ Tautan artikel berhasil disalin ke clipboard!');
      }).catch(() => {
        showToast('✓ Tautan artikel disalin!');
      });
    });
  }

  // Social share buttons click feedback
  const socialBtns = document.querySelectorAll('.btn-social-share');
  socialBtns.forEach(sb => {
    sb.addEventListener('click', () => {
      const network = sb.getAttribute('data-network');
      showToast(`Membuka dialog bagikan ke ${network}...`);
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================================
   5. REVIEW NOTES MODAL (PU-02)
   ========================================================== */
function initReviewModal() {
  const modal = document.getElementById('reviewModal');
  const closeBtn = document.getElementById('closeReviewModal');
  const reviewBtns = document.querySelectorAll('.btn-trigger-review');

  reviewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================================
   6. READING VIEW MODAL (PU-03)
   ========================================================== */
function initReadingModal() {
  const modal = document.getElementById('readingModal');
  const closeBtn = document.getElementById('closeReadingModal');
  const readBtns = document.querySelectorAll('.btn-trigger-read');

  readBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.pub-article-card');
      const title = card.querySelector('.card-title')?.textContent || 'Artikel';
      const cat = card.querySelector('.card-floating-category')?.textContent || 'Umum';
      const cover = card.querySelector('.card-cover-img')?.src || '';

      document.getElementById('readingModalCategory').textContent = cat;
      document.getElementById('readingModalTitle').textContent = title;
      document.getElementById('readingModalCover').src = cover;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================================
   7. SIDEBAR TOGGLE MOBILE
   ========================================================== */
function initSidebarMobile() {
  const toggleBtn = document.getElementById('menuToggleBtn');
  const sidebar = document.getElementById('sidebarLeft');
  const backdrop = document.getElementById('mobileBackdrop');

  if (!toggleBtn || !sidebar || !backdrop) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('show');
  });

  backdrop.addEventListener('click', () => {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
  });
}

/* ==========================================================
   8. TOAST UTILITY
   ========================================================== */
function showToast(msg) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: #ffffff;
      padding: 0.875rem 1.25rem;
      border-radius: 12px;
      font-size: 0.8125rem;
      font-weight: 500;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-left: 4px solid #059669;
      transform: translateY(30px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(30px)';
    toast.style.opacity = '0';
  }, 3500);
}
