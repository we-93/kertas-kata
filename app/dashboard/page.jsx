"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import SidebarParticipant from "@/components/SidebarParticipant";
import TopHeader from "@/components/TopHeader";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import "@/css/dashboard.css";

export default function DashboardPage() {
  const { user, ensureAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [articlesData, setArticlesData] = useState([]);
  const [counts, setCounts] = useState({ published: 0, in_review: 0, draft: 0 });
  const [activeTab, setActiveTab] = useState("published");
  const [chartPeriod, setChartPeriod] = useState("7");

  // Dynamic greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return "Selamat Pagi";
    if (hour >= 11 && hour < 15) return "Selamat Siang";
    if (hour >= 15 && hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        await ensureAuth("participant");
        const res = await api.articles.getMy();
        if (res && res.success && res.data) {
          const { articles, counts: apiCounts } = res.data;
          setArticlesData(articles || []);
          if (apiCounts) {
            setCounts(apiCounts);
          }
        }
      } catch (err) {
        console.warn("Gagal memuat artikel dashboard:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [ensureAuth]);

  // Filtered articles based on active tab
  const filteredArticles = useMemo(() => {
    return articlesData.filter((a) => a.status === activeTab);
  }, [articlesData, activeTab]);

  const totalViews = useMemo(() => {
    return articlesData.reduce((acc, it) => acc + (it.viewCount || 0), 0);
  }, [articlesData]);

  // Print eligibility: 10 published articles needed
  const printProgress = Math.min(100, Math.round(((counts.published || 0) / 10) * 100));
  const printRemaining = Math.max(0, 10 - (counts.published || 0));

  return (
    <AuthGuard requiredRole="participant">
      <div className="app-container">
        {/* Left Sidebar */}
        <SidebarParticipant activePath="/dashboard" />

        {/* Main Content Area */}
        <div className="main-wrapper">
          <TopHeader />

          <main className="content-body">
          {/* Welcome Banner */}
          <section className="welcome-banner">
            <div className="banner-overlay-shape"></div>
            <div className="welcome-content">
              <div className="welcome-texts">
                <h1>
                  <span>{greeting}, </span>
                  <span>{user?.name || "Penulis Komunitas"}</span>! ✨
                </h1>
                <p>
                  Mari wujudkan gagasan bernas untuk memajukan literasi masyarakat Kabupaten Tangerang. Tuangkan ide Anda, dan terbitkan karya terbaik bersama komunitas.
                </p>
              </div>
              <div className="welcome-actions">
                <Link href="/menulis" className="btn-primary" id="btnQuickWrite">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Tulis Naskah Baru</span>
                </Link>
                <Link href="/elearning" className="btn-secondary" id="btnQuickLearn">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Mulai Belajar</span>
                </Link>
              </div>
            </div>
          </section>

          {/* 4 Stat Cards */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Tulisan Diterbitkan</span>
                <div className="stat-icon green">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="stat-value">{counts.published || 0}</div>
              <div className="stat-sub">
                <span className="trend-badge positive">✓ Lolos Kurasi Resmi</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Sedang Dikurasi</span>
                <div className="stat-icon orange">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="stat-value">{counts.in_review || 0}</div>
              <div className="stat-sub">
                <span>Dalam antrean tim reviewer</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Total Pembaca</span>
                <div className="stat-icon blue">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div className="stat-value">{totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + "K" : totalViews}</div>
              <div className="stat-sub">
                <span>Akumulasi pembaca karya</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Draf Belum Dikirim</span>
                <div className="stat-icon purple">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              </div>
              <div className="stat-value">{counts.draft || 0}</div>
              <div className="stat-sub">
                <span>Siap disempurnakan & dikirim</span>
              </div>
            </div>
          </section>

          {/* Status Tulisan with Tabs */}
          <section className="section-box">
            <div className="section-box-header">
              <div className="section-heading-group">
                <h2 className="section-title">Status Tulisan</h2>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>(Karya Penulis)</span>
              </div>

              <div className="tab-nav">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "draft" ? "active" : ""}`}
                  onClick={() => setActiveTab("draft")}
                >
                  <span>Draft</span>
                  <span className="tab-pill">{counts.draft || 0}</span>
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "in_review" ? "active" : ""}`}
                  onClick={() => setActiveTab("in_review")}
                >
                  <span>In Review</span>
                  <span className="tab-pill">{counts.in_review || 0}</span>
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "published" ? "active" : ""}`}
                  onClick={() => setActiveTab("published")}
                >
                  <span>Published</span>
                  <span className="tab-pill">{counts.published || 0}</span>
                </button>
              </div>
            </div>

            <div className="article-list">
              {loading ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                  Memuat naskah tulisan...
                </div>
              ) : filteredArticles.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3.5rem 1.5rem", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📝</div>
                  <h4 style={{ fontWeight: "700", color: "var(--text-main)", marginBottom: "0.25rem" }}>
                    Belum ada naskah dengan status {activeTab === "published" ? "Terbit" : activeTab === "in_review" ? "In Review" : "Draf"}
                  </h4>
                  <p style={{ fontSize: "0.875rem", maxWidth: "420px", margin: "0 auto 1.25rem" }}>
                    Mulai tulis karya terbaik Anda sekarang dan terbitkan ke etalase literasi Kertas Kata Kabupaten Tangerang.
                  </p>
                  <Link href="/menulis" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>
                    Tulis Naskah Sekarang
                  </Link>
                </div>
              ) : (
                filteredArticles.map((art) => (
                  <div key={art.id} className="article-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem", borderBottom: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(37, 99, 235, 0.08)", color: "var(--primary-600)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                        {art.category ? art.category.substring(0, 2).toUpperCase() : "KK"}
                      </div>
                      <div>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.25rem" }}>
                          <span className="nav-badge" style={{ textTransform: "capitalize", fontSize: "0.6875rem" }}>
                            {art.category || "Umum"}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            • {new Date(art.updatedAt || art.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
                          {art.title}
                        </h4>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                          {art.wordCount || 0} kata • {art.viewCount || 0} pembaca • Status:{" "}
                          <strong style={{ color: art.status === "published" ? "var(--success-600)" : art.status === "in_review" ? "var(--accent-600)" : "var(--purple-600)" }}>
                            {art.status === "published" ? "Terbit" : art.status === "in_review" ? "Sedang Dikurasi" : "Draf"}
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {art.status === "published" ? (
                        <Link href={`/baca-artikel/${art.slug || art.id}`} className="btn-secondary" style={{ padding: "0.45rem 0.85rem", fontSize: "0.8125rem", textDecoration: "none" }}>
                          Baca Karya
                        </Link>
                      ) : (
                        <Link href={`/menulis?id=${art.id}`} className="btn-primary" style={{ padding: "0.45rem 0.85rem", fontSize: "0.8125rem", textDecoration: "none" }}>
                          Edit Naskah
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Author Analytics Chart */}
          <section className="section-box">
            <div className="section-box-header">
              <div className="section-heading-group">
                <h2 className="section-title">Author Analytics</h2>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tren Pembaca & Keterlibatan</span>
              </div>
              <div className="chart-controls">
                <select value={chartPeriod} onChange={(e) => setChartPeriod(e.target.value)} aria-label="Pilih Periode Waktu">
                  <option value="7">7 Hari Terakhir</option>
                  <option value="30">30 Hari Terakhir</option>
                </select>
              </div>
            </div>

            <div className="analytics-chart-container">
              <div className="chart-header">
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color blue"></div>
                    <span>Views Artikel</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color orange"></div>
                    <span>Apresiasi & Komentar</span>
                  </div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
                  Total Terakumulasi: <strong>{totalViews} Views</strong>
                </div>
              </div>

              <div className="svg-chart-wrapper" style={{ padding: "1.5rem 0 0.5rem" }}>
                <svg viewBox="0 0 700 200" width="100%" height="200" style={{ overflow: "visible" }}>
                  <defs>
                    <linearGradient id="chartGradBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="40" y1="30" x2="680" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="80" x2="680" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="130" x2="680" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="180" x2="680" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Area fill */}
                  <polygon
                    points="50,170 140,150 230,110 320,135 410,70 500,95 590,50 670,40 670,180 50,180"
                    fill="url(#chartGradBlue)"
                  />

                  {/* View Line */}
                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="50,170 140,150 230,110 320,135 410,70 500,95 590,50 670,40"
                  />

                  {/* Appreciation Line */}
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="50,180 140,175 230,160 320,168 410,140 500,150 590,120 670,115"
                  />

                  {/* Dots */}
                  <circle cx="590" cy="50" r="5" fill="#2563eb" stroke="#fff" strokeWidth="2" />
                  <circle cx="670" cy="40" r="5" fill="#2563eb" stroke="#fff" strokeWidth="2" />

                  {/* X Axis Labels */}
                  <text x="50" y="196" fill="#94a3b8" fontSize="11" textAnchor="middle">Sen</text>
                  <text x="140" y="196" fill="#94a3b8" fontSize="11" textAnchor="middle">Sel</text>
                  <text x="230" y="196" fill="#94a3b8" fontSize="11" textAnchor="middle">Rab</text>
                  <text x="320" y="196" fill="#94a3b8" fontSize="11" textAnchor="middle">Kam</text>
                  <text x="410" y="196" fill="#94a3b8" fontSize="11" textAnchor="middle">Jum</text>
                  <text x="500" y="196" fill="#94a3b8" fontSize="11" textAnchor="middle">Sab</text>
                  <text x="590" y="196" fill="#2563eb" fontWeight="700" fontSize="11" textAnchor="middle">Min</text>
                  <text x="670" y="196" fill="#2563eb" fontWeight="700" fontSize="11" textAnchor="middle">Hari Ini</text>
                </svg>
              </div>
            </div>
          </section>

          {/* Notifikasi Terbaru */}
          <section className="section-box">
            <div className="section-box-header">
              <div className="section-heading-group">
                <h2 className="section-title">Notifikasi & Umpan Balik Redaksi</h2>
              </div>
            </div>

            <div className="notifications-feed">
              <div className="notification-item">
                <div className="notif-icon-box review">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="notif-content">
                  <div className="notif-message">
                    <strong>Tim Redaksi Kertas Kata:</strong> Selamat datang di ruang karya KERTAS KATA. Setiap naskah yang dikirim akan diverifikasi oleh tim kurator dan asisten AI redaksi.
                  </div>
                  <div className="notif-time">Baru Saja • Sistem Literasi Tangerang</div>
                </div>
              </div>

              {counts.published > 0 && (
                <div className="notification-item">
                  <div className="notif-icon-box published">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="notif-content">
                    <div className="notif-message">
                      <strong>Editorial Kertas Kata:</strong> Naskah Anda telah disetujui kurator dan diterbitkan di etalase publik.
                    </div>
                    <div className="notif-time">Terverifikasi • Lolos Kurasi</div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* Right Sidebar */}
      <aside className="sidebar-right">
        <div className="profile-card-widget">
          <div className="profile-avatar-large">
            <div className="avatar-inner">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "RD"}
            </div>
            <div className="avatar-badge-online" title="Online Aktif"></div>
          </div>
          <h3 className="profile-name">{user?.name || "Raden"}</h3>
          <div className="profile-region">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{user?.originRegion || "Kabupaten Tangerang"}</span>
          </div>
          <div className="profile-specialization">Peran: {user?.role === "admin" ? "Administrator" : "Penulis Komunitas"}</div>
          <p className="profile-bio">
            "Menulis untuk merawat ingatan sejarah, gagasan, dan kearifan masyarakat Kabupaten Tangerang."
          </p>
        </div>

        {/* Gamifikasi Badges */}
        <div className="widget-section">
          <div className="widget-section-header">
            <span className="widget-title">Lencana Prestasi</span>
            <span className="widget-link">3 Lencana</span>
          </div>
          <div className="badge-row-display">
            <div className="badge-item" title="Penulis Pemula - Bergabung di Kertas Kata">
              <div className="badge-icon-circle gold">🎖️</div>
              <span className="badge-name">Penulis Aktif</span>
            </div>
            <div className="badge-item" title="Pegiat Diskusi - Berpartisipasi di komunitas">
              <div className="badge-icon-circle blue">💬</div>
              <span className="badge-name">Komunitas</span>
            </div>
            <div className="badge-item" title="Pelajar Tekun - Mengikuti modul pembelajaran">
              <div className="badge-icon-circle green">🎓</div>
              <span className="badge-name">E-Learning</span>
            </div>
          </div>
        </div>

        {/* Syarat Cetak Mandiri */}
        <div className="print-eligibility-card">
          <div className="eligibility-header">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="eligibility-title">Syarat Cetak Mandiri</span>
          </div>
          <p className="eligibility-desc">
            Anggota berhak mengajukan <strong>Cetak Naskah Mandiri Ber-ISBN</strong> setelah memiliki minimal <strong>10 tulisan terbit</strong>.
          </p>
          <div className="eligibility-progress-info">
            <span>Progress Tulisan Terbit</span>
            <span>{counts.published || 0} / 10 Karya ({printProgress}%)</span>
          </div>
          <div className="eligibility-bar-wrap">
            <div className="eligibility-bar-fill" style={{ width: `${printProgress}%` }}></div>
          </div>
          <div style={{ fontSize: "0.6875rem", color: "#92400e", fontWeight: "500" }}>
            {printRemaining > 0
              ? `💡 Butuh ${printRemaining} tulisan terbit lagi untuk membuka fasilitas cetak ber-ISBN.`
              : "🎉 Selamat! Syarat kuota tulisan terbit Anda telah terpenuhi untuk cetak mandiri."}
          </div>
        </div>

        {/* E-Sertifikat 32 JP */}
        <div className="cert-progress-card">
          <div className="cert-header">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="cert-title">E-Sertifikat 32 JP</span>
          </div>
          <p className="cert-desc">
            Selesaikan modul E-Learning dan terbitkan minimal 3 tulisan untuk klaim sertifikat resmi ber-QR Code Dispusipda Tangerang.
          </p>
          <div className="stat-progress-bar" style={{ background: "rgba(37, 99, 235, 0.15)" }}>
            <div className="stat-progress-fill" style={{ width: `${Math.min(100, Math.round(((counts.published || 0) / 3) * 100))}%` }}></div>
          </div>
          <div style={{ fontSize: "0.6875rem", color: "var(--primary-800)", fontWeight: "600" }}>
            Status: {counts.published >= 3 ? "Syarat Tulisan Terpenuhi (3/3) ✅" : `${counts.published}/3 Tulisan Terbit`}
          </div>
        </div>

        {/* Mode Switcher to Admin if authorized */}
        <div style={{ padding: "0.5rem 0" }}>
          <Link
            href="/admin"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              background: "rgba(124, 58, 237, 0.08)",
              color: "#7c3aed",
              fontSize: "0.8125rem",
              fontWeight: "700",
              textDecoration: "none",
              border: "1px solid rgba(124, 58, 237, 0.2)",
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Beralih ke Portal Admin</span>
          </Link>
        </div>
      </aside>
    </div>
    </AuthGuard>
  );
}
