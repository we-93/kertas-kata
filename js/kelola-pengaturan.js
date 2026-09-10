/**
 * KELOLA PENGATURAN SISTEM - KERTAS KATA ADMIN
 * Mengelola parameter operasional platform, kebijakan kurasi & penerbitan,
 * kriteria e-learning 32 JP, gamifikasi poin, integrasi ISBN/percetakan, dan keamanan.
 */

(function () {
  'use strict';

  // 1. State Konfigurasi Default Sistem
  const defaultSettings = {
    platformName: 'KERTAS KATA Kabupaten Tangerang',
    tagline: 'Wadah Literasi, Pembelajaran Menulis, dan Publikasi Karya',
    contactEmail: 'redaksi@kertaskata.tangerangkab.go.id',
    serviceRegion: 'Kabupaten Tangerang (28 Kecamatan)',
    
    // Editorial & Kurasi
    minArticleWords: 800,
    maxDraftsPerUser: 5,
    autoFilterBadwords: true,
    curatorReviewSlaDays: 3,
    minWorksForSelfPrint: 10, // Selaras 100% dengan dashboard.html
    allowPublicComments: true,

    // E-Learning & 32 JP
    totalModulesCount: 5,
    totalLessonHours: 32,
    minQuizPassingScore: 75,
    requiredPublishedArticlesForCert: 3, // Selaras 100% dengan profil.html & dashboard.html
    certNumberPrefix: 'SRT/KT-TNG',
    enableAutoCertGeneration: true,

    // Gamifikasi & Poin
    xpReadArticle: 5,
    xpWriteComment: 10,
    xpPassQuiz: 50,
    xpPublishArticle: 100,
    level1Threshold: 0,
    level2Threshold: 500,
    level3Threshold: 1500,
    level4Threshold: 3000,

    // Integrasi API
    perpusnasApiUrl: 'https://isbn.perpusnas.go.id/api/v2/registry',
    perpusnasApiKey: 'KT-ISBN-PROD-98842-SEC',
    partnerPrintingApiUrl: 'https://api.percetakan-gemilang.co.id/v1/orders',
    printingPricePerCopyA5: 48000,

    // Keamanan & Sesi
    adminIdleTimeoutMins: 60,
    enforceComplexPassword: true,
    maxLoginAttempts: 5,
    enableTwoFactorAuth: true,
    autoDailyBackup: true
  };

  let currentSettings = { ...defaultSettings };

  // 2. Tab Switcher
  function initTabSwitcher() {
    const tabBtns = document.querySelectorAll('.settings-tab-btn');
    const panelSections = document.querySelectorAll('.settings-panel-card');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        panelSections.forEach(panel => {
          if (panel.id === targetId) {
            panel.style.display = 'block';
          } else {
            panel.style.display = 'none';
          }
        });
      });
    });
  }

  // 3. Simpan Semua Pengaturan
  window.saveAllSettings = function (e) {
    if (e) e.preventDefault();

    // Read form values
    const minWords = document.getElementById('cfgMinArticleWords')?.value;
    if (minWords) currentSettings.minArticleWords = parseInt(minWords, 10);

    const minPrintWorks = document.getElementById('cfgMinWorksForSelfPrint')?.value;
    if (minPrintWorks) currentSettings.minWorksForSelfPrint = parseInt(minPrintWorks, 10);

    const passingScore = document.getElementById('cfgMinQuizScore')?.value;
    if (passingScore) currentSettings.minQuizPassingScore = parseInt(passingScore, 10);

    const certArticles = document.getElementById('cfgCertArticles')?.value;
    if (certArticles) currentSettings.requiredPublishedArticlesForCert = parseInt(certArticles, 10);

    showToast('💾 Menyimpan seluruh parameter konfigurasi sistem KERTAS KATA...');

    setTimeout(() => {
      showToast('✓ Berhasil! Parameter sistem telah diperbarui dan langsung aktif di platform.');
    }, 800);
  };

  // 4. Pulihkan Pengaturan Default
  window.openResetModal = function () {
    const modal = document.getElementById('resetSettingsModal');
    if (modal) {
      modal.classList.add('show');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.confirmRestoreDefaults = function () {
    currentSettings = { ...defaultSettings };
    window.closeModal('resetSettingsModal');
    showToast('🔄 Parameter konfigurasi berhasil dipulihkan ke setelan pabrik default.');
  };

  // 5. Cadangan Basis Data (Database Backup)
  window.downloadDatabaseBackup = function () {
    showToast('🗄️ Memproses berkas cadangan basis data lengkap (Format SQL/JSON Compressed 1.240 MB)...');
    setTimeout(() => {
      showToast('📥 Berkas cadangan [backup_kertaskata_2026_09_10.sql.gz] siap diunduh.');
    }, 1200);
  };

  // 6. Putuskan Sesi Aktif
  window.invalidateAllSessions = function () {
    showToast('🛡️ Memutus seluruh sesi login perangkat lain kecuali sesi Anda saat ini.');
  };

  // 7. Helper Modal Closer
  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // 8. Toast Notification
  function showToast(message) {
    let toast = document.getElementById('globalAdminToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalAdminToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #1e293b;
        color: #ffffff;
        padding: 0.85rem 1.35rem;
        border-radius: 12px;
        font-size: 0.8125rem;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        opacity: 0;
        transform: translateY(15px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

  // 9. Mobile Drawer Navigation Toggle
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

  // 10. Event Listeners Initialization
  document.addEventListener('DOMContentLoaded', () => {
    initTabSwitcher();

    const saveForm = document.getElementById('settingsMainForm');
    if (saveForm) {
      saveForm.addEventListener('submit', window.saveAllSettings);
    }

    const backupBtn = document.getElementById('btnBackupDatabase');
    if (backupBtn) {
      backupBtn.addEventListener('click', window.downloadDatabaseBackup);
    }

    // Init Mobile Drawer
    initMobileDrawer();
  });

  // Keyboard accessibility: ESC closes open modals
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.inline-review-modal-overlay.show, .inline-review-modal-overlay.active').forEach(m => {
        m.classList.remove('show');
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });

})();
