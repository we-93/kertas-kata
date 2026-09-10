"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import "@/css/baca-artikel.css";

export default function BacaArtikelPage() {
  const params = useParams();
  const slug = params ? params.slug : null;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light"); // light, sepia, dark
  const [font, setFont] = useState("sans"); // sans, serif
  const [fontSize, setFontSize] = useState("md"); // sm, md, lg
  const [showPref, setShowPref] = useState(false);
  const [likesCount, setLikesCount] = useState(12);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        let res = await api.articles.getBySlug(slug);
        if (!res || !res.success || !res.data) {
          // fallback to getById
          res = await api.articles.getById(slug);
        }
        if (res && res.success && res.data) {
          setArticle(res.data);
        }
      } catch (err) {
        console.warn("Gagal memuat artikel:", err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount(likesCount + 1);
      setHasLiked(true);
    } else {
      setLikesCount(likesCount - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title || "Artikel KERTAS KATA",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Tautan artikel telah disalin ke papan klip!");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", color: "#64748b" }}>
        Memuat naskah karya...
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", gap: "1rem" }}>
        <h2>Naskah Tidak Ditemukan</h2>
        <p style={{ color: "#64748b" }}>Artikel yang Anda cari tidak tersedia atau belum diterbitkan.</p>
        <Link href="/publikasi" style={{ padding: "0.65rem 1.25rem", background: "#2563eb", color: "#fff", borderRadius: "8px", textDecoration: "none" }}>
          Kembali ke Publikasi
        </Link>
      </div>
    );
  }

  return (
    <div className={`theme-${theme} font-${font} text-size-${fontSize}`} style={{ minHeight: "100vh" }}>
      {/* Sticky Reader Topbar */}
      <header className="reader-topbar">
        <div className="reader-topbar-inner">
          <Link href="/publikasi" className="btn-back-home">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>KERTAS KATA</span>
          </Link>

          <div className="reader-topbar-title">
            {article.title}
          </div>

          <div className="reader-topbar-actions">
            <button
              type="button"
              className="btn-reader-tool"
              onClick={() => setShowPref(!showPref)}
              title="Kenyamanan Membaca"
            >
              <span>Aa</span>
              <span>Tampilan</span>
            </button>
            <Link href="/publikasi" className="btn-reader-tool" style={{ textDecoration: "none" }}>
              <span>🔍 Eksplorasi</span>
            </Link>
          </div>
        </div>

        {/* Preferences Popover */}
        {showPref && (
          <div className="preferences-popover" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <div className="pref-label">Mode Suasana Baca</div>
              <div className="pref-btn-group">
                <button type="button" className={`pref-choice-btn ${theme === "light" ? "active" : ""}`} onClick={() => setTheme("light")}>Terang</button>
                <button type="button" className={`pref-choice-btn ${theme === "sepia" ? "active" : ""}`} onClick={() => setTheme("sepia")}>Sepia</button>
                <button type="button" className={`pref-choice-btn ${theme === "dark" ? "active" : ""}`} onClick={() => setTheme("dark")}>Gelap</button>
              </div>
            </div>

            <div>
              <div className="pref-label">Jenis Tipografi</div>
              <div className="pref-btn-group">
                <button type="button" className={`pref-choice-btn ${font === "sans" ? "active" : ""}`} onClick={() => setFont("sans")}>Modern Sans</button>
                <button type="button" className={`pref-choice-btn ${font === "serif" ? "active" : ""}`} onClick={() => setFont("serif")}>Klasik Serif</button>
              </div>
            </div>

            <div>
              <div className="pref-label">Ukuran Teks</div>
              <div className="pref-btn-group">
                <button type="button" className={`pref-choice-btn ${fontSize === "sm" ? "active" : ""}`} onClick={() => setFontSize("sm")}>A- (16px)</button>
                <button type="button" className={`pref-choice-btn ${fontSize === "md" ? "active" : ""}`} onClick={() => setFontSize("md")}>A (18px)</button>
                <button type="button" className={`pref-choice-btn ${fontSize === "lg" ? "active" : ""}`} onClick={() => setFontSize("lg")}>A+ (21px)</button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Article Content */}
      <main className="article-main-container">
        <nav className="article-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link>
          <span>/</span>
          <Link href="/publikasi">Publikasi</Link>
          <span>/</span>
          <span>{article.category || "Umum"}</span>
        </nav>

        <header className="article-header">
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ background: "#dbeafe", color: "#1e40af", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
              {article.category || "Umum"}
            </span>
          </div>

          <h1 className="article-title">{article.title}</h1>

          {article.lead && (
            <p className="article-lead">{article.lead}</p>
          )}

          {/* Author Card */}
          <div className="article-author-card">
            <div className="author-avatar-wrap">
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.125rem", fontWeight: 700 }}>
                {article.author?.name ? article.author.name[0] : "P"}
              </div>
            </div>
            <div className="author-meta">
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)" }}>
                {article.author?.name || "Penulis Komunitas"}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                {article.author?.originRegion || "Kabupaten Tangerang"} &bull; Diterbitkan {new Date(article.publishedAt || article.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} &bull; {article.wordCount || 0} kata
              </div>
            </div>
          </div>
        </header>

        {article.coverUrl && (
          <div style={{ margin: "2rem 0", borderRadius: "14px", overflow: "hidden", maxHeight: "420px" }}>
            <img src={article.coverUrl} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        {/* Article Body */}
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: article.content || "<p>Naskah tidak memiliki teks.</p>" }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
            {article.tags.map((t, idx) => (
              <span key={idx} style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--primary-700)", padding: "0.25rem 0.75rem", borderRadius: "6px", fontSize: "0.8125rem", fontWeight: 600 }}>
                #{typeof t === "string" ? t : t.name}
              </span>
            ))}
          </div>
        )}

        {/* Appreciation & Share bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2.5rem", padding: "1.5rem", background: "rgba(0,0,0,0.02)", borderRadius: "12px" }}>
          <button
            type="button"
            onClick={handleLike}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              background: hasLiked ? "#fee2e2" : "#fff",
              color: hasLiked ? "#dc2626" : "#475569",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <span>{hasLiked ? "❤️" : "🤍"}</span>
            <span>Apresiasi ({likesCount})</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              background: "#fff",
              color: "#475569",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <span>🔗</span>
            <span>Bagikan Karya</span>
          </button>
        </div>
      </main>
    </div>
  );
}
