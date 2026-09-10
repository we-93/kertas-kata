"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/admin.css";

export default function AdminDashboardPage() {
  const { user, ensureAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingQueue: 0,
    publishedArticles: 0,
    totalEbooks: 0,
    revisionQueue: 0,
    readyQueue: 0,
  });
  const [queue, setQueue] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  // Selected article for inline review modal
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [reviewTab, setReviewTab] = useState("ai"); // 'ai' or 'curator'
  const [curatorComment, setCuratorComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      await ensureAuth("admin");
      const [overviewRes, queueRes] = await Promise.all([
        api.admin.getOverview(),
        api.admin.getQueue("all"),
      ]);

      if (overviewRes && overviewRes.success && overviewRes.data) {
        setStats(overviewRes.data);
      }
      if (queueRes && queueRes.success && queueRes.data) {
        setQueue(queueRes.data);
      }
    } catch (err) {
      console.warn("Gagal memuat data admin:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [ensureAuth]);

  // Filter queue items
  const filteredQueue = useMemo(() => {
    if (activeFilter === "all") return queue;
    if (activeFilter === "pending") return queue.filter((q) => q.status === "pending" || q.status === "in_review");
    if (activeFilter === "revision") return queue.filter((q) => q.status === "revision");
    if (activeFilter === "ready") return queue.filter((q) => q.status === "ready" || q.status === "published");
    return queue;
  }, [queue, activeFilter]);

  // Open review modal
  const handleOpenReview = (item) => {
    setSelectedArticle(item);
    setAiSuggestions([]);
    setCommentsList(item.reviews || []);
    setCuratorComment("");
    setReviewTab("ai");
  };

  // Run AI Check
  const handleRunAiCheck = async () => {
    if (!selectedArticle) return;
    setIsAnalyzingAi(true);
    try {
      const res = await api.admin.runAICheck(selectedArticle.id);
      if (res && res.success && res.data) {
        setAiSuggestions(res.data.suggestions || []);
        alert(`✨ Analisis AI selesai! Ditemukan ${res.data.suggestions?.length || 0} saran perbaikan ejaan dan gaya bahasa.`);
      }
    } catch (err) {
      alert("Gagal menjalankan AI koreksi: " + err.message);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Decision (approve / revision / reject)
  const handleDecision = async (action) => {
    if (!selectedArticle) return;
    const actionLabel = action === "approve" ? "menyetujui penerbitan" : action === "revision" ? "meminta revisi" : "menolak";
    const comment = prompt(`Catatan editorial untuk ${actionLabel} naskah "${selectedArticle.title}":`, action === "approve" ? "Naskah memenuhi standar kurasi Kertas Kata. Disetujui terbit." : "");
    if (comment === null) return; // cancelled

    setActionLoading(true);
    try {
      const res = await api.admin.decide(selectedArticle.id, action, comment);
      if (res && res.success) {
        alert(`✅ Keputusan berhasil disimpan: Naskah ${action === "approve" ? "telah DITERBITKAN!" : action === "revision" ? "dikembalikan untuk REVISI." : "DITOLAK."}`);
        setSelectedArticle(null);
        await loadData();
      } else {
        alert(res?.message || "Gagal memproses keputusan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Admin */}
      <SidebarAdmin activePath="/admin" queueCount={stats.pendingQueue || 0} />

      {/* Main Wrapper */}
      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Welcome Banner */}
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Portal Kurasi &amp; Manajemen Literasi <span>Admin KERTAS KATA</span></h1>
                <p>
                  Kelola verifikasi naskah ilmiah &amp; sastra anggota, integrasi AI koreksi PUEBI/KBBI, penerbitan ISBN buku bunga rampai, dan pemantauan analitik membaca se-Kabupaten Tangerang.
                </p>
                <div className="admin-status-pill">
                  <span className="status-dot-pulse"></span>
                  <span>Sistem Operasional Normal &bull; Asisten AI Kurator Siap Digunakan</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <a
                  href="#antrean-review"
                  className="btn btn-primary"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(124, 58, 237, 0.4)",
                    padding: "0.75rem 1.25rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    textDecoration: "none",
                    color: "#fff",
                    borderRadius: "10px",
                    fontWeight: "700",
                  }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Mulai Kurasi ({stats.pendingQueue || 0} Antrean)</span>
                </a>
              </div>
            </div>
          </section>

          {/* 4 Stat Cards */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{stats.totalMembers || 0}</div>
                  <div className="admin-stat-label">Total Anggota Terdaftar</div>
                </div>
                <div className="admin-stat-icon-wrap blue">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: "700" }}>Aktif</span>
                <span style={{ color: "var(--text-muted)" }}>Komunitas Literasi Kab. Tangerang</span>
              </div>
            </div>

            <div className="admin-stat-card" style={{ borderLeft: "4px solid #f59e0b" }}>
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val" style={{ color: "#d97706" }}>{stats.pendingQueue || 0}</div>
                  <div className="admin-stat-label">Menunggu Review</div>
                </div>
                <div className="admin-stat-icon-wrap amber">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#d97706", fontWeight: "700" }}>{stats.pendingQueue || 0} Baru</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; {stats.revisionQueue || 0} Revisi</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{stats.publishedArticles || 0}</div>
                  <div className="admin-stat-label">Artikel Diterbitkan</div>
                </div>
                <div className="admin-stat-icon-wrap emerald">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: "700" }}>Portal Publikasi</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Terkurasi</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{stats.totalEbooks || 0}</div>
                  <div className="admin-stat-label">Koleksi E-Book &amp; Antologi</div>
                </div>
                <div className="admin-stat-icon-wrap purple">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#7c3aed", fontWeight: "700" }}>Perpustakaan Digital</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Kab. Tangerang</span>
              </div>
            </div>
          </section>

          {/* Quick Actions Grid */}
          <section className="quick-actions-section">
            <div className="section-title-wrap">
              <h2>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--primary-600)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Tindakan Cepat Kurator &amp; Admin
              </h2>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Akses cepat modul penerbitan dan kelulusan program</span>
            </div>

            <div className="quick-actions-grid">
              <Link href="/kelola-sertifikat" className="btn-quick-card" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="quick-card-icon" style={{ background: "#fef3c7", color: "#d97706" }}>🎓</div>
                <strong>Generate Sertifikat 32 JP</strong>
                <span>Terbitkan e-sertifikat bernomor resmi untuk anggota yang telah tuntas modul.</span>
              </Link>

              <Link href="/kelola-cetak" className="btn-quick-card" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="quick-card-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>📖</div>
                <strong>Inisiasi Proyek Antologi</strong>
                <span>Buka kurasi buku ber-ISBN baru dari karya-karya terbaik anggota.</span>
              </Link>

              <Link href="/kelola-perpustakaan" className="btn-quick-card" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="quick-card-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>📚</div>
                <strong>Unggah E-Book Komunitas</strong>
                <span>Tambahkan literatur pegangan dan referensi literasi komunitas ke perpustakaan.</span>
              </Link>

              <Link href="/kelola-komunitas" className="btn-quick-card" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="quick-card-icon" style={{ background: "#ecfdf5", color: "#059669" }}>🏆</div>
                <strong>Pembaruan Hall of Fame</strong>
                <span>Tampilkan penulis berdedikasi dan aktif bulan ini di beranda komunitas.</span>
              </Link>
            </div>
          </section>

          {/* Antrean Naskah Masuk */}
          <section className="review-queue-card" id="antrean-review">
            <div className="queue-header-bar">
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.25rem" }}>
                  Antrean Naskah Masuk untuk Kurasi
                </h2>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                  Klik tombol <strong>&quot;Mulai Review&quot;</strong> untuk membuka Editor Inline Review &amp; Asisten AI Koreksi PUEBI/KBBI.
                </p>
              </div>

              {/* Filter tabs */}
              <div className="queue-filter-tabs">
                <button
                  type="button"
                  className={`queue-tab-btn ${activeFilter === "all" ? "active" : ""}`}
                  onClick={() => setActiveFilter("all")}
                >
                  <span>Semua</span>
                  <span className="queue-tab-badge">{queue.length}</span>
                </button>
                <button
                  type="button"
                  className={`queue-tab-btn ${activeFilter === "pending" ? "active" : ""}`}
                  onClick={() => setActiveFilter("pending")}
                >
                  <span>Menunggu Review</span>
                  <span className="queue-tab-badge" style={{ background: "#fee2e2", color: "#b91c1c" }}>
                    {queue.filter((q) => q.status === "pending" || q.status === "in_review").length}
                  </span>
                </button>
                <button
                  type="button"
                  className={`queue-tab-btn ${activeFilter === "revision" ? "active" : ""}`}
                  onClick={() => setActiveFilter("revision")}
                >
                  <span>Revisi Anggota</span>
                  <span className="queue-tab-badge" style={{ background: "#fef3c7", color: "#b45309" }}>
                    {queue.filter((q) => q.status === "revision").length}
                  </span>
                </button>
                <button
                  type="button"
                  className={`queue-tab-btn ${activeFilter === "ready" ? "active" : ""}`}
                  onClick={() => setActiveFilter("ready")}
                >
                  <span>Siap Terbit</span>
                  <span className="queue-tab-badge" style={{ background: "#dcfce7", color: "#15803d" }}>
                    {queue.filter((q) => q.status === "ready" || q.status === "published").length}
                  </span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Penulis &amp; Asal Kecamatan</th>
                    <th>Judul Naskah &amp; Kategori</th>
                    <th>Tanggal Masuk</th>
                    <th>Skor Plagiarisme</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Aksi Kurasi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Memuat antrean naskah dari database...
                      </td>
                    </tr>
                  ) : filteredQueue.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Tidak ada naskah dalam filter ini.
                      </td>
                    </tr>
                  ) : (
                    filteredQueue.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="author-cell-info">
                            <div className="author-avatar-chip">{item.authorInitials || "P"}</div>
                            <div className="author-meta-text">
                              <span className="author-name-bold">{item.author || "Penulis Komunitas"}</span>
                              <span className="author-sub-region">{item.region || "Kabupaten Tangerang"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="article-title-cell">{item.title}</div>
                          <span style={{ display: "inline-block", marginTop: "0.25rem", fontSize: "0.6875rem", color: "var(--primary-700)", background: "var(--primary-50)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                            {item.category || "Umum"}
                          </span>
                        </td>
                        <td style={{ whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                          {item.date || new Date().toLocaleDateString("id-ID")}
                        </td>
                        <td>
                          <span className={`plagiarism-badge ${item.plagStatus === "safe" ? "safe" : "warning"}`}>
                            {item.plagStatus === "safe" ? "🛡️" : "⚠️"} {item.plagiarism || 0}% - {item.plagStatus === "safe" ? "Aman" : "Perlu Cek"}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${item.status === "revision" ? "revision" : item.status === "ready" || item.status === "published" ? "ready" : "pending"}`}>
                            {item.statusLabel || item.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="btn-action-review"
                            onClick={() => handleOpenReview(item)}
                          >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Mulai Review</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Activity Feed */}
          <section className="admin-activity-card">
            <div className="section-title-wrap">
              <h2>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--primary-600)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Log Aktivitas &amp; Audit Kurasi Terkini
              </h2>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Riwayat keputusan editorial dan integrasi otomatis AI</span>
            </div>

            <div className="activity-list">
              <div className="activity-item" style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1rem", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#ede9fe", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                  AI
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--text-main)" }}>
                    Sistem Copilot AI memverifikasi kelayakan struktur kalimat dan kepatuhan PUEBI untuk naskah masuk.
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Otomatis &bull; Sistem Berjalan</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* INLINE REVIEW & AI ASSISTANT MODAL (WIREFRAME 6) */}
      {selectedArticle && (
        <div className="inline-review-modal-overlay active" onClick={() => setSelectedArticle(null)}>
          <div className="inline-review-card" onClick={(e) => e.stopPropagation()}>
            {/* Top Action Bar */}
            <div className="review-top-bar">
              <div className="review-article-badge">
                <button
                  type="button"
                  className="btn-close-modal"
                  onClick={() => setSelectedArticle(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", color: "var(--text-muted)" }}
                >
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, background: "#eff6ff", color: "#1d4ed8", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>
                      {selectedArticle.category || "Umum"}
                    </span>
                    <span className={`plagiarism-badge ${selectedArticle.plagStatus === "safe" ? "safe" : "warning"}`}>
                      🛡️ {selectedArticle.plagiarism || 0}% - Aman
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    Oleh: <strong>{selectedArticle.author}</strong> ({selectedArticle.region})
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="review-actions-group">
                <button
                  type="button"
                  className="btn-ai-koreksi"
                  onClick={handleRunAiCheck}
                  disabled={isAnalyzingAi}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{isAnalyzingAi ? "Menganalisis Naskah..." : "✨ Jalankan AI Koreksi"}</span>
                </button>

                <button
                  type="button"
                  className="btn-review-action approve"
                  onClick={() => handleDecision("approve")}
                  disabled={actionLoading}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Setujui Terbit</span>
                </button>

                <button
                  type="button"
                  className="btn-review-action revision"
                  onClick={() => handleDecision("revision")}
                  disabled={actionLoading}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Minta Revisi</span>
                </button>

                <button
                  type="button"
                  className="btn-review-action reject"
                  onClick={() => handleDecision("reject")}
                  disabled={actionLoading}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Tolak</span>
                </button>
              </div>
            </div>

            {/* Split Review Body (60% Left / 40% Right) */}
            <div className="review-split-body">
              {/* Left Pane: Article Reader */}
              <div className="review-article-pane">
                <div className="article-review-header">
                  <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: "800", color: "#0f172a" }}>
                    {selectedArticle.title}
                  </h1>
                  <div className="article-review-meta">
                    <span><strong>Kategori:</strong> {selectedArticle.category}</span>
                    <span>&bull;</span>
                    <span><strong>Jumlah Kata:</strong> {selectedArticle.wordCount || 0} kata</span>
                    <span>&bull;</span>
                    <span><strong>Diajukan:</strong> {selectedArticle.date}</span>
                  </div>
                </div>

                <div
                  className="article-review-text"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content || "<p>Naskah tidak memiliki teks.</p>" }}
                  style={{ padding: "1.5rem 0", lineHeight: 1.8, fontSize: "1rem", color: "#334155" }}
                />
              </div>

              {/* Right Pane: AI Assistant & Curator Notes */}
              <div className="review-side-pane">
                <div className="side-pane-tabs">
                  <button
                    type="button"
                    className={`side-pane-tab-btn ${reviewTab === "ai" ? "active" : ""}`}
                    onClick={() => setReviewTab("ai")}
                  >
                    ✨ Asisten AI ({aiSuggestions.length})
                  </button>
                  <button
                    type="button"
                    className={`side-pane-tab-btn ${reviewTab === "curator" ? "active" : ""}`}
                    onClick={() => setReviewTab("curator")}
                  >
                    💬 Catatan Editorial ({commentsList.length})
                  </button>
                </div>

                {reviewTab === "ai" && (
                  <div className="side-pane-content" style={{ padding: "1rem" }}>
                    {isAnalyzingAi && (
                      <div style={{ background: "#faf5ff", border: "1px dashed #c084fc", borderRadius: "10px", padding: "1rem", textAlign: "center", marginBottom: "1rem" }}>
                        <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#7c3aed" }}>Sedang Menganalisis Naskah...</div>
                        <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.2rem" }}>Memeriksa kepatuhan KBBI V, PUEBI, dan koherensi semantik</div>
                      </div>
                    )}

                    {aiSuggestions.length === 0 && !isAnalyzingAi ? (
                      <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✨</div>
                        <p style={{ fontSize: "0.8125rem", margin: 0 }}>
                          Klik tombol <strong>&quot;Jalankan AI Koreksi&quot;</strong> di atas untuk memindai kepatuhan PUEBI &amp; KBBI pada naskah ini.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {aiSuggestions.map((sug, idx) => (
                          <div key={idx} style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: "8px", padding: "0.75rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "700", color: "#7c3aed", marginBottom: "0.25rem" }}>
                              <span>{sug.type || "PUEBI & Ejaan"}</span>
                              <span>Baris ~{sug.line || idx + 1}</span>
                            </div>
                            <div style={{ fontSize: "0.8125rem", color: "#334155" }}>
                              <span style={{ textDecoration: "line-through", color: "#dc2626" }}>{sug.original}</span>
                              {" ➔ "}
                              <strong style={{ color: "#059669" }}>{sug.replacement}</strong>
                            </div>
                            {sug.reason && (
                              <div style={{ fontSize: "0.6875rem", color: "#6b7280", marginTop: "0.25rem" }}>
                                {sug.reason}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {reviewTab === "curator" && (
                  <div className="side-pane-content" style={{ padding: "1rem" }}>
                    {commentsList.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💬</div>
                        <p style={{ fontSize: "0.8125rem", margin: 0 }}>Belum ada catatan kurator editorial untuk naskah ini.</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {commentsList.map((c, i) => (
                          <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.75rem" }}>
                            <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--primary-700)" }}>
                              {c.reviewer?.name || "Kurator Editorial"}
                            </div>
                            <div style={{ fontSize: "0.8125rem", color: "#334155", marginTop: "0.25rem" }}>
                              {c.comment}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
