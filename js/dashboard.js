/**
 * KERTAS KATA - Dashboard Anggota Logic
 * Based on PRD v1.0, Wireframe v1.0, and ERD
 */

document.addEventListener('DOMContentLoaded', () => {
  initGreeting();
  initSidebarMobile();
  initArticleTabs();
  initAnalyticsChart();
  initNotificationPopover();
  initSearchFilter();
  initActionToasts();
  if (window.KK_API) {
    loadDashboardDataFromApi();
  }
});

/* ====================================================
   1. DYNAMIC TIME-BASED GREETING
   ==================================================== */
function initGreeting() {
  const greetingEl = document.getElementById('dynamicGreeting');
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let timeStr = 'Pagi';
  if (hour >= 11 && hour < 15) {
    timeStr = 'Siang';
  } else if (hour >= 15 && hour < 18) {
    timeStr = 'Sore';
  } else if (hour >= 18 || hour < 4) {
    timeStr = 'Malam';
  }

  greetingEl.textContent = `Selamat ${timeStr},`;
}

/* ====================================================
   2. MOBILE SIDEBAR TOGGLE
   ==================================================== */
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

/* ====================================================
   3. ARTICLE DATA & TAB FILTERING (ERD & 10 KATEGORI)
   ==================================================== */
let articlesData = [];

async function loadDashboardDataFromApi() {
  if (!window.KK_API) return;
  try {
    await window.KK_API.auth.ensureUserAuth('anggota');

    // Sinkronisasi info profil pengguna di header & banner sambutan
    const currentUser = window.KK_API.auth.getCurrentUser();
    if (currentUser) {
      const uName = currentUser.name || 'Penulis Komunitas';
      const initials = uName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const region = currentUser.originRegion || 'Kabupaten Tangerang';
      const email = currentUser.email || '';
      const roleLabel = currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'mentor' ? 'Mentor' : 'Anggota';

      const userPillAvatar = document.getElementById('userPillAvatar');
      const userPillName = document.getElementById('userPillName');
      const userPillRole = document.getElementById('userPillRole');
      const dropdownAvatar = document.getElementById('dropdownAvatar');
      const dropdownUserName = document.getElementById('dropdownUserName');
      const dropdownUserRole = document.getElementById('dropdownUserRole');
      const dropdownUserEmail = document.getElementById('dropdownUserEmail');
      const welcomeUserName = document.getElementById('welcomeUserName');

      if (userPillAvatar) userPillAvatar.textContent = initials;
      if (userPillName) userPillName.textContent = uName;
      if (userPillRole) userPillRole.textContent = `${roleLabel} (${region})`;
      if (dropdownAvatar) dropdownAvatar.textContent = initials;
      if (dropdownUserName) dropdownUserName.textContent = uName;
      if (dropdownUserRole) dropdownUserRole.textContent = `${roleLabel} (${region})`;
      if (dropdownUserEmail) dropdownUserEmail.textContent = email;
      if (welcomeUserName) welcomeUserName.textContent = uName;
    }

    const res = await window.KK_API.articles.getMy();
    if (res && res.success && res.data) {
      const { articles, counts } = res.data;
      articlesData = (articles || []).map(a => ({
        id: a.id,
        title: a.title,
        category: a.category,
        categoryClass: `tag-${(a.category || 'opini').toLowerCase().replace(/[^a-z]/g, '')}`,
        status: a.status,
        statusLabel: a.status === 'published' ? 'Terbit' : a.status === 'in_review' ? 'Sedang Dikurasi' : 'Draf',
        date: new Date(a.updatedAt || a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        views: a.viewCount || 0,
        comments: a.reviews?.length || 0,
        slug: a.slug,
        notes: a.reviews?.[0]?.comment || 'Dalam antrean kurator.',
        words: `${a.wordCount || 0} kata`,
      }));

      // Update 4 kartu statistik riil dari database
      const statPublished = document.getElementById('statPublishedArticles');
      const statInReview = document.getElementById('statInReviewArticles');
      const statTotalViews = document.getElementById('statTotalViews');
      const statDraft = document.getElementById('statDraftArticles');

      const totalViews = (articles || []).reduce((acc, it) => acc + (it.viewCount || 0), 0);
      if (statPublished) statPublished.textContent = counts?.published || 0;
      if (statInReview) statInReview.textContent = counts?.in_review || 0;
      if (statTotalViews) statTotalViews.textContent = totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + 'K' : totalViews;
      if (statDraft) statDraft.textContent = counts?.draft || 0;

      // Update badge tab status
      const badgeDraft = document.getElementById('badgeDraft');
      const badgeInReview = document.getElementById('badgeInReview');
      const badgePublished = document.getElementById('badgePublished');
      if (badgeDraft) badgeDraft.textContent = counts?.draft || 0;
      if (badgeInReview) badgeInReview.textContent = counts?.in_review || 0;
      if (badgePublished) badgePublished.textContent = counts?.published || 0;

      const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'published';
      renderArticles(activeTab);
    }
  } catch (err) {
    console.warn('Gagal memuat data dashboard dari API:', err.message);
  }
}

function initArticleTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn[data-tab]');
  const container = document.getElementById('articlesContainer');

  if (!tabButtons.length || !container) return;

  // Render published first by default
  renderArticles('published');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      renderArticles(targetTab);
    });
  });
}

