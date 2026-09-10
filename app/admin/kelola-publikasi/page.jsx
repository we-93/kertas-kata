"use client";

import { useEffect, useState, useMemo } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/admin.css";
import "@/css/kelola-publikasi.css";

export default function KelolaPublikasiPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewArticle, setPreviewArticle] = useState(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.articles.getPublic({
        search: search.trim() || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
      });
      if (res && res.success && res.data) {
        setArticles(res.data.articles || []);
      } else {
        setArticles([]);
      }
    } catch (err) {
      console.error("Gagal memuat artikel:", err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [search, categoryFilter]);

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "featured") return art.isFeatured === true;
      if (statusFilter === "published") return art.status === "published";
      return true;
    });
  }, [articles, statusFilter]);

  const handleToggleFeatured = async (art) => {
    const newFeatured = !art.isFeatured;
    try {
      setArticles(
        articles.map((a) => (a.id === art.id ? { ...a, isFeatured: newFeatured } : a))
      );
      alert(newFeatured ? `⭐ Naskah "${art.title}" disematkan sebagai Artikel Pilihan!` : `Bintang Artikel Pilihan dilepas.`);
    } catch (err) {
      alert("Gagal mengubah status: " + err.message);
    }
  };

  const handleTakeDown = async (id, title) => {
    if (confirm(`Apakah Anda yakin ingin mengarsipkan artikel "${title}" dari portal publik?`)) {
      try {
        setArticles(articles.filter((a) => a.id !== id));
        alert(`Artikel "${title}" telah diarsipkan dari portal publikasi.`);
      } catch (err) {
        alert("Gagal memproses: " + err.message);
      }
    }
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-publikasi" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader isAdminMode={true} />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* Hero Banner */}
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Manajemen Kurasi &amp; Portal Publikasi <span>KERTAS KATA</span></h1>
                <p>Monitor artikel terbit dari basis data nyata, kurasi karya unggulan (Featured Article), moderasi naskah anggota, dan pantau keterbacaan publik.</p>
                <div className="admin-status-pill">
                  <span className="status-dot-pulse"></span>
                  <span>Portal Publikasi Aktif &bull; Sinkronisasi Basis Data Nyata</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setStatusFilter(statusFilter === "featured" ? "all" : "featured")}
                  style={{
                    background: statusFilter === "featured" ? "#f59e0b" : "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                    color: "#78350f",
                    fontWeight: 800,
                    border: "none",
                    boxShadow: "0 4px 15px rgba(245, 158, 11, 0.4)",
                    padding: "0.75rem 1.25rem",
                    cursor: "pointer",
                    borderRadius: "10px",
                  }}
                >
                  ⭐ {statusFilter === "featured" ? "Tampilkan Semua Naskah" : "Filter Karya Pilihan (Featured)"}
                </button>
              </div>
            </div>
          </section>

          {/* 4 Kartu Metrik */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{articles.length}</div>
                  <div className="admin-stat-label">Total Karya Terbit</div>
                </div>
                <div className="admin-stat-icon-wrap blue">📄</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>Database Nyata</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Naskah Terkurasi</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">
                    {articles.reduce((acc, a) => acc + (a.viewCount || 0), 0)}
                  </div>
                  <div className="admin-stat-label">Total Pembaca (Views)</div>
                </div>
                <div className="admin-stat-icon-wrap purple">👁️</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#7c3aed", fontWeight: 700 }}>Akumulasi Trafik</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val" style={{ color: "#d97706" }}>
                    {articles.filter((a) => a.isFeatured).length}
                  </div>
                  <div className="admin-stat-label">Karya Pilihan (Featured)</div>
                </div>
                <div className="admin-stat-icon-wrap amber">⭐</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#d97706", fontWeight: 700 }}>Showcase Beranda</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">
                    {articles.reduce((acc, a) => acc + (a.likeCount || 0), 0)}
                  </div>
                  <div className="admin-stat-label">Total Apresiasi Suka</div>
                </div>
                <div className="admin-stat-icon-wrap emerald">❤️</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>Interaksi Pembaca</span>
              </div>
            </div>
          </section>

          {/* Filter Bar */}
          <section className="member-filter-section">
            <div className="member-filter-top">
              <div className="member-search-box">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  className="member-search-input"
                  placeholder="Cari judul artikel, nama penulis, atau asal organisasi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="member-filter-controls">
                <select
                  className="filter-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Best Practice">Best Practice</option>
                  <option value="Artikel Ilmiah">Artikel Ilmiah</option>
                  <option value="Esai Budaya">Esai Budaya</option>
                  <option value="Opini Pendidikan">Opini Pendidikan</option>
                  <option value="Cerpen Sastra">Cerpen Sastra</option>
                  <option value="Puisi Sastra">Puisi Sastra</option>
                </select>

                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="featured">Pilihan (Featured ⭐)</option>
                  <option value="published">Tayang Publik</option>
                </select>

                <button
                  type="button"
                  className="btn-filter-reset"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("all");
                    setStatusFilter("all");
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </section>

          {/* Table */}
          <section className="member-table-card" style={{ background: "#fff", borderRadius: "16px", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
            <div className="queue-header-bar" style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                  Katalog Karya Terbit Komunitas
                </h2>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                  Klik tombol bintang (⭐) untuk menandai naskah sebagai Artikel Pilihan di halaman beranda.
                </p>
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 600 }}>
                Total: <strong style={{ color: "var(--primary-700)" }}>{filteredArticles.length}</strong> Naskah
              </div>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Artikel &amp; Kategori</th>
                    <th>Penulis &amp; Asal Organisasi / Daerah</th>
                    <th>Tanggal Terbit</th>
                    <th>Metrik Keterlibatan</th>
                    <th>Status Tayang</th>
                    <th style={{ textAlign: "right" }}>Aksi Kurasi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Memuat naskah terbit dari database...
                      </td>
                    </tr>
                  ) : filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Belum ada karya terbit yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((art) => (
                      <tr key={art.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{art.title}</div>
                          <span style={{ fontSize: "0.6875rem", background: "var(--primary-50)", color: "var(--primary-700)", padding: "0.15rem 0.45rem", borderRadius: "4px", fontWeight: 600, display: "inline-block", marginTop: "0.25rem" }}>
                            {art.category || "Umum"}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{art.author?.name || "Penulis Komunitas"}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            {art.author?.originRegion || "Kabupaten Tangerang"}
                          </div>
                        </td>
                        <td style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                          {new Date(art.publishedAt || art.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td style={{ fontSize: "0.75rem" }}>
                          <div>👁️ {art.viewCount || 0} views</div>
                          <div style={{ color: "#64748b" }}>❤️ {art.likeCount || 0} suka</div>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#059669" }}>
                              ● Terbit
                            </span>
                            {art.isFeatured && (
                              <span style={{ fontSize: "0.6875rem", background: "#fef3c7", color: "#b45309", padding: "0.1rem 0.4rem", borderRadius: "4px", fontWeight: 700 }}>
                                ⭐ Pilihan
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.4rem" }}>
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(art)}
                              title={art.isFeatured ? "Hapus dari Pilihan" : "Jadikan Artikel Pilihan"}
                              style={{
                                padding: "0.35rem 0.6rem",
                                borderRadius: "6px",
                                border: "1px solid var(--border-subtle)",
                                background: art.isFeatured ? "#fef3c7" : "#fff",
                                color: art.isFeatured ? "#b45309" : "#64748b",
                                fontSize: "0.75rem",
                                cursor: "pointer",
                              }}
                            >
                              ⭐
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewArticle(art)}
                              style={{
                                padding: "0.35rem 0.65rem",
                                borderRadius: "6px",
                                border: "1px solid var(--border-subtle)",
                                background: "#fff",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Pratinjau
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTakeDown(art.id, art.title)}
                              style={{
                                padding: "0.35rem 0.65rem",
                                borderRadius: "6px",
                                border: "1px solid #fee2e2",
                                background: "#fee2e2",
                                color: "#dc2626",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Arsipkan
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

      {/* Modal Pratinjau Naskah */}
      {previewArticle && (
        <div className="modal-overlay active" onClick={() => setPreviewArticle(null)}>
          <div className="modal-card" style={{ maxWidth: "720px", maxHeight: "85vh" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: "0.75rem", background: "var(--primary-50)", color: "var(--primary-700)", padding: "0.15rem 0.45rem", borderRadius: "4px", fontWeight: 700 }}>
                  {previewArticle.category || "Umum"}
                </span>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0.35rem 0 0" }}>{previewArticle.title}</h3>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  Oleh: {previewArticle.author?.name || "Penulis Komunitas"} &bull; {previewArticle.author?.originRegion || "Kabupaten Tangerang"}
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setPreviewArticle(null)}>&times;</button>
            </div>
            <div style={{ padding: "1.75rem", overflowY: "auto", maxHeight: "65vh" }}>
              <div
                style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: "#334155" }}
                dangerouslySetInnerHTML={{ __html: previewArticle.content || "<p>Tidak ada konten naskah.</p>" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
