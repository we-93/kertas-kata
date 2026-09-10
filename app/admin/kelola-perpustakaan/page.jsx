"use client";

import { useEffect, useState } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/admin.css";
import "@/css/kelola-perpustakaan.css";

export default function KelolaPerpustakaanPage() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAccess, setFilterAccess] = useState("all");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingEbook, setEditingEbook] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [authorOrg, setAuthorOrg] = useState("");
  const [category, setCategory] = useState("Pendidikan & Modul");
  const [isbn, setIsbn] = useState("");
  const [accessType, setAccessType] = useState("free");
  const [price, setPrice] = useState(0);
  const [pages, setPages] = useState(120);
  const [coverUrl, setCoverUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchEbooks = async () => {
    try {
      setLoading(true);
      const res = await api.library.getEbooks({
        search: search.trim() || undefined,
        category: filterCategory !== "all" ? filterCategory : undefined,
        accessType: filterAccess !== "all" ? filterAccess : undefined,
      });
      if (res && res.success && res.data) {
        setEbooks(res.data);
      } else {
        setEbooks([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data e-book:", err);
      setEbooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, [search, filterCategory, filterAccess]);

  const openAddModal = () => {
    setEditingEbook(null);
    setTitle("");
    setAuthor("");
    setAuthorOrg("");
    setCategory("Pendidikan & Modul");
    setIsbn("");
    setAccessType("free");
    setPrice(0);
    setPages(120);
    setCoverUrl("");
    setDownloadUrl("");
    setWhatsappUrl("");
    setSynopsis("");
    setShowModal(true);
  };

  const openEditModal = (eb) => {
    setEditingEbook(eb);
    setTitle(eb.title || "");
    setAuthor(eb.author || "");
    setAuthorOrg(eb.authorOrg || "");
    setCategory(eb.category || "Pendidikan & Modul");
    setIsbn(eb.isbn || "");
    setAccessType(eb.accessType || "free");
    setPrice(eb.price || 0);
    setPages(eb.pages || 120);
    setCoverUrl(eb.coverUrl || "");
    setDownloadUrl(eb.downloadUrl || "");
    setWhatsappUrl(eb.whatsappUrl || "");
    setSynopsis(eb.synopsis || "");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        title,
        author,
        authorOrg: authorOrg.trim() || "Kabupaten Tangerang",
        category,
        isbn: isbn.trim() || null,
        accessType,
        price: accessType === "premium" ? parseFloat(price) || 0 : 0,
        pages: parseInt(pages) || 100,
        coverUrl: coverUrl.trim() || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
        downloadUrl: downloadUrl.trim() || null,
        whatsappUrl: accessType === "premium" ? (whatsappUrl.trim() || null) : null,
        synopsis: synopsis.trim() || null,
      };

      if (editingEbook) {
        const res = await api.library.updateEbook(editingEbook.id, payload);
        if (res.success) {
          alert("🎉 Metadata e-book berhasil diperbarui!");
          setShowModal(false);
          fetchEbooks();
        } else {
          alert("Gagal memperbarui: " + (res.message || ""));
        }
      } else {
        const res = await api.library.createEbook(payload);
        if (res.success) {
          alert("🎉 E-Book baru berhasil diterbitkan ke katalog perpustakaan!");
          setShowModal(false);
          fetchEbooks();
        } else {
          alert("Gagal menambahkan: " + (res.message || ""));
        }
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, bookTitle) => {
    if (!confirm(`Hapus e-book "${bookTitle}" dari perpustakaan digital?`)) return;
    try {
      const res = await api.library.deleteEbook(id);
      if (res.success) {
        alert("E-Book berhasil dihapus.");
        fetchEbooks();
      } else {
        alert("Gagal menghapus: " + (res.message || ""));
      }
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-perpustakaan" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader isAdminMode={true} />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* Hero Banner */}
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Kelola Perpustakaan &amp; Koleksi E-Book <span>KERTAS KATA</span></h1>
                <p>Tambah koleksi buku digital, atur tautan berkas unduhan langsung, nomor ISBN, serta sematkan tautan WhatsApp admin untuk e-book eksklusif premium.</p>
                <div className="admin-status-pill">
                  <span className="status-dot-pulse"></span>
                  <span>Distribusi Unduhan Mandiri &bull; E-Book Download-Only Terintegrasi S3/Cloud</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={openAddModal}
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(124, 58, 237, 0.4)",
                    padding: "0.75rem 1.25rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#fff",
                    borderRadius: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>+ Tambah E-Book Baru</span>
                </button>
              </div>
            </div>
          </section>

          {/* 4 Stat Cards */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{ebooks.length}</div>
                  <div className="admin-stat-label">Total E-Book Terdaftar</div>
                </div>
                <div className="admin-stat-icon-wrap blue">📚</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>Database Nyata</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Katalog Digital</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{ebooks.filter((b) => b.accessType === "free").length}</div>
                  <div className="admin-stat-label">Akses Gratis (Unduh Terbuka)</div>
                </div>
                <div className="admin-stat-icon-wrap emerald">📖</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>Bebas Diunduh</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val" style={{ color: "#d97706" }}>
                    {ebooks.filter((b) => b.accessType === "premium").length}
                  </div>
                  <div className="admin-stat-label">E-Book Premium (WhatsApp)</div>
                </div>
                <div className="admin-stat-icon-wrap amber">💬</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#d97706", fontWeight: 700 }}>Tautan WA Admin</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">
                    {ebooks.reduce((acc, b) => acc + (b.downloadsCount || 0), 0)}
                  </div>
                  <div className="admin-stat-label">Akumulasi Unduhan Pembaca</div>
                </div>
                <div className="admin-stat-icon-wrap purple">📥</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#7c3aed", fontWeight: 700 }}>Trafik Koleksi</span>
              </div>
            </div>
          </section>

          {/* Filter Bar */}
          <section className="member-filter-section" style={{ background: "#fff", padding: "1.25rem", borderRadius: "14px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", flex: 1 }}>
                <input
                  type="text"
                  placeholder="Cari judul e-book, penulis, atau asal organisasi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ minWidth: "260px", flex: 1, padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem" }}
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{ padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem" }}
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Pendidikan & Modul">Pendidikan &amp; Modul</option>
                  <option value="Sastra & Antologi">Sastra &amp; Antologi</option>
                  <option value="Seni & Budaya">Seni &amp; Budaya</option>
                  <option value="Jurnalistik & Opini">Jurnalistik &amp; Opini</option>
                  <option value="Sejarah & Riset">Sejarah &amp; Riset</option>
                </select>
                <select
                  value={filterAccess}
                  onChange={(e) => setFilterAccess(e.target.value)}
                  style={{ padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem" }}
                >
                  <option value="all">Semua Tipe Akses</option>
                  <option value="free">Gratis (Unduh Langsung)</option>
                  <option value="premium">Premium (WhatsApp)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Table */}
          <section className="lib-table-card" style={{ background: "#fff", borderRadius: "16px", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
            <div className="queue-header-bar" style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-subtle)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                Katalog E-Book Perpustakaan Komunitas
              </h2>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Sampul &amp; Judul E-Book</th>
                    <th>Penulis &amp; Asal Organisasi / Daerah</th>
                    <th>Kategori</th>
                    <th>Tipe Akses &amp; Tautan Unduh</th>
                    <th>ISBN</th>
                    <th style={{ textAlign: "right" }}>Aksi Kurasi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Memuat katalog buku dari database...
                      </td>
                    </tr>
                  ) : ebooks.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Belum ada koleksi e-book yang terdaftar. Klik "+ Tambah E-Book Baru" untuk menerbitkan buku.
                      </td>
                    </tr>
                  ) : (
                    ebooks.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                            <img
                              src={b.coverUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"}
                              alt={b.title}
                              style={{ width: "42px", height: "56px", objectFit: "cover", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{b.title}</div>
                              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{b.pages || 100} Halaman</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.author}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{b.authorOrg || "Kabupaten Tangerang"}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: "0.75rem", background: "var(--primary-50)", color: "var(--primary-700)", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 600 }}>
                            {b.category}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                            <span style={{
                              display: "inline-block",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: b.accessType === "free" ? "#059669" : "#d97706"
                            }}>
                              {b.accessType === "free" ? "✓ Gratis (Unduh)" : "⭐ Premium (WhatsApp)"}
                            </span>
                            {b.accessType === "free" && b.downloadUrl ? (
                              <a
                                href={b.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: "0.75rem", color: "#2563eb", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                              >
                                📥 Cek File Unduhan
                              </a>
                            ) : b.accessType === "premium" && b.whatsappUrl ? (
                              <a
                                href={b.whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: "0.75rem", color: "#059669", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                              >
                                💬 Cek Link WhatsApp
                              </a>
                            ) : (
                              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Belum ada URL</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <code style={{ fontSize: "0.75rem", color: "#475569" }}>{b.isbn || "-"}</code>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                            <button
                              type="button"
                              onClick={() => openEditModal(b)}
                              style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", background: "#fff", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(b.id, b.title)}
                              style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid #fee2e2", background: "#fee2e2", color: "#dc2626", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                            >
                              🗑️
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

      {/* Modal Add / Edit E-Book */}
      {showModal && (
        <div className="modal-overlay active" onClick={() => setShowModal(false)}>
          <div className="modal-card" style={{ maxWidth: "680px", width: "92%" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                {editingEbook ? "✏️ Edit Metadata E-Book" : "📚 Tambah E-Book Baru ke Perpustakaan"}
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Judul Buku Digital *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bunga Rampai Literasi Pendidikan Tangerang"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    Nama Penulis / Kurator *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Tim Penulis Kertas Kata"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    Asal Organisasi / Daerah (Dapat Diisi Bebas) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SMPN 1 Tigaraksa / Komunitas Sastra"
                    value={authorOrg}
                    onChange={(e) => setAuthorOrg(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    Kategori Buku *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                  >
                    <option value="Pendidikan & Modul">Pendidikan &amp; Modul</option>
                    <option value="Sastra & Antologi">Sastra &amp; Antologi</option>
                    <option value="Seni & Budaya">Seni &amp; Budaya</option>
                    <option value="Jurnalistik & Opini">Jurnalistik &amp; Opini</option>
                    <option value="Sejarah & Riset">Sejarah &amp; Riset</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    Nomor ISBN (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="978-623-01-xxxx-x"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    Tipe Akses *
                  </label>
                  <select
                    value={accessType}
                    onChange={(e) => setAccessType(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                  >
                    <option value="free">Gratis (Unduh Bebas Publik)</option>
                    <option value="premium">Eksklusif (Buku Premium via WhatsApp)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    Jumlah Halaman &amp; Sampul
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="number"
                      min="10"
                      value={pages}
                      onChange={(e) => setPages(e.target.value)}
                      style={{ width: "90px", padding: "0.65rem 0.5rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                    />
                    <input
                      type="url"
                      placeholder="URL Gambar Sampul (Opsional)"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      style={{ flex: 1, padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.75rem" }}
                    />
                  </div>
                </div>
              </div>

              {/* Input URL Unduh Berkas E-Book */}
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#1e3a8a", marginBottom: "0.35rem" }}>
                  📥 URL Unduh Berkas E-Book (Download-Only) *
                </label>
                <input
                  type="url"
                  placeholder="https://s3.ap-southeast-1.amazonaws.com/kertas-kata/ebooks/buku-antologi.pdf"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem" }}
                />
                <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginTop: "0.35rem" }}>
                  Sematkan tautan unduh file PDF/EPUB. E-Book hanya dapat diunduh langsung oleh pembaca dan tidak dibaca di dalam aplikasi.
                </span>
              </div>

              {/* Input URL WhatsApp Khusus Premium */}
              {accessType === "premium" && (
                <div style={{ background: "#f0fdf4", padding: "1rem", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#166534", marginBottom: "0.35rem" }}>
                    💬 URL WhatsApp Admin untuk E-Book Premium *
                  </label>
                  <input
                    type="url"
                    placeholder="https://wa.me/6281234567890?text=Halo%20Admin%2C%20saya%20tertarik%20mengunduh%2Fmembeli%20e-book%20ini"
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #86efac", fontSize: "0.8125rem" }}
                  />
                  <span style={{ display: "block", fontSize: "0.75rem", color: "#15803d", marginTop: "0.35rem" }}>
                    Tombol unduh pada e-book premium ini akan mengarahkan pembaca secara otomatis ke WhatsApp Anda.
                  </span>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Sinopsis &amp; Deskripsi Singkat
                </label>
                <textarea
                  rows="3"
                  placeholder="Ringkasan isi buku dan manfaat bagi anggota..."
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontFamily: "inherit" }}
                ></textarea>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" }}
                >
                  {submitting ? "Menyimpan..." : editingEbook ? "Simpan Perubahan" : "Terbitkan E-Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
