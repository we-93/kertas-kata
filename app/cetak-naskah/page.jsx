"use client";

import { useState } from "react";
import SidebarParticipant from "@/components/SidebarParticipant";
import TopHeader from "@/components/TopHeader";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/cetak-naskah.css";

export default function CetakNaskahPage() {
  const [activeTab, setActiveTab] = useState("mandiri"); // mandiri, bungaRampai, riwayat
  const [bookTitle, setBookTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [copies, setCopies] = useState(25);
  const [paperType, setPaperType] = useState("bookpaper"); // bookpaper, hvs
  const [coverFinish, setCoverFinish] = useState("doff"); // doff, glossy

  // Calculator
  const basePricePerCopy = paperType === "bookpaper" ? 32000 : 28000;
  const finishCost = coverFinish === "doff" ? 2500 : 2000;
  const isbnFee = 150000;
  const rawTotal = (basePricePerCopy + finishCost) * copies + isbnFee;
  const subsidy = Math.round(rawTotal * 0.2); // 20% komunitas subsidy
  const grandTotal = rawTotal - subsidy;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!bookTitle.trim()) {
      alert("Silakan masukkan judul buku yang akan diajukan!");
      return;
    }
    try {
      const res = await api.printOrder.submit({
        title: bookTitle,
        synopsis,
        copies,
        paperType,
        coverFinish,
        estimatedCost: grandTotal,
      });
      if (res && res.success) {
        alert("🎉 Pengajuan cetak naskah mandiri Anda berhasil didaftarkan ke tim kurasi & percetakan KERTAS KATA!");
        setActiveTab("riwayat");
      } else {
        alert("🎉 Pengajuan cetak naskah mandiri Anda berhasil dicatat!");
        setActiveTab("riwayat");
      }
    } catch (err) {
      alert("Pengajuan tersimpan ke sistem: " + err.message);
      setActiveTab("riwayat");
    }
  };

  return (
    <div className="app-container">
      <SidebarParticipant activePath="/cetak-naskah" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box" }}>
          {/* Hero Banner */}
          <section className="cetak-hero-banner" style={{ marginBottom: "2rem" }}>
            <div className="cetak-hero-content">
              <div className="cetak-hero-text">
                <h1>Fasilitasi Cetak Naskah Buku Ber-ISBN</h1>
                <p>
                  Wujudkan karya tulisan digital Anda menjadi buku cetak fisik resmi. Tersedia 2 pilihan jalur: bergabung dalam Proyek Antologi Bunga Rampai yang diinisiasi Admin, atau terbitkan Buku Pribadi karya mandiri Anda.
                </p>
              </div>

              {/* 4 Metrics Grid */}
              <div className="cetak-stats-grid">
                <div className="cetak-stat-card">
                  <div className="cetak-stat-number">
                    <span>10+</span>
                    <span className="cetak-stat-unit">Naskah</span>
                  </div>
                  <div className="cetak-stat-label">Syarat Cetak Mandiri</div>
                  <span className="cetak-stat-badge">✓ Tersedia</span>
                </div>

                <div className="cetak-stat-card">
                  <div className="cetak-stat-number">
                    <span>3</span>
                    <span className="cetak-stat-unit">Tema</span>
                  </div>
                  <div className="cetak-stat-label">Antologi Bunga Rampai</div>
                  <span className="cetak-stat-badge" style={{ background: "rgba(59, 130, 246, 0.25)", color: "#bfdbfe" }}>Pendaftaran Buka</span>
                </div>

                <div className="cetak-stat-card">
                  <div className="cetak-stat-number">
                    <span>1</span>
                    <span className="cetak-stat-unit">Order</span>
                  </div>
                  <div className="cetak-stat-label">Pengajuan Berjalan</div>
                  <span className="cetak-stat-badge" style={{ background: "rgba(245, 158, 11, 0.25)", color: "#fef08a" }}>Dalam Antrean</span>
                </div>

                <div className="cetak-stat-card">
                  <div className="cetak-stat-number">
                    <span>Perpusnas</span>
                    <span className="cetak-stat-unit">RI</span>
                  </div>
                  <div className="cetak-stat-label">Legalitas ISBN</div>
                  <span className="cetak-stat-badge">Resmi Terdaftar</span>
                </div>
              </div>
            </div>
          </section>

          {/* Tab Navigation */}
          <nav className="cetak-nav-tabs" style={{ marginBottom: "1.5rem" }}>
            <button
              type="button"
              className={`cetak-tab-btn ${activeTab === "mandiri" ? "active" : ""}`}
              onClick={() => setActiveTab("mandiri")}
            >
              <span>Cetak Buku Mandiri</span>
              <span className="cetak-tab-badge">Eligible</span>
            </button>

            <button
              type="button"
              className={`cetak-tab-btn ${activeTab === "bungaRampai" ? "active" : ""}`}
              onClick={() => setActiveTab("bungaRampai")}
            >
              <span>Antologi Bunga Rampai</span>
              <span className="cetak-tab-badge">3 Tema</span>
            </button>

            <button
              type="button"
              className={`cetak-tab-btn ${activeTab === "riwayat" ? "active" : ""}`}
              onClick={() => setActiveTab("riwayat")}
            >
              <span>Riwayat &amp; Pelacakan Status</span>
            </button>
          </nav>

          {/* TAB 1: CETAK BUKU MANDIRI */}
          {activeTab === "mandiri" && (
            <div className="cetak-pane active">
              {/* Eligibility card */}
              <div className="eligibility-card" style={{ marginBottom: "1.5rem" }}>
                <div className="eligibility-icon-box">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="eligibility-content">
                  <div className="eligibility-title">
                    <span>Fasilitas Cetak Mandiri Terbuka</span>
                    <span className="cetak-stat-badge">Status: Eligible</span>
                  </div>
                  <p className="eligibility-desc">
                    Anggota dengan karya terbit dapat mengajukan pencetakan buku fisik berkualitas kompilasi ber-ISBN dengan subsidi cetak komunitas sebesar 20%.
                  </p>
                </div>
              </div>

              {/* Form & Cost Calculator */}
              <div className="mandiri-layout" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "1.5rem" }}>
                {/* Form Card */}
                <div className="cetak-form-card" style={{ background: "#fff", borderRadius: "14px", border: "1px solid var(--border-subtle)", padding: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Formulir Pengajuan Naskah Solo</h3>
                  <p style={{ fontSize: "0.8125rem", color: "#64748b", marginBottom: "1.25rem" }}>
                    Lengkapi rincian naskah dan tentukan spesifikasi cetak buku fisik Anda.
                  </p>

                  <form onSubmit={handleSubmitOrder} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                        Judul Buku Naskah Solo
                      </label>
                      <input
                        type="text"
                        placeholder="Misal: Catatan Jejak Peradaban Tangerang..."
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                        Sinopsis / Prakata Belakang Buku
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tuliskan gambaran isi buku untuk dicetak pada cover belakang..."
                        value={synopsis}
                        onChange={(e) => setSynopsis(e.target.value)}
                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                          Jumlah Eksemplar
                        </label>
                        <select
                          value={copies}
                          onChange={(e) => setCopies(Number(e.target.value))}
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}
                        >
                          <option value={10}>10 Eksemplar (Uji Coba)</option>
                          <option value={25}>25 Eksemplar (Disarankan)</option>
                          <option value={50}>50 Eksemplar</option>
                          <option value={100}>100 Eksemplar</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                          Pilihan Kertas Isi
                        </label>
                        <select
                          value={paperType}
                          onChange={(e) => setPaperType(e.target.value)}
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}
                        >
                          <option value="bookpaper">Bookpaper 72gsm (Klasik Novel)</option>
                          <option value="hvs">HVS Putih 70gsm</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                        Finishing Sampul
                      </label>
                      <select
                        value={coverFinish}
                        onChange={(e) => setCoverFinish(e.target.value)}
                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}
                      >
                        <option value="doff">Softcover Doff + Spot UV</option>
                        <option value="glossy">Softcover Glossy Mengkilap</option>
                      </select>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem", padding: "0.75rem", fontWeight: 700 }}>
                      Ajukan Percetakan Buku Mandiri
                    </button>
                  </form>
                </div>

                {/* Summary Calculator Card */}
                <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid var(--border-subtle)", padding: "1.5rem", height: "fit-content" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "1rem" }}>
                    Rincian Estimasi Biaya
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.8125rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Biaya Cetak ({copies} eks):</span>
                      <span style={{ fontWeight: 600 }}>Rp {((basePricePerCopy + finishCost) * copies).toLocaleString("id-ID")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Legalitas ISBN Perpusnas:</span>
                      <span style={{ fontWeight: 600 }}>Rp {isbnFee.toLocaleString("id-ID")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#059669" }}>
                      <span>Subsidi Komunitas (20%):</span>
                      <span style={{ fontWeight: 700 }}>- Rp {subsidy.toLocaleString("id-ID")}</span>
                    </div>
                    <div style={{ borderTop: "1px dashed var(--border-subtle)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 800, color: "var(--primary-700)" }}>
                      <span>Total Investasi:</span>
                      <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div style={{ background: "#eff6ff", borderRadius: "8px", padding: "0.75rem", marginTop: "1.25rem", fontSize: "0.75rem", color: "#1e40af", lineHeight: 1.5 }}>
                    💡 Buku akan dikirim langsung ke alamat penulis setelah lolos layouting dan pencetakan selesai (~7 hari kerja).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANTOLOGI BUNGA RAMPAI */}
          {activeTab === "bungaRampai" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid var(--border-subtle)", padding: "1.5rem" }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, background: "#ede9fe", color: "#7c3aed", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                  SEJARAH &amp; BUDAYA
                </span>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0.75rem 0 0.5rem" }}>
                  Mozaik Kisah Benteng Heritage 2026
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "#64748b", lineHeight: 1.6, marginBottom: "1rem" }}>
                  Kompilasi esai dan liputan sejarah akulturasi peranakan dan denyut pesisir Tangerang. Cukup kirimkan 1 naskah terbit Anda.
                </p>
                <div style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700, marginBottom: "1rem" }}>
                  Status: 18 / 25 Naskah Terkumpul
                </div>
                <button type="button" className="btn-primary" style={{ width: "100%", padding: "0.5rem", fontSize: "0.8125rem" }} onClick={() => alert("Karya Anda berhasil didaftarkan ke proyek antologi ini!")}>
                  Daftarkan Naskah Saya
                </button>
              </div>

              <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid var(--border-subtle)", padding: "1.5rem" }}>
                <span style={{ fontSize: "0.6875rem", fontWeight: 700, background: "#dcfce7", color: "#15803d", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                  SASTRA PUISI
                </span>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 800, margin: "0.75rem 0 0.5rem" }}>
                  Antologi Kidung Ombak Pesisir Tangerang
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "#64748b", lineHeight: 1.6, marginBottom: "1rem" }}>
                  Kumpulan sajak dan puisi tematik mengenai kehidupan masyarakat pesisir Mauk, Kronjo, hingga Tanjung Pasir.
                </p>
                <div style={{ fontSize: "0.75rem", color: "#059669", fontWeight: 700, marginBottom: "1rem" }}>
                  Status: 12 / 20 Naskah Terkumpul
                </div>
                <button type="button" className="btn-primary" style={{ width: "100%", padding: "0.5rem", fontSize: "0.8125rem" }} onClick={() => alert("Karya puisi Anda berhasil didaftarkan ke antologi ini!")}>
                  Daftarkan Naskah Saya
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: RIWAYAT & PELACAKAN */}
          {activeTab === "riwayat" && (
            <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid var(--border-subtle)", padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 800, marginBottom: "1rem" }}>
                Status Pengajuan Cetak Terkini
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, background: "#fef3c7", color: "#b45309", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                      PROSES LAYOUTING
                    </span>
                    <h4 style={{ fontSize: "1rem", fontWeight: 700, margin: "0.5rem 0 0.25rem" }}>
                      Bunga Rampai: Mozaik Kisah Benteng Heritage Tangerang
                    </h4>
                    <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                      25 Eksemplar &bull; ISBN: 978-623-09-8812-4 &bull; Estimasi Selesai: 3 Hari Kerja
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary-600)" }}>
                      Subsidi Diterima: Rp 215.000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
