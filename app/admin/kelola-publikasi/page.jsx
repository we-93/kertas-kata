"use client";

import { useEffect, useState } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/admin.css";

export default function KelolaPublikasiPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.articles.getAll({ status: "published" });
        if (res && res.success && res.data) {
          setArticles(res.data.articles || []);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleTakeDown = async (id, title) => {
    if (confirm(`Apakah Anda yakin ingin menarik artikel "${title}" dari etalase publik?`)) {
      alert(`Artikel "${title}" telah diarsipkan.`);
      setArticles(articles.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-publikasi" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Kelola Etalase <span>Publikasi Karya</span></h1>
                <p>Pantau keterbacaan artikel terbit, kurasi naskah unggulan di halaman depan, moderasi konten, serta arsip karya literasi masyarakat.</p>
              </div>
            </div>
          </section>

          <section className="review-queue-card">
            <div className="queue-header-bar">
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800 }}>
                Katalog Naskah Terbit ({articles.length})
              </h2>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Judul &amp; Kategori</th>
                    <th>Penulis &amp; Wilayah</th>
                    <th>Tanggal Terbit</th>
                    <th>Pembaca</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Moderasi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>Memuat katalog publikasi...</td></tr>
                  ) : articles.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>Belum ada naskah terbit.</td></tr>
                  ) : (
                    articles.map((art) => (
                      <tr key={art.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{art.title}</div>
                          <span style={{ fontSize: "0.6875rem", background: "rgba(37, 99, 235, 0.08)", color: "var(--primary-600)", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>
                            {art.category || "Umum"}
                          </span>
                        </td>
                        <td>
                          <div>{art.author?.name || "Penulis Komunitas"}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{art.author?.originRegion || "Kab. Tangerang"}</div>
                        </td>
                        <td>{new Date(art.publishedAt || art.createdAt).toLocaleDateString("id-ID")}</td>
                        <td>{art.viewCount || 0} views</td>
                        <td>
                          <span style={{ color: "#059669", fontWeight: 700, fontSize: "0.75rem" }}>● Terbit Publik</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => handleTakeDown(art.id, art.title)}
                            style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#dc2626", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                          >
                            Arsipkan
                          </button>
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
    </div>
  );
}
