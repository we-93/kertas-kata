"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import "@/css/dashboard.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { login, loginGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      setIsSubmitting(false);

      if (res.success) {
        if (res.user?.role === "admin" || res.user?.role === "mentor") {
          router.replace(redirectUrl.startsWith("/admin") ? redirectUrl : "/admin");
        } else {
          router.replace(redirectUrl);
        }
      } else {
        setErrorMessage(res.message || "Email atau kata sandi tidak cocok.");
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || "Terjadi kesalahan saat masuk.");
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // Mock / Direct payload untuk Google SSO di lingkungan web
      const res = await loginGoogle({
        email: "raden@gmail.com",
        name: "Raden",
        googleId: "google-raden-2026",
      });
      setIsSubmitting(false);

      if (res.success) {
        router.replace(redirectUrl);
      } else {
        setErrorMessage(res.message || "Gagal masuk menggunakan Google.");
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || "Gagal menghubungkan ke layanan Google.");
    }
  };

  const quickFill = (role) => {
    if (role === "admin") {
      setEmail("admin@kertaskata.my.id");
      setPassword("Semua123@");
    } else {
      setEmail("raden@gmail.com");
      setPassword("Semua123@");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(ellipse at top, #1e293b 0%, #0f172a 100%)",
      fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
      padding: "1.5rem"
    }}>
      <div style={{
        maxWidth: "440px",
        width: "100%",
        background: "#ffffff",
        borderRadius: "20px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        {/* Header Branding */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b 0%, #283547 100%)",
          padding: "2rem 2rem 1.5rem",
          textAlign: "center",
          color: "#ffffff",
          position: "relative"
        }}>
          <Link href="/" style={{
            display: "inline-flex",
            alignItems: "center",
            textDecoration: "none",
            marginBottom: "0.85rem"
          }}>
            <div style={{
              background: "#ffffff",
              borderRadius: "12px",
              padding: "0.45rem 0.85rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <img
                src="/logo-kertas-kata.png"
                alt="KERTAS KATA Kabupaten Tangerang"
                style={{ height: "42px", width: "auto", objectFit: "contain" }}
              />
            </div>
          </Link>
          <h1 style={{ fontSize: "1.125rem", fontWeight: 700, margin: "0 0 0.25rem" }}>
            Masuk ke Dashboard Private
          </h1>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
            Ekosistem Literasi &amp; Publikasi Kabupaten Tangerang
          </p>
        </div>

        {/* Body Content */}
        <div style={{ padding: "1.75rem 2rem 2rem" }}>
          {/* Quick Credential Switcher */}
          <div style={{
            background: "#f8fafc",
            border: "1px dashed #cbd5e1",
            borderRadius: "10px",
            padding: "0.75rem",
            marginBottom: "1.25rem",
            fontSize: "0.75rem"
          }}>
            <div style={{ fontWeight: 700, color: "#334155", marginBottom: "0.5rem" }}>
              Kredensial Akun Terverifikasi:
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => quickFill("member")}
                style={{
                  flex: 1,
                  padding: "0.45rem",
                  borderRadius: "6px",
                  background: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.6875rem",
                  cursor: "pointer"
                }}
              >
                👤 Anggota (raden@gmail.com)
              </button>
              <button
                type="button"
                onClick={() => quickFill("admin")}
                style={{
                  flex: 1,
                  padding: "0.45rem",
                  borderRadius: "6px",
                  background: "#7c3aed",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.6875rem",
                  cursor: "pointer"
                }}
              >
                🛡️ Admin Kurasi
              </button>
            </div>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "10px",
              border: "1.5px solid #e2e8f0",
              background: "#ffffff",
              color: "#1e293b",
              fontWeight: 700,
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.65rem",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Masuk dengan Akun Google</span>
          </button>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            margin: "1.25rem 0",
            color: "#94a3b8",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <span style={{ padding: "0 0.75rem", fontWeight: 600 }}>atau login manual</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              padding: "0.65rem 0.85rem",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Manual Email & Password Form */}
          <form onSubmit={handleManualLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.35rem" }}>
                Alamat Email <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                style={{
                  width: "100%",
                  padding: "0.7rem 0.85rem",
                  borderRadius: "8px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "0.875rem",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <label style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1e293b" }}>
                  Kata Sandi <span style={{ color: "#ef4444" }}>*</span>
                </label>
              </div>

              {/* Password Input with Eye Icon */}
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "0.7rem 2.5rem 0.7rem 0.85rem",
                    borderRadius: "8px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.875rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                  style={{
                    position: "absolute",
                    right: "0.6rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.25rem",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {showPassword ? (
                    // Eye Slash Icon (Hide Password)
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    // Eye Icon (Show Password)
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                marginTop: "0.5rem",
                padding: "0.75rem",
                borderRadius: "10px",
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "background 0.2s ease"
              }}
            >
              {isSubmitting ? "Memverifikasi Kredensial..." : "Masuk ke Dashboard"}
            </button>
          </form>

          {/* Footer Back */}
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <Link href="/" style={{ fontSize: "0.8125rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>
              ← Kembali ke Beranda KERTAS KATA
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}
