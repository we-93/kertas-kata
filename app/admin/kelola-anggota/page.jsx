"use client";

import { useEffect, useState, useMemo } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/admin.css";
import "@/css/kelola-anggota.css";

const INITIAL_MEMBERS = [
  { id: "m1", name: "Raden", email: "raden@gmail.com", region: "Tigaraksa", role: "participant", status: "active", articlesCount: 0, joinedDate: "10 Sep 2026" },
  { id: "m2", name: "Siti Aminah, S.Pd.", email: "siti.aminah@gmail.com", region: "Teluknaga", role: "participant", status: "active", articlesCount: 8, joinedDate: "15 Agu 2026" },
  { id: "m3", name: "Ahmad Fauzi", email: "ahmad.fauzi@gmail.com", region: "Balaraja", role: "participant", status: "active", articlesCount: 5, joinedDate: "18 Agu 2026" },
  { id: "m4", name: "Nurul Fajriah, S.S.", email: "nurul.f@gmail.com", region: "Kronjo", role: "participant", status: "pending", articlesCount: 1, joinedDate: "20 Agu 2026" },
  { id: "m5", name: "Dian Pratama, M.Hum.", email: "dian.pratama@gmail.com", region: "Tigaraksa", role: "mentor", status: "active", articlesCount: 15, joinedDate: "05 Agu 2026" },
];

export default function KelolaAnggotaPage() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRegion, setNewRegion] = useState("Tigaraksa");

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
      const matchRegion = filterRegion === "all" || m.region === filterRegion;
      return matchSearch && matchRegion;
    });
  }, [members, search, filterRegion]);

  const handleAddMember = (e) => {
    e.preventDefault();
    const newMember = {
      id: "m" + Date.now(),
      name: newName,
      email: newEmail,
      region: newRegion,
      role: "participant",
      status: "active",
      articlesCount: 0,
      joinedDate: "Hari ini",
    };
    setMembers([newMember, ...members]);
    setShowAddModal(false);
    setNewName("");
    setNewEmail("");
    alert("🎉 Anggota baru berhasil ditambahkan!");
  };

  const handleToggleStatus = (id) => {
    setMembers(members.map((m) => {
      if (m.id === id) {
        return { ...m, status: m.status === "active" ? "suspended" : "active" };
      }
      return m;
    }));
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-anggota" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

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
                  <span>Basis Data Terhubung &bull; 28 Kecamatan Terintegrasi</span>
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
                  <div className="admin-stat-label">Total Anggota</div>
                </div>
                <div className="admin-stat-icon-wrap blue">👥</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>28 Kecamatan</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Kab. Tangerang</span>
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
                  <div className="admin-stat-val">{members.reduce((acc, it) => acc + (it.articlesCount || 0), 0)}</div>
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
                  Pencarian nama, email, dan filter wilayah asal kecamatan.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ padding: "0.5rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem" }}
                />
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  style={{ padding: "0.5rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem" }}
                >
                  <option value="all">Semua Kecamatan</option>
                  <option value="Tigaraksa">Tigaraksa</option>
                  <option value="Teluknaga">Teluknaga</option>
                  <option value="Balaraja">Balaraja</option>
                  <option value="Kronjo">Kronjo</option>
                </select>
              </div>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Nama &amp; Surel</th>
                    <th>Kecamatan</th>
                    <th>Peran</th>
                    <th>Tulisan Terbit</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{m.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{m.email}</div>
                      </td>
                      <td>{m.region}</td>
                      <td>
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: "4px", background: m.role === "mentor" ? "#ede9fe" : "#eff6ff", color: m.role === "mentor" ? "#7c3aed" : "#2563eb" }}>
                          {m.role === "mentor" ? "Mentor" : "Anggota"}
                        </span>
                      </td>
                      <td>{m.articlesCount} naskah</td>
                      <td>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: m.status === "active" ? "#059669" : m.status === "pending" ? "#d97706" : "#dc2626" }}>
                          {m.status === "active" ? "● Aktif" : m.status === "pending" ? "● Menunggu" : "● Ditangguhkan"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(m.id)}
                          style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", background: "#fff", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                        >
                          {m.status === "active" ? "Tangguhkan" : "Aktifkan"}
                        </button>
                      </td>
                    </tr>
                  ))}
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
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Alamat Email</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Kecamatan</label>
                <select value={newRegion} onChange={(e) => setNewRegion(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                  <option value="Tigaraksa">Tigaraksa</option>
                  <option value="Teluknaga">Teluknaga</option>
                  <option value="Balaraja">Balaraja</option>
                  <option value="Kronjo">Kronjo</option>
                  <option value="Cikupa">Cikupa</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Batal</button>
                <button type="submit" className="btn-primary">Simpan Anggota</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
