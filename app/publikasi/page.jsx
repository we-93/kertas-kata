"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import SidebarParticipant from "@/components/SidebarParticipant";
import TopHeader from "@/components/TopHeader";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/publikasi.css";

const CATEGORIES = [
  "Semua",
  "Refleksi Pedagogik",
  "Pendidikan",
  "Sejarah",
  "Politik",
  "Pemerintahan",
  "Cerpen",
  "Puisi",
  "Ilmiah",
  "Opini",
  "Artificial Intelligence",
];

export default function PublikasiPage() {
  const [articles, setArticles] = useState([]); // Publik
  const [myArticles, setMyArticles] = useState([]); // Milik Sendiri
  const [counts, setCounts] = useState({ published: 0, in_review: 0, revision: 0, draft: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("katalog"); // 'katalog', 'draft', 'in_review', 'revision', 'published'

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Katalog Publik
        const resPublic = await api.articles.getPublic({ status: "published" });
        if (resPublic && resPublic.success && resPublic.data) {
          setArticles(resPublic.data.articles || []);
        }

        // Fetch Karya Sendiri (Status Tulisan)
        const resMy = await api.articles.getMy();
        if (resMy && resMy.success && resMy.data) {
          setMyArticles(resMy.data.articles || []);
          if (resMy.data.counts) {
            setCounts(resMy.data.counts);
          }
        }
      } catch (err) {
        console.warn("Gagal memuat data publikasi:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredMyArticles = useMemo(() => {
    return myArticles.filter((a) => a.status === activeTab);
  }, [myArticles, activeTab]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = selectedCategory === "Semua" || a.category === selectedCategory;
      const matchSearch =
        searchQuery === "" ||
        a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="app-container">
      <SidebarParticipant activePath="/publikasi" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box" }}>
          {/* Hero Banner */}
          <section className="publikasi-hero-banner" style={{ marginBottom: "2rem" }}>
            <div className="publikasi-hero-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div className="publikasi-hero-text">
                <h1 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#fff", marginBottom: "0.5rem" }}>
                  Katalog Publikasi &amp; Kurasi Karya Literasi
                </h1>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9375rem", maxWidth: "600px", lineHeight: "1.6" }}>
                  Jelajahi karya tulisan orisinal berbobot dari pendidik, pegiat, dan masyarakat Kabupaten Tangerang yang telah lolos uji kurasi editorial resmi.
                </p>
              </div>
              <Link
                href="/menulis"
                className="btn-primary"
                style={{
                  background: "var(--accent-500)",
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.875rem",
                  borderRadius: "10px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Tulis Naskah Baru</span>
              </Link>
            </div>
          </section>

          {/* Category Filter Pills */}
          <section style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "9999px",
                    border: "none",
                    background: selectedCategory === cat ? "var(--primary-600)" : "#f1f5f9",
                    color: selectedCategory === cat ? "#fff" : "#475569",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Search bar inside page */}
          <div style={{ marginBottom: "2rem" }}>
            <input
              type="text"
              placeholder="Cari judul artikel atau nama penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "480px",
                padding: "0.75rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
          </div>

          <div className="section-box-header" style={{ marginBottom: "1.5rem" }}>
            <div className="section-heading-group">
              <h2 className="section-title">Koleksi Karya</h2>
            </div>

            <div className="tab-nav">
              <button
                type="button"
                className={`tab-btn ${activeTab === "katalog" ? "active" : ""}`}
                onClick={() => setActiveTab("katalog")}
              >
                <span>Katalog Publik</span>
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === "draft" ? "active" : ""}`}
                onClick={() => setActiveTab("draft")}
              >
                <span>Draft</span>
                <span className="tab-pill">{counts.draft || 0}</span>
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === "in_review" ? "active" : ""}`}
                onClick={() => setActiveTab("in_review")}
              >
                <span>In Review</span>
                <span className="tab-pill">{counts.in_review || 0}</span>
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === "revision" ? "active" : ""}`}
                onClick={() => setActiveTab("revision")}
              >
                <span>Perlu Revisi</span>
                <span className="tab-pill" style={{ background: "#fef3c7", color: "#b45309" }}>{counts.revision || 0}</span>
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === "published" ? "active" : ""}`}
                onClick={() => setActiveTab("published")}
              >
                <span>Karya Saya (Terbit)</span>
                <span className="tab-pill">{counts.published || 0}</span>
              </button>
            </div>
          </div>

          {activeTab === "katalog" ? (
            /* Articles Grid (Katalog Publik) */
            loading ? (
              <div style={{ textAlign: "center", padding: "4rem 1rem", color: "var(--text-muted)" }}>
                Memuat karya publikasi...
              </div>
          ) : filteredArticles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 1.5rem", background: "#fff", borderRadius: "14px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📖</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "700", color: "#0f172a", marginBottom: "0.25rem" }}>
                Tidak ada artikel ditemukan
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                {searchQuery ? "Coba gunakan kata kunci pencarian yang lain." : "Belum ada tulisan terbit di kategori ini."}
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    border: "1px solid var(--border-subtle)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  {art.coverUrl && (
                    <div style={{ height: "180px", width: "100%", overflow: "hidden" }}>
                      <img src={art.coverUrl} alt={art.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}

                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "0.6875rem", fontWeight: "700", background: "rgba(37, 99, 235, 0.08)", color: "var(--primary-600)", padding: "0.2rem 0.6rem", borderRadius: "4px" }}>
                        {art.category || "Umum"}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {new Date(art.publishedAt || art.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.125rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "0.5rem", lineHeight: 1.4 }}>
                      {art.title}
                    </h3>

                    {art.lead && (
                      <p style={{ fontSize: "0.8125rem", color: "#64748b", lineHeight: 1.6, flex: 1, marginBottom: "1.25rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {art.lead}
                      </p>
                    )}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)", marginTop: "auto" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--primary-600)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "700" }}>
                          {art.author?.name ? art.author.name[0] : "P"}
                        </div>
                        <span style={{ fontSize: "0.8125rem", fontWeight: "600", color: "var(--text-main)" }}>
                          {art.author?.name || "Penulis Komunitas"}
                        </span>
                      </div>

                      <Link
                        href={`/${(art.category || "umum").toLowerCase().replace(/\s+/g, '-')}/${art.slug || art.id}`}
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: "700",
                          color: "var(--primary-600)",
                          textDecoration: "none",
                        }}
                      >
                        Baca Artikel →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )) : (
            /* Status Tulisan (Karya Sendiri) */
            <div className="article-list">
              {loading ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                  Memuat naskah tulisan...
                </div>
              ) : filteredMyArticles.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3.5rem 1.5rem", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📝</div>
                  <h4 style={{ fontWeight: "700", color: "var(--text-main)", marginBottom: "0.25rem" }}>
                    Belum ada naskah dengan status {activeTab === "published" ? "Terbit" : activeTab === "in_review" ? "In Review" : activeTab === "revision" ? "Perlu Revisi" : "Draf"}
                  </h4>
                  <p style={{ fontSize: "0.875rem", maxWidth: "420px", margin: "0 auto 1.25rem" }}>
                    Mulai tulis karya terbaik Anda sekarang dan terbitkan ke etalase literasi Kertas Kata Kabupaten Tangerang.
                  </p>
                  <Link href="/menulis" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>
                    Tulis Naskah Sekarang
                  </Link>
                </div>
              ) : (
                filteredMyArticles.map((art) => (
                  <div key={art.id} className="article-item" style={{ padding: "1.25rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "0.75rem", background: "#fff", borderRadius: "12px", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "rgba(37, 99, 235, 0.08)", color: "var(--primary-600)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                          {art.category ? art.category.substring(0, 2).toUpperCase() : "KK"}
                        </div>
                        <div>
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.25rem" }}>
                            <span className="nav-badge" style={{ textTransform: "capitalize", fontSize: "0.6875rem" }}>
                              {art.category || "Umum"}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              • {new Date(art.updatedAt || art.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
                            {art.title}
                          </h4>
                          <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                            {art.wordCount || 0} kata • {art.viewCount || 0} pembaca • Status:{" "}
                            <strong style={{ color: art.status === "published" ? "var(--success-600)" : art.status === "in_review" ? "var(--accent-600)" : art.status === "revision" ? "#d97706" : "var(--purple-600)" }}>
                              {art.status === "published" ? "Terbit" : art.status === "in_review" ? "Sedang Dikurasi" : art.status === "revision" ? "Perlu Revisi Admin" : "Draf"}
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {art.status === "published" ? (
                          <Link href={`/${(art.category || "umum").toLowerCase().replace(/\s+/g, '-')}/${art.slug || art.id}`} className="btn-secondary" style={{ padding: "0.45rem 0.85rem", fontSize: "0.8125rem", textDecoration: "none" }}>
                            Baca Karya
                          </Link>
                        ) : art.status === "revision" ? (
                          <Link href={`/menulis?id=${art.id}`} className="btn-primary" style={{ padding: "0.45rem 0.85rem", fontSize: "0.8125rem", textDecoration: "none", background: "#d97706", borderColor: "#d97706" }}>
                            ✏️ Revisi Naskah Ini
                          </Link>
                        ) : (
                          <Link href={`/menulis?id=${art.id}`} className="btn-primary" style={{ padding: "0.45rem 0.85rem", fontSize: "0.8125rem", textDecoration: "none" }}>
                            Edit Naskah
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Feedback / Review Notes from Curator */}
                    {art.reviews && art.reviews.length > 0 && (
                      <div style={{
                        padding: "0.85rem 1.1rem",
                        background: "#fffbe6",
                        border: "1.5px solid #ffe58f",
                        borderRadius: "10px",
                        fontSize: "0.8125rem",
                        color: "#722ed1"
                      }}>
                        <div style={{ fontWeight: "700", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.4rem", color: "#531dab" }}>
                          <span>💬 Catatan Umpan Balik Kurator Admin:</span>
                        </div>
                        <div style={{ color: "#1f1f1f", lineHeight: "1.5", fontSize: "0.85rem", background: "#ffffff", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #ffd591" }}>
                          {art.reviews[0].comment}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
