"use client";

import { useState, useEffect } from "react";
import SidebarParticipant from "@/components/SidebarParticipant";
import TopHeader from "@/components/TopHeader";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/profil.css";

export default function ProfilPage() {
  const { user, ensureAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("Kec. Tigaraksa, Kab. Tangerang");
  const [bio, setBio] = useState("Pendidik & pegiat literasi lokal. Menulis untuk merawat ingatan sejarah dan kearifan masyarakat Tangerang.");
  const [articlesCount, setArticlesCount] = useState(0);

  useEffect(() => {
    async function loadUser() {
      await ensureAuth("participant");
      if (user) {
        setName(user.name || "Rahmat Hidayat");
        setEmail(user.email || "rahmat.hidayat@gmail.com");
        if (user.originRegion) setRegion(user.originRegion);
      }
      try {
        const res = await api.articles.getMy();
        if (res && res.success && res.data) {
          setArticlesCount(res.data.counts?.published || 0);
        }
      } catch (err) {}
    }
    loadUser();
  }, [user, ensureAuth]);

  const handleSave = (e) => {
    e.preventDefault();
    alert("Profil Anda berhasil diperbarui!");
  };

  return (
    <div className="app-container">
      <SidebarParticipant activePath="/profil" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box" }}>
          {/* Profile Header Card */}
          <section style={{ background: "#fff", borderRadius: "18px", border: "1px solid var(--border-subtle)", padding: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #1e40af)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: "800", boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)" }}>
              {name ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "RH"}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-main)", margin: 0 }}>{name}</h1>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "9999px", background: "#dcfce7", color: "#15803d" }}>
                  Penulis Terverifikasi
                </span>
              </div>
              <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                📍 {region} &bull; ✉️ {email}
              </div>
              <p style={{ fontSize: "0.875rem", color: "#334155", marginTop: "0.5rem", lineHeight: 1.6, maxWidth: "650px" }}>
                &quot;{bio}&quot;
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ textAlign: "center", background: "#f8fafc", padding: "0.75rem 1.25rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--primary-600)" }}>{articlesCount}</div>
                <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: "600" }}>Karya Terbit</div>
              </div>
              <div style={{ textAlign: "center", background: "#f8fafc", padding: "0.75rem 1.25rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--accent-600)" }}>3</div>
                <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: "600" }}>Lencana</div>
              </div>
            </div>
          </section>

          {/* Form Edit Profile */}
          <section style={{ background: "#fff", borderRadius: "18px", border: "1px solid var(--border-subtle)", padding: "2rem", maxWidth: "720px" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "800", marginBottom: "1.5rem" }}>
              Perbarui Informasi Profil
            </h3>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "700", marginBottom: "0.35rem" }}>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "700", marginBottom: "0.35rem" }}>
                  Alamat Surel (Email)
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem", background: "#f8fafc" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "700", marginBottom: "0.35rem" }}>
                  Wilayah / Kecamatan Domisili
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "700", marginBottom: "0.35rem" }}>
                  Biografi Singkat Penulis
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button type="submit" className="btn-primary" style={{ padding: "0.75rem 1.5rem", fontWeight: "700" }}>
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
