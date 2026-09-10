"use client";

import { useEffect, useState, useMemo } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/admin.css";
import "@/css/kelola-cetak.css";

export default function KelolaCetakPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterWorkflow, setFilterWorkflow] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form New Anthology Project
  const [newTitle, setNewTitle] = useState("");
  const [newCurator, setNewCurator] = useState("");
  const [newCopies, setNewCopies] = useState(50);
  const [newTargetIsbn, setNewTargetIsbn] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.print.getOrders();
      if (res && res.success && res.data) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.warn("Gagal memuat pesanan cetak:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.title?.toLowerCase().includes(search.toLowerCase()) ||
        o.author?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.bookTitle?.toLowerCase().includes(search.toLowerCase());
      const matchWorkflow = filterWorkflow === "all" || o.status === filterWorkflow;
      return matchSearch && matchWorkflow;
    });
  }, [orders, search, filterWorkflow]);

  const handleUpdateStatus = (id, newStatus) => {
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    alert(`Status tahapan pesanan berhasil diubah menjadi: ${newStatus}`);
  };

  const handleCreateAnthology = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.print.createOrder({
        bookTitle: newTitle,
        curator: newCurator,
        copiesCount: parseInt(newCopies),
        isbn: newTargetIsbn || "978-623-09-xxxx-x",
        orderType: "antologi",
      });
      if (res && res.success) {
        alert("🎉 Proyek antologi bunga rampai ber-ISBN berhasil dibuat!");
        setShowAddModal(false);
        setNewTitle("");
        setNewCurator("");
        fetchOrders();
      } else {
        alert("Gagal membuat antologi: " + (res?.message || ""));
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-cetak" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader isAdminMode={true} />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* Hero Banner */}
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Penerbitan Buku Cetak &amp; Legalitas ISBN <span>KERTAS KATA</span></h1>
                <p>Verifikasi pengajuan cetak buku fisik mandiri, pantau alur percetakan, registrasi ISBN resmi ke Perpusnas RI, serta kelola penerbitan buku antologi komunitas.</p>
                <div className="admin-status-pill">
                  <span className="status-dot-pulse"></span>
                  <span>Layanan Cetak Mandiri &amp; ISBN Aktif &bull; Terhubung Basis Data</span>
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
                  + Inisiasi Proyek Antologi Ber-ISBN
                </button>
              </div>
            </div>
          </section>

          {/* 4 Stats Cards */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">{orders.length}</div>
                  <div className="admin-stat-label">Total Permohonan Cetak</div>
                </div>
                <div className="admin-stat-icon-wrap blue">📖</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#2563eb", fontWeight: 700 }}>Database Nyata</span>
                <span style={{ color: "var(--text-muted)" }}>&bull; Antrean Cetak</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">
                    {orders.filter((o) => o.status === "completed").length}
                  </div>
                  <div className="admin-stat-label">Buku Selesai &amp; Dikirim</div>
                </div>
                <div className="admin-stat-icon-wrap emerald">✓</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#059669", fontWeight: 700 }}>Tercetak &amp; Ber-ISBN</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val">
                    {orders.filter((o) => o.status === "printing" || o.status === "layouting").length}
                  </div>
                  <div className="admin-stat-label">Dalam Proses Produksi</div>
                </div>
                <div className="admin-stat-icon-wrap purple">⚙️</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#7c3aed", fontWeight: 700 }}>Mitra Percetakan</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <div>
                  <div className="admin-stat-val" style={{ color: "#d97706" }}>
                    {orders.reduce((acc, o) => acc + (o.copiesCount || o.copies || 0), 0)}
                  </div>
                  <div className="admin-stat-label">Total Eksemplar Buku</div>
                </div>
                <div className="admin-stat-icon-wrap amber">📚</div>
              </div>
              <div className="admin-stat-footer">
                <span style={{ color: "#d97706", fontWeight: 700 }}>Volume Cetak</span>
              </div>
            </div>
          </section>

          {/* Filter Bar */}
          <section className="print-filter-bar" style={{ background: "#fff", padding: "1.25rem", borderRadius: "14px", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              <input
                type="text"
                placeholder="Cari judul buku, nama pemohon, atau nomor ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ minWidth: "260px", flex: 1, padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem" }}
              />

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <select
                  value={filterWorkflow}
                  onChange={(e) => setFilterWorkflow(e.target.value)}
                  style={{ padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.8125rem" }}
                >
                  <option value="all">Semua Tahapan Workflow</option>
                  <option value="pending">Menunggu Verifikasi</option>
                  <option value="layouting">Tata Letak &amp; ISBN</option>
                  <option value="printing">Proses Percetakan</option>
                  <option value="completed">Selesai &amp; Dikirim</option>
                </select>
              </div>
            </div>
          </section>

          {/* Table */}
          <section className="print-table-section" style={{ background: "#fff", borderRadius: "16px", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
            <div className="queue-header-bar" style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
                  Antrean Permohonan Cetak &amp; Registrasi ISBN Perpusnas
                </h2>
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 600 }}>
                Total: <strong style={{ color: "var(--primary-700)" }}>{filteredOrders.length}</strong> Permohonan
              </div>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Pemohon &amp; Asal Organisasi / Daerah</th>
                    <th>Judul Buku</th>
                    <th>Spesifikasi &amp; Jumlah</th>
                    <th>Nomor ISBN</th>
                    <th>Status Alur Kerja</th>
                    <th style={{ textAlign: "right" }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Memuat antrean cetak dari database...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                        Belum ada antrean cetak fisik. Klik "+ Inisiasi Proyek Antologi Ber-ISBN" untuk membuat proyek antologi.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                            {o.user?.name || o.member || "Anggota Komunitas"}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            {o.user?.originRegion || "Kabupaten Tangerang"}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                            {o.bookTitle || o.title || "Karya Buku Komunitas"}
                          </div>
                          <span style={{ fontSize: "0.6875rem", background: "#f1f5f9", padding: "0.1rem 0.4rem", borderRadius: "4px", display: "inline-block", marginTop: "0.2rem" }}>
                            {o.orderType === "antologi" ? "Bunga Rampai Bersama" : "Cetak Mandiri"}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600 }}>{o.copiesCount || o.copies || 25} Eksemplar</span>
                        </td>
                        <td>
                          <code style={{ fontSize: "0.75rem" }}>{o.isbn || "Proses Pengajuan"}</code>
                        </td>
                        <td>
                          <span style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                            background: o.status === "completed" ? "#dcfce7" : o.status === "printing" ? "#dbeafe" : "#fef3c7",
                            color: o.status === "completed" ? "#15803d" : o.status === "printing" ? "#1e40af" : "#b45309",
                          }}>
                            {o.status === "completed" ? "✓ Selesai & Dikirim" : o.status === "printing" ? "Sedang Dicetak" : o.status === "layouting" ? "Tata Letak & ISBN" : "Verifikasi"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                            style={{ padding: "0.35rem 0.5rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", fontSize: "0.75rem", cursor: "pointer" }}
                          >
                            <option value="pending">Tahap 1: Verifikasi</option>
                            <option value="layouting">Tahap 2: Tata Letak &amp; ISBN</option>
                            <option value="printing">Tahap 3: Sedang Dicetak</option>
                            <option value="completed">Tahap 4: Selesai &amp; Dikirim</option>
                          </select>
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

      {/* Modal Inisiasi Antologi */}
      {showAddModal && (
        <div className="modal-overlay active" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" style={{ maxWidth: "560px", width: "92%" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>📖 Inisiasi Antologi Bunga Rampai Ber-ISBN</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateAnthology} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Judul Buku Antologi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mozaik Kisah Benteng Heritage Tangerang"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Kurator / Editor Utama</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Tim Kurator Kertas Kata"
                    value={newCurator}
                    onChange={(e) => setNewCurator(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Target Eksemplar</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newCopies}
                    onChange={(e) => setNewCopies(e.target.value)}
                    style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Nomor ISBN Pengajuan (Opsional)</label>
                <input
                  type="text"
                  placeholder="978-623-09-xxxx-x"
                  value={newTargetIsbn}
                  onChange={(e) => setNewTargetIsbn(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Batal</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Memproses..." : "Inisiasi Antologi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
