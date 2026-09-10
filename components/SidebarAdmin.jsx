'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarAdmin({ isOpen, onClose, queueBadgeCount = 0 }) {
  const pathname = usePathname();

  const primaryItems = [
    {
      href: '/admin',
      label: 'Portal Kurasi',
      badge: queueBadgeCount > 0 ? `${queueBadgeCount} Baru` : null,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      ),
    },
    {
      href: '/kelola-anggota',
      label: 'Kelola Anggota',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
      ),
    },
    {
      href: '/kelola-elearning',
      label: 'Kelola E-Learning',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
      ),
    },
    {
      href: '/kelola-publikasi',
      label: 'Kelola Publikasi',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
        </svg>
      ),
    },
  ];

  const serviceItems = [
    {
      href: '/kelola-perpustakaan',
      label: 'Kelola Perpustakaan',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
        </svg>
      ),
    },
    {
      href: '/kelola-komunitas',
      label: 'Kelola Komunitas',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
    },
    {
      href: '/kelola-cetak',
      label: 'Kelola Cetak & ISBN',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
        </svg>
      ),
    },
    {
      href: '/kelola-sertifikat',
      label: 'Sertifikat & Hall of Fame',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"/>
        </svg>
      ),
    },
    {
      href: '/kelola-pengaturan',
      label: 'Pengaturan Sistem',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
    },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`} id="adminSidebar">
      <div className="sidebar-brand" style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/admin" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '0.4rem 0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src="/logo-kertas-kata.png"
              alt="KERTAS KATA"
              style={{ height: '36px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.2rem' }}>
            <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#a78bfa', letterSpacing: '0.05em' }}>
              PORTAL KURATOR
            </span>
            <span style={{ fontSize: '0.625rem', background: '#7c3aed', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
              ADMIN
            </span>
          </div>
        </Link>
      </div>

      <nav className="sidebar-nav" aria-label="Navigasi Admin">
        <div className="nav-section-label">MANAJEMEN KURASI</div>

        {primaryItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="badge" style={{ marginLeft: 'auto', fontSize: '0.6875rem', background: '#fee2e2', color: '#b91c1c', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="nav-section-label">LAYANAN & DISTRIBUSI</div>

        {serviceItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mode Switcher to Member Dashboard */}
      <div className="sidebar-switch-mode" style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto' }}>
        <Link
          href="/dashboard"
          className="btn-switch-mode"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.08)',
            color: '#ffffff',
            fontSize: '0.8125rem',
            fontWeight: '700',
            textDecoration: 'none',
          }}
          onClick={onClose}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Beralih Mode Anggota</span>
        </Link>
      </div>
    </aside>
  );
}