function renderArticles(status) {
  const container = document.getElementById('articlesContainer');
  if (!container) return;

  const filtered = articlesData.filter(a => a.status === status);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted); background: #ffffff; border-radius: 14px; border: 1.5px dashed var(--border-subtle);">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📝</div>
        <p style="font-size: 0.9375rem; font-weight: 600; color: var(--text-main); margin-bottom: 0.25rem;">Tidak ada tulisan pada status ini.</p>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 1.25rem;">Tuangkan ide bermakna Anda sekarang dan terbitkan karya di KERTAS KATA.</p>
        <a href="menulis.html" class="btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; padding: 0.6rem 1.25rem; border-radius: 8px; font-size: 0.8125rem;">
          ✍️ Mulai Tulis Sekarang
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isPublished = item.status === 'published';
    const isInReview = item.status === 'in_review';

    let badgeClass = 'badge-published';
    if (isInReview) badgeClass = 'badge-review';
    if (item.status === 'draft') badgeClass = 'badge-draft';

    return `
      <div class="article-item" data-id="${item.id}" data-title="${item.title.toLowerCase()}">
        <div class="article-main">
          <div class="article-meta">
            <span class="category-tag ${item.categoryClass}">${item.category}</span>
            <span class="article-status-badge ${badgeClass}">
              ${isInReview ? '⏳ ' : isPublished ? '✓ ' : '📝 '} ${item.statusLabel}
            </span>
            <span class="article-date">${item.date}</span>
          </div>
          <h3 class="article-title">${item.title}</h3>
          <div class="article-stats">
            ${isPublished ? `
              <div class="article-stat-item" title="Total Pembaca">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <span>${item.views} views</span>
              </div>
              <div class="article-stat-item" title="Komentar Pembaca">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span>${item.comments} komentar</span>
              </div>
            ` : isInReview ? `
              <span style="font-size: 0.75rem; color: #b45309;">📌 ${item.notes}</span>
            ` : `
              <span style="font-size: 0.75rem; color: var(--text-muted);">📄 Panjang teks: ${item.words}</span>
            `}
          </div>
        </div>
        <div class="article-actions">
          ${isPublished ? `
            <button class="btn-icon-action action-share" title="Bagikan Tautan Artikel">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
            </button>
            <button class="btn-icon-action action-view" title="Pratinjau Artikel Publik">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </button>
          ` : isInReview ? `
            <button class="btn-icon-action action-preview" title="Cek Status Kurasi">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </button>
          ` : `
            <button class="btn-primary" style="padding: 0.45rem 0.875rem; font-size: 0.75rem;" title="Lanjutkan Mengedit Naskah">
              Lanjut Tulis
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

/* ====================================================
   4. AUTHOR ANALYTICS CHART (PURE SVG INTERACTIVE)
   ==================================================== */
