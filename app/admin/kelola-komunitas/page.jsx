"use client";

import { useEffect, useState, useMemo } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/admin.css";
import "@/css/kelola-komunitas.css";

export default function KelolaKomunitasPage() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Klinik Menulis");
  const [newContent, setNewContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const res = await api.community.getThreads({
        category: categoryFilter !== "all" ? categoryFilter : undefined,
      });
      if (res && res.success && res.data) {
        setThreads(res.data);
      } else {
        setThreads([]);
      }
    } catch (err) {
      console.error("Gagal mengambil topik forum:", err);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [categoryFilter]);

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      const q = search.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchAuthor = t.author?.name?.toLowerCase().includes(q) || t.authorName?.toLowerCase().includes(q);
      return matchTitle || matchAuthor;
    });
  }, [threads, search]);

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.community.createThread({
        title: newTitle,
        category: newCategory,
        content: newContent,
        isPinned,
      });
      if (res.success) {
        alert("🎉 Topik diskusi / pengumuman resmi berhasil diterbitkan!");
        setShowAddModal(false);
        setNewTitle("");
        setNewContent("");
        setIsPinned(false);
        fetchThreads();
      } else {
        alert("Gagal membuat topik: " + (res.message || ""));
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePin = (id) => {
    setThreads(
      threads.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const handleDelete = (id, title) => {
    if (confirm(`Hapus topik forum "${title}"?`)) {
      setThreads(threads.filter((t) => t.id !== id));
      alert("Topik berhasil dihapus dari forum.");
    }
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-komunitas" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader isAdminMode={true} />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* Hero Banner */}
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Manajemen Forum Diskusi &amp; Komunitas <span>KERTAS KATA</span></h1>
                <p>Moderasi diskusi kepenulisan, sematkan topik panduan kurator, pantau keterlibatan anggota se-Kabupaten Tangerang, serta bina ekosistem literasi yang aktif dan sehat.</p>
                <div className="admin-status-pill">
                  <span className="status-dot-pulse"></span>
                  <span>Moderasi Forum Aktif &bull; Database Komunitas Terhubung</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                  style={{
                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    color: "#fff",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(37, 99, 235, 0.35)",
                    padding: "0.75rem 1.25rem",
                    borderRadius: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  + Buat Topik / Pengumuman Baru
                </button>
              </div>
            </div>
          </section>

          {/* 4 Stats Cards */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{threads.length}</div>
                  <div className="admin-stat-label">Total Diskusi Aktif</div>
                </div>
                <div className="admin-stat-icon-wrap blue">💬</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#2563eb", fontWeight: 700 }}>Database Nyata</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Forum Komunitas</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">
                    {threads.reduce((acc, t) => acc + (t.repliesCount || t.commentsCount || 0), 0)}
                  </div>
                  <div className="admin-stat-label">Total Balasan &amp; Komentar</div>
                </div>
                <div className="admin-stat-icon-wrap emerald">📝</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>Interaksi Anggota</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val" style={{ color: "#7c3aed" }}>
                    {threads.filter((t) => t.isPinned).length}
                  </div>
                  <div className="admin-stat-label">Topik Disematkan (📌 Pinned)</div>
                </div>
                <div className="admin-stat-icon-wrap purple">📌</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#7c3aed", fontWeight: 700 }}>Pengumuman Kurator</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val" style={{ color: "#d97706" }}>
                    {threads.reduce((acc, t) => acc + (t.likesCount || 0), 0)}
                  </div>
                  <div className="admin-stat-label">Total Apresiasi Suka</div>
                </div>
                <div className="admin-stat-icon-wrap amber">❤️</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#d97706", fontWeight: 700 }}>Dukungan Komunitas</span>
              </div>
            </div>
          </section>

          {/* Filter Bar */}
          <section className="forum-filter-bar" style={{ background: "#fff", padding: "1.25rem", borderRadius: "14px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              <input
                type="text"
                placeholder="Cari judul diskusi atau nama pembuat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: "260px", flex: 1, padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem" }}
              />
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {["all", "Klinik Menulis", "Bedah Karya", "Inspirasi Komunitas", "Seputar Publikasi"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      padding: "0.5rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      background: categoryFilter === cat ? "var(--primary-600)" : "#fff",
                      color: categoryFilter === cat ? "#fff" : "var(--text-main)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {cat === "all" ? "Semua Topik" : cat}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Table */}
          <section className="forum-table-section" style={{ background: "#fff", borderRadius: "16px", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
            <div className="queue-header-bar" style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                  Daftar Topik Forum Komunitas
                </h2>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                  Moderasi, sematkan pengumuman (pin), atau kelola konten forum diskusi anggota.
                </p>
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 600 }}>
                Total: <strong style={{ color: "var(--primary-700)" }}>{filteredThreads.length}</strong> Topik
              </div>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Judul Topik Diskusi</th>
                    <th>Pembuat &amp; Asal Organisasi / Daerah</th>
                    <th>Kategori</th>
                    <th>Interaksi Balasan</th>
                    <th>Status Sematan</th>
                    <th style={{ textAlign: "right" }}>Moderasi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Memuat topik forum dari database...
                      </td>
                    </tr>
                  ) : filteredThreads.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Belum ada diskusi di forum. Klik "+ Buat Topik / Pengumuman Baru" untuk memulai.
                      </td>
                    </tr>
                  ) : (
                    filteredThreads.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                            {t.isPinned && <span style={{ marginRight: "0.35rem" }}>📌</span>}
                            {t.title}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{t.author?.name || t.authorName || "Anggota Komunitas"}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            {t.author?.originRegion || "Kabupaten Tangerang"}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.75rem", background: "#f1f5f9", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 600 }}>
                            {t.category || "Diskusi Umum"}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.75rem", color: "#475569" }}>
                            💬 {t.repliesCount || t.commentsCount || 0} balasan &bull; ❤️ {t.likesCount || 0} suka
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: t.isPinned ? "#7c3aed" : "#64748b" }}>
                            {t.isPinned ? "📌 Disematkan" : "Normal"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                            <button
                              type="button"
                              onClick={() => handleTogglePin(t.id)}
                              style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", background: "#fff", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                            >
                              {t.isPinned ? "Lepas Pin" : "Sematkan"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(t.id, t.title)}
                              style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid #fee2e2", background: "#fee2e2", color: "#dc2626", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Add Topic Modal */}
      {showAddModal && (
        <div className="modal-overlay active" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" style={{ maxWidth: "600px", width: "92%" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>➕ Buat Topik / Pengumuman Forum Baru</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateTopic} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Judul Diskusi / Pengumuman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Petunjuk Pelaksanaan Lokakarya Penulisan Sastra 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Kategori Forum</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                >
                  <option value="Klinik Menulis">Klinik Menulis</option>
                  <option value="Bedah Karya">Bedah Karya</option>
                  <option value="Inspirasi Komunitas">Inspirasi Komunitas</option>
                  <option value="Seputar Publikasi">Seputar Publikasi</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Isi Pesan / Pengantar Topik</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tuliskan pengantar diskusi secara santun dan jelas..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontFamily: "inherit" }}
                ></textarea>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                />
                <label htmlFor="pinCheck" style={{ fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer" }}>
                  Sematkan sebagai Pengumuman Penting (📌 Pinned di bagian teratas forum)
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Batal</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Menerbitkan..." : "Terbitkan ke Forum"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
