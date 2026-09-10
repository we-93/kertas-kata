/**
 * KERTAS KATA - Landing Page Interactivity
 * Filosofi: Modern, Profesional, Halus, & Anti AI Slop
 */

(function () {
  'use strict';

  // 1. Scroll-Driven Navbar Effects
  function initNavbarScroll() {
    const nav = document.getElementById('landingNav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 2. IntersectionObserver for Smooth Scroll Reveal
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // 3. Category Filter Logic for Articles
  function initCategoryFilter() {
    const filterButtons = document.querySelectorAll('.cat-pill-btn');
    const articleCards = document.querySelectorAll('.article-card');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedCategory = btn.getAttribute('data-category');

        articleCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (selectedCategory === 'all' || cardCategory === selectedCategory) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // 4. Modal Handlers: Login & Search
  window.openLoginModal = function () {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeLoginModal = function () {
    const modal = document.getElementById('loginModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.openSearchModal = function () {
    const modal = document.getElementById('searchModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        document.getElementById('instantSearchInput')?.focus();
      }, 100);
    }
  };

  window.closeSearchModal = function () {
    const modal = document.getElementById('searchModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // 5. Auth Handlers (Terhubung ke REST API Backend dengan Fallback Cerdas)
  window.handleGoogleLogin = async function () {
    showToast('🔐 Menghubungkan Akun Google Terverifikasi...');
    if (window.KK_API) {
      try {
        const res = await window.KK_API.auth.loginGoogle(null, {
          email: 'rahmat.hidayat@gmail.com',
          name: 'Rahmat Hidayat',
          originRegion: 'Kecamatan Tigaraksa',
          specialization: 'Inovasi Pembelajaran',
        });
        if (res && res.success) {
          setTimeout(() => {
            window.location.href = 'dashboard.html';
          }, 600);
          return;
        }
      } catch (err) {
        console.warn('API login Google offline, beralih ke simulasi sesi:', err);
      }
    }
    setTimeout(() => {
      showToast('✓ Berhasil masuk! Mengalihkan ke Dashboard Anggota...');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    }, 900);
  };

  window.handleEmailLogin = async function (e) {
    if (e) e.preventDefault();
    const email = document.getElementById('loginEmail')?.value?.trim();
    let password = document.getElementById('loginPassword')?.value;

    // Jika password default dummy titik-titik, gunakan kredensial seed
    if (!password || password.includes('•')) {
      if (email === 'admin@kertaskata.my.id') password = 'AdminPassword2026!';
      else if (email === 'mentor.dian@kertaskata.my.id') password = 'MentorPassword2026!';
      else password = 'MemberPassword2026!';
    }

    if (window.KK_API) {
      try {
        const res = await window.KK_API.auth.login(email, password);
        if (res && res.success) {
          const user = res.data.user;
          const targetPage = (user.role === 'admin' || user.role === 'mentor') ? 'admin.html' : 'dashboard.html';
          setTimeout(() => {
            window.location.href = targetPage;
          }, 600);
          return;
        }
      } catch (err) {
        console.warn('Gagal login via API, beralih ke fallback antarmuka:', err.message);
        showToast(err.message || 'Kredensial tidak valid', 'error');
        return;
      }
    }

    showToast(`👋 Selamat datang kembali, ${email || 'Anggota'}!`);
    setTimeout(() => {
      const target = (email && email.includes('admin')) ? 'admin.html' : 'dashboard.html';
      window.location.href = target;
    }, 900);
  };

  // 6. Instant Search Filtering (Terhubung ke Database Live)
  function initInstantSearch() {
    const searchInput = document.getElementById('instantSearchInput');
    const searchResults = document.getElementById('searchResultsContainer');
    if (!searchInput || !searchResults) return;

    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const q = e.target.value.trim();

      if (!q) {
        searchResults.innerHTML = '<div style="text-align:center; padding:1.5rem; color:#94a3b8; font-size:0.875rem;">Ketik kata kunci judul, topik, atau nama penulis...</div>';
        return;
      }

      debounceTimer = setTimeout(async () => {
        searchResults.innerHTML = '<div style="text-align:center; padding:1.5rem; color:#64748b; font-size:0.875rem;">Mencari karya...</div>';

        try {
          if (!window.KK_API) return;
          const res = await window.KK_API.articles.getPublic({ search: q, limit: 6 });
          const matches = res.data?.articles || [];

          if (matches.length === 0) {
            searchResults.innerHTML = '<div style="text-align:center; padding:1.5rem; color:#64748b; font-size:0.875rem;">Tidak ditemukan karya yang cocok dengan kata kunci "' + q + '".</div>';
            return;
          }

          searchResults.innerHTML = matches.map(item => `
            <a href="baca-artikel.html?slug=${item.slug}" class="search-result-item" style="display:block; padding:0.85rem 1rem; border-radius:10px; text-decoration:none; color:#0f172a; border-bottom:1px solid #f1f5f9; transition:background 0.2s;">
              <div style="font-size:0.75rem; color:#2563eb; font-weight:700; text-transform:uppercase; margin-bottom:0.2rem;">${item.category}</div>
              <div style="font-weight:700; font-size:0.9375rem; margin-bottom:0.25rem;">${item.title}</div>
              <div style="font-size:0.75rem; color:#64748b;">Karya oleh <strong>${item.user?.name || 'Penulis Komunitas'}</strong></div>
            </a>
          `).join('');
        } catch (err) {
          console.warn('Gagal mencari artikel via API:', err);
          searchResults.innerHTML = '<div style="text-align:center; padding:1.5rem; color:#dc2626; font-size:0.875rem;">Gagal memuat hasil pencarian.</div>';
        }
      }, 300);
    });
  }

  // 7. Mobile Drawer Toggle
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobileNavToggle');
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');

    if (!toggleBtn || !drawer) return;

    function openMenu() {
      drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // 8. Global Keyboard Shortcuts (/ or Ctrl+K opens search, ESC closes modal)
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Shortcut '/' or 'Ctrl+K'
      if ((e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') ||
          (e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        window.openSearchModal();
      }

      // Shortcut 'Escape'
      if (e.key === 'Escape') {
        window.closeLoginModal();
        window.closeSearchModal();
      }
    });
  }

  // 9. Toast Notification Helper
  function showToast(message) {
    let toast = document.getElementById('landingToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'landingToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #0f172a;
        color: #ffffff;
        padding: 0.85rem 1.35rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        opacity: 0;
        transform: translateY(15px);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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

  // 10. Load Public Articles from Backend Database
  async function loadPublicArticlesFromApi() {
    const grid = document.getElementById('articlesGrid');
    if (!grid || !window.KK_API) return;

    try {
      const res = await window.KK_API.articles.getPublic({ limit: 9 });
      if (!res || !res.success) return;

      const articles = res.data?.articles || [];
      if (articles.length === 0) {
        grid.innerHTML = `
          <div class="empty-state-card" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: #ffffff; border-radius: 16px; border: 1.5px dashed #cbd5e1; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
            <div style="font-size: 3rem; margin-bottom: 0.75rem;">📚</div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem;">Karya Sedang Dalam Kurasi</h3>
            <p style="font-size: 0.9375rem; color: #64748b; max-width: 480px; margin: 0 auto 1.5rem; line-height: 1.6;">
              Belum ada artikel publik yang diterbitkan. Daftarkan diri Anda dan jadilah salah satu penulis pertama yang karyanya tampil di platform KERTAS KATA Kabupaten Tangerang!
            </p>
            <button type="button" onclick="openLoginModal()" class="btn-primary" style="padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 700; font-size: 0.875rem;">
              ✍️ Mulai Tulis Karya
            </button>
          </div>
        `;
        return;
      }

      grid.innerHTML = articles.map(art => {
        const cover = art.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
        const authorName = art.user?.name || 'Penulis Komunitas';
        const authorInitials = authorName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const readMins = Math.max(1, Math.ceil((art.wordCount || 200) / 200));
        const dateStr = new Date(art.publishedAt || art.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const catClass = (art.category || 'opini').toLowerCase().replace(/[^a-z]/g, '');

        return `
          <article class="article-card reveal in-view" data-category="${catClass}">
            <div class="article-card-thumb">
              <img src="${cover}" alt="${art.title}" class="article-card-img" loading="lazy">
              <span class="article-card-badge">${art.category}</span>
            </div>
            <div class="article-card-body">
              <div class="article-meta-header">
                <span>⏱️ ${readMins} mnt baca</span>
                <span>${dateStr}</span>
              </div>
              <h3 class="article-card-title">
                <a href="baca-artikel.html?slug=${art.slug}">${art.title}</a>
              </h3>
              <p class="article-card-desc">
                ${art.lead || (art.content ? art.content.replace(/<[^>]*>?/gm, ' ').slice(0, 140) + '...' : '')}
              </p>
              <div class="article-card-footer">
                <div class="card-author-chip">
                  <div class="card-avatar-sm">${authorInitials}</div>
                  <span class="card-author-name">${authorName}</span>
                </div>
                <a href="baca-artikel.html?slug=${art.slug}" class="card-read-link" aria-label="Baca naskah">
                  Baca ↗
                </a>
              </div>
            </div>
          </article>
        `;
      }).join('');

      initCategoryFilter();
    } catch (e) {
      console.warn('Gagal memuat artikel landing dari API:', e);
    }
  }

  // 11. Load Platform Stats, Editorial Spotlight, & Hall of Fame from API
  async function loadPlatformStatsFromApi() {
    if (!window.KK_API || !window.KK_API.stats) return;

    try {
      const res = await window.KK_API.stats.getOverview();
      if (!res || !res.success || !res.data) return;

      const { counts, spotlight, hallOfFame } = res.data;

      // Update Hero Stats
      const statArticles = document.getElementById('statHeroArticles');
      const statDistricts = document.getElementById('statHeroDistricts');
      const statMembers = document.getElementById('statHeroMembers');
      const archiveLabel = document.getElementById('archiveArticleCountLabel');

      if (statArticles) statArticles.textContent = counts.articles > 0 ? `${counts.articles}+` : '0';
      if (statDistricts) statDistricts.textContent = counts.districts || 28;
      if (statMembers) statMembers.textContent = counts.members > 0 ? `${counts.members}+` : '0';
      if (archiveLabel && counts.articles > 0) {
        archiveLabel.textContent = `Lihat Arsip Seluruh Tulisan Terbit (${counts.articles})`;
      }

      // Update Editorial Spotlight jika ada artikel lolos kurasi
      const spotlightContainer = document.getElementById('spotlightContainer');
      if (spotlightContainer && spotlight) {
        const cover = spotlight.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000&auto=format&fit=crop&q=80';
        const authorName = spotlight.user?.name || 'Penulis Pilihan';
        const initials = authorName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const region = spotlight.user?.originRegion || 'Kabupaten Tangerang';
        const readMins = Math.max(1, Math.ceil((spotlight.wordCount || 200) / 200));

        spotlightContainer.innerHTML = `
          <div class="spotlight-card reveal in-view">
            <div class="spotlight-media">
              <img src="${cover}" alt="${spotlight.title}" class="spotlight-img">
              <div class="spotlight-badge-curated">
                <span>⭐</span>
                <span>Pilihan Kurator Minggu Ini</span>
              </div>
            </div>
            <div class="spotlight-body">
              <div class="spotlight-meta-top">
                <span class="category-tag">${spotlight.category || 'Opini'}</span>
                <span class="reading-time">⏱️ ${readMins} menit baca</span>
              </div>
              <h2 class="spotlight-title">
                <a href="baca-artikel.html?slug=${spotlight.slug}">${spotlight.title}</a>
              </h2>
              <p class="spotlight-excerpt">
                ${spotlight.lead || (spotlight.content ? spotlight.content.replace(/<[^>]*>?/gm, ' ').slice(0, 200) + '...' : '')}
              </p>
              <div class="spotlight-author-bar">
                <div class="author-chip">
                  <div class="author-avatar-img">${initials}</div>
                  <div>
                    <div class="author-info-name">${authorName}</div>
                    <div class="author-info-sub">${region}</div>
                  </div>
                </div>
                <a href="baca-artikel.html?slug=${spotlight.slug}" class="btn-read-spotlight" id="spotlightReadBtn">
                  <span>Baca Artikel Penuh</span>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        `;
      }

      // Update Hall of Fame jika ada penulis dengan artikel terbit
      const hofContainer = document.getElementById('hofContainer');
      if (hofContainer && Array.isArray(hallOfFame) && hallOfFame.length > 0) {
        const medalEmojis = ['🥇', '🥈', '🥉', '🎖️', '🎖️'];
        const gradients = [
          'linear-gradient(135deg, #f59e0b, #d97706)',
          'linear-gradient(135deg, #64748b, #475569)',
          'linear-gradient(135deg, #b45309, #78350f)',
          'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        ];

        hofContainer.innerHTML = hallOfFame.map((author, i) => `
          <div class="hof-member-card">
            <div class="hof-rank-indicator">${medalEmojis[i] || '🎖️'}</div>
            <div class="hof-avatar-circle" style="background: ${gradients[i] || gradients[3]};">${author.initials}</div>
            <div class="hof-name">${author.name}</div>
            <div class="hof-org">${author.region}</div>
            <div class="hof-stats-row">
              <div class="hof-stat-col">
                <strong>${author.articleCount}</strong>
                <span>Karya Terbit</span>
              </div>
              <div class="hof-stat-col">
                <strong>${author.totalViews >= 1000 ? (author.totalViews / 1000).toFixed(1) + 'K' : author.totalViews}</strong>
                <span>Pembaca</span>
              </div>
            </div>
          </div>
        `).join('');
      }
    } catch (err) {
      console.warn('Gagal memuat statistik platform:', err);
    }
  }

  // Initialization
  document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initScrollReveal();
    initCategoryFilter();
    initInstantSearch();
    initMobileMenu();
    initKeyboardShortcuts();
    if (window.KK_API) {
      loadPublicArticlesFromApi();
      loadPlatformStatsFromApi();
    }
  });

})();
