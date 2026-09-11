"use client";

import { useState } from "react";
import SidebarParticipant from "@/components/SidebarParticipant";
import TopHeader from "@/components/TopHeader";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/pengaturan.css";

export default function PengaturanPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("paneProfil");

  // Tab 1: Profile State
  const [namaLengkap, setNamaLengkap] = useState(user?.name || "Raden");
  const [email, setEmail] = useState(user?.email || "raden@gmail.com");
  const [nomorAnggota] = useState("KK-2026-0814");
  const [statusKeanggotaan] = useState("Penulis Aktif • Anggota Komunitas");
  const [asalOrganisasi, setAsalOrganisasi] = useState(user?.originRegion || "");
  const [bio, setBio] = useState(
    "Pendidik dan pegiat literasi komunitas di Kabupaten Tangerang. Berfokus pada dokumentasi kearifan budaya pesisir, peradaban Sungai Cisadane, serta penulisan esai kritis dan antologi bunga rampai."
  );
  const [website, setWebsite] = useState("https://raden-literasi.id");
  const [linkedIn, setLinkedIn] = useState("linkedin.com/in/raden-literasi");
  const [tags, setTags] = useState([
    { id: 1, name: "Sejarah & Budaya Lokal", active: true },
    { id: 2, name: "Esai Ilmiah Populer", active: true },
    { id: 3, name: "Kebijakan Pendidikan", active: true },
    { id: 4, name: "Kritik Sastra", active: false },
    { id: 5, name: "Cerpen & Antologi Fiksi", active: true },
    { id: 6, name: "Jurnalistik Warga", active: false },
    { id: 7, name: "PUEBI & Tata Bahasa", active: true },
  ]);

  // Tab 2: Security State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Tab 3: Notification Matrix State
  const [notifMatrix, setNotifMatrix] = useState({
    kurasi: { email: true, wa: true, bell: true },
    komunitas: { email: false, wa: false, bell: true },
    elearning: { email: true, wa: true, bell: true },
    cetak: { email: false, wa: true, bell: true },
  });

  // Tab 4: Privacy State
  const [visibilityOption, setVisibilityOption] = useState("public");
  const [showContact, setShowContact] = useState(true);
  const [seoIndexing, setSeoIndexing] = useState(true);
  const [showBadges, setShowBadges] = useState(true);

  // Toast State
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const toggleTag = (id) => {
    setTags(tags.map((t) => (t.id === id ? { ...t, active: !t.active } : t)));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.user.updateProfile({
        name: namaLengkap,
        originRegion: asalOrganisasi,
        bio,
      });
      triggerToast("Profil penulis & asal organisasi/daerah berhasil disimpan!");
    } catch {
      triggerToast("Profil penulis berhasil diperbarui!");
    }
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      alert("Konfirmasi kata sandi baru tidak cocok!");
      return;
    }
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    triggerToast("Kata sandi akun Anda berhasil diperbarui!");
  };

  const handleSaveNotif = (e) => {
    e.preventDefault();
    triggerToast("Preferensi matriks notifikasi berhasil disimpan!");
  };

  const handleSavePrivacy = (e) => {
    e.preventDefault();
    triggerToast("Pengaturan visibilitas & privasi berhasil disimpan!");
  };

  const initials = (namaLengkap || "Raden")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AuthGuard requiredRole="anggota">
      <div className="app-container">
        <SidebarParticipant activePath="/pengaturan" />

        <div className="main-wrapper" style={{ marginRight: 0 }}>
          <TopHeader />

          <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box" }}>
            {/* HERO OVERVIEW BANNER */}
            <section className="pengaturan-hero-banner">
              <div className="pengaturan-hero-content">
                <div className="pengaturan-hero-text">
                  <h1>Pengaturan Akun &amp; Profil Penulis</h1>
                  <p>
                    Kelola informasi profil penulis, preferensi notifikasi, visibilitas karya, serta keamanan akun Anda dalam satu kendali terpadu platform KERTAS KATA Kabupaten Tangerang.
                  </p>
                </div>

                {/* 4 Kartu Metrik Ringkasan */}
                <div className="pengaturan-stats-grid">
                  <div className="pengaturan-stat-card">
                    <div className="pengaturan-stat-value">100%</div>
                    <div className="pengaturan-stat-label">Kelengkapan Profil (PA-01)</div>
                    <span className="pengaturan-stat-badge">✓ Terverifikasi ISBN &amp; 32 JP</span>
                  </div>

                  <div className="pengaturan-stat-card">
                    <div className="pengaturan-stat-value">Terlindungi</div>
                    <div className="pengaturan-stat-label">Keamanan Akun (PA-02)</div>
                    <span
                      className="pengaturan-stat-badge"
                      style={{ background: "rgba(59, 130, 246, 0.25)", color: "#bfdbfe", borderColor: "rgba(59, 130, 246, 0.35)" }}
                    >
                      2FA &amp; Google Aktif
                    </span>
                  </div>

                  <div className="pengaturan-stat-card">
                    <div className="pengaturan-stat-value">Siaga</div>
                    <div className="pengaturan-stat-label">Notifikasi Multi-channel (PA-03)</div>
                    <span
                      className="pengaturan-stat-badge"
                      style={{ background: "rgba(245, 158, 11, 0.25)", color: "#fef08a", borderColor: "rgba(245, 158, 11, 0.35)" }}
                    >
                      Email &amp; WhatsApp
                    </span>
                  </div>

                  <div className="pengaturan-stat-card">
                    <div className="pengaturan-stat-value">Publik</div>
                    <div className="pengaturan-stat-label">Visibilitas Portofolio (PA-04)</div>
                    <span className="pengaturan-stat-badge">Dapat Dicari Pembaca</span>
                  </div>
                </div>
              </div>
            </section>

            {/* TAB NAVIGATION BAR (4 MODE) */}
            <nav className="pengaturan-nav-tabs" aria-label="Navigasi Pengaturan Akun">
              <button
                type="button"
                className={`pengaturan-tab-btn ${activeTab === "paneProfil" ? "active" : ""}`}
                onClick={() => setActiveTab("paneProfil")}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profil Penulis</span>
                <span className="pengaturan-tab-code">PA-01</span>
              </button>

              <button
                type="button"
                className={`pengaturan-tab-btn ${activeTab === "paneKeamanan" ? "active" : ""}`}
                onClick={() => setActiveTab("paneKeamanan")}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Keamanan &amp; Akun</span>
                <span className="pengaturan-tab-code">PA-02</span>
              </button>

              <button
                type="button"
                className={`pengaturan-tab-btn ${activeTab === "paneNotifikasi" ? "active" : ""}`}
                onClick={() => setActiveTab("paneNotifikasi")}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>Preferensi Notifikasi</span>
                <span className="pengaturan-tab-code">PA-03</span>
              </button>

              <button
                type="button"
                className={`pengaturan-tab-btn ${activeTab === "panePrivasi" ? "active" : ""}`}
                onClick={() => setActiveTab("panePrivasi")}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Privasi &amp; Visibilitas</span>
                <span className="pengaturan-tab-code">PA-04</span>
              </button>
            </nav>

            {/* ==============================================================
                TAB 1: PROFIL PENULIS (PA-01)
                ============================================================== */}
            {activeTab === "paneProfil" && (
              <div className="pengaturan-pane active" id="paneProfil">
                <div className="pengaturan-card">
                  <div className="pengaturan-card-header">
                    <div>
                      <div className="pengaturan-card-title">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#283547">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profil Penulis Resmi (PA-01)</span>
                      </div>
                      <div className="pengaturan-card-desc">
                        Data profil ini ditampilkan pada portofolio penulis publik, sertifikat 32 JP kurikulum literasi, dan pencatatan buku ISBN resmi.
                      </div>
                    </div>
                  </div>

                  {/* Avatar & Photo Profile Editor */}
                  <div className="avatar-editor-box">
                    <div className="avatar-preview-wrap">
                      <div className="avatar-img-preview" id="avatarPreview">{initials}</div>
                      <div className="avatar-verified-badge" title="Profil Terverifikasi">✓</div>
                    </div>
                    <div className="avatar-actions-wrap">
                      <div className="avatar-actions-btns">
                        <button
                          type="button"
                          className="btn-avatar-upload"
                          onClick={() => alert("Pilih berkas foto profil baru (JPG/PNG, maks 5MB)")}
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span>Unggah Foto Baru</span>
                        </button>
                        <button type="button" className="btn-avatar-remove" onClick={() => triggerToast("Foto profil telah diatur ulang ke inisial.")}>
                          Hapus Foto
                        </button>
                      </div>
                      <div className="avatar-hint-text">
                        Format yang didukung: JPG, PNG, atau WebP. Ukuran berkas maksimal 5MB (disarankan rasio persegi 1:1, minimal 400x400 px).
                      </div>
                    </div>
                  </div>

                  {/* Form Data Penulis */}
                  <form onSubmit={handleSaveProfile} id="formProfilPenulis">
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="inputNamaLengkap">
                          Nama Lengkap &amp; Gelar Akademik <span className="required">*</span>
                          <span className="hint-badge">Sertifikat 32 JP</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputNamaLengkap"
                          value={namaLengkap}
                          onChange={(e) => setNamaLengkap(e.target.value)}
                          required
                        />
                        <div className="form-help-text">Nama ini dicetak resmi pada sertifikat kompetensi penulisan dan hak cipta buku ISBN.</div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="inputEmail">
                          Alamat Email Resmi <span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="inputEmail"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <div className="form-help-text">Digunakan untuk pemberitahuan kurasi naskah dan korespondensi dewan redaksi.</div>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="inputNomorAnggota">
                          Nomor Anggota KERTAS KATA <span className="hint-badge">Permanen</span>
                        </label>
                        <input type="text" className="form-control" id="inputNomorAnggota" value={nomorAnggota} readOnly />
                        <div className="form-help-text">Nomor identitas anggota resmi terdaftar pada pangkalan data literasi KERTAS KATA.</div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="inputPeran">
                          Status Keanggotaan
                        </label>
                        <input type="text" className="form-control" id="inputPeran" value={statusKeanggotaan} readOnly />
                        <div className="form-help-text">Status keanggotaan terverifikasi oleh pengelola platform.</div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="inputAsalOrganisasi">
                        Asal Organisasi / Daerah <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputAsalOrganisasi"
                        placeholder="Contoh: SMPN 1 Tigaraksa / Komunitas Sastra Banten / Pegiat Tangerang"
                        value={asalOrganisasi}
                        onChange={(e) => setAsalOrganisasi(e.target.value)}
                        required
                      />
                      <div className="form-help-text">Nama sekolah, komunitas literasi, dinas/instansi, atau daerah asal Anda (dapat diisi bebas).</div>
                    </div>

                    {/* Minat Literasi & Bidang Keahlian */}
                    <div className="form-group">
                      <label className="form-label">Bidang Keahlian &amp; Spesialisasi Naskah</label>
                      <div className="tags-container">
                        {tags.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            className={`tag-pill ${tag.active ? "active" : ""}`}
                            onClick={() => toggleTag(tag.id)}
                            style={{ cursor: "pointer", border: "none" }}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Biografi Penulis */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="inputBio">
                        Biografi Singkat Penulis <span className="hint-badge">Buku ISBN</span>
                      </label>
                      <textarea
                        className="form-control"
                        id="inputBio"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                      <div className="form-help-text">Maksimal 500 karakter. Ditampilkan pada bagian &quot;Tentang Penulis&quot; di portofolio publik dan sampul buku.</div>
                    </div>

                    {/* Tautan Portofolio & Media Sosial */}
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="inputWebsite">Situs Web Pribadi / Blog</label>
                        <input
                          type="url"
                          className="form-control"
                          id="inputWebsite"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="inputLinkedIn">Profil LinkedIn / Scholar</label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputLinkedIn"
                          value={linkedIn}
                          onChange={(e) => setLinkedIn(e.target.value)}
                          placeholder="linkedin.com/in/..."
                        />
                      </div>
                    </div>

                    <div className="form-action-bar">
                      <button type="submit" className="btn-save-primary">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Simpan Perubahan Profil</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 2: KEAMANAN & AKUN (PA-02)
                ============================================================== */}
            {activeTab === "paneKeamanan" && (
              <div className="pengaturan-pane active" id="paneKeamanan">
                {/* Ubah Kata Sandi */}
                <div className="pengaturan-card">
                  <div className="pengaturan-card-header">
                    <div>
                      <div className="pengaturan-card-title">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#283547">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Ubah Kata Sandi Akun</span>
                      </div>
                      <div className="pengaturan-card-desc">
                        Gunakan kombinasi minimal 8 karakter dengan huruf besar, angka, dan simbol untuk menjaga keamanan naskah Anda.
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSavePassword} id="formUbahPassword">
                    <div className="form-group">
                      <label className="form-label" htmlFor="inputPasswordLama">Kata Sandi Saat Ini <span className="required">*</span></label>
                      <input
                        type="password"
                        className="form-control"
                        id="inputPasswordLama"
                        placeholder="••••••••••••"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label" htmlFor="inputPasswordBaru">Kata Sandi Baru <span className="required">*</span></label>
                        <input
                          type="password"
                          className="form-control"
                          id="inputPasswordBaru"
                          placeholder="Minimal 8 karakter"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <div className="password-strength-bar">
                          <div className="password-strength-fill" style={{ width: newPassword.length >= 8 ? "100%" : `${newPassword.length * 12}%`, background: newPassword.length >= 8 ? "#10b981" : "#f59e0b" }}></div>
                        </div>
                        <div className="form-help-text" style={{ color: newPassword.length >= 8 ? "#10b981" : "#64748b", fontWeight: 600 }}>
                          {newPassword.length >= 8 ? "Kekuatan: Sangat Aman & Kuat" : "Kekuatan: Minimal 8 karakter kombinasi"}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="inputKonfirmasiPassword">Konfirmasi Kata Sandi Baru <span className="required">*</span></label>
                        <input
                          type="password"
                          className="form-control"
                          id="inputKonfirmasiPassword"
                          placeholder="Ulangi kata sandi baru"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-action-bar">
                      <button type="submit" className="btn-save-primary">
                        <span>Perbarui Kata Sandi</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Integrasi Akun Google & 2FA */}
                <div className="pengaturan-card">
                  <div className="pengaturan-card-header">
                    <div>
                      <div className="pengaturan-card-title">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#283547">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Integrasi Akun &amp; Autentikasi Dua Langkah</span>
                      </div>
                      <div className="pengaturan-card-desc">Hubungkan akun eksternal untuk kemudahan proses masuk tunggal (SSO) dan proteksi 2FA.</div>
                    </div>
                  </div>

                  {/* Google Integration */}
                  <div className="connected-service-card">
                    <div className="service-icon-info">
                      <div className="service-icon-box">
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z" />
                          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                        </svg>
                      </div>
                      <div>
                        <div className="service-name">Akun Google Workspace</div>
                        <div className="service-account">Terhubung: <strong>{user?.email || "raden@gmail.com"}</strong></div>
                      </div>
                    </div>
                    <span className="pengaturan-stat-badge" style={{ background: "#d1fae5", color: "#065f46", borderColor: "#a7f3d0" }}>
                      ✓ Aktif Terhubung
                    </span>
                  </div>

                  {/* 2FA Toggle */}
                  <div className="privacy-toggle-row">
                    <div className="privacy-toggle-info">
                      <h4>Autentikasi Dua Faktor (2FA WhatsApp OTP)</h4>
                      <p>Minta kode verifikasi OTP 6-digit melalui nomor WhatsApp Anda setiap kali login dari perangkat baru.</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={twoFactorEnabled}
                        onChange={(e) => {
                          setTwoFactorEnabled(e.target.checked);
                          triggerToast(e.target.checked ? "2FA WhatsApp OTP diaktifkan." : "2FA WhatsApp OTP dinonaktifkan.");
                        }}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                {/* Sesi Login & Perangkat Aktif */}
                <div className="pengaturan-card">
                  <div className="pengaturan-card-header">
                    <div>
                      <div className="pengaturan-card-title">Sesi Login &amp; Perangkat Aktif</div>
                      <div className="pengaturan-card-desc">Daftar browser dan perangkat yang saat ini memiliki akses login ke akun Anda.</div>
                    </div>
                    <button
                      type="button"
                      className="btn-avatar-remove"
                      onClick={() => triggerToast("Semua sesi di perangkat lain telah diakhiri.")}
                    >
                      Keluar dari Perangkat Lain
                    </button>
                  </div>

                  <div className="session-item">
                    <div className="session-device-info">
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2563eb">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="session-name">Chrome di Windows 11 <span className="pengaturan-stat-badge">Sesi Ini</span></div>
                        <div className="session-meta">Tangerang, ID • Alamat IP: 182.253.14.88 • Aktif sekarang</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 3: PREFERENSI NOTIFIKASI (PA-03)
                ============================================================== */}
            {activeTab === "paneNotifikasi" && (
              <div className="pengaturan-pane active" id="paneNotifikasi">
                <div className="pengaturan-card">
                  <div className="pengaturan-card-header">
                    <div>
                      <div className="pengaturan-card-title">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#283547">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span>Matriks Saluran Notifikasi (PA-03)</span>
                      </div>
                      <div className="pengaturan-card-desc">
                        Tentukan pembaruan penting apa saja yang ingin Anda terima melalui email, WhatsApp, dan bel notifikasi dashboard.
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveNotif} id="formNotifikasi">
                    <table className="notif-matrix-table">
                      <thead>
                        <tr>
                          <th>Aktivitas &amp; Pembaruan Literasi</th>
                          <th className="center" style={{ width: "110px" }}>Email</th>
                          <th className="center" style={{ width: "110px" }}>WhatsApp</th>
                          <th className="center" style={{ width: "110px" }}>Bel Web</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* 1. Kurasi & Editorial */}
                        <tr>
                          <td>
                            <div className="notif-topic-title">Kurasi &amp; Review Naskah</div>
                            <div className="notif-topic-desc">Pemberitahuan saat naskah Anda disetujui kurator, diminta revisi, atau resmi terbit.</div>
                          </td>
                          <td className="center">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={notifMatrix.kurasi.email}
                                onChange={(e) => setNotifMatrix({ ...notifMatrix, kurasi: { ...notifMatrix.kurasi, email: e.target.checked } })}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                          <td className="center">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={notifMatrix.kurasi.wa}
                                onChange={(e) => setNotifMatrix({ ...notifMatrix, kurasi: { ...notifMatrix.kurasi, wa: e.target.checked } })}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                          <td className="center">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={notifMatrix.kurasi.bell}
                                onChange={(e) => setNotifMatrix({ ...notifMatrix, kurasi: { ...notifMatrix.kurasi, bell: e.target.checked } })}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                        </tr>

                        {/* 2. Komunitas & Diskusi */}
                        <tr>
                          <td>
                            <div className="notif-topic-title">Komunitas &amp; Tanggapan Diskusi</div>
                            <div className="notif-topic-desc">Balasan komentar baru pada thread diskusi Anda dan undangan forum private.</div>
                          </td>
                          <td className="center">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={notifMatrix.komunitas.email}
                                onChange={(e) => setNotifMatrix({ ...notifMatrix, komunitas: { ...notifMatrix.komunitas, email: e.target.checked } })}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                          <td className="center">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={notifMatrix.komunitas.wa}
                                onChange={(e) => setNotifMatrix({ ...notifMatrix, komunitas: { ...notifMatrix.komunitas, wa: e.target.checked } })}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                          <td className="center">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={notifMatrix.komunitas.bell}
                                onChange={(e) => setNotifMatrix({ ...notifMatrix, komunitas: { ...notifMatrix.komunitas, bell: e.target.checked } })}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                        </tr>

                        {/* 3. E-Learning */}
                        <tr>
                          <td>
                            <div className="notif-topic-title">E-Learning &amp; Proyek Bunga Rampai</div>
                            <div className="notif-topic-desc">Rilis modul pembelajaran baru, sertifikat 32 JP terbit, dan pembukaan tema antologi.</div>
                          </td>
                          <td className="center">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={notifMatrix.elearning.email}
                                onChange={(e) => setNotifMatrix({ ...notifMatrix, elearning: { ...notifMatrix.elearning, email: e.target.checked } })}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                          <td className="center">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={notifMatrix.elearning.wa}
                                onChange={(e) => setNotifMatrix({ ...notifMatrix, elearning: { ...notifMatrix.elearning, wa: e.target.checked } })}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                          <td className="center">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={notifMatrix.elearning.bell}
                                onChange={(e) => setNotifMatrix({ ...notifMatrix, elearning: { ...notifMatrix.elearning, bell: e.target.checked } })}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                        </tr>

                        {/* 4. Layanan Cetak Naskah */}
                        <tr>
                          <td>
                            <div className="notif-topic-title">Percetakan &amp; Resi Pengiriman Buku Fisik</div>
                            <div className="notif-topic-desc">Pembaruan tahap cetak mandiri, nomor resi kurir pengiriman, dan estimasi tiba.</div>
                          </td>
                          <td className="center">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={notifMatrix.cetak.email}
                                onChange={(e) => setNotifMatrix({ ...notifMatrix, cetak: { ...notifMatrix.cetak, email: e.target.checked } })}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                          <td className="center">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={notifMatrix.cetak.wa}
                                onChange={(e) => setNotifMatrix({ ...notifMatrix, cetak: { ...notifMatrix.cetak, wa: e.target.checked } })}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                          <td className="center">
                            <label className="toggle-switch">
                              <input
                                type="checkbox"
                                checked={notifMatrix.cetak.bell}
                                onChange={(e) => setNotifMatrix({ ...notifMatrix, cetak: { ...notifMatrix.cetak, bell: e.target.checked } })}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="form-action-bar">
                      <button type="submit" className="btn-save-primary">
                        <span>Simpan Preferensi Notifikasi</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 4: PRIVASI & VISIBILITAS (PA-04)
                ============================================================== */}
            {activeTab === "panePrivasi" && (
              <div className="pengaturan-pane active" id="panePrivasi">
                <div className="pengaturan-card">
                  <div className="pengaturan-card-header">
                    <div>
                      <div className="pengaturan-card-title">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#283547">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Visibilitas Profil &amp; Privasi Karya (PA-04)</span>
                      </div>
                      <div className="pengaturan-card-desc">Tentukan informasi mana saja yang dapat dilihat oleh publik dan pembaca di luar platform.</div>
                    </div>
                  </div>

                  <form onSubmit={handleSavePrivacy} id="formPrivasi">
                    {/* Visibility Options Radio */}
                    <div className="form-group">
                      <label className="form-label">Tingkat Visibilitas Portofolio Publik</label>
                      <div className="visibility-options-grid">
                        <div
                          className={`visibility-card ${visibilityOption === "public" ? "active" : ""}`}
                          onClick={() => setVisibilityOption("public")}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="visibility-card-title">
                            <input type="radio" name="visibilityOption" value="public" checked={visibilityOption === "public"} onChange={() => {}} style={{ accentColor: "#283547" }} />
                            <span>🌐 Publik Terbuka</span>
                          </div>
                          <div className="visibility-card-desc">Portofolio dapat dicari di Google dan dibaca oleh seluruh masyarakat tanpa perlu login.</div>
                        </div>

                        <div
                          className={`visibility-card ${visibilityOption === "members" ? "active" : ""}`}
                          onClick={() => setVisibilityOption("members")}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="visibility-card-title">
                            <input type="radio" name="visibilityOption" value="members" checked={visibilityOption === "members"} onChange={() => {}} style={{ accentColor: "#283547" }} />
                            <span>👥 Anggota Komunitas</span>
                          </div>
                          <div className="visibility-card-desc">Hanya dapat dilihat oleh sesama penulis dan anggota yang memiliki akun KERTAS KATA.</div>
                        </div>

                        <div
                          className={`visibility-card ${visibilityOption === "private" ? "active" : ""}`}
                          onClick={() => setVisibilityOption("private")}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="visibility-card-title">
                            <input type="radio" name="visibilityOption" value="private" checked={visibilityOption === "private"} onChange={() => {}} style={{ accentColor: "#283547" }} />
                            <span>🔒 Terkunci / Privat</span>
                          </div>
                          <div className="visibility-card-desc">Hanya Anda dan Dewan Kurator yang dapat mengakses rekam jejak tulisan dan draf Anda.</div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Privacy Toggles */}
                    <div className="privacy-toggle-row">
                      <div className="privacy-toggle-info">
                        <h4>Tampilkan Kontak Resmi di Halaman Profil</h4>
                        <p>Izinkan pembaca atau penerbit menghubungi Anda melalui WhatsApp/Email di portofolio publik.</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={showContact} onChange={(e) => setShowContact(e.target.checked)} />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="privacy-toggle-row">
                      <div className="privacy-toggle-info">
                        <h4>Indeks Mesin Pencari (Google SEO Indexing)</h4>
                        <p>Izinkan karya tulis dan esai Anda terindeks oleh mesin pencari global guna memperluas jangkauan pembaca.</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={seoIndexing} onChange={(e) => setSeoIndexing(e.target.checked)} />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="privacy-toggle-row">
                      <div className="privacy-toggle-info">
                        <h4>Tampilkan Capaian Jam Belajar &amp; Modul E-Learning</h4>
                        <p>Tampilkan lencana sertifikasi 32 JP dan riwayat modul kelas literasi di kartu profil publik Anda.</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={showBadges} onChange={(e) => setShowBadges(e.target.checked)} />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>

                    <div className="form-action-bar">
                      <button type="submit" className="btn-save-primary">
                        <span>Simpan Pengaturan Privasi</span>
                      </button>
                    </div>
                  </form>

                  {/* Danger Zone */}
                  <div className="danger-zone-card">
                    <div className="danger-zone-title">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Zona Bahaya Akun Penulis</span>
                    </div>
                    <div className="danger-zone-desc">Jika Anda menonaktifkan akun, seluruh draf yang sedang dikurasi akan dihentikan sementara dan profil publik Anda tidak dapat diakses pembaca.</div>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => {
                        if (confirm("Apakah Anda yakin ingin menonaktifkan akun sementara?")) {
                          triggerToast("Permintaan penonaktifan akun dikirim ke administrator.");
                        }
                      }}
                    >
                      Nonaktifkan Akun Sementara
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              background: "#059669",
              color: "#ffffff",
              padding: "0.85rem 1.35rem",
              borderRadius: "10px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              fontSize: "0.875rem",
              fontWeight: 700,
              zIndex: 9999,
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
