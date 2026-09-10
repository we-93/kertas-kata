"use client";

import { useEffect, useState, useMemo } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/admin.css";
import "@/css/kelola-anggota.css";

export default function KelolaAnggotaPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("Semua123@");
  const [newOriginRegion, setNewOriginRegion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getMembers({
        search: search.trim() || undefined,
        region: filterRegion.trim() || undefined,
      });
      if (res?.data?.members) {
        setMembers(res.data.members);
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data anggota:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [search, filterRegion]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post("/auth/register", {
        name: newName,
        email: newEmail,
        password: newPassword || "Semua123@",
        originRegion: newOriginRegion.trim() || "Kabupaten Tangerang",
      });

      if (res.success) {
        alert("🎉 Anggota baru berhasil didaftarkan ke sistem!");
        setShowAddModal(false);
        setNewName("");
        setNewEmail("");
        setNewPassword("Semua123@");
        setNewOriginRegion("");
        fetchMembers();
      } else {
        alert("Gagal menambahkan anggota: " + (res.message || "Terjadi kesalahan"));
      }
    } catch (err) {
      alert("Gagal menambahkan anggota: " + (err.message || "Kesalahan jaringan"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    const confirmMsg = currentStatus === "active"
      ? "Apakah Anda yakin ingin menangguhkan akun anggota ini?"
      : "Apakah Anda ingin mengaktifkan kembali akun anggota ini?";
    
    if (!confirm(confirmMsg)) return;

    try {
      const res = await api.admin.updateMemberStatus(id, { status: newStatus });
      if (res.success) {
        fetchMembers();
      } else {
        alert("Gagal memperbarui status: " + (res.message || ""));
      }
    } catch (err) {
      alert("Gagal memperbarui status: " + (err.message || ""));
    }
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-anggota" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader isAdminMode={true} />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Hero Banner */}
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Direktori &amp; Manajemen Anggota <span>KERTAS KATA</span></h1>
                <p>Kelola basis data keanggotaan pendidik, pegiat, dan penulis se-Kabupaten Tangerang. Pantau progres artikel, moderasi akun, dan verifikasi anggota baru.</p>
                <div className="admin-status-pill">
                  <span className="status-dot-pulse"></span>
                  <span>Basis Data Database Aktif &bull; Sinkronisasi Real-Time</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                  style={{
                    background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(124, 58, 237, 0.4)",
                    padding: "0.75rem 1.25rem",
                    color: "#fff",
                    borderRadius: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  + Tambah Anggota Baru
                </button>
              </div>
            </div>
          </section>

          {/* 4 Stats */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{members.length}</div>
                  <div className="admin-stat-label">Total Anggota Terdaftar</div>
                </div>
                <div className="admin-stat-icon-wrap blue">👥</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>Database Nyata</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Platform Literasi</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{members.filter((m) => m.status === "active").length}</div>
                  <div className="admin-stat-label">Anggota Aktif</div>
                </div>
                <div className="admin-stat-icon-wrap emerald">✓</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>Status Aktif</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val" style={{ color: "#d97706" }}>{members.filter((m) => m.status === "pending").length}</div>
                  <div className="admin-stat-label">Menunggu Verifikasi</div>
                </div>
                <div className="admin-stat-icon-wrap amber">⏳</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#d97706", fontWeight: 700 }}>Pendaftar Baru</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{members.reduce((acc, it) => acc + (it._count?.articles || 0), 0)}</div>
                  <div className="admin-stat-label">Akumulasi Naskah Terbit</div>
                </div>
                <div className="admin-stat-icon-wrap purple">📚</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#7c3aed", fontWeight: 700 }}>Karya Anggota</span>
              </div>
            </div>
          </section>

          {/* Table Directory */}
          <section className="review-queue-card">
            <div className="queue-header-bar" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                  Daftar Anggota Platform Literasi
                </h2>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                  Pencarian nama, surel, dan filter asal organisasi atau daerah.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Cari nama atau surel..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ padding: "0.5rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem", minWidth: "180px" }}
                />
                <input
                  type="text"
                  placeholder="Filter asal organisasi / daerah..."
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  style={{ padding: "0.5rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem", minWidth: "200px" }}
                />
              </div>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Nama &amp; Surel</th>
                    <th>Asal Organisasi / Daerah</th>
                    <th>Peran</th>
                    <th>Tulisan Terbit</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                        Memuat data anggota dari database...
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Belum ada data anggota yang terdaftar atau cocok dengan pencarian.
                      </td>
                    </tr>
                  ) : (
                    members.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{m.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{m.email}</div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 500 }}>{m.originRegion || "-"}</span>
                        </td>
                        <td>
                          <span style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            background: m.role === "admin" ? "#fef3c7" : m.role === "mentor" ? "#ede9fe" : "#eff6ff",
                            color: m.role === "admin" ? "#d97706" : m.role === "mentor" ? "#7c3aed" : "#2563eb",
                            textTransform: "capitalize"
                          }}>
                            {m.role === "admin" ? "Admin" : m.role === "mentor" ? "Mentor" : "Anggota"}
                          </span>
                        </td>
                        <td>{m._count?.articles || 0} naskah</td>
                        <td>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: m.status === "active" ? "#059669" : m.status === "pending" ? "#d97706" : "#dc2626" }}>
                            {m.status === "active" ? "● Aktif" : m.status === "pending" ? "● Menunggu" : "● Ditangguhkan"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {m.role !== "admin" && (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(m.id, m.status)}
                              style={{
                                padding: "0.35rem 0.65rem",
                                borderRadius: "6px",
                                border: "1px solid var(--border-subtle)",
                                background: "#fff",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                color: m.status === "active" ? "#dc2626" : "#059669"
                              }}
                            >
                              {m.status === "active" ? "Tangguhkan" : "Aktifkan"}
                            </button>
                          )}
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

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="modal-overlay active" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.125rem" }}>Tambah Anggota Baru</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddMember} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso, S.Pd."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Alamat Surel (Email)</label>
                <input
                  type="email"
                  placeholder="Contoh: budi@sekolah.sch.id"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Kata Sandi Default</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Asal Organisasi / Daerah (Dapat Diisi Bebas)</label>
                <input
                  type="text"
                  placeholder="Contoh: SMPN 1 Tigaraksa / Komunitas Penulis Banten"
                  value={newOriginRegion}
                  onChange={(e) => setNewOriginRegion(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Batal</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Menyimpan..." : "Simpan Anggota"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