function initAnalyticsChart() {
  const chartWrapper = document.getElementById('analyticsChartWrapper');
  const periodSelect = document.getElementById('chartPeriodSelect');
  if (!chartWrapper) return;

  const dataset7Days = {
    labels: ['Sen, 1 Sep', 'Sel, 2 Sep', 'Rab, 3 Sep', 'Kam, 4 Sep', 'Jum, 5 Sep', 'Sab, 6 Sep', 'Min, 7 Sep'],
    views: [95, 140, 120, 210, 185, 290, 340],
    engagements: [12, 22, 18, 38, 29, 45, 58]
  };

  const dataset30Days = {
    labels: ['Pekan 1', 'Pekan 2', 'Pekan 3', 'Pekan 4'],
    views: [240, 310, 290, 410],
    engagements: [40, 55, 48, 75]
  };

  function renderChart(data) {
    const width = 800;
    const height = 200;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 30;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    const maxView = Math.max(...data.views) * 1.15;
    const n = data.labels.length;

    // Helper coords
    const getX = (i) => paddingLeft + (i / (n - 1)) * chartW;
    const getY = (val) => paddingTop + chartH - (val / maxView) * chartH;

    // Build views path
    let viewsPathD = `M ${getX(0)} ${getY(data.views[0])}`;
    let viewsAreaD = `M ${getX(0)} ${getY(data.views[0])}`;
    for (let i = 1; i < n; i++) {
      const prevX = getX(i - 1);
      const prevY = getY(data.views[i - 1]);
      const currX = getX(i);
      const currY = getY(data.views[i]);
      const cpx1 = prevX + (currX - prevX) / 2;
      const cpy1 = prevY;
      const cpx2 = prevX + (currX - prevX) / 2;
      const cpy2 = currY;
      viewsPathD += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${currX} ${currY}`;
      viewsAreaD += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${currX} ${currY}`;
    }
    viewsAreaD += ` L ${getX(n - 1)} ${paddingTop + chartH} L ${getX(0)} ${paddingTop + chartH} Z`;

    // Engagements line
    const maxEng = Math.max(...data.engagements) * 1.3;
    const getYEng = (val) => paddingTop + chartH - (val / maxEng) * chartH;
    let engPathD = `M ${getX(0)} ${getYEng(data.engagements[0])}`;
    for (let i = 1; i < n; i++) {
      const prevX = getX(i - 1);
      const prevY = getYEng(data.engagements[i - 1]);
      const currX = getX(i);
      const currY = getYEng(data.engagements[i]);
      const cpx1 = prevX + (currX - prevX) / 2;
      const cpy1 = prevY;
      const cpx2 = prevX + (currX - prevX) / 2;
      const cpy2 = currY;
      engPathD += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${currX} ${currY}`;
    }

    // Grid lines (3 horizontal)
    const gridLines = [0.25, 0.5, 0.75, 1].map(pct => {
      const y = paddingTop + chartH - pct * chartH;
      const labelVal = Math.round(pct * maxView);
      return `
        <line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" class="chart-grid-line" />
        <text x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end" class="chart-axis-text">${labelVal}</text>
      `;
    }).join('');

    // X Axis Labels
    const xLabels = data.labels.map((lbl, idx) => {
      return `<text x="${getX(idx)}" y="${height - 8}" text-anchor="middle" class="chart-axis-text">${lbl}</text>`;
    }).join('');

    // Points
    const pointsViews = data.views.map((v, i) => {
      return `
        <circle 
          cx="${getX(i)}" 
          cy="${getY(v)}" 
          r="4.5" 
          class="chart-point blue"
          data-label="${data.labels[i]}"
          data-views="${v}"
          data-eng="${data.engagements[i]}"
        />
      `;
    }).join('');

    chartWrapper.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2563eb" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        ${gridLines}
        <path d="${viewsAreaD}" class="chart-area-views" />
        <path d="${viewsPathD}" class="chart-line-views" />
        <path d="${engPathD}" class="chart-line-engagements" />
        ${xLabels}
        ${pointsViews}
      </svg>
      <div id="chartTooltip" style="
        position: absolute;
        display: none;
        background: #0f172a;
        color: #fff;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        font-size: 0.6875rem;
        pointer-events: none;
        transform: translate(-50%, -120%);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 50;
      "></div>
    `;

    // Tooltip interaction
    const circles = chartWrapper.querySelectorAll('.chart-point');
    const tooltip = document.getElementById('chartTooltip');

    circles.forEach(c => {
      c.addEventListener('mouseenter', (e) => {
        const lbl = c.getAttribute('data-label');
        const v = c.getAttribute('data-views');
        const eng = c.getAttribute('data-eng');
        const bbox = c.getBoundingClientRect();
        const wrapBox = chartWrapper.getBoundingClientRect();

        tooltip.innerHTML = `
          <strong>${lbl}</strong><br/>
          👀 ${v} Views Artikel<br/>
          💬 ${eng} Reaksi & Komentar
        `;
        tooltip.style.left = `${bbox.left - wrapBox.left + bbox.width / 2}px`;
        tooltip.style.top = `${bbox.top - wrapBox.top}px`;
        tooltip.style.display = 'block';
      });

      c.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
    });
  }

  renderChart(dataset7Days);

  if (periodSelect) {
    periodSelect.addEventListener('change', (e) => {
      if (e.target.value === '30') {
        renderChart(dataset30Days);
      } else {
        renderChart(dataset7Days);
      }
    });
  }
}

/* ====================================================
   5. NOTIFICATION POPOVER TOGGLE
   ==================================================== */
function initNotificationPopover() {
  const notifBtn = document.getElementById('notifBellBtn');
  const popover = document.getElementById('notifPopover');

  if (!notifBtn || !popover) return;

  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    popover.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!popover.contains(e.target) && !notifBtn.contains(e.target)) {
      popover.classList.remove('show');
    }
  });
}

/* ====================================================
   6. SEARCH FILTER SIMULATION
   ==================================================== */
function initSearchFilter() {
  const searchInput = document.getElementById('headerSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    const items = document.querySelectorAll('.article-item');

    items.forEach(item => {
      const title = item.getAttribute('data-title') || '';
      if (title.includes(val) || val === '') {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });

  // Global keyboard shortcut Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

/* ====================================================
   7. TOAST NOTIFICATIONS HELPER
   ==================================================== */
function initActionToasts() {
  document.addEventListener('click', (e) => {
    const shareBtn = e.target.closest('.action-share');
    if (shareBtn) {
      showToast('🔗 Tautan artikel berhasil disalin ke papan klip!');
      return;
    }

    const downloadPdfBtn = e.target.closest('#btnUnduhPortofolio');
    if (downloadPdfBtn) {
      showToast('📄 Menyiapkan portofolio PDF resmi Kertas Kata Kabupaten Tangerang...');
      return;
    }
  });
}

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
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-left: 4px solid #f59e0b;
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
  }, 3200);
}
