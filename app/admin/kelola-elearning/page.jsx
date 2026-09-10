"use client";

import { useEffect, useState } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/admin.css";
import "@/css/kelola-elearning.css";

export default function KelolaElearningPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("4 JP");
  const [orderIndex, setOrderIndex] = useState(1);
  const [videoUrl, setVideoUrl] = useState("");
  const [passingScore, setPassingScore] = useState(80);
  const [submitting, setSubmitting] = useState(false);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await api.elearning.getModules();
      if (res && res.success && res.data) {
        setModules(res.data);
      }
    } catch (err) {
      console.error("Gagal mengambil daftar modul:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const openAddModal = () => {
    setEditingModule(null);
    setTitle("");
    setDescription("");
    setDuration("4 JP");
    setOrderIndex(modules.length + 1);
    setVideoUrl("");
    setPassingScore(80);
    setShowModal(true);
  };

  const openEditModal = (m) => {
    setEditingModule(m);
    setTitle(m.title);
    setDescription(m.description || "");
    setDuration(m.duration || "4 JP");
    setOrderIndex(m.orderIndex || 1);
    setVideoUrl(m.videoUrl || "");
    setPassingScore(m.passingScore || 80);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        duration,
        orderIndex: parseInt(orderIndex) || 1,
        videoUrl: videoUrl.trim() || null,
        passingScore: parseInt(passingScore) || 80,
      };

      if (editingModule) {
        const res = await api.elearning.updateModule(editingModule.id, payload);
        if (res.success) {
          alert("🎉 Modul berhasil diperbarui!");
          setShowModal(false);
          fetchModules();
        } else {
          alert("Gagal memperbarui: " + (res.message || ""));
        }
      } else {
        const res = await api.elearning.createModule(payload);
        if (res.success) {
          alert("🎉 Modul pembelajaran baru berhasil ditambahkan!");
          setShowModal(false);
          fetchModules();
        } else {
          alert("Gagal menambahkan modul: " + (res.message || ""));
        }
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModule = async (id, title) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus modul "${title}"?`)) return;
    try {
      const res = await api.elearning.deleteModule(id);
      if (res.success) {
        alert("Modul berhasil dihapus.");
        fetchModules();
      } else {
        alert("Gagal menghapus: " + (res.message || ""));
      }
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-elearning" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader isAdminMode={true} />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* Hero Overview Banner */}
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Manajemen Kurikulum &amp; Modul E-Learning <span>KERTAS KATA</span></h1>
                <p>Kelola struktur materi, sematkan video pembelajaran berformat S3 Cloud Storage milik Admin, kuis pemahaman, dan evaluasi ketuntasan 32 Jam Pelajaran (JP).</p>
                <div className="admin-status-pill">
                  <span className="status-dot-pulse"></span>
                  <span>Kurikulum Berjenjang Aktif &bull; Terhubung Database &amp; S3 Cloud Video</span>
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
                  <span>+ Tambah Modul Baru</span>
                </button>
              </div>
            </div>
          </section>

          {/* 4 Kartu Metrik E-Learning */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{modules.length} Modul</div>
                  <div className="admin-stat-label">Kurikulum Aktif</div>
                </div>
                <div className="admin-stat-icon-wrap blue">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>32 JP Standar</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Database Terhubung</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{modules.filter((m) => m.videoUrl).length} Video</div>
                  <div className="admin-stat-label">Video Pembelajaran S3</div>
                </div>
                <div className="admin-stat-icon-wrap purple">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#7c3aed", fontWeight: 700 }}>Cloud Storage Admin</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Link S3 Dedicated</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val" style={{ color: "#059669" }}>
                    {modules.length > 0 ? Math.round(modules.reduce((acc, m) => acc + (m.passingScore || 80), 0) / modules.length) : 80}%
                  </div>
                  <div className="admin-stat-label">Rata-Rata KKM Kuis</div>
                </div>
                <div className="admin-stat-icon-wrap emerald">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>Syarat Sertifikat</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Minimal Poin</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">32 JP</div>
                  <div className="admin-stat-label">Sertifikasi Kompetensi</div>
                </div>
                <div className="admin-stat-icon-wrap amber">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                  </svg>
                </div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#d97706", fontWeight: 700 }}>E-Sertifikat Otomatis</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Terverifikasi</span>
              </div>
            </div>
          </section>

          {/* Daftar Modul Kurikulum */}
          <section className="module-grid-section">
            <div className="section-title-wrap">
              <h2>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--primary-600)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                Struktur Modul Pelatihan Literasi Komunitas
              </h2>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Modul tersinkronisasi langsung dari database. Anggota menuntaskan modul secara berjenjang.
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "18px" }}>
                <p style={{ color: "var(--text-muted)" }}>Memuat modul pelatihan dari database...</p>
              </div>
            ) : modules.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: "18px", border: "1px dashed var(--border-subtle)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📚</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.5rem" }}>Belum Ada Modul Pelatihan</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 1rem" }}>
                  Tambahkan modul pembelajaran pertama Anda dan sematkan tautan video dari S3 Cloud Storage milik Admin.
                </p>
                <button type="button" className="btn btn-primary" onClick={openAddModal}>
                  + Tambah Modul Sekarang
                </button>
              </div>
            ) : (
              modules.map((m, idx) => (
                <div className="module-admin-card" key={m.id || idx}>
                  <div className="module-left-info">
                    <div className="module-order-badge">{m.orderIndex || idx + 1}</div>
                    <div className="module-text-details">
                      <div className="module-title-row">
                        <h3>{m.title}</h3>
                        <span className="badge-jp">{m.duration || "4 JP"}</span>
                        <span className="badge-module-status active">✓ Terbuka</span>
                      </div>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
                        {m.description || "Tidak ada deskripsi singkat untuk modul ini."}
                      </p>
                      <div className="module-meta-chips" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                        {m.videoUrl ? (
                          <span className="meta-chip-item" style={{ background: "#ede9fe", color: "#6d28d9", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem" }}>
                            🎬 Video S3: <a href={m.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#7c3aed", textDecoration: "underline" }}>Buka Sumber Video</a>
                          </span>
                        ) : (
                          <span className="meta-chip-item" style={{ background: "#f1f5f9", color: "#64748b", padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem" }}>
                            🎬 Belum Ada Video S3
                          </span>
                        )}
                        <span className="meta-chip-item" style={{ background: "#ecfdf5", color: "#059669", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem" }}>
                          📝 KKM: {m.passingScore || 80} Poin
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="module-actions-group" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn-module-action primary"
                      onClick={() => openEditModal(m)}
                      style={{ padding: "0.5rem 0.85rem", borderRadius: "8px", background: "var(--primary-50)", border: "1px solid var(--primary-200)", color: "var(--primary-700)", fontWeight: 600, cursor: "pointer", fontSize: "0.8125rem" }}
                    >
                      ✏️ Edit Modul
                    </button>
                    <button
                      type="button"
                      className="btn-module-action"
                      onClick={() => handleDeleteModule(m.id, m.title)}
                      style={{ padding: "0.5rem 0.85rem", borderRadius: "8px", background: "#fee2e2", border: "1px solid #fecaca", color: "#dc2626", fontWeight: 600, cursor: "pointer", fontSize: "0.8125rem" }}
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
      </div>

      {/* Modal Tambah / Edit Modul */}
      {showModal && (
        <div className="modal-overlay active" onClick={() => setShowModal(false)}>
          <div className="modal-card" style={{ maxWidth: "600px", width: "92%" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                {editingModule ? "✏️ Edit Modul Pembelajaran" : "➕ Tambah Modul Pembelajaran Baru"}
              </h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Judul Modul Pembelajaran
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Fondasi Literasi Digital & Etika Kepenulisan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    Beban JP / Durasi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 4 JP"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    Urutan Modul
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={orderIndex}
                    onChange={(e) => setOrderIndex(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                    KKM Kuis (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    required
                    value={passingScore}
                    onChange={(e) => setPassingScore(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                  />
                </div>
              </div>

              {/* Input Link Video S3 Milik Admin */}
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", fontWeight: 700, color: "#1e3a8a", marginBottom: "0.35rem" }}>
                  <span>🎬 Link Video Pembelajaran (S3 Storage Admin)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://s3.ap-southeast-1.amazonaws.com/kertas-kata/video/modul-1.mp4"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem" }}
                />
                <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginTop: "0.35rem", lineHeight: 1.4 }}>
                  Sematkan URL video materi pembelajaran yang tersimpan di AWS S3 / Cloud Storage milik Admin Kertas Kata.
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Deskripsi &amp; Capaian Kompetensi
                </label>
                <textarea
                  rows="3"
                  placeholder="Rincian tujuan pembelajaran dan materi yang dicakup..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontFamily: "inherit" }}
                ></textarea>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" }}
                >
                  {submitting ? "Menyimpan..." : editingModule ? "Simpan Perubahan" : "Tambahkan Modul"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
