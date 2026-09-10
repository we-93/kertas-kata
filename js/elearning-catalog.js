/**
 * KERTAS KATA - E-Learning Catalog Overview Logic
 * Handles interactive module filtering and locked status alerts
 */

document.addEventListener('DOMContentLoaded', () => {
  initCatalogFilters();
  initLockedCardAlerts();
  initSidebarMobile();
});

function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.filter-pill-btn[data-filter]');
  const cards = document.querySelectorAll('.catalog-module-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'flex';
        } else if (filter === 'completed' && card.classList.contains('completed')) {
          card.style.display = 'flex';
        } else if (filter === 'active' && card.classList.contains('active')) {
          card.style.display = 'flex';
        } else if (filter === 'locked' && card.classList.contains('locked')) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initLockedCardAlerts() {
  const lockedCards = document.querySelectorAll('.catalog-module-card.locked, .btn-card-locked');
  lockedCards.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('🔒 Modul Terkunci: Selesaikan kuis Modul 5 dengan skor minimal 70% untuk membuka modul ini!');
    });
  });
}

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
