"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import SidebarParticipant from "@/components/SidebarParticipant";
import TopHeader from "@/components/TopHeader";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/profil.css";

export default function ProfilPage() {
  const { user, ensureAuth } = useAuth();
  const [articles, setArticles] = useState([]);
  const [counts, setCounts] = useState({ published: 0, in_review: 0, draft: 0 });
  const [activeCategory, setActiveCategory] = useState("all");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    async function loadData() {
      await ensureAuth("participant");
      try {
        const res = await api.articles.getMy();
        if (res && res.success && res.data) {
          const { articles: myArticles, counts: myCounts } = res.data;
          if (myArticles) {
            setArticles(myArticles.filter((a) => a.status === "published"));
          }
          if (myCounts) {
            setCounts(myCounts);
          }
        }
      } catch (err) {
        console.warn("Gagal memuat artikel profil:", err.message);
      }
    }
    loadData();
  }, [ensureAuth]);

  // Dynamic portfolio from database (clean state when no published articles)
  const displayArticles = useMemo(() => {
    return articles.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.category || "Sejarah",
      lead: a.lead || "Dokumentasi dan esai literasi masyarakat Kabupaten Tangerang.",
      date: new Date(a.publishedAt || a.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      views: a.viewCount || 0,
      comments: 0,
      coverUrl: a.coverUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
      slug: a.slug || a.id,
    }));
  }, [articles]);

  const filteredPortfolio = useMemo(() => {
    if (activeCategory === "all") return displayArticles;
    return displayArticles.filter((a) => a.category.toLowerCase() === activeCategory.toLowerCase());
  }, [displayArticles, activeCategory]);

  const totalViews = useMemo(() => {
    return displayArticles.reduce((acc, it) => acc + it.views, 0);
  }, [displayArticles]);

  const handleShareProfile = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    let shared = false;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Profil Penulis ${user?.name || "Raden"} - KERTAS KATA`,
          text: `Lihat portofolio karya literasi resmi ${user?.name || "Raden"} di KERTAS KATA Kabupaten Tangerang.`,
          url: url,
        });
        shared = true;
      } catch (e) {
        // Fallback ke salin tautan jika dibatalkan
      }
    }

    if (!shared) {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        } else {
          const ta = document.createElement("textarea");
          ta.value = url;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        setCopiedShare(true);
        setToastMessage("Tautan profil penulis berhasil disalin ke papan klip!");
        setTimeout(() => setCopiedShare(false), 3000);
        setTimeout(() => setToastMessage(""), 3500);
      } catch (err) {
        setToastMessage("Tautan: " + url);
        setTimeout(() => setToastMessage(""), 4000);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AuthGuard requiredRole="participant">
      <div className="app-container">
      <SidebarParticipant activePath="/profil" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box" }}>
          {/* ====================================================
               HERO OVERVIEW BANNER (PR-01)
               ==================================================== */}
          <section className="profil-hero-banner">
            <div className="profil-hero-content">
              {/* Avatar Showcase */}
              <div className="profil-avatar-box">
                <img
                  className="profil-avatar-img"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                  alt={`Foto Profil ${user?.name || "Raden"}`}
                />
                <div className="profil-verified-badge" title="Akun Terverifikasi Sekolah Literasi">✓</div>
              </div>

              {/* Identity Details */}
              <div className="profil-identity-info">
                <div className="profil-name-row">
                  <h1>{user?.name || "Raden"}</h1>
                </div>

                <div className="profil-meta-tags">
                  <div className="profil-meta-item">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{user?.originRegion || "Kecamatan Tigaraksa, Kab. Tangerang"}</span>
                  </div>
                  <div className="profil-meta-item">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Spesialisasi: Sejarah Lokal &amp; Opini Kebijakan Publik</span>
                  </div>
                  <div className="profil-meta-item">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Bergabung: Agustus 2026</span>
                  </div>
                </div>

                <p className="profil-bio-text">
                  Pendidik dan pegiat literasi komunitas di Tigaraksa. Gemar meneliti sejarah akulturasi peranakan pesisir Tangerang dan menulis esai kebijakan tata ruang ramah anak berkelanjutan.
                </p>

                {/* Action Buttons */}
                <div className="profil-action-buttons">
                  <Link href="/pengaturan" className="btn-profil-action btn-profil-edit">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    <span>Pengaturan Profil</span>
                  </Link>

                  <button
                    type="button"
                    className="btn-profil-action btn-profil-pdf"
                    onClick={() => setShowPdfModal(true)}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Unduh Portofolio (PDF)</span>
                  </button>

                  <button
                    type="button"
                    className="btn-profil-action btn-profil-share"
                    onClick={handleShareProfile}
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Bagikan Profil</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ====================================================
               METRIC STATS COUNTERS (PR-04)
               ==================================================== */}
          <section className="profil-stats-grid">
            <div className="profil-stat-card">
              <div className="stat-icon-wrapper emerald">✓</div>
              <div className="stat-content">
                <span className="stat-val-number">{displayArticles.length}</span>
                <span className="stat-val-desc">Karya Terbit (Tayang)</span>
              </div>
            </div>

            <div className="profil-stat-card">
              <div className="stat-icon-wrapper blue">👁</div>
              <div className="stat-content">
                <span className="stat-val-number">{totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + "K" : totalViews}</span>
                <span className="stat-val-desc">Total Pembaca (Views)</span>
              </div>
            </div>

            <div className="profil-stat-card">
              <div className="stat-icon-wrapper amber">💬</div>
              <div className="stat-content">
                <span className="stat-val-number">45</span>
                <span className="stat-val-desc">Diskusi/Komentar</span>
              </div>
            </div>

            <div className="profil-stat-card">
              <div className="stat-icon-wrapper purple">❤️</div>
              <div className="stat-content">
                <span className="stat-val-number">142</span>
                <span className="stat-val-desc">Apresiasi/Suka</span>
              </div>
            </div>
          </section>

          {/* ====================================================
               MAIN 2-COLUMN RESPONSIVE LAYOUT
               ==================================================== */}
          <div className="profil-main-layout">
            {/* KOLOM KIRI: LENCANA, SERTIFIKASI & INFO AKUN */}
            <div className="profil-left-col">
              {/* Card 1: Badges & Prestasi */}
              <div className="profil-card">
                <div className="profil-card-header">
                  <h3>
                    <span>🏆</span>
                    <span>Lencana &amp; Prestasi</span>
                  </h3>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#059669", background: "#ecfdf5", padding: "0.25rem 0.625rem", borderRadius: "9999px" }}>
                    4 Diraih
                  </span>
                </div>

                <div className="badges-list">
                  <div className="badge-item-row">
                    <div className="badge-icon-bubble">🏆</div>
                    <div className="badge-info-meta">
                      <div className="badge-name-title">
                        <span>Penulis Produktif</span>
                        <span className="badge-tag-status earned">✓ Diraih</span>
                      </div>
                      <div className="badge-desc-text">Menerbitkan minimal 3 karya lolos kurasi resmi redaksi KERTAS KATA.</div>
                      <div style={{ fontSize: "0.6875rem", color: "#94a3b8", marginTop: "0.25rem" }}>Diperoleh: 24 Agt 2026</div>
                    </div>
                  </div>

                  <div className="badge-item-row">
                    <div className="badge-icon-bubble">📖</div>
                    <div className="badge-info-meta">
                      <div className="badge-name-title">
                        <span>Top Reader</span>
                        <span className="badge-tag-status earned">✓ Diraih</span>
                      </div>
                      <div className="badge-desc-text">Menyelesaikan 4 modul pembelajaran literasi dan lulus kuis evaluasi.</div>
                      <div style={{ fontSize: "0.6875rem", color: "#94a3b8", marginTop: "0.25rem" }}>Diperoleh: 18 Agt 2026</div>
                    </div>
                  </div>

                  <div className="badge-item-row">
                    <div className="badge-icon-bubble">💬</div>
                    <div className="badge-info-meta">
                      <div className="badge-name-title">
                        <span>Kritikus Aktif</span>
                        <span className="badge-tag-status earned">✓ Diraih</span>
                      </div>
                      <div className="badge-desc-text">Memberikan 10+ ulasan dan tanggapan berbobot di forum komunitas.</div>
                      <div style={{ fontSize: "0.6875rem", color: "#94a3b8", marginTop: "0.25rem" }}>Diperoleh: 01 Sep 2026</div>
                    </div>
                  </div>

                  <div className="badge-item-row">
                    <div className="badge-icon-bubble">🌟</div>
                    <div className="badge-info-meta">
                      <div className="badge-name-title">
                        <span>Riset Sejarah Tangerang</span>
                        <span className="badge-tag-status earned">✓ Diraih</span>
                      </div>
                      <div className="badge-desc-text">Mendapatkan skor 95 pada Modul 3: Riset Budaya &amp; Sejarah Lokal.</div>
                      <div style={{ fontSize: "0.6875rem", color: "#94a3b8", marginTop: "0.25rem" }}>Diperoleh: 28 Agt 2026</div>
                    </div>
                  </div>

                  <div className="badge-item-row locked">
                    <div className="badge-icon-bubble">🎓</div>
                    <div className="badge-info-meta">
                      <div className="badge-name-title">
                        <span>Lulusan Terbaik 32 JP</span>
                        <span className="badge-tag-status progress">5/8 Modul</span>
                      </div>
                      <div className="badge-desc-text">Selesaikan seluruh 8 Modul Pembelajaran dengan nilai rata-rata min. 80.</div>
                      <div className="badge-progress-track">
                        <div className="badge-progress-fill" style={{ width: "62.5%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="badge-item-row locked">
                    <div className="badge-icon-bubble">📚</div>
                    <div className="badge-info-meta">
                      <div className="badge-name-title">
                        <span>Cetak Mandiri Perdana</span>
                        <span className="badge-tag-status progress">{displayArticles.length}/10 Naskah</span>
                      </div>
                      <div className="badge-desc-text">Terbitkan 10 tulisan resmi untuk membuka hak cetak buku mandiri ber-ISBN.</div>
                      <div className="badge-progress-track">
                        <div className="badge-progress-fill" style={{ width: `${Math.min(100, (displayArticles.length / 10) * 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: E-Sertifikat 32 JP Pelatihan */}
              <div className="profil-card">
                <div className="profil-card-header">
                  <h3>
                    <span>📜</span>
                    <span>Sertifikat Pelatihan</span>
                  </h3>
                </div>

                <div className="certificate-preview-card">
                  <div className="cert-header">
                    <span className="cert-title">E-Sertifikat 32 JP KERTAS KATA</span>
                    <span className="cert-stamp">Dalam Progres</span>
                  </div>
                  <div className="cert-body-note">
                    Sertifikat resmi Gerakan Tangerang Gemilang Membaca &amp; Menulis bersertifikasi Komunitas.
                  </div>
                  <div className="cert-footer-meta">
                    <span>Syarat: 8 Modul + 3 Artikel Terbit</span>
                    <span style={{ fontWeight: 700, color: "#2563eb" }}>Progress: 65%</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Informasi Anggota */}
              <div className="profil-card">
                <div className="profil-card-header">
                  <h3>
                    <span>ℹ️</span>
                    <span>Informasi Anggota</span>
                  </h3>
                </div>

                <div className="info-list-group">
                  <div className="info-list-item">
                    <span className="info-label">Email Terdaftar</span>
                    <span className="info-val">{user?.email || "raden@gmail.com"}</span>
                  </div>
                  <div className="info-list-item">
                    <span className="info-label">Status Akun</span>
                    <span className="info-val" style={{ color: "#059669" }}>● Terverifikasi Aktif</span>
                  </div>
                  <div className="info-list-item">
                    <span className="info-label">Peran Pengguna</span>
                    <span className="info-val" style={{ textTransform: "capitalize" }}>{user?.role || "Anggota"} Komunitas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN: PORTOFOLIO KARYA TERBIT & AKTIVITAS */}
            <div className="profil-right-col">
              {/* Card Portofolio Karya Terbit */}
              <div className="profil-card">
                <div className="profil-card-header">
                  <div>
                    <h3>
                      <span>📚</span>
                      <span>Portofolio Karya Resmi</span>
                    </h3>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      Daftar karya yang telah lolos uji kurasi Dewan Redaksi Kabupaten Tangerang dan tayang publik.
                    </div>
                  </div>
                </div>

                {/* Category Filter Buttons */}
                <div className="portfolio-filter-row">
                  <div className="portfolio-tabs">
                    <button
                      type="button"
                      className={`portfolio-tab-btn ${activeCategory === "all" ? "active" : ""}`}
                      onClick={() => setActiveCategory("all")}
                    >
                      Semua Karya ({displayArticles.length})
                    </button>
                    <button
                      type="button"
                      className={`portfolio-tab-btn ${activeCategory === "Sejarah" ? "active" : ""}`}
                      onClick={() => setActiveCategory("Sejarah")}
                    >
                      Sejarah
                    </button>
                    <button
                      type="button"
                      className={`portfolio-tab-btn ${activeCategory === "Opini" ? "active" : ""}`}
                      onClick={() => setActiveCategory("Opini")}
                    >
                      Opini
                    </button>
                    <button
                      type="button"
                      className={`portfolio-tab-btn ${activeCategory === "Pemerintahan" ? "active" : ""}`}
                      onClick={() => setActiveCategory("Pemerintahan")}
                    >
                      Pemerintahan
                    </button>
                  </div>
                  <Link href="/publikasi" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary-600)", textDecoration: "none" }}>
                    Lihat Katalog Publikasi →
                  </Link>
                </div>

                {/* Portfolio Grid */}
                {filteredPortfolio.length > 0 ? (
                  <div className="portfolio-articles-grid">
                    {filteredPortfolio.map((art) => (
                      <article key={art.id} className="port-card">
                        <div className="port-cover-wrapper">
                          <img className="port-cover-img" src={art.coverUrl} alt={art.title} />
                          <span className="port-category-tag">{art.category}</span>
                        </div>
                        <div className="port-card-body">
                          <h4 className="port-card-title">{art.title}</h4>
                          <p className="port-card-excerpt">{art.lead}</p>
                          <div className="port-card-footer">
                            <span>Rilis: {art.date}</span>
                            <div className="port-meta-metrics">
                              <span>👁 {art.views}</span>
                              <span>💬 {art.comments}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: "center",
                    padding: "3.5rem 1.5rem",
                    background: "#f8fafc",
                    borderRadius: "14px",
                    border: "1.5px dashed #cbd5e1",
                    margin: "1rem 0"
                  }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>✍️</div>
                    <h4 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.35rem" }}>
                      Belum Ada Naskah yang Diterbitkan
                    </h4>
                    <p style={{ fontSize: "0.8125rem", color: "#64748b", maxWidth: "420px", margin: "0 auto 1.25rem", lineHeight: 1.6 }}>
                      Koleksi portofolio resmi Anda masih bersih. Mulai tulis artikel opini, riset, atau sastra pertama Anda di Studio Menulis untuk dikurasi redaksi.
                    </p>
                    <Link
                      href="/menulis"
                      className="btn-profil-action"
                      style={{
                        background: "#2563eb",
                        color: "#ffffff",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.65rem 1.25rem"
                      }}
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Mulai Menulis Naskah Pertama</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Card Riwayat Aktivitas & Kontribusi Komunitas */}
              <div className="profil-card">
                <div className="profil-card-header">
                  <h3>
                    <span>⏱️</span>
                    <span>Jejak Aktivitas &amp; Literasi Terkini</span>
                  </h3>
                </div>

                <div className="timeline-list">
                  <div className="timeline-item">
                    <div className="timeline-icon-dot">📝</div>
                    <div className="timeline-item-content">
                      <div className="timeline-item-header">
                        <span className="timeline-action-title">Menyelesaikan Draf Naskah Cerpen</span>
                        <span className="timeline-time-text">15 menit lalu</span>
                      </div>
                      <div className="timeline-desc">
                        Menyimpan draf naskah <em>&quot;Antologi Kisah Pendek: Kabut Senja di Dermaga Tanjung Pasir&quot;</em> (1.450 kata).
                      </div>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-icon-dot">💬</div>
                    <div className="timeline-item-content">
                      <div className="timeline-item-header">
                        <span className="timeline-action-title">Menerima Catatan Kurasi dari Mentor Dian Pratama</span>
                        <span className="timeline-time-text">Kemarin, 14:35</span>
                      </div>
                      <div className="timeline-desc">
                        Ulasan kurator untuk naskah <em>&quot;Menyusuri Jejak Klenteng Boen Tek Bio: Mozaik Harmoni Pesisir&quot;</em> (status: Sedang Kurasi).
                      </div>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-icon-dot">🎓</div>
                    <div className="timeline-item-content">
                      <div className="timeline-item-header">
                        <span className="timeline-action-title">Menyelesaikan Modul 4 E-Learning</span>
                        <span className="timeline-time-text">3 hari lalu</span>
                      </div>
                      <div className="timeline-desc">
                        Lulus kuis evaluasi materi <em>&quot;Menulis Opini Publik &amp; Esai Kebijakan&quot;</em> dengan skor 80.
                      </div>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-icon-dot">🏆</div>
                    <div className="timeline-item-content">
                      <div className="timeline-item-header">
                        <span className="timeline-action-title">Meraih Lencana &quot;Penulis Produktif&quot;</span>
                        <span className="timeline-time-text">24 Agt 2026</span>
                      </div>
                      <div className="timeline-desc">
                        Dianugerahi lencana kehormatan dewan redaksi setelah artikel ke-3 resmi tayang dan diverifikasi publik.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ====================================================
           MODAL EXPORT PORTOFOLIO KE PDF (PR-05)
           ==================================================== */}
      {showPdfModal && (
        <div className="modal-overlay active" onClick={() => setShowPdfModal(false)}>
          <div className="modal-card" style={{ maxWidth: "800px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.25rem" }}>📥</span>
                <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Pratinjau Portofolio Penulis Resmi (PDF)</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowPdfModal(false)}>&times;</button>
            </div>

            <div className="modal-body" style={{ maxHeight: "75vh", overflowY: "auto", padding: "1.5rem" }}>
              <div className="pdf-preview-sheet" id="printablePortfolioSheet">
                {/* Kop Surat Resmi Literasi */}
                <div className="pdf-header-letterhead">
                  <div className="pdf-logo-brand">
                    <div className="pdf-logo-icon">
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="pdf-title-doc">
                      <h2>KERTAS KATA • KABUPATEN TANGERANG</h2>
                      <p>Platform Gerakan Literasi Sekolah &amp; Masyarakat Gemilang Membaca-Menulis</p>
                    </div>
                  </div>
                  <div className="pdf-badge-stamp">
                    PORTOFOLIO RESMI TERVERIFIKASI
                  </div>
                </div>

                {/* Data Biodata Penulis */}
                <div className="pdf-author-profile-row">
                  <img
                    className="pdf-author-img"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                    alt={user?.name || "Raden"}
                  />
                  <div className="pdf-author-details">
                    <h3>{user?.name || "Raden"}</h3>
                    <p><strong>Peran:</strong> Anggota Terdaftar Komunitas Literasi Kabupaten Tangerang</p>
                    <p><strong>Wilayah:</strong> {user?.originRegion || "Kecamatan Tigaraksa, Kabupaten Tangerang"}</p>
                    <p><strong>Spesialisasi:</strong> Sejarah Lokal Tangerang, Opini &amp; Esai Kebijakan Publik</p>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.35rem" }}>
                      <em>&quot;Pendidik dan pegiat literasi komunitas di Tigaraksa. Meneliti akulturasi sejarah pesisir dan esai tata ruang ramah anak.&quot;</em>
                    </p>
                  </div>
                </div>

                {/* Ringkasan Metrik Publikasi */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem", textAlign: "center" }}>
                  <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e3a8a" }}>{displayArticles.length}</div>
                    <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 600 }}>Karya Terbit</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e3a8a" }}>{totalViews}</div>
                    <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 600 }}>Total Pembaca</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e3a8a" }}>45</div>
                    <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 600 }}>Apresiasi Pembaca</div>
                  </div>
                  <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e3a8a" }}>4 Badges</div>
                    <div style={{ fontSize: "0.6875rem", color: "#64748b", fontWeight: 600 }}>Prestasi Literasi</div>
                  </div>
                </div>

                {/* Tabel Katalog Tulisan Terbit */}
                <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
                  Daftar Artikel &amp; Naskah Resmi yang Telah Terbit
                </h4>
                <table className="pdf-table-articles">
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }}>No</th>
                      <th style={{ width: "50%" }}>Judul Artikel</th>
                      <th style={{ width: "15%" }}>Kategori</th>
                      <th style={{ width: "15%" }}>Tanggal Terbit</th>
                      <th style={{ width: "15%" }}>Status Kurasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayArticles.map((art, idx) => (
                      <tr key={art.id}>
                        <td>{idx + 1}</td>
                        <td><strong>{art.title}</strong></td>
                        <td>{art.category}</td>
                        <td>{art.date}</td>
                        <td style={{ color: "#059669", fontWeight: 700 }}>✓ Terbit Resmi</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer Tanda Tangan & QR Validasi */}
                <div className="pdf-footer-signatures" style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>Tigaraksa, Kabupaten Tangerang</p>
                    <p style={{ margin: "0.25rem 0 0", color: "#64748b" }}>Dicetak otomatis via Sistem Digital KERTAS KATA</p>
                    <p style={{ margin: "0.25rem 0 0", color: "#059669", fontWeight: 700 }}>Kode Validasi: KTK-2026-TGR-09882</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-block", padding: "0.5rem", background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "6px", fontFamily: "monospace", fontSize: "0.6875rem" }}>
                      [ QR CODE VERIFIED ]<br />
                      kertaskata.my.id/verify
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi Cetak PDF */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn-profil-action"
                  style={{ background: "#1e3a8a", color: "#ffffff", border: "none", padding: "0.75rem 1.5rem", fontSize: "0.875rem", fontWeight: 700, borderRadius: "8px", cursor: "pointer" }}
                >
                  🖨️ Cetak / Simpan PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: "#059669",
          color: "#ffffff",
          padding: "0.75rem 1.25rem",
          borderRadius: "10px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25)",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontSize: "0.875rem",
          fontWeight: 700,
          zIndex: 9999,
        }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}
