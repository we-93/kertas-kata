"use client";

import { useEffect, useState, useMemo } from "react";
import SidebarParticipant from "@/components/SidebarParticipant";
import TopHeader from "@/components/TopHeader";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/perpustakaan.css";

const MOCK_BOOKS = [
  {
    id: "buku-1",
    title: "Bunga Rampai: Mozaik Kisah Benteng Heritage Tangerang",
    author: "Komunitas Penulis KERTAS KATA",
    category: "sastra",
    categoryLabel: "Sastra & Antologi",
    isFree: true,
    pages: 184,
    isbn: "978-623-09-8812-4",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    desc: "Kumpulan cerita pendek dan esai naratif karya para pendidik dan pemuda Kabupaten Tangerang mengenai denyut sejarah dan akulturasi di tepi Cisadane.",
  },
  {
    id: "buku-2",
    title: "Panduan Literasi Kritis & Penulisan Opini Publik",
    author: "Tim Litbang Dispusipda Tangerang",
    category: "pendidikan",
    categoryLabel: "Pendidikan & Modul",
    isFree: true,
    pages: 142,
    isbn: "978-623-09-8813-1",
    coverUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80",
    desc: "Buku rujukan utama penulisan opini bermutu, analisis fakta, dan teknik penulisan artikel ilmiah populer bagi masyarakat.",
  },
  {
    id: "buku-3",
    title: "Menelusuri Jejak Pesisir Utara: Riwayat Nelayan Mauk & Kronjo",
    author: "Dian Pratama, M.Hum.",
    category: "sejarah",
    categoryLabel: "Sejarah & Riset",
    isFree: false,
    price: 35000,
    pages: 210,
    isbn: "978-623-09-8814-8",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80",
    desc: "Riset etnografi mendalam mengenai sejarah permukiman maritim, pelabuhan dagang kuno, dan kearifan lokal warga pesisir utara Tangerang.",
  },
  {
    id: "buku-4",
    title: "Kiat Jurnalistik Warga: Meliput dari Balai Desa",
    author: "Redaksi Kertas Kata",
    category: "jurnalistik",
    categoryLabel: "Jurnalistik & Opini",
    isFree: true,
    pages: 98,
    isbn: "978-623-09-8815-5",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80",
    desc: "Buku saku praktis bagi warga yang ingin mewartakan potensi desa, layanan publik, dan kabar inspiratif seputar lingkungannya.",
  },
];

