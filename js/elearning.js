/**
 * KERTAS KATA - E-Learning Platform Logic
 * Based on PRD v1.0 (EL-01 to EL-05) & User Flow 2B
 */

document.addEventListener('DOMContentLoaded', () => {
  initVideoPlayer();
  initContentTabs();
  initQuizSystem();
  initPersonalNotes();
  initCurriculumModules();
  initSidebarMobile();
});

/* ====================================================
   1. SIMULATED VIDEO PLAYER (EL-02)
   ==================================================== */
function initVideoPlayer() {
  const playCenterBtn = document.getElementById('playCenterBtn');
  const videoScreen = document.getElementById('videoScreen');
  const btnPlayToggle = document.getElementById('btnPlayToggle');
  const seekFill = document.getElementById('videoSeekFill');
  const timeDisplay = document.getElementById('videoTimeDisplay');
  const btnSpeed = document.getElementById('btnVideoSpeed');

  if (!playCenterBtn || !seekFill || !timeDisplay) return;

  let isPlaying = false;
  let currentSeconds = 14 * 60 + 20; // 14:20
  const totalSeconds = 22 * 60 + 15; // 22:15
  let interval = null;
  const speeds = ['1.0x', '1.25x', '1.5x', '2.0x'];
  let currentSpeedIdx = 0;

  function updateTimeDisplay() {
    const curM = Math.floor(currentSeconds / 60);
    const curS = currentSeconds % 60;
    const totM = Math.floor(totalSeconds / 60);
    const totS = totalSeconds % 60;
    timeDisplay.textContent = `${curM}:${curS < 10 ? '0' : ''}${curS} / ${totM}:${totS}`;
    const pct = (currentSeconds / totalSeconds) * 100;
    seekFill.style.width = `${pct}%`;
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playCenterBtn.style.display = 'none';
      if (btnPlayToggle) btnPlayToggle.innerHTML = `
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      `;
      interval = setInterval(() => {
        if (currentSeconds < totalSeconds) {
          currentSeconds += 1;
          updateTimeDisplay();
        } else {
          togglePlay();
        }
      }, 1000);
      showToast('▶ Video materi diputar');
    } else {
      playCenterBtn.style.display = 'flex';
      if (btnPlayToggle) btnPlayToggle.innerHTML = `
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
      clearInterval(interval);
      showToast('⏸ Video dijeda');
    }
  }

  playCenterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
  });

  videoScreen.addEventListener('click', togglePlay);
  if (btnPlayToggle) btnPlayToggle.addEventListener('click', togglePlay);

  if (btnSpeed) {
    btnSpeed.addEventListener('click', () => {
      currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
      btnSpeed.textContent = speeds[currentSpeedIdx];
      showToast(`⚡ Kecepatan video: ${speeds[currentSpeedIdx]}`);
    });
  }

  updateTimeDisplay();
}

/* ====================================================
   2. CONTENT TABS (Materi, Kuis, Catatan, Tanya Mentor)
   ==================================================== */
function initContentTabs() {
  const tabButtons = document.querySelectorAll('.content-tab-btn[data-target]');
  const panes = document.querySelectorAll('.tab-pane');

  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ====================================================
   3. INTERACTIVE QUIZ ENGINE (EL-04)
   ==================================================== */
function initQuizSystem() {
  const quizForm = document.getElementById('quizForm');
  const quizResult = document.getElementById('quizResult');
  const btnSubmitQuiz = document.getElementById('btnSubmitQuiz');

  if (!quizForm || !quizResult) return;

  // Option selection style
  const radioLabels = document.querySelectorAll('.quiz-option-label');
  radioLabels.forEach(label => {
    const radio = label.querySelector('input[type="radio"]');
    if (!radio) return;

    radio.addEventListener('change', () => {
      const groupName = radio.name;
      document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
        r.closest('.quiz-option-label').classList.remove('selected');
      });
      if (radio.checked) {
        label.classList.add('selected');
      }
    });
  });

  // Correct Answers for Modul 5 Quiz
  const correctAnswers = {
    q1: 'c', // Konfirmasi narasumber dan cek fakta lapangan
    q2: 'b', // Izin tertulis/lisan dan menjaga asas praduga tak bersalah
    q3: 'b'  // 70%
  };

  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(quizForm);
    let totalScore = 0;
    const totalQuestions = 3;

    for (const [key, correctVal] of Object.entries(correctAnswers)) {
      if (formData.get(key) === correctVal) {
        totalScore += 1;
      }
    }

    const percentage = Math.round((totalScore / totalQuestions) * 100);
    const passed = percentage >= 70;

    quizResult.style.display = 'flex';
    if (passed) {
      quizResult.className = 'quiz-result-banner passed';
      quizResult.innerHTML = `
        <div style="font-size: 2rem;">🎉</div>
        <div>
          <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem;">Selamat! Anda Lulus Kuis Modul 5</h4>
          <p style="font-size: 0.8125rem;">Skor Akhir: <strong>${percentage}%</strong> (${totalScore}/${totalQuestions} Benar). Anda melampaui batas kelulusan 70%.</p>
          <div style="margin-top: 0.5rem; font-size: 0.75rem; font-weight: 600; color: #047857;">
            🔓 <strong>Modul 6: Estetika Puisi & Gaya Bahasa Figuratif</strong> sekarang telah terbuka!
          </div>
        </div>
      `;

      // Update module 5 status to completed
      const mod5 = document.getElementById('moduleItem5');
      if (mod5) {
        mod5.classList.add('completed');
        const icon = mod5.querySelector('.module-status-icon');
        if (icon) icon.innerHTML = '✓';
      }

      // Unlock module 6
      const mod6 = document.getElementById('moduleItem6');
      if (mod6) {
        mod6.classList.remove('locked');
        const icon = mod6.querySelector('.module-status-icon');
        if (icon) icon.innerHTML = '▶';
        mod6.title = 'Modul 6 Terbuka - Klik untuk mempelajari';
      }

      showToast('🌟 Kuis Lulus! Modul berikutnya telah dibuka.');
    } else {
      quizResult.className = 'quiz-result-banner failed';
      quizResult.innerHTML = `
        <div style="font-size: 2rem;">⚠️</div>
        <div>
          <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem;">Nilai Belum Mencapai Batas Kelulusan</h4>
          <p style="font-size: 0.8125rem;">Skor Anda: <strong>${percentage}%</strong>. Batas minimal kelulusan adalah 70%.</p>
          <p style="font-size: 0.75rem; margin-top: 0.25rem;">Silakan tinjau kembali video dan ringkasan materi sebelum mengulang kuis.</p>
        </div>
      `;
      showToast('❌ Nilai belum memenuhi syarat kelulusan (min. 70%).');
    }

    quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* ====================================================
   4. PERSONAL NOTES SYSTEM (EL-05)
   ==================================================== */
function initPersonalNotes() {
  const notesTextarea = document.getElementById('personalNotesText');
  const btnSaveNotes = document.getElementById('btnSaveNotes');
  const btnClearNotes = document.getElementById('btnClearNotes');
  const notesStatus = document.getElementById('notesSaveStatus');

  if (!notesTextarea) return;

  const storageKey = 'kertas_kata_notes_module_5';
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    notesTextarea.value = saved;
    if (notesStatus) notesStatus.textContent = 'Tersimpan otomatis di penyimpanan lokal';
  }

  function saveNotes() {
    localStorage.setItem(storageKey, notesTextarea.value);
    if (notesStatus) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      notesStatus.textContent = `Tersimpan otomatis pukul ${timeStr}`;
    }
  }

  // Auto-save on typing
  notesTextarea.addEventListener('input', () => {
    if (notesStatus) notesStatus.textContent = 'Menyimpan perubahan...';
    saveNotes();
  });

  if (btnSaveNotes) {
    btnSaveNotes.addEventListener('click', () => {
      saveNotes();
      showToast('💾 Catatan pribadi berhasil disimpan!');
    });
  }

  if (btnClearNotes) {
    btnClearNotes.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin mengosongkan catatan ini?')) {
        notesTextarea.value = '';
        localStorage.removeItem(storageKey);
        if (notesStatus) notesStatus.textContent = 'Catatan telah dikosongkan';
        showToast('🗑️ Catatan telah dibersihkan');
      }
    });
  }
}

/* ====================================================
   5. CURRICULUM MODULE SELECTION & LOCKED CHECKS
   ==================================================== */
function initCurriculumModules() {
  const moduleItems = document.querySelectorAll('.module-item');

  moduleItems.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('locked')) {
        showToast('🔒 Modul Terkunci: Selesaikan kuis Modul 5 dengan skor minimal 70% untuk membuka materi ini!');
        return;
      }

      if (item.classList.contains('completed')) {
        const title = item.querySelector('.module-item-title').textContent;
        showToast(`📚 Membuka arsip materi: ${title}`);
      }
    });
  });
}

/* ====================================================
   6. MOBILE SIDEBAR TOGGLE
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

/* Toast Notification Utility */
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
