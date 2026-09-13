"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import "@/css/landing.css";

export default function PublicNavbar({ onLoginClick }) {
  const { user } = useAuth();

  const handleLogin = (e) => {
    if (onLoginClick) {
      e.preventDefault();
      onLoginClick();
    }
  };

  return (
    <header className="landing-nav" id="landingNav" style={{ position: "sticky", top: 0, zIndex: 1000, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e2e8f0" }}>
      <div className="container nav-inner">
        <Link href="/" className="nav-brand" aria-label="Beranda KERTAS KATA" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo-kertas-kata.png"
            alt="KERTAS KATA - Komunitas Literasi Kabupaten Tangerang"
            style={{ height: "42px", width: "auto", objectFit: "contain" }}
          />
        </Link>

        <nav aria-label="Menu Utama">
          <ul className="nav-menu">
            <li><Link href="/" className="nav-link">Beranda</Link></li>
            <li><Link href="/publikasi" className="nav-link">Jelajah Artikel</Link></li>
            <li><Link href="/dashboard/elearning" className="nav-link">E-Learning</Link></li>
            <li><Link href="/perpustakaan" className="nav-link">E-Library</Link></li>
            <li><Link href="/komunitas" className="nav-link">Komunitas</Link></li>
          </ul>
        </nav>

        <div className="nav-actions">
          {user ? (
            <Link href={user.role === "admin" ? "/admin" : "/dashboard"} className="btn-nav-login" style={{ background: "#eff6ff", color: "#1d4ed8" }}>
              Buka Dashboard ({user.role === "admin" ? "Admin" : "Anggota"})
            </Link>
          ) : (
            onLoginClick ? (
              <button
                type="button"
                className="btn-nav-login"
                onClick={handleLogin}
              >
                Masuk
              </button>
            ) : (
              <Link href="/login" className="btn-nav-login">Masuk</Link>
            )
          )}

          <Link href="/dashboard/menulis" className="btn-nav-cta">
            <span>✍️ Mulai Menulis</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
