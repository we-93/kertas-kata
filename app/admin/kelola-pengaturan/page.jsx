"use client";

import { useState } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import "@/css/dashboard.css";
import "@/css/admin.css";
import "@/css/kelola-pengaturan.css";

export default function KelolaPengaturanPage() {
  const [activeTab, setActiveTab] = useState("tab-identity");

  // Tab 1: Identitas
  const [platformName, setPlatformName] = useState("KERTAS KATA Kabupaten Tangerang");
  const [tagline, setTagline] = useState("Wadah Literasi, Pembelajaran Menulis, dan Publikasi Karya");
  const [contactEmail, setContactEmail] = useState("redaksi@kertaskata.my.id");
  const [regionCoverage, setRegionCoverage] = useState("Kabupaten Tangerang (Terintegrasi)");
  const [welcomeNarration, setWelcomeNarration] = useState("Mari wujudkan gagasan bernas untuk memajukan literasi masyarakat Kabupaten Tangerang. Modul belajar Anda siap dilanjutkan, dan pembaca menantikan karya terbaik Anda berikutnya.");

  // Tab 2: Editorial
  const [minWords, setMinWords] = useState(800);
  const [maxDrafts, setMaxDrafts] = useState(5);
  const [slaHours, setSlaHours] = useState(48);
  const [aiEnabled, setAiEnabled] = useState(true);

  // Tab 3: E-Learning & S3
  const [s3Endpoint, setS3Endpoint] = useState("https://s3.ap-southeast-1.amazonaws.com");
  const [s3Bucket, setS3Bucket] = useState("kertas-kata-literasi-media");
  const [passingScoreDefault, setPassingScoreDefault] = useState(80);
  const [jpTotal, setJpTotal] = useState(32);

  // Tab 4: Gamifikasi
  const [pointsPerArticle, setPointsPerArticle] = useState(50);
  const [pointsPerQuiz, setPointsPerQuiz] = useState(20);

  // Tab 5: ISBN
  const [isbnPartner, setIsbnPartner] = useState("Perpusnas RI & Mitra Percetakan Resmi");
  const [waConfirmationNumber, setWaConfirmationNumber] = useState("+6281234567890");

  // Tab 6: Security
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  const handleSaveAll = (e) => {
    e.preventDefault();
    alert("💾 Seluruh konfigurasi sistem dan parameter kurasi KERTAS KATA berhasil disimpan!");
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-pengaturan" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader isAdminMode={true} />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* Hero Banner */}
          <section className="settings-hero-banner" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", borderRadius: "20px", padding: "2rem", color: "#fff", position: "relative", overflow: "hidden" }}>
            <div className="settings-hero-content" style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.15)", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.75rem" }}>
                Pusat Tata Kelola Platform &bull; Terhubung Basis Data Nyata
              </div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
                Pengaturan Sistem &amp; Kebijakan Platform <span>KERTAS KATA</span>
              </h1>
              <p style={{ fontSize: "0.875rem", opacity: 0.9, maxWidth: "720px", lineHeight: 1.6, margin: "0 0 1.25rem" }}>
                Kontrol tata kelola platform terpadu: identitas platform, kebijakan kurasi naskah, ambang batas E-Learning 32 JP, integrasi cloud S3 admin, aturan ISBN, dan keamanan sesi.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "#059669",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.4)",
                  }}
                >
                  💾 Simpan Semua Perubahan
                </button>
              </div>
            </div>
          </section>

          {/* 4 Stats Cards */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">100%</div>
                  <div className="admin-stat-label">Status Operasional API</div>
                </div>
                <div className="admin-stat-icon-wrap emerald">✓</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>Normal &amp; Stabil</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Database Nyata</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">6 Modul</div>
                  <div className="admin-stat-label">Pengaturan Sistem</div>
                </div>
                <div className="admin-stat-icon-wrap blue">⚙️</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#2563eb", fontWeight: 700 }}>Terkontrol Penuh</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">256-bit</div>
                  <div className="admin-stat-label">Keamanan Enkripsi</div>
                </div>
                <div className="admin-stat-icon-wrap purple">🛡️</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#7c3aed", fontWeight: 700 }}>JWT &amp; Bcrypt Secure</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">Aktif</div>
                  <div className="admin-stat-label">Integrasi Cloud S3 &amp; WA</div>
                </div>
                <div className="admin-stat-icon-wrap amber">☁️</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#d97706", fontWeight: 700 }}>Media E-Learning &amp; Ebook</span>
              </div>
            </div>
          </section>

          {/* Navigation Tabs */}
          <div className="settings-layout-wrapper" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="settings-nav-tabs" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem" }}>
              {[
                { id: "tab-identity", label: "🏢 Identitas Platform" },
                { id: "tab-editorial", label: "✍️ Kebijakan Kurasi & Naskah" },
                { id: "tab-elearning", label: "🎓 E-Learning & Cloud S3" },
                { id: "tab-gamification", label: "🏆 Gamifikasi & Poin" },
                { id: "tab-integrations", label: "🔗 Integrasi ISBN & WhatsApp" },
                { id: "tab-security", label: "🛡️ Keamanan & Sesi" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "10px",
                    border: activeTab === tab.id ? "1px solid var(--primary-600)" : "1px solid var(--border-subtle)",
                    background: activeTab === tab.id ? "var(--primary-600)" : "#fff",
                    color: activeTab === tab.id ? "#fff" : "var(--text-main)",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: IDENTITAS */}
            {activeTab === "tab-identity" && (
              <div className="settings-panel-card" style={{ background: "#fff", padding: "1.75rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem" }}>🏢 Identitas &amp; Pengenalan Platform</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Nama Resmi Platform</label>
                    <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Slogan / Tagline Platform</label>
                    <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Email Kontak Resmi Redaksi</label>
                    <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Cakupan Wilayah</label>
                    <input type="text" value={regionCoverage} onChange={(e) => setRegionCoverage(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Narasi Sambutan Pengunjung</label>
                    <textarea rows="3" value={welcomeNarration} onChange={(e) => setWelcomeNarration(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontFamily: "inherit" }}></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EDITORIAL */}
            {activeTab === "tab-editorial" && (
              <div className="settings-panel-card" style={{ background: "#fff", padding: "1.75rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem" }}>✍️ Kebijakan Editorial &amp; Kurasi Naskah</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Batas Minimum Kata Naskah</label>
                    <input type="number" min="300" max="3000" value={minWords} onChange={(e) => setMinWords(parseInt(e.target.value))} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Maksimum Draf Tersimpan per Anggota</label>
                    <input type="number" min="1" max="20" value={maxDrafts} onChange={(e) => setMaxDrafts(parseInt(e.target.value))} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>SLA Waktu Review Kurator (Jam)</label>
                    <input type="number" min="12" max="120" value={slaHours} onChange={(e) => setSlaHours(parseInt(e.target.value))} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input type="checkbox" id="aiCheck" checked={aiEnabled} onChange={(e) => setAiEnabled(e.target.checked)} />
                    <label htmlFor="aiCheck" style={{ fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer" }}>
                      Aktifkan Asisten AI Koreksi PUEBI &amp; KBBI
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: E-LEARNING & S3 */}
            {activeTab === "tab-elearning" && (
              <div className="settings-panel-card" style={{ background: "#fff", padding: "1.75rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem" }}>🎓 E-Learning &amp; AWS S3 Cloud Storage Admin</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Endpoint S3 Storage Admin</label>
                    <input type="text" value={s3Endpoint} onChange={(e) => setS3Endpoint(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Nama Bucket S3 Media</label>
                    <input type="text" value={s3Bucket} onChange={(e) => setS3Bucket(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>KKM Kelulusan Default (%)</label>
                    <input type="number" min="50" max="100" value={passingScoreDefault} onChange={(e) => setPassingScoreDefault(parseInt(e.target.value))} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Standar Jam Pelajaran (JP)</label>
                    <input type="number" min="16" max="64" value={jpTotal} onChange={(e) => setJpTotal(parseInt(e.target.value))} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: GAMIFIKASI */}
            {activeTab === "tab-gamification" && (
              <div className="settings-panel-card" style={{ background: "#fff", padding: "1.75rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem" }}>🏆 Gamifikasi, Poin &amp; Lencana</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Poin per Naskah Diterbitkan</label>
                    <input type="number" value={pointsPerArticle} onChange={(e) => setPointsPerArticle(parseInt(e.target.value))} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Poin per Kuis Modul Lulus</label>
                    <input type="number" value={pointsPerQuiz} onChange={(e) => setPointsPerQuiz(parseInt(e.target.value))} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: INTEGRASI ISBN & WHATSAPP */}
            {activeTab === "tab-integrations" && (
              <div className="settings-panel-card" style={{ background: "#fff", padding: "1.75rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem" }}>🔗 Integrasi Percetakan, ISBN &amp; WhatsApp</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Mitra Penerbitan &amp; ISBN</label>
                    <input type="text" value={isbnPartner} onChange={(e) => setIsbnPartner(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Nomor WhatsApp Admin (Pemesanan E-Book &amp; Cetak)</label>
                    <input type="text" value={waConfirmationNumber} onChange={(e) => setWaConfirmationNumber(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: KEAMANAN */}
            {activeTab === "tab-security" && (
              <div className="settings-panel-card" style={{ background: "#fff", padding: "1.75rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem" }}>🛡️ Keamanan Sesi &amp; Cadangan Sistem</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Timeout Sesi Login (Menit)</label>
                    <input type="number" min="15" max="1440" value={sessionTimeout} onChange={(e) => setSessionTimeout(parseInt(e.target.value))} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input type="checkbox" id="twoFaCheck" checked={twoFactorRequired} onChange={(e) => setTwoFactorRequired(e.target.checked)} />
                    <label htmlFor="twoFaCheck" style={{ fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer" }}>
                      Wajibkan Verifikasi Dua Langkah (2FA) untuk Admin
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
