"use client";

import { useState } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import "@/css/dashboard.css";
import "@/css/admin.css";

const INITIAL_MODULES = [
  { id: 1, order: "01", title: "Fondasi Literasi & Berpikir Kritis", lessons: 4, passingScore: 70, status: "active", enrolled: 840, completionRate: "92%" },
  { id: 2, order: "02", title: "Riset Budaya & Sejarah Lokal Tangerang", lessons: 5, passingScore: 70, status: "active", enrolled: 720, completionRate: "88%" },
  { id: 3, order: "03", title: "Seni Bercerita & Penulisan Cerpen", lessons: 6, passingScore: 75, status: "active", enrolled: 650, completionRate: "85%" },
  { id: 4, order: "04", title: "Menulis Opini Publik & Esai Kebijakan", lessons: 4, passingScore: 75, status: "active", enrolled: 580, completionRate: "78%" },
  { id: 5, order: "05", title: "Jurnalistik Warga & Berita Komunitas", lessons: 3, passingScore: 70, status: "active", enrolled: 430, completionRate: "65%" },
  { id: 6, order: "06", title: "Estetika Puisi & Gaya Bahasa Figuratif", lessons: 4, passingScore: 70, status: "active", enrolled: 310, completionRate: "52%" },
  { id: 7, order: "07", title: "Penulisan Artikel Ilmiah Populer", lessons: 5, passingScore: 80, status: "active", enrolled: 240, completionRate: "45%" },
  { id: 8, order: "08", title: "Etika Siber, Hak Cipta & Digital Publishing", lessons: 4, passingScore: 80, status: "active", enrolled: 190, completionRate: "38%" },
];

export default function KelolaElearningPage() {
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [selectedModule, setSelectedModule] = useState(null);

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-elearning" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader isAdminMode={true} />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {/* Header */}
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Kelola Kurikulum <span>E-Learning Literasi</span></h1>
                <p>Manajemen materi video, modul bacaan, kuis kelulusan, dan pemantauan angka kelulusan modul 32 JP peserta pelatihan literasi Kabupaten Tangerang.</p>
              </div>
            </div>
          </section>

          {/* Table */}
          <section className="review-queue-card">
            <div className="queue-header-bar">
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800 }}>
                Daftar 8 Modul Pelatihan Aktif
              </h2>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Urutan &amp; Judul Modul</th>
                    <th>Jumlah Materi</th>
                    <th>KKM Kuis</th>
                    <th>Peserta Mengikuti</th>
                    <th>Tingkat Kelulusan</th>
                    <th style={{ textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--text-main)" }}>Modul {m.order}: {m.title}</div>
                      </td>
                      <td>{m.lessons} Video &bull; Teks</td>
                      <td>{m.passingScore}%</td>
                      <td>{m.enrolled} peserta</td>
                      <td>
                        <span style={{ fontWeight: 700, color: "#059669" }}>{m.completionRate}</span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn-action-review"
                          onClick={() => setSelectedModule(m)}
                        >
                          Edit Modul
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

      {/* Edit Module Modal */}
      {selectedModule && (
        <div className="modal-overlay active" onClick={() => setSelectedModule(null)}>
          <div className="modal-card" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.1rem" }}>Edit Modul: {selectedModule.title}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedModule(null)}>&times;</button>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Judul Modul</label>
                <input type="text" defaultValue={selectedModule.title} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Nilai KKM Kelulusan (%)</label>
                <input type="number" defaultValue={selectedModule.passingScore} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedModule(null)}>Batal</button>
                <button type="button" className="btn-primary" onClick={() => { alert("Perubahan modul berhasil disimpan!"); setSelectedModule(null); }}>Simpan Perubahan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
