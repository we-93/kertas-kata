/**
 * KERTAS KATA - Article Reader Script
 * Filosofi: Editorial Experience, Kenyamanan Pembaca, & Anti AI Slop
 */

(function () {
  'use strict';

  // 1. Reading Progress Bar & Title In-Nav on Scroll
  function initReadingProgress() {
    const progressBar = document.getElementById('readingProgressFill');
    const navTitle = document.getElementById('navArticleTitle');
    const heroTitle = document.getElementById('articleHeroTitle');

    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const percent = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
        progressBar.style.width = percent + '%';
      }

      // Title in Topbar
      if (heroTitle && navTitle) {
        const rect = heroTitle.getBoundingClientRect();
        if (rect.bottom < 0) {
          navTitle.classList.add('visible');
        } else {
          navTitle.classList.remove('visible');
        }
      }
    }, { passive: true });
  }

  // 2. Reading Preferences: Theme, Font, and Size
  window.togglePreferencesPopover = function () {
    const popover = document.getElementById('preferencesPopover');
    if (popover) {
      popover.classList.toggle('active');
    }
  };

  // Close popover when clicking outside
  document.addEventListener('click', (e) => {
    const popover = document.getElementById('preferencesPopover');
    const trigger = document.getElementById('btnPrefTrigger');
    if (popover && popover.classList.contains('active')) {
      if (!popover.contains(e.target) && trigger && !trigger.contains(e.target)) {
        popover.classList.remove('active');
      }
    }
  });

  window.setReaderTheme = function (theme) {
    document.body.classList.remove('theme-sepia', 'theme-dark');
    document.querySelectorAll('[data-pref-theme]').forEach(b => b.classList.remove('active'));

    if (theme === 'sepia') {
      document.body.classList.add('theme-sepia');
      document.querySelector('[data-pref-theme="sepia"]')?.classList.add('active');
    } else if (theme === 'dark') {
      document.body.classList.add('theme-dark');
      document.querySelector('[data-pref-theme="dark"]')?.classList.add('active');
    } else {
      document.querySelector('[data-pref-theme="light"]')?.classList.add('active');
    }

    try { localStorage.setItem('kertas_reader_theme', theme); } catch (e) {}
  };

  window.setReaderFont = function (font) {
    document.body.classList.remove('font-serif');
    document.querySelectorAll('[data-pref-font]').forEach(b => b.classList.remove('active'));

    if (font === 'serif') {
      document.body.classList.add('font-serif');
      document.querySelector('[data-pref-font="serif"]')?.classList.add('active');
    } else {
      document.querySelector('[data-pref-font="sans"]')?.classList.add('active');
    }

    try { localStorage.setItem('kertas_reader_font', font); } catch (e) {}
  };

  window.setReaderFontSize = function (size) {
    document.body.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
    document.querySelectorAll('[data-pref-size]').forEach(b => b.classList.remove('active'));

    if (size === 'sm') {
      document.body.classList.add('text-size-sm');
      document.querySelector('[data-pref-size="sm"]')?.classList.add('active');
    } else if (size === 'lg') {
      document.body.classList.add('text-size-lg');
      document.querySelector('[data-pref-size="lg"]')?.classList.add('active');
    } else {
      document.body.classList.add('text-size-md');
      document.querySelector('[data-pref-size="md"]')?.classList.add('active');
    }

    try { localStorage.setItem('kertas_reader_size', size); } catch (e) {}
  };

  // Restore Saved Preferences
  function restorePreferences() {
    try {
      const savedTheme = localStorage.getItem('kertas_reader_theme');
      if (savedTheme) window.setReaderTheme(savedTheme);

      const savedFont = localStorage.getItem('kertas_reader_font');
      if (savedFont) window.setReaderFont(savedFont);

      const savedSize = localStorage.getItem('kertas_reader_size');
      if (savedSize) window.setReaderFontSize(savedSize);
    } catch (e) {}
  }

  // 3. Reaction Claps / Likes
  let likeCount = 342;
  let hasLiked = false;

  window.handleClapReaction = function () {
    const btn = document.getElementById('btnReactionClap');
    const countEl = document.getElementById('clapCountDisplay');
    const heartIcon = document.getElementById('clapHeartIcon');

    likeCount += 1;
    if (countEl) countEl.textContent = likeCount;

    if (!hasLiked) {
      hasLiked = true;
      if (btn) btn.classList.add('active');
      showToast('❤️ Terima kasih atas apresiasi Anda untuk penulis!');
    }

    if (heartIcon) {
      heartIcon.classList.remove('heart-burst-animate');
      void heartIcon.offsetWidth; // trigger reflow
      heartIcon.classList.add('heart-burst-animate');
    }
  };

  // 4. Bookmark Toggle
  let isBookmarked = false;

  window.handleBookmark = function () {
    const btn = document.getElementById('btnBookmarkArticle');
    isBookmarked = !isBookmarked;

    if (isBookmarked) {
      if (btn) {
        btn.classList.add('active');
        btn.innerHTML = '🔖 <span>Tersimpan</span>';
      }
      showToast('🔖 Artikel berhasil disimpan ke Daftar Bacaan Anda.');
    } else {
      if (btn) {
        btn.classList.remove('active');
        btn.innerHTML = '🏷️ <span>Simpan</span>';
      }
      showToast('🗑️ Artikel dihapus dari Daftar Bacaan.');
    }
  };

  // 5. Share Handlers
  window.handleShare = function (platform) {
    const url = window.location.href;
    const title = 'Merajut Harmoni di Tepian Cisadane - KERTAS KATA';

    if (platform === 'wa') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
    } else if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else {
      // Copy Link
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('🔗 Tautan artikel berhasil disalin ke papan klip!');
        }).catch(() => {
          fallbackCopy(url);
        });
      } else {
        fallbackCopy(url);
      }
    }
  };

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('🔗 Tautan artikel berhasil disalin!');
  }

  // 6. Follow Author Handler
  let isFollowing = false;

  window.handleFollowAuthor = function () {
    const btn = document.getElementById('btnFollowAuthor');
    isFollowing = !isFollowing;

    if (isFollowing) {
      if (btn) {
        btn.classList.add('following');
        btn.textContent = '✓ Mengikuti';
      }
      showToast('👤 Anda kini mengikuti Rahmat Hidayat. Pembaruan karyanya akan muncul di beranda Anda.');
    } else {
      if (btn) {
        btn.classList.remove('following');
        btn.textContent = '+ Ikuti Penulis';
      }
      showToast('Batal mengikuti penulis.');
    }
  };

  // 7. Interactive Comment Submission
  window.handlePostComment = function (e) {
    if (e) e.preventDefault();

    const nameInput = document.getElementById('commentAuthorName');
    const textInput = document.getElementById('commentText');
    const commentList = document.getElementById('commentThreadList');
    const countBadge = document.getElementById('commentTotalCount');

    const name = (nameInput?.value || '').trim() || 'Pembaca Komunitas';
    const text = (textInput?.value || '').trim();

    if (!text) {
      showToast('⚠️ Mohon tuliskan ulasan atau tanggapan Anda terlebih dahulu.');
      return;
    }

    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

    const newCard = document.createElement('div');
    newCard.className = 'comment-card';
    newCard.style.animation = 'comment-appear 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    newCard.innerHTML = `
      <div class="comment-avatar" style="background: #2563eb;">${initials}</div>
      <div class="comment-content">
        <div class="comment-author-name">${name}</div>
        <div class="comment-meta">Baru saja • Warga Literasi</div>
        <div class="comment-text">${text}</div>
        <div class="comment-actions">
          <button type="button" class="btn-comment-action" onclick="this.style.color='#dc2626'">❤️ Suka (0)</button>
          <button type="button" class="btn-comment-action" onclick="showToast('💬 Fitur balas komentar aktif.')">↩️ Balas</button>
        </div>
      </div>
    `;

    if (commentList) {
      commentList.insertBefore(newCard, commentList.firstChild);
    }

    if (textInput) textInput.value = '';
    if (countBadge) {
      const current = parseInt(countBadge.textContent, 10) || 18;
      countBadge.textContent = current + 1;
    }

    showToast('💬 Tanggapan bermakna Anda berhasil dipublikasikan!');
  };

  // 8. Toast Helper
  function showToast(message) {
    let toast = document.getElementById('readerToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'readerToast';
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

  async function loadArticleBySlugFromApi() {
    if (!window.KK_API) return;
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    if (!slug) return;

    try {
      const res = await window.KK_API.articles.getRead(slug);
      if (res && res.success && res.data) {
        const art = res.data;
        const heroTitle = document.getElementById('articleHeroTitle');
        const navTitle = document.getElementById('navArticleTitle');
        const coverImg = document.querySelector('.article-hero-cover img');
        const bodyContent = document.querySelector('.article-content-wrapper') || document.querySelector('article');
        const categoryBadge = document.querySelector('.article-category-pill') || document.querySelector('.hero-cat-tag');

        if (heroTitle) heroTitle.textContent = art.title;
        if (navTitle) navTitle.textContent = art.title;
        if (coverImg && art.coverUrl) coverImg.src = art.coverUrl;
        if (categoryBadge && art.category) categoryBadge.textContent = art.category;

        document.title = `${art.title} - KERTAS KATA`;
      }
    } catch (err) {
      console.warn('Gagal memuat artikel dari slug:', err.message);
    }
  }

  // Initialization
  document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    restorePreferences();
    loadArticleBySlugFromApi();
  });

})();
