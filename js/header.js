/**
 * KERTAS KATA - Unified Header Logic
 * Manages user avatar dropdown menu, notification popover, and responsive header interactions.
 */

(function () {
  'use strict';

  function initHeaderDropdown() {
    const userPillBtn = document.getElementById('userPillBtn') || document.getElementById('userPill');
    const userDropdown = document.getElementById('userDropdownMenu');
    const notifBtn = document.getElementById('notifBellBtn');
    const notifPopover = document.getElementById('notifPopover');

    // 1. Toggle User Dropdown
    if (userPillBtn && userDropdown) {
      userPillBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = userDropdown.classList.contains('show');

        // Close notif popover if open
        if (notifPopover) {
          notifPopover.classList.remove('show');
        }

        if (isOpen) {
          userDropdown.classList.remove('show');
          userPillBtn.classList.remove('active');
          userPillBtn.setAttribute('aria-expanded', 'false');
        } else {
          userDropdown.classList.add('show');
          userPillBtn.classList.add('active');
          userPillBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    // 2. Toggle Notification Popover (if present on page)
    if (notifBtn && notifPopover) {
      notifBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = notifPopover.classList.contains('show');

        // Close user dropdown if open
        if (userDropdown) {
          userDropdown.classList.remove('show');
          if (userPillBtn) {
            userPillBtn.classList.remove('active');
            userPillBtn.setAttribute('aria-expanded', 'false');
          }
        }

        notifPopover.classList.toggle('show', !isOpen);
      });
    }

    // 3. Close on Outside Click
    document.addEventListener('click', function (e) {
      if (userDropdown && userDropdown.classList.contains('show')) {
        if (!userDropdown.contains(e.target) && !userPillBtn.contains(e.target)) {
          userDropdown.classList.remove('show');
          if (userPillBtn) {
            userPillBtn.classList.remove('active');
            userPillBtn.setAttribute('aria-expanded', 'false');
          }
        }
      }

      if (notifPopover && notifPopover.classList.contains('show')) {
        if (!notifPopover.contains(e.target) && !notifBtn.contains(e.target)) {
          notifPopover.classList.remove('show');
        }
      }
    });

    // 4. Close on Escape Key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (userDropdown && userDropdown.classList.contains('show')) {
          userDropdown.classList.remove('show');
          if (userPillBtn) {
            userPillBtn.classList.remove('active');
            userPillBtn.setAttribute('aria-expanded', 'false');
          }
        }
        if (notifPopover && notifPopover.classList.contains('show')) {
          notifPopover.classList.remove('show');
        }
      }
    });

    // 5. Logout Action Handler
    const logoutBtn = document.getElementById('headerLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar dari akun KERTAS KATA?');
        if (confirmLogout) {
          // Display friendly feedback & redirect
          alert('Anda telah berhasil keluar dari akun KERTAS KATA. Terima kasih!');
          window.location.href = 'dashboard.html';
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderDropdown);
  } else {
    initHeaderDropdown();
  }
})();
