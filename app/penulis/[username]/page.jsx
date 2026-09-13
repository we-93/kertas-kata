"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import api from "@/lib/api";
import "@/css/dashboard.css"; // Reuse dashboard styles for cards
import "@/css/profil.css";

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await api.user.getPublicProfile(username);
        if (res && res.success && res.data) {
          setProfile(res.data);
        } else {
          setError(res?.message || "Profil tidak ditemukan.");
        }
      } catch (err) {
        setError("Gagal memuat profil penulis.");
      } finally {
        setLoading(false);
      }
    }
    if (username) loadProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PublicNavbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profil Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">{error || "Penulis yang Anda cari tidak terdaftar atau tautan tidak valid."}</p>
          <Link href="/publikasi" className="btn-primary" style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
            Kembali ke Jelajah Artikel
          </Link>
        </div>
      </div>
    );
  }

  const articles = profile.articles || [];
  const totalViews = articles.reduce((acc, a) => acc + (a.viewCount || 0), 0);
  
  const filteredArticles = activeCategory === "all" 
    ? articles 
    : articles.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <PublicNavbar />
      
      <main className="container mx-auto max-w-5xl px-4 py-10 flex-1">
        
        {/* Banner Profil */}
        <section style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          {/* Cover Photo */}
          <div style={{ height: '200px', width: '100%', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', position: 'relative' }}>
          </div>
          
          <div style={{ padding: '0 2rem 2rem 2rem', position: 'relative' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
              
              {/* Profile Picture Overlapping */}
              <div style={{ marginTop: '-75px', position: 'relative', flexShrink: 0 }}>
                <img 
                  src={profile.photoUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.name) + "&background=random&size=150"} 
                  alt={profile.name}
                  style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #fff', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                />
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: '#10b981', color: '#fff', padding: '4px', borderRadius: '50%', border: '2px solid #fff', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} title="Anggota Terverifikasi">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              {/* Info Details */}
              <div style={{ flex: '1 1 300px', paddingTop: '1rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>{profile.name}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem', color: '#475569', marginBottom: '1rem' }}>
                  {profile.originRegion && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>📍</span>
                      <span>{profile.originRegion}</span>
                    </div>
                  )}
                  {profile.specialization && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>✍️</span>
                      <span>{profile.specialization}</span>
                    </div>
                  )}
                  {profile.createdAt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span>🗓️</span>
                      <span>Bergabung {new Date(profile.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
                
                {profile.bio && (
                  <div style={{ marginBottom: '1.5rem', maxWidth: '800px' }}>
                    <strong style={{ display: 'block', fontSize: '0.875rem', color: '#334155', marginBottom: '0.25rem' }}>Biografi Singkat Penulis:</strong>
                    <p style={{ color: '#475569', lineHeight: 1.6, margin: 0 }}>
                      {profile.bio}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                   <button
                      type="button"
                      className="btn-profil-action btn-profil-share"
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        backgroundColor: '#2563eb', 
                        color: '#fff', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '6px', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                      }}
                      onClick={async () => {
                        const url = window.location.href;
                        if (navigator.share) {
                          try { await navigator.share({ title: `Profil Penulis ${profile.name}`, url }); } catch(e){}
                        } else {
                          navigator.clipboard.writeText(url);
                          alert('Tautan disalin!');
                        }
                      }}
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span>Bagikan Profil</span>
                    </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrik Ringkas */}
        <section className="profil-stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="profil-stat-card">
            <div className="stat-icon-wrapper emerald">✓</div>
            <div className="stat-content">
              <span className="stat-val-number">{articles.length}</span>
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
              <span className="stat-val-number">0</span>
              <span className="stat-val-desc">Diskusi/Komentar</span>
            </div>
          </div>

          <div className="profil-stat-card">
            <div className="stat-icon-wrapper purple">❤️</div>
            <div className="stat-content">
              <span className="stat-val-number">0</span>
              <span className="stat-val-desc">Apresiasi/Suka</span>
            </div>
          </div>
        </section>

        {/* Katalog Karya */}
        <section style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.25rem 0' }}>
                <span>📝</span> Portofolio Naskah
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Karya yang telah lolos uji kurasi redaksi.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '8px', overflowX: 'auto' }}>
              <button 
                onClick={() => setActiveCategory("all")}
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: '6px', whiteSpace: 'nowrap', ...(activeCategory === "all" ? { backgroundColor: '#fff', color: '#2563eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' } : { backgroundColor: 'transparent', color: '#475569' }) }}
              >
                Semua
              </button>
              <button 
                onClick={() => setActiveCategory("Sejarah")}
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: '6px', whiteSpace: 'nowrap', ...(activeCategory === "Sejarah" ? { backgroundColor: '#fff', color: '#2563eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' } : { backgroundColor: 'transparent', color: '#475569' }) }}
              >
                Sejarah
              </button>
              <button 
                onClick={() => setActiveCategory("Opini")}
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: '6px', whiteSpace: 'nowrap', ...(activeCategory === "Opini" ? { backgroundColor: '#fff', color: '#2563eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' } : { backgroundColor: 'transparent', color: '#475569' }) }}
              >
                Opini
              </button>
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="portfolio-articles-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {filteredArticles.map((art) => (
                <Link href={`/${art.category.toLowerCase()}/${art.slug}`} key={art.id} className="port-card block no-underline text-inherit hover:-translate-y-1 transition-transform">
                  <div className="port-cover-wrapper">
                    <img className="port-cover-img" src={art.coverUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"} alt={art.title} />
                    <span className="port-category-tag">{art.category}</span>
                  </div>
                  <div className="port-card-body">
                    <h4 className="port-card-title text-gray-900">{art.title}</h4>
                    <p className="port-card-excerpt text-gray-600">{art.lead}</p>
                    <div className="port-card-footer text-gray-500">
                      <span>{new Date(art.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'})}</span>
                      <div className="port-meta-metrics">
                        <span>👁 {art.viewCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="text-4xl mb-3">✍️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">Belum Ada Karya Diterbitkan</h3>
              <p className="text-sm text-gray-500">Penulis belum mempublikasikan karya dalam kategori ini.</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
