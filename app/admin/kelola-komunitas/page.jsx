"use client";

import { useState } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import "@/css/dashboard.css";
import "@/css/admin.css";

const INITIAL_TOPICS = [
  { id: "1", title: "Bedah Karya: Menjaga Keseimbangan Fakta & Narasi dalam Esai Sejarah", author: "Dian Pratama", category: "Bedah Karya", status: "open", replies: 14, pinned: true },
  { id: "2", title: "Diskusi Khusus: Penyusunan Antologi Puisi Pesisir Utara 2026", author: "Siti Aminah", category: "Kolaborasi Antologi", status: "open", replies: 8, pinned: false },
  { id: "3", title: "Etika Peliputan Berita Desa: Menghadapi Narasumber yang Tertutup", author: "Ahmad Fauzi", category: "Jurnalistik Warga", status: "open", replies: 5, pinned: false },
];

export default function KelolaKomunitasPage() {
  const [topics, setTopics] = useState(INITIAL_TOPICS);

  const togglePin = (id) => {
    setTopics(topics.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)));
  };

  const handleDelete = (id) => {
    if (confirm("Hapus topik diskusi ini?")) {
      setTopics(topics.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-komunitas" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Moderasi &amp; Kelola <span>Komunitas Diskusi</span></h1>
                <p>Moderasi topik perbincangan, sematkan pengumuman penting di forum, kelola grup diskusi private, serta jaga kenyamanan interaksi anggota.</p>
              </div>
            </div>
          </section>

          <section className="review-queue-card">
            <div className="queue-header-bar">
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800 }}>
                Daftar Topik Forum Aktif ({topics.length})
              </h2>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Judul Topik</th>
                    <th>Pembuat Diskusi</th>
                    <th>Kategori</th>
                    <th>Tanggapan</th>
                    <th>Status Sematan</th>
                    <th style={{ textAlign: "right" }}>Moderasi</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--text-main)" }}>
                          {t.pinned && <span style={{ marginRight: "0.25rem" }}>📌</span>}
                          {t.title}
                        </div>
                      </td>
                      <td>{t.author}</td>
                      <td>
                        <span style={{ fontSize: "0.75rem", background: "#f1f5f9", padding: "0.15rem 0.5rem", borderRadius: "4px" }}>
                          {t.category}
                        </span>
                      </td>
                      <td>{t.replies} balasan</td>
                      <td>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: t.pinned ? "#7c3aed" : "#64748b" }}>
                          {t.pinned ? "Disematkan" : "Normal"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          onClick={() => togglePin(t.id)}
                          style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", background: "#fff", fontSize: "0.75rem", cursor: "pointer" }}
                        >
                          {t.pinned ? "Lepas Pin" : "Sematkan"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id)}
                          style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#dc2626", fontSize: "0.75rem", cursor: "pointer" }}
                        >
                          Hapus
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
    </div>
  );
}
