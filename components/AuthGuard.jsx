"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children, requiredRole = "anggota" }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Halaman private: redirect ke halaman login
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        if (requiredRole === "admin" && user.role !== "admin" && user.role !== "mentor") {
          // Pengguna akun anggota dilarang keras akses admin -> alihkan ke dashboard anggota
          router.replace("/dashboard");
        } else if (requiredRole === "anggota" && (user.role === "admin" || user.role === "mentor")) {
          // Pengguna akun admin dilarang keras akses anggota -> alihkan ke portal admin
          router.replace("/admin");
        } else {
          setAuthorized(true);
        }
      }
    }
  }, [user, loading, router, pathname, requiredRole]);

  if (loading || !authorized) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-app, #f8fafc)",
        fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
        color: "#64748b"
      }}>
        <div style={{
          width: "42px",
          height: "42px",
          border: "3.5px solid #e2e8f0",
          borderTopColor: "#2563eb",
          borderRadius: "50%",
          animation: "authSpin 0.9s linear infinite"
        }} />
        <p style={{ marginTop: "1.25rem", fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
          Memverifikasi Akses Aman Dashboard KERTAS KATA...
        </p>
        <style>{`
          @keyframes authSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return children;
}
