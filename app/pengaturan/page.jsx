"use client";

import { useState } from "react";
import SidebarParticipant from "@/components/SidebarParticipant";
import TopHeader from "@/components/TopHeader";
import "@/css/dashboard.css";

export default function PengaturanPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [curationAlerts, setCurationAlerts] = useState(true);
  const [communityNotifs, setCommunityNotifs] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    alert("Pengaturan akun Anda berhasil disimpan!");
  };

  return (
    <div className="app-container">
      <SidebarParticipant activePath="/pengaturan" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box" }}>
          <section style={{ maxWidth: "720px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.5rem" }}>
              Pengaturan Akun &amp; Preferensi
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "2rem" }}>
              Atur notifikasi kurasi naskah, preferensi keamanan, dan privasi akun Anda di KERTAS KATA Kabupaten Tangerang.
            </p>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Notifikasi Card */}
              <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid var(--border-subtle)", padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Notifikasi Editorial</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Pemberitahuan Status Kurasi</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Terima info saat naskah disetujui terbit atau membutuhkan revisi</div>
                    </div>
                    <input type="checkbox" checked={curationAlerts} onChange={(e) => setCurationAlerts(e.target.checked)} />
                  </label>

                  <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Surel Mingguan Literasi (Newsletter)</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Rangkuman artikel populer dan modul e-learning terbaru</div>
                    </div>
                    <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} />
                  </label>

                  <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Aktivitas Komunitas</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Notifikasi saat seseorang membalas diskusi atau mengikuti profil Anda</div>
                    </div>
                    <input type="checkbox" checked={communityNotifs} onChange={(e) => setCommunityNotifs(e.target.checked)} />
                  </label>
                </div>
              </div>

              {/* Keamanan Sandi */}
              <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid var(--border-subtle)", padding: "1.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Keamanan Sandi Akun</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>Kata Sandi Lama</label>
                    <input type="password" placeholder="••••••••" style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>Kata Sandi Baru</label>
                    <input type="password" placeholder="••••••••" style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn-primary" style={{ padding: "0.75rem 1.5rem", fontWeight: 700 }}>
                  Simpan Pengaturan
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
