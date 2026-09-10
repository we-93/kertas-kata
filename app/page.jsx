'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import '../css/landing.css';

export default function LandingPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic stats & articles
  const [stats, setStats] = useState({ articles: 0, members: 0 });
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.articles.getPublic({ limit: 6 });
        if (res && res.success && Array.isArray(res.data)) {
          setArticles(res.data);
          setStats((prev) => ({ ...prev, articles: res.data.length }));
        }

        const overviewRes = await api.admin.getOverview();
        if (overviewRes && overviewRes.success && overviewRes.data) {
          setStats({
            articles: overviewRes.data.publishedArticles || 0,
            members: overviewRes.data.totalMembers || 0,
          });
        }
      } catch (err) {
        console.warn('Gagal memuat data landing page:', err);
      }
    }
    loadData();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      setIsLoginModalOpen(false);
      if (res.user?.role === 'admin' || res.user?.role === 'mentor') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setLoginError(res.message);
    }
  };

  const quickFillLogin = (role) => {
    if (role === 'admin') {
      setEmail('admin@kertaskata.my.id');
      setPassword('AdminPassword2026!');
    } else {
      setEmail('rahmat.hidayat@gmail.com');
      setPassword('MemberPassword2026!');
    }
  };

  return (
    <div className="landing-wrapper">
      {/* 1. STICKY GLASSMORPHISM NAVBAR */}
      <header className="landing-nav" id="landingNav">
        <div className="container nav-inner">
          <Link href="/" className="nav-brand" aria-label="Beranda KERTAS KATA">
            <div className="nav-logo-box">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div className="nav-brand-title">KERTAS<span>KATA</span></div>
          </Link>

          <nav aria-label="Menu Utama">
            <ul className="nav-menu">
              <li><Link href="/" className="nav-link active">Beranda</Link></li>
              <li><Link href="/publikasi" className="nav-link">Jelajah Artikel</Link></li>
              <li><Link href="/elearning" className="nav-link">E-Learning</Link></li>
              <li><Link href="/perpustakaan" className="nav-link">E-Library</Link></li>
              <li><Link href="/komunitas" className="nav-link">Komunitas</Link></li>
            </ul>
          </nav>

          <div className="nav-actions">
            {user ? (
              <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-nav-login" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                Buka Dashboard ({user.role === 'admin' ? 'Admin' : 'Anggota'})
              </Link>
            ) : (
              <button
                type="button"
                className="btn-nav-login"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Masuk
              </button>
            )}

            <Link href="/menulis" className="btn-nav-cta">
              <span>✍️ Mulai Menulis</span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 2. HERO SECTION */}
        <section className="landing-hero" id="beranda">
          <div className="container hero-content">
            <div className="hero-pill-badge">
              <span className="hero-badge-dot"></span>
              <span>Ekosistem Literasi &amp; Penerbitan Karya Resmi Komunitas</span>
            </div>

            <h1 className="hero-headline">
              Kertas Kata: Tempat Ide Bertemu Pembaca.
            </h1>
            <p className="hero-subheadline">
              Platform literasi digital bagi pendidik dan masyarakat Kabupaten Tangerang. Belajar menulis, kurasi naskah berstandar KBBI/PUEBI, menerbitkan karya, hingga mencetak buku ber-ISBN — semua dalam satu ekosistem.
            </p>

            <div className="hero-cta-group">
              <Link href="/publikasi" className="btn-hero-primary">
                <span>📖 Jelajahi Karya Pilihan</span>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
              </Link>
              <Link href="/menulis" className="btn-hero-secondary">
                <span>✨ Gabung Sebagai Penulis</span>
              </Link>
            </div>

            {/* Hero Stats */}
            <div className="hero-stats-grid">
              <div className="hero-stat-card">
                <div className="hero-stat-val">{stats.articles}</div>
                <div className="hero-stat-label">Karya Terbit Kurasi</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-val">28</div>
                <div className="hero-stat-label">Kecamatan Terhubung</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-val">{stats.members}</div>
                <div className="hero-stat-label">Anggota &amp; Penulis Terdaftar</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-val">100%</div>
                <div className="hero-stat-label">Akses Terbuka &amp; Gratis</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FITUR UTAMA SECTION */}
        <section className="container" style={{ padding: '4rem 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              Fitur Unggulan KERTAS KATA
            </h2>
            <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '1rem' }}>
              Dukungan penuh dari meja tulis hingga penerbitan resmi ber-ISBN
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✍️</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Writing Studio Mandiri</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Editor tulisan bebas distraksi dengan auto-save otomatis ke database, kalkulasi target kata, dan kemudahan format naskah.
              </p>
            </div>

            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Copilot Kurasi</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Pemeriksaan otomatis kepatuhan KBBI V, tanda baca PUEBI, dan orisinalitas naskah bebas plagiarisme sebelum diterbitkan.
              </p>
            </div>

            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>E-Learning Bersertifikat 32 JP</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
                5 modul kepenulisan esensial lengkap dengan kuis interaktif dan penerbitan e-sertifikat bernomor resmi dinas.
              </p>
            </div>

            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Antologi Buku Ber-ISBN</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Kompilasi artikel terpilih menjadi buku fisik atau digital resmi Perpusnas RI yang siap dicetak dan didistribusikan.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* LOGIN MODAL */}
      {isLoginModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '440px',
            width: '100%',
            padding: '2rem',
            boxShadow: 'var(--shadow-xl)',
            position: 'relative',
          }}>
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748b' }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 0.75rem' }}>
                🔐
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Masuk ke KERTAS KATA
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                Gunakan akun komunitas terdaftar Anda
              </p>
            </div>

            {/* Quick Demo Credentials */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.75rem' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Pilih Akun Cepat (Uji Coba):</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => quickFillLogin('admin')}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', background: '#7c3aed', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.6875rem' }}
                >
                  Admin Kurator
                </button>
                <button
                  type="button"
                  onClick={() => quickFillLogin('member')}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.6875rem' }}
                >
                  Anggota Peserta
                </button>
              </div>
            </div>

            {loginError && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem', borderRadius: '8px', fontSize: '0.75rem', marginBottom: '1rem', fontWeight: 600 }}>
                ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Memverifikasi...' : 'Masuk Sekarang'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
