'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function TopHeader({ onToggleMenu, isAdminMode = false }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);

  const uName = user?.name || (isAdminMode ? 'Administrator Kurator' : 'Penulis Komunitas');
  const initials = uName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const region = user?.originRegion || 'Kabupaten Tangerang';
  const roleLabel = isAdminMode ? 'Kurator Tangerang' : user?.role === 'mentor' ? 'Mentor' : 'Anggota';

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleMenu = (e) => {
    e?.preventDefault?.();
    if (onToggleMenu) {
      onToggleMenu();
      return;
    }
    const sidebar = document.getElementById('sidebarLeft');
    if (!sidebar) return;

    const isOpen = sidebar.classList.contains('open') || sidebar.classList.contains('active');
    let backdrop = document.getElementById('mobileSidebarBackdrop');

    if (isOpen) {
      sidebar.classList.remove('open', 'active');
      if (backdrop) backdrop.remove();
    } else {
      sidebar.classList.add('open', 'active');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'mobileSidebarBackdrop';
        backdrop.className = 'mobile-sidebar-backdrop';
        backdrop.onclick = () => {
          sidebar.classList.remove('open', 'active');
          backdrop.remove();
        };
        document.body.appendChild(backdrop);
      }
    }
  };

  return (
    <header className="top-header" ref={dropdownRef}>
      <div className="header-left">
        <button
          type="button"
          className="menu-toggle-btn"
          aria-label="Buka Menu Navigasi"
          onClick={handleToggleMenu}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        {/* Global Search Bar */}
        <div className="header-search">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder={isAdminMode ? "Cari naskah kurasi, nama anggota, ISBN..." : "Cari tulisan, modul, atau penulis..."}
            aria-label="Pencarian"
          />
        </div>
      </div>

      <div className="header-right">
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="header-action-btn"
            aria-label="Notifikasi"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setDropdownOpen(false);
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </button>

          {notifOpen && (
            <div className="notification-popover" style={{ display: 'block', position: 'absolute', right: 0, top: '48px', width: '300px' }}>
              <div className="popover-header">
                <span className="popover-title">Notifikasi</span>
              </div>
              <div className="popover-body">
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  Belum ada notifikasi baru.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Identity Pill & Dropdown */}
        <div className="user-dropdown-container" style={{ position: 'relative' }}>
          <button
            type="button"
            className="user-pill"
            aria-expanded={dropdownOpen}
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotifOpen(false);
            }}
          >
            <div className="user-avatar-small" style={{ background: isAdminMode ? '#7c3aed' : '#2563eb', color: '#fff' }}>
              {initials}
            </div>
            <div className="user-pill-info">
              <span className="user-pill-name">{uName}</span>
              <span className="user-pill-role">{roleLabel}</span>
            </div>
            <svg className="user-pill-chevron" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="user-dropdown-menu" style={{ display: 'block', position: 'absolute', right: 0, top: '48px', width: '260px' }}>
              <div className="user-dropdown-header">
                <div className="user-dropdown-avatar" style={{ background: isAdminMode ? '#7c3aed' : '#2563eb', color: '#fff' }}>
                  {initials}
                </div>
                <div className="user-dropdown-info">
                  <span className="user-dropdown-name">{uName}</span>
                  <span className="user-dropdown-role">{roleLabel} • {region}</span>
                  <span className="user-dropdown-email">{user?.email || (isAdminMode ? 'admin@kertaskata.my.id' : 'anggota@kertaskata.id')}</span>
                </div>
              </div>

              <div className="user-dropdown-items">
                {isAdminMode ? (
                  <Link href="/admin/kelola-pengaturan" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span>Profil & Pengaturan Admin</span>
                  </Link>
                ) : (
                  <>
                    <Link href="/profil" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      <span>Profil Saya</span>
                    </Link>

                    <Link href="/pengaturan" className="user-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span>Pengaturan</span>
                    </Link>
                  </>
                )}

                <div className="user-dropdown-divider"></div>
                <button type="button" className="user-dropdown-item logout" onClick={logout}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
