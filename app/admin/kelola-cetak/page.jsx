"use client";

import { useState } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import "@/css/dashboard.css";
import "@/css/admin.css";

const INITIAL_ORDERS = [
  { id: "ORD-001", member: "Raden", title: "Mozaik Kisah Benteng Heritage Tangerang", copies: 25, type: "Antologi Komunitas", status: "layouting", isbn: "978-623-09-8812-4", date: "08 Sep 2026" },
  { id: "ORD-002", member: "Siti Aminah, S.Pd.", title: "Catatan Guru Penggerak Pesisir Tangerang", copies: 50, type: "Buku Solo", status: "printing", isbn: "978-623-09-8816-2", date: "05 Sep 2026" },
  { id: "ORD-003", member: "Ahmad Fauzi", title: "Warta Dari Balai Desa", copies: 25, type: "Buku Solo", status: "completed", isbn: "978-623-09-8817-9", date: "28 Agu 2026" },
];

export default function KelolaCetakPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    alert(`Status pesanan ${id} berhasil diubah menjadi: ${newStatus}`);
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-cetak" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Kelola Cetak Naskah <span>&amp; Legalitas ISBN</span></h1>
                <p>Verifikasi pengajuan cetak buku fisik mandiri, pantau proses layouting percetakan, registrasi ISBN resmi Perpusnas RI, serta pengiriman buku ke penulis.</p>
              </div>
            </div>
          </section>

          <section className="review-queue-card">
            <div className="queue-header-bar">
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800 }}>
                Antrean &amp; Riwayat Cetak Fisik ({orders.length})
              </h2>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Kode &amp; Pemohon</th>
                    <th>Judul Buku</th>
                    <th>Jenis &amp; Jumlah</th>
                    <th>Nomor ISBN</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--primary-700)" }}>{o.id}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{o.member}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{o.title}</div>
                      </td>
                      <td>{o.type} &bull; {o.copies} eks</td>
                      <td><code>{o.isbn}</code></td>
                      <td>{o.date}</td>
                      <td>
                        <span style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          background: o.status === "completed" ? "#dcfce7" : o.status === "printing" ? "#dbeafe" : "#fef3c7",
                          color: o.status === "completed" ? "#15803d" : o.status === "printing" ? "#1e40af" : "#b45309",
                        }}>
                          {o.status === "completed" ? "Selesai Dikirim" : o.status === "printing" ? "Sedang Dicetak" : "Proses Layouting"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          style={{ padding: "0.35rem 0.5rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", fontSize: "0.75rem" }}
                        >
                          <option value="layouting">Layouting</option>
                          <option value="printing">Sedang Dicetak</option>
                          <option value="completed">Selesai &amp; Dikirim</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
