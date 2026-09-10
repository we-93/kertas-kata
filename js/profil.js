/* ==========================================================================
   KERTAS KATA - PROFIL PENULIS (HALAMAN PROFIL) JAVASCRIPT
   Kabupaten Tangerang Digital Literacy Platform
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPdfExportModal();
  initShareProfile();
  initPortfolioFilter();
  initMobileSidebar();
});

/* ==========================================================
   1. EXPORT TO PDF MODAL (PR-05)
   ========================================================== */
function initPdfExportModal() {
  const modal = document.getElementById('pdfExportModal');
  const openBtn = document.getElementById('btnOpenExportPdf');
  const closeBtn = document.getElementById('btnClosePdfModal');
  const printBtn = document.getElementById('btnPrintPdf');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

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

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================
   2. SHARE PUBLIC PROFILE LINK
   ========================================================== */
function initShareProfile() {
  const shareBtn = document.getElementById('btnSharePublicProfile');

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const profileUrl = 'https://kertaskata.tangerangkab.go.id/penulis/rahmat-hidayat';
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(profileUrl).then(() => {
          showToast('✓ Tautan profil publik berhasil disalin ke clipboard!');
        }).catch(() => {
          fallbackCopyText(profileUrl);
        });
      } else {
        fallbackCopyText(profileUrl);
      }
    });
  }
}

function fallbackCopyText(text) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  showToast('✓ Tautan profil publik disalin ke clipboard!');
}

/* ==========================================================
   3. PORTFOLIO CATEGORY FILTER (PR-02)
   ========================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-tab-btn');
  const cards = document.querySelectorAll('.port-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCat = btn.getAttribute('data-category');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterCat === 'all' || cardCat === filterCat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================
   4. MOBILE SIDEBAR TOGGLE
   ========================================================== */
function initMobileSidebar() {
  const toggleBtn = document.getElementById('menuToggleBtn') || document.getElementById('btnMobileMenu');
  const sidebar = document.getElementById('sidebarLeft');
  const backdrop = document.getElementById('mobileBackdrop');

  if (toggleBtn && sidebar && backdrop) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebar.classList.toggle('active');
      backdrop.classList.toggle('show');
      backdrop.classList.toggle('active');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebar.classList.remove('active');
      backdrop.classList.remove('show');
      backdrop.classList.remove('active');
    });
  }
}

/* ==========================================================
   5. TOAST NOTIFICATION UTILITY
   ========================================================== */
function showToast(message) {
  let toast = document.getElementById('profilToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'profilToast';
    toast.className = 'profil-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}
