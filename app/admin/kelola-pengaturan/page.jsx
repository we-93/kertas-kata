"use client";

import { useState } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import "@/css/dashboard.css";
import "@/css/admin.css";

export default function KelolaPengaturanPage() {
  const [minWords, setMinWords] = useState(50);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoApproveAiSafe, setAutoApproveAiSafe] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    alert("Konfigurasi sistem KERTAS KATA berhasil diperbarui!");
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-pengaturan" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Pengaturan Sistem <span>&amp; Kebijakan Platform</span></h1>
                <p>Konfigurasi parameter kurasi editorial, integrasi asisten AI PUEBI &amp; KBBI, aturan kuota minimal penerbitan cetak mandiri, dan keamanan server.</p>
              </div>
            </div>
          </section>

          <section style={{ background: "#fff", borderRadius: "14px", border: "1px solid var(--border-subtle)", padding: "1.75rem", maxWidth: "680px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "1.25rem" }}>
              Parameter Kurasi &amp; Asisten AI
            </h3>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Batas Minimal Kata Pengajuan Naskah
                </label>
                <input
                  type="number"
                  value={minWords}
                  onChange={(e) => setMinWords(Number(e.target.value))}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}
                />
                <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem", display: "block" }}>
                  Naskah di bawah jumlah kata ini tidak dapat diajukan ke meja kurator.
                </span>
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Aktifkan Asisten AI Koreksi PUEBI/KBBI</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Memungkinkan kurator menganalisis ejaan dan gaya bahasa naskah secara instan</div>
                  </div>
                  <input type="checkbox" checked={aiEnabled} onChange={(e) => setAiEnabled(e.target.checked)} />
                </label>
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Persetujuan Otomatis jika Skor Plagiarisme 0%</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Otomatisasi jalur cepat untuk penulis senior terverifikasi</div>
                  </div>
                  <input type="checkbox" checked={autoApproveAiSafe} onChange={(e) => setAutoApproveAiSafe(e.target.checked)} />
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button type="submit" className="btn-primary" style={{ padding: "0.75rem 1.5rem", fontWeight: 700 }}>
                  Simpan Konfigurasi
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
