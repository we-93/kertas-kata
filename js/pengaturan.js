/**
 * KERTAS KATA - Pengaturan Akun & Profil Penulis Logic
 * PRD v1.0 Bagian J (Fitur PA-01 s/d PA-04)
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const tabs = document.querySelectorAll('.pengaturan-tab-btn');
  const panes = document.querySelectorAll('.pengaturan-pane');
  const toastEl = document.getElementById('pengaturanToast');
  const toastMsg = document.getElementById('toastMessage');

  // Avatar Upload Elements (PA-01)
  const avatarFileInput = document.getElementById('avatarFileInput');
  const btnUploadAvatar = document.getElementById('btnUploadAvatar');
  const btnRemoveAvatar = document.getElementById('btnRemoveAvatar');
  const avatarPreview = document.getElementById('avatarPreview');
  const headerAvatar = document.querySelector('.user-avatar-small');

  // Forms
  const formProfil = document.getElementById('formProfilPenulis');
  const formPassword = document.getElementById('formUbahPassword');
  const formNotif = document.getElementById('formNotifikasi');
  const formPrivasi = document.getElementById('formPrivasi');

  // Mobile Menu
  const btnMobileMenu = document.getElementById('menuToggleBtn');
  const sidebarLeft = document.getElementById('sidebarLeft');
  const mobileBackdrop = document.getElementById('mobileBackdrop');

  // Helper: Show Toast
  function showToast(message, duration = 3500) {
    if (!toastEl) return;
    toastMsg.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  }

  // 1. Tab Navigation & Hash Routing
  function switchTab(targetId) {
    tabs.forEach(t => t.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));

    const activeTab = document.querySelector(`.pengaturan-tab-btn[data-tab="${targetId}"]`);
    const activePane = document.getElementById(targetId);

    if (activeTab && activePane) {
      activeTab.classList.add('active');
      activePane.classList.add('active');
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPane = tab.dataset.tab;
      switchTab(targetPane);
      
      // Update URL hash without jumping
      const hash = tab.dataset.hash;
      if (hash) {
        history.replaceState(null, null, `#${hash}`);
      }
    });
  });

  // Check URL Hash on Load
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash) {
    const matchedTab = Array.from(tabs).find(t => t.dataset.hash === initialHash);
    if (matchedTab) {
      switchTab(matchedTab.dataset.tab);
    }
  }

  // 2. Avatar Photo Profile Editor (PA-01)
  if (btnUploadAvatar && avatarFileInput) {
    btnUploadAvatar.addEventListener('click', () => {
      avatarFileInput.click();
    });

    avatarFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showToast('Ukuran file foto melebihi batas maksimum 5MB!');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const imgUrl = event.target.result;
          if (avatarPreview) {
            avatarPreview.innerHTML = `<img src="${imgUrl}" alt="Foto Profil Rahmat Hidayat">`;
          }
          if (headerAvatar) {
            headerAvatar.innerHTML = `<img src="${imgUrl}" alt="Foto Profil" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
          }
          showToast('📸 Foto profil penulis berhasil diunggah dan diperbarui!');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnRemoveAvatar) {
    btnRemoveAvatar.addEventListener('click', () => {
      if (avatarPreview) {
        avatarPreview.innerHTML = 'RH';
      }
      if (headerAvatar) {
        headerAvatar.innerHTML = 'RH';
      }
      if (avatarFileInput) avatarFileInput.value = '';
      showToast('Foto profil dihapus. Menggunakan inisial default.');
    });
  }

  // 3. Topics / Tags Selector (PA-01)
  const tagPills = document.querySelectorAll('.tag-pill');
  tagPills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
    });
  });

  // 4. Form Profil Penulis Submission (PA-01)
  if (formProfil) {
    formProfil.addEventListener('submit', (e) => {
      e.preventDefault();
      const namaInput = document.getElementById('inputNamaLengkap');
      if (namaInput && namaInput.value.trim()) {
        const headerNameEl = document.querySelector('.user-pill-name');
        if (headerNameEl) headerNameEl.textContent = namaInput.value.trim();
      }
      showToast('✅ Data Profil Penulis (PA-01) berhasil disimpan untuk sertifikat & ISBN!');
    });
  }

  // 5. Password Strength Meter (PA-02)
  const inputNewPass = document.getElementById('inputPasswordBaru');
  const passStrengthFill = document.getElementById('passStrengthFill');
  const passStrengthLabel = document.getElementById('passStrengthLabel');

  if (inputNewPass) {
    inputNewPass.addEventListener('input', (e) => {
      const val = e.target.value;
      let score = 0;
      if (val.length >= 8) score += 25;
      if (/[A-Z]/.test(val)) score += 25;
      if (/[0-9]/.test(val)) score += 25;
      if (/[^A-Za-z0-9]/.test(val)) score += 25;

      if (passStrengthFill && passStrengthLabel) {
        passStrengthFill.style.width = `${Math.max(score, 10)}%`;
        if (score <= 25) {
          passStrengthFill.style.background = '#ef4444';
          passStrengthLabel.textContent = 'Kekuatan: Lemah';
          passStrengthLabel.style.color = '#ef4444';
        } else if (score <= 50) {
          passStrengthFill.style.background = '#f59e0b';
          passStrengthLabel.textContent = 'Kekuatan: Cukup';
          passStrengthLabel.style.color = '#f59e0b';
        } else {
          passStrengthFill.style.background = '#10b981';
          passStrengthLabel.textContent = 'Kekuatan: Sangat Aman & Kuat';
          passStrengthLabel.style.color = '#10b981';
        }
      }
    });
  }

  if (formPassword) {
    formPassword.addEventListener('submit', (e) => {
      e.preventDefault();
      const passBaru = document.getElementById('inputPasswordBaru').value;
      const passKonfirmasi = document.getElementById('inputKonfirmasiPassword').value;

      if (passBaru !== passKonfirmasi) {
        showToast('Konfirmasi kata sandi tidak cocok!');
        return;
      }

      formPassword.reset();
      if (passStrengthFill) passStrengthFill.style.width = '75%';
      showToast('🔒 Kata sandi akun Anda berhasil diperbarui dengan aman!');
    });
  }

  // 6. Active Sessions (PA-02)
  const btnLogoutOtherSessions = document.getElementById('btnLogoutOtherSessions');
  if (btnLogoutOtherSessions) {
    btnLogoutOtherSessions.addEventListener('click', () => {
      const otherSessions = document.querySelectorAll('.session-item.other-device');
      otherSessions.forEach(s => s.remove());
      showToast('✅ Berhasil keluar dari semua perangkat login lain.');
    });
  }

  // 7. Notification Matrix Submission (PA-03)
  if (formNotif) {
    formNotif.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('🔔 Preferensi notifikasi multi-channel (PA-03) berhasil disimpan!');
    });
  }

  // 8. Visibility Options (PA-04)
  const visibilityCards = document.querySelectorAll('.visibility-card');
  visibilityCards.forEach(card => {
    card.addEventListener('click', () => {
      visibilityCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  if (formPrivasi) {
    formPrivasi.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('🛡️ Pengaturan privasi & visibilitas karya (PA-04) berhasil diperbarui!');
    });
  }

  // Danger Zone Actions
  const btnDeactivateAccount = document.getElementById('btnDeactivateAccount');
  if (btnDeactivateAccount) {
    btnDeactivateAccount.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin menonaktifkan akun sementara waktu?')) {
        showToast('Permintaan penonaktifan akun telah diproses. Konfirmasi dikirim ke email.');
      }
    });
  }

  // Mobile Menu Drawer
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
});