export default function PerpustakaanPage() {
  const [books, setBooks] = useState(MOCK_BOOKS);
  const [filterType, setFilterType] = useState("all"); // all, free, premium, bookmark
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await api.library.getEbooks();
        if (res && res.success && res.data && res.data.length > 0) {
          setBooks(res.data);
        }
      } catch (err) {
        // Fallback to mock books
      }
    }
    loadBooks();
  }, []);

  const toggleBookmark = (id) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter((b) => b !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      if (filterType === "free" && !b.isFree) return false;
      if (filterType === "premium" && b.isFree) return false;
      if (filterType === "bookmark" && !bookmarks.includes(b.id)) return false;
      if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
      return true;
    });
  }, [books, filterType, categoryFilter, bookmarks]);

  return (
    <div className="app-container">
      <SidebarParticipant activePath="/perpustakaan" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box" }}>
          {/* Hero Banner */}
          <section className="perpustakaan-hero-banner" style={{ marginBottom: "2rem" }}>
            <div className="perpustakaan-hero-content">
              <div className="perpustakaan-hero-text">
                <h1>Perpustakaan Digital KERTAS KATA</h1>
                <p>
                  Akses koleksi buku digital resmi, antologi karya pilihan, modul literasi, dan materi pengayaan literasi bermutu tinggi untuk menumbuhkan budaya membaca masyarakat Kabupaten Tangerang.
                </p>
              </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="perpustakaan-stats-row">
              <div className="lib-stat-card">
                <div className="lib-stat-val">{books.length}</div>
                <div className="lib-stat-label">Total Koleksi Ebook</div>
              </div>
              <div className="lib-stat-card">
                <div className="lib-stat-val">{books.filter((b) => b.isFree).length}</div>
                <div className="lib-stat-label">Akses Gratis (Public)</div>
              </div>
              <div className="lib-stat-card">
                <div className="lib-stat-val">{books.filter((b) => !b.isFree).length}</div>
                <div className="lib-stat-label">Koleksi Eksklusif</div>
              </div>
              <div className="lib-stat-card">
                <div className="lib-stat-val">{bookmarks.length}</div>
                <div className="lib-stat-label">Rak Buku Saya</div>
              </div>
            </div>
          </section>

          {/* Filter Bar */}
          <section className="perpustakaan-filter-bar" style={{ marginBottom: "1.5rem" }}>
            <div className="lib-filter-tabs">
              <button className={`lib-filter-pill ${filterType === "all" ? "active" : ""}`} onClick={() => setFilterType("all")}>
                Semua Koleksi ({books.length})
              </button>
              <button className={`lib-filter-pill ${filterType === "free" ? "active" : ""}`} onClick={() => setFilterType("free")}>
                Buku Gratis ({books.filter((b) => b.isFree).length})
              </button>
              <button className={`lib-filter-pill ${filterType === "premium" ? "active" : ""}`} onClick={() => setFilterType("premium")}>
                Buku Premium ({books.filter((b) => !b.isFree).length})
              </button>
              <button className={`lib-filter-pill ${filterType === "bookmark" ? "active" : ""}`} onClick={() => setFilterType("bookmark")}>
                Rak Buku Saya ({bookmarks.length})
              </button>
            </div>

            <div className="lib-filter-actions">
              <select
                className="lib-category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter Berdasarkan Kategori"
              >
                <option value="all">Semua Kategori</option>
                <option value="pendidikan">Pendidikan &amp; Modul</option>
                <option value="sastra">Sastra &amp; Antologi</option>
                <option value="seni">Seni &amp; Budaya</option>
                <option value="jurnalistik">Jurnalistik &amp; Opini</option>
                <option value="sejarah">Sejarah &amp; Riset</option>
              </select>
            </div>
          </section>

          {/* Ebooks Catalog Grid */}
          <section className="ebooks-catalog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {filteredBooks.map((book) => (
              <div
                key={book.id}
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
                <div style={{ height: "200px", width: "100%", overflow: "hidden", position: "relative" }}>
                  <img src={book.coverUrl} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: book.isFree ? "rgba(16, 185, 129, 0.9)" : "rgba(245, 158, 11, 0.9)",
                      color: "#fff",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {book.isFree ? "GRATIS" : "PREMIUM"}
                  </span>
                </div>

                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <span style={{ fontSize: "0.6875rem", color: "var(--primary-600)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    {book.categoryLabel || book.category}
                  </span>
                  <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.35rem", lineHeight: 1.4 }}>
                    {book.title}
                  </h3>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.75rem" }}>
                    Oleh {book.author} &bull; {book.pages} hlm
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "#475569", lineHeight: 1.5, flex: 1, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {book.desc}
                  </p>

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                    {book.accessType === "premium" || !book.isFree ? (
                      <a
                        href={book.whatsappUrl || `https://wa.me/?text=${encodeURIComponent(`Halo Admin Kertas Kata, saya tertarik untuk mengunduh e-book: ${book.title}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{
                          flex: 1,
                          padding: "0.55rem",
                          fontSize: "0.8125rem",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          color: "#fff",
                          background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                          textDecoration: "none",
                          textAlign: "center",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.35rem",
                          fontWeight: 700,
                        }}
                      >
                        <span>Unduh via WhatsApp</span>
                        <span>💬</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="btn-primary"
                        style={{
                          flex: 1,
                          padding: "0.55rem",
                          fontSize: "0.8125rem",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          color: "#fff",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.35rem",
                          fontWeight: 700,
                        }}
                        onClick={() => {
                          if (book.downloadUrl) {
                            window.open(book.downloadUrl, "_blank");
                          } else {
                            alert("Berkas unduhan untuk buku ini sedang disiapkan oleh Admin.");
                          }
                        }}
                      >
                        <span>Unduh E-Book</span>
                        <span>📥</span>
                      </button>
                    )}

                    <button
                      type="button"
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                        background: bookmarks.includes(book.id) ? "#eff6ff" : "#fff",
                        color: bookmarks.includes(book.id) ? "var(--primary-600)" : "#64748b",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleBookmark(book.id)}
                      title="Simpan ke Rak Buku"
                    >
                      {bookmarks.includes(book.id) ? "🔖" : "🤍"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
