"use client";

import { useState } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import "@/css/dashboard.css";
import "@/css/admin.css";

const INITIAL_CERTS = [
  { id: "CERT-2026-001", name: "Raden", region: "Tigaraksa", modulesPassed: 8, articlesPublished: 12, certNumber: "KK/32JP/2026/089", status: "issued", issueDate: "01 Sep 2026" },
  { id: "CERT-2026-002", name: "Siti Aminah, S.Pd.", region: "Teluknaga", modulesPassed: 8, articlesPublished: 8, certNumber: "KK/32JP/2026/090", status: "issued", issueDate: "03 Sep 2026" },
  { id: "CERT-2026-003", name: "Ahmad Fauzi", region: "Balaraja", modulesPassed: 8, articlesPublished: 5, certNumber: "KK/32JP/2026/091", status: "ready", issueDate: "-" },
];

export default function KelolaSertifikatPage() {
  const [certs, setCerts] = useState(INITIAL_CERTS);

  const handleIssue = (id) => {
    setCerts(certs.map((c) => (c.id === id ? { ...c, status: "issued", issueDate: "Hari ini" } : c)));
    alert(`🎉 E-Sertifikat 32 JP resmi diterbitkan untuk ${id}! QR Code verifikasi aktif.`);
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-sertifikat" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Penerbitan Sertifikat 32 JP <span>&amp; Hall of Fame</span></h1>
                <p>Verifikasi peserta yang telah memenuhi kualifikasi kurikulum 8 modul dan minimal 3 naskah terbit. Generate nomor sertifikat resmi Dispusipda dengan barcode verifikasi online.</p>
              </div>
            </div>
          </section>

          <section className="review-queue-card">
            <div className="queue-header-bar">
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800 }}>
                Kandidat Kelulusan &amp; Sertifikasi ({certs.length})
              </h2>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Nama Peserta</th>
                    <th>Asal Wilayah</th>
                    <th>Syarat Modul (8)</th>
                    <th>Karya Terbit (&ge;3)</th>
                    <th>Nomor Sertifikat</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {certs.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{c.name}</div>
                      </td>
                      <td>{c.region}</td>
                      <td>
                        <span style={{ color: "#059669", fontWeight: 700 }}>✓ {c.modulesPassed}/8 Modul</span>
                      </td>
                      <td>
                        <span style={{ color: "#059669", fontWeight: 700 }}>✓ {c.articlesPublished} Terbit</span>
                      </td>
                      <td><code>{c.certNumber}</code></td>
                      <td>
                        <span style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          background: c.status === "issued" ? "#dcfce7" : "#eff6ff",
                          color: c.status === "issued" ? "#15803d" : "#1d4ed8",
                        }}>
                          {c.status === "issued" ? "Telah Terbit" : "Siap Terbit"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {c.status === "issued" ? (
                          <button
                            type="button"
                            onClick={() => alert(`Unduh salinan PDF sertifikat resmi: ${c.certNumber}`)}
                            style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", background: "#fff", fontSize: "0.75rem", cursor: "pointer" }}
                          >
                            Unduh PDF
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => handleIssue(c.id)}
                            style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}
                          >
                            Terbitkan Sertifikat
                          </button>
                        )}
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
