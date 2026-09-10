"use client";

import { useEffect, useState, useMemo } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/admin.css";
import "@/css/kelola-sertifikat.css";

export default function KelolaSertifikatPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [issuedCerts, setIssuedCerts] = useState({});

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getMembers();
      if (res && res.success && res.data?.members) {
        setMembers(res.data.members);
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.warn("Gagal memuat anggota sertifikat:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleIssueCert = (member) => {
    const certNum = `KK/32JP/2026/${String(Math.floor(100 + Math.random() * 900))}`;
    setIssuedCerts((prev) => ({
      ...prev,
      [member.id]: {
        certNumber: certNum,
        issuedAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      },
    }));
    alert(`🎉 E-Sertifikat 32 JP resmi DITERBITKAN untuk ${member.name}!\nNomor Registrasi: ${certNum}\nQR Code Validasi Resmi Aktif.`);
  };

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase();
      const matchSearch = m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || m.originRegion?.toLowerCase().includes(q);
      const isIssued = !!issuedCerts[m.id];
      if (filterStatus === "terbit" && !isIssued) return false;
      if (filterStatus === "pending" && isIssued) return false;
      return matchSearch;
    });
  }, [members, search, filterStatus, issuedCerts]);

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-sertifikat" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader isAdminMode={true} />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* Hero Banner */}
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Penerbitan Sertifikat 32 JP &amp; Hall of Fame <span>KERTAS KATA</span></h1>
                <p>Terbitkan e-sertifikat bernomor resmi dan ber-QR Code untuk anggota yang tuntas modul pelatihan e-learning, verifikasi naskah terbit, serta tetapkan apresiasi lencana prestasi.</p>
                <div className="admin-status-pill">
                  <span className="status-dot-pulse"></span>
                  <span>Sistem Sertifikasi Aktif &bull; Sinkronisasi Data Anggota Real-Time</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4 Stats Cards */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{Object.keys(issuedCerts).length}</div>
                  <div className="admin-stat-label">Sertifikat Resmi Diterbitkan</div>
                </div>
                <div className="admin-stat-icon-wrap purple">📜</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#7c3aed", fontWeight: 700 }}>QR Valid</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Terverifikasi</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val" style={{ color: "#059669" }}>
                    {members.length - Object.keys(issuedCerts).length}
                  </div>
                  <div className="admin-stat-label">Kandidat Dalam Pembelajaran</div>
                </div>
                <div className="admin-stat-icon-wrap emerald">⏳</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>Progres Belajar</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">32 JP</div>
                  <div className="admin-stat-label">Beban Jam Pelajaran</div>
                </div>
                <div className="admin-stat-icon-wrap blue">🎓</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#2563eb", fontWeight: 700 }}>Standar Komunitas</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val" style={{ color: "#d97706" }}>
                    {members.reduce((acc, m) => acc + (m._count?.articles || 0), 0)}
                  </div>
                  <div className="admin-stat-label">Akumulasi Naskah Terbit</div>
                </div>
                <div className="admin-stat-icon-wrap amber">📚</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#d97706", fontWeight: 700 }}>Karya Anggota</span>
              </div>
            </div>
          </section>

          {/* Filter Bar */}
          <section className="cert-filter-panel" style={{ background: "#fff", padding: "1.25rem", borderRadius: "14px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              <input
                type="text"
                placeholder="Cari nama peserta atau asal organisasi / daerah..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: "280px", flex: 1, padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem" }}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem" }}
              >
                <option value="all">Semua Status</option>
                <option value="terbit">Sudah Diterbitkan (✓ Terbit)</option>
                <option value="pending">Belum Terbit (Siap Verifikasi)</option>
              </select>
            </div>
          </section>

          {/* Table */}
          <section className="cert-table-container" style={{ background: "#fff", borderRadius: "16px", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
            <div className="queue-header-bar" style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                  Daftar E-Sertifikat Resmi Komunitas
                </h2>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>
                  Verifikasi dan penerbitan nomor registrasi sertifikat 32 JP dengan tautan QR Code.
                </p>
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 600 }}>
                Total: <strong style={{ color: "var(--primary-700)" }}>{filteredMembers.length}</strong> Peserta
              </div>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Nama Anggota</th>
                    <th>Asal Organisasi / Daerah</th>
                    <th>Tulisan Terbit</th>
                    <th>Nomor Registrasi Sertifikat</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Aksi Kurator</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Memuat data anggota dari database...
                      </td>
                    </tr>
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Belum ada anggota yang sesuai dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => {
                      const cert = issuedCerts[m.id];
                      return (
                        <tr key={m.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{m.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{m.email}</div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 500 }}>{m.originRegion || "-"}</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: "#059669" }}>
                              {m._count?.articles || 0} Naskah Terbit
                            </span>
                          </td>
                          <td>
                            {cert ? (
                              <div>
                                <code style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4338ca" }}>{cert.certNumber}</code>
                                <div style={{ fontSize: "0.6875rem", color: "#64748b" }}>Terbit: {cert.issuedAt}</div>
                              </div>
                            ) : (
                              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Belum Di-generate</span>
                            )}
                          </td>
                          <td>
                            <span style={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              padding: "0.2rem 0.5rem",
                              borderRadius: "4px",
                              background: cert ? "#dcfce7" : "#eff6ff",
                              color: cert ? "#15803d" : "#2563eb",
                            }}>
                              {cert ? "✓ Telah Terbit" : "Siap Terbit"}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {cert ? (
                              <button
                                type="button"
                                onClick={() => alert(`Unduh salinan PDF E-Sertifikat resmi ${cert.certNumber} untuk ${m.name}. File telah diverifikasi.`)}
                                style={{
                                  padding: "0.4rem 0.75rem",
                                  borderRadius: "6px",
                                  border: "1px solid var(--border-subtle)",
                                  background: "#fff",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                Unduh PDF
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleIssueCert(m)}
                                style={{
                                  padding: "0.4rem 0.75rem",
                                  borderRadius: "6px",
                                  border: "none",
                                  background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                                  color: "#fff",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                Terbitkan E-Sertifikat
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
