"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PublicNavbar from "@/components/PublicNavbar";
import api from "@/lib/api";
import "@/css/baca-artikel.css";

export default function BacaArtikelPage() {
  const { user } = useAuth();
  const params = useParams();
  const slug = params ? params.slug : null;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light"); // light, sepia, dark
  const [font, setFont] = useState("georgia"); // changed to georgia
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
    <div className={`theme-${theme} font-${font} text-size-${fontSize}`} style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "var(--reader-font-family)" }}>
      <PublicNavbar />

      {/* Main Article Content 2 Columns */}
      <main className="article-split-layout">
        
        {/* Kolom Kiri: Artikel 75% */}
        <div className="article-left-content">
          
          <header className="article-header">
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ background: "#dbeafe", color: "#1e40af", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
              {article.category || "Umum"}
            </span>
          </div>

          <h1 className="article-title" style={{ lineHeight: 1.25 }}>{article.title}</h1>

          {article.lead && (
            <p className="article-lead">{article.lead}</p>
          )}

          {/* Author Card Side-by-Side In Header */}
          <div className="article-author-card" style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 700, flexShrink: 0, overflow: "hidden" }}>
              {article.user?.photoUrl ? (
                <img src={article.user.photoUrl} alt={article.user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                article.user?.name ? article.user.name[0] : "P"
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.125rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {article.user?.name || "Penulis Komunitas"}
                <span style={{ fontSize: "0.75rem", background: "#f1f5f9", padding: "0.15rem 0.5rem", borderRadius: "4px", color: "#64748b", fontWeight: 600 }}>
                  {article.user?.originRegion || "Kabupaten Tangerang"}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>
                Diterbitkan {new Date(article.publishedAt || article.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} &bull; Waktu Baca {article.wordCount ? Math.ceil(article.wordCount / 200) : 1} menit
              </div>
            </div>
          </div>
          
          <div style={{ background: "rgba(59, 130, 246, 0.1)", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.75rem", color: "#1e3a8a", marginTop: "1rem" }}>
            Tulisan dari {article.user?.name || "Penulis Komunitas"}, seluruh isi menjadi tanggung jawab penulis dan tidak mewakili pandangan resmi tim KERTAS KATA.
          </div>
        </header>

        {article.coverUrl && (
          <div style={{ margin: "2rem 0", borderRadius: "14px", overflow: "hidden", maxHeight: "420px" }}>
            <img src={article.coverUrl} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        {article.coverCaption && (
          <div style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "-1.5rem", marginBottom: "2rem" }}>
            {article.coverCaption}
          </div>
        )}

        {/* Article Body */}
        <div
          className="article-body-content"
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2.5rem", padding: "1.5rem", background: "rgba(0,0,0,0.02)", borderRadius: "12px", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748b", fontSize: "0.875rem", fontWeight: 600 }}>
              <span>👁️</span>
              <span>{article.viewCount || 0} dilihat</span>
            </div>
          </div>

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
            <span>Bagikan</span>
          </button>
        </div>

        {/* Kolom Diskusi Komentar */}
        <div style={{ marginTop: "3rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "2rem", marginBottom: "4rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.5rem", fontFamily: "var(--font-sans)" }}>Diskusi & Komentar</h3>
          {user ? (
            <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
                  {user.name ? user.name[0] : "U"}
                </div>
                <textarea
                  placeholder="Tambahkan komentar Anda..."
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "0.875rem", resize: "vertical", minHeight: "80px", fontFamily: "var(--font-sans)" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="button" style={{ background: "#2563eb", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: "8px", border: "none", fontWeight: 600, cursor: "pointer" }}>Kirim Komentar</button>
              </div>
            </div>
          ) : (
            <div style={{ background: "#f1f5f9", padding: "1.5rem", borderRadius: "12px", textAlign: "center", fontFamily: "var(--font-sans)" }}>
              <p style={{ color: "#475569", marginBottom: "1rem" }}>Silakan masuk (login) untuk ikut berdiskusi dan memberikan komentar pada tulisan ini.</p>
              <Link href="/login" style={{ display: "inline-block", background: "#2563eb", color: "#fff", padding: "0.5rem 1.25rem", borderRadius: "8px", textDecoration: "none", fontWeight: 600 }}>Masuk / Daftar</Link>
            </div>
          )}
        </div>



        </div>

        {/* Kolom Kanan: 25% (Profil Penulis & Artikel Penulis) */}
        <aside className="article-right-sidebar">
          
          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1.25rem", color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", display: "inline-block" }}>
              Tentang Penulis
            </h4>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1rem" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 700, overflow: "hidden" }}>
                {article.user?.photoUrl ? (
                  <img src={article.user.photoUrl} alt={article.user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  article.user?.name ? article.user.name[0] : "P"
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ fontWeight: 800, fontSize: "1.125rem", color: "#0f172a", lineHeight: 1 }}>
                  {article.user?.name || "Penulis Komunitas"}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#475569", fontWeight: 600, lineHeight: 1 }}>
                  {article.user?.originRegion || "Kabupaten Tangerang"}
                </div>
              </div>
              <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                {article.user?.bio || "Penulis aktif di KERTAS KATA Kabupaten Tangerang."}
              </p>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", width: "100%", marginTop: "0.5rem" }}>
                <button style={{ flex: "1 1 200px", background: "transparent", border: "1px solid #cbd5e1", padding: "0.6rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, color: "#475569", cursor: "pointer" }}>
                  Ikuti Profil
                </button>
                <Link href={`/penulis/${article.user?.username || 'raden'}`} style={{ flex: "1 1 200px", background: "#2563eb", border: "1px solid #2563eb", padding: "0.6rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, color: "#fff", cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  Kunjungi Profil
                </Link>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1.25rem", color: "#0f172a", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem", display: "inline-block" }}>
              Karya {article.user?.name || "Penulis"} Lainnya
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {article.authorArticles && article.authorArticles.length > 0 ? (
                article.authorArticles.map(art => (
                  <Link key={art.id} href={`/${(art.category || "umum").toLowerCase().replace(/\s+/g, '-')}/${art.slug || art.id}`} style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <h5 style={{ fontSize: "0.875rem", fontWeight: 700, margin: 0, lineHeight: 1.4, color: "#0f172a" }}>{art.title}</h5>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{new Date(art.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </Link>
                ))
              ) : (
                <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>Belum ada karya lain.</div>
              )}
            </div>
          </div>

        </aside>

        {/* 5 Artikel Terbaru Global */}
        <div className="article-bottom-full">
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.5rem", fontFamily: "var(--font-sans)" }}>Artikel Terbaru</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {article.latestArticles && article.latestArticles.map(art => (
              <Link key={art.id} href={`/${(art.category || "umum").toLowerCase().replace(/\s+/g, '-')}/${art.slug || art.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <img src={art.coverUrl || "/placeholder.jpg"} alt={art.title} style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
                  <span style={{ fontSize: "0.6875rem", color: "#2563eb", fontWeight: 700, textTransform: "uppercase" }}>{art.category}</span>
                  <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, lineHeight: 1.4, margin: 0, fontFamily: "var(--font-sans)" }}>{art.title}</h4>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Oleh {art.user?.name || "Penulis"}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
