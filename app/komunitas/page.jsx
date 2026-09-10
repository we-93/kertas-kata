"use client";

import { useEffect, useState, useMemo } from "react";
import SidebarParticipant from "@/components/SidebarParticipant";
import TopHeader from "@/components/TopHeader";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/komunitas.css";

const INITIAL_THREADS = [
  {
    id: "thread-1",
    author: "Dian Pratama, M.Hum.",
    authorRole: "Kurator Editorial",
    authorInitials: "DP",
    region: "Tigaraksa",
    title: "Bedah Karya: Menjaga Keseimbangan Fakta & Narasi dalam Esai Sejarah",
    category: "bedah_karya",
    categoryLabel: "Bedah Karya",
    isPrivate: false,
    date: "2 jam yang lalu",
    content: "Saat menulis tentang artefak atau peristiwa sejarah lokal seperti Benteng Tangerang, banyak penulis pemula terjebak sekadar merangkum buku teks. Bagaimana cara teman-teman menghidupkan sudut pandang emosional tanpa memanipulasi keakuratan data sejarah?",
    likes: 24,
    comments: [
      { id: "c1", user: "Raden", text: "Saya biasanya memulai dari kisah personal sesepuh warga atau benda peninggalan keluarga yang masih tersisa." },
    ],
  },
  {
    id: "thread-2",
    author: "Siti Aminah, S.Pd.",
    authorRole: "Pendidik Literasi",
    authorInitials: "SA",
    region: "Teluknaga",
    title: "Diskusi Khusus: Penyusunan Antologi Puisi Pesisir Utara 2026",
    category: "antologi",
    categoryLabel: "Kolaborasi Antologi",
    isPrivate: true,
    date: "Kemarin",
    content: "Halo rekan-rekan penulis puisi! Forum ini dibentuk untuk menyelaraskan tema metafora laut, ritme ombak, dan kehidupan perkampungan nelayan Mauk & Kronjo yang akan kita bukukan bersama.",
    likes: 19,
    comments: [],
  },
  {
    id: "thread-3",
    author: "Budi Santoso, M.Pd.",
    authorRole: "Pegiat Jurnalistik",
    authorInitials: "BS",
    region: "Balaraja",
    title: "Etika Peliputan Berita Desa: Menghadapi Narasumber yang Tertutup",
    category: "puebi",
    categoryLabel: "Jurnalistik Warga",
    isPrivate: false,
    date: "2 hari yang lalu",
    content: "Bagi rekan-rekan yang sering meliput masalah fasilitas air bersih atau jalan desa, bagaimana pendekatan santun agar aparatur RT/RW bersedia memberikan konfirmasi yang berimbang?",
    likes: 31,
    comments: [],
  },
];

export default function KomunitasPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [filterType, setFilterType] = useState("all"); // all, public, private, my
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("bedah_karya");
  const [newContent, setNewContent] = useState("");
  const [newIsPrivate, setNewIsPrivate] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState(["Sarah Melati, M.I.Kom", "Budi Santoso, M.Pd"]);
  const [availableMembers, setAvailableMembers] = useState([
    "Sarah Melati, M.I.Kom",
    "Budi Santoso, M.Pd",
    "Suryadi Ningrat",
    "Anisa Fitriani",
    "Dian Prasetyo"
  ]);
  const [customMemberInput, setCustomMemberInput] = useState("");

  useEffect(() => {
    async function loadThreads() {
      try {
        const res = await api.community.getThreads();
        if (res && res.success && res.data && res.data.length > 0) {
          setThreads(res.data);
        }
      } catch (err) {
        // Fallback to initial threads
      }
    }
    loadThreads();
  }, []);

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      if (filterType === "public" && t.isPrivate) return false;
      if (filterType === "private" && !t.isPrivate) return false;
      if (filterType === "my" && t.author !== user?.name) return false;
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
      return true;
    });
  }, [threads, filterType, categoryFilter, user]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Silakan lengkapi judul dan isi topik diskusi!");
      return;
    }

    if (newIsPrivate && selectedMembers.length < 2) {
      alert("Untuk forum private, silakan pilih minimal 2 anggota undangan!");
      return;
    }

    const newThreadObj = {
      id: "thread-" + Date.now(),
      author: user?.name || "Raden",
      authorRole: "Anggota Komunitas",
      authorInitials: user?.name ? user.name[0] : "R",
      region: user?.originRegion || "Kabupaten Tangerang",
      title: newTitle,
      category: newCategory,
      categoryLabel: newCategory === "bedah_karya" ? "Bedah Karya" : newCategory === "antologi" ? "Kolaborasi Antologi" : "PUEBI & Riset",
      isPrivate: newIsPrivate,
      invitedMembers: newIsPrivate ? selectedMembers : [],
      date: "Baru saja",
      content: newContent,
      likes: 1,
      comments: [],
    };

    setThreads([newThreadObj, ...threads]);
    setShowCreateModal(false);
    setNewTitle("");
    setNewContent("");
    alert("🎉 Topik diskusi baru berhasil diterbitkan ke komunitas!");
  };

  return (
    <AuthGuard requiredRole="participant">
      <div className="app-container">
      <SidebarParticipant activePath="/komunitas" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box" }}>
          {/* Hero Banner */}
          <section className="komunitas-hero-banner" style={{ marginBottom: "2rem" }}>
            <div className="komunitas-hero-content">
              <div className="komunitas-hero-text">
                <h1>Ruang Diskusi &amp; Kolaborasi Literasi</h1>
                <p>
                  Wadah bertukar praktik baik, berdiskusi mengenai teknik kepenulisan, konsultasi naskah langsung dengan kurator, dan memperluas jejaring antar anggota se-Kabupaten Tangerang.
                </p>
              </div>
              <button
                type="button"
                className="btn-create-thread-hero"
                onClick={() => setShowCreateModal(true)}
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>+ Buat Diskusi Baru</span>
              </button>
            </div>

            {/* 4 Stat Cards */}
            <div className="komunitas-stats-row">
              <div className="kom-stat-card">
                <div className="kom-stat-val">{threads.length}</div>
                <div className="kom-stat-label">Total Diskusi Aktif</div>
              </div>
              <div className="kom-stat-card">
                <div className="kom-stat-val">{threads.filter((t) => !t.isPrivate).length}</div>
                <div className="kom-stat-label">Forum Publik Terbuka</div>
              </div>
              <div className="kom-stat-card">
                <div className="kom-stat-val">{threads.filter((t) => t.isPrivate).length}</div>
                <div className="kom-stat-label">Forum Private (Undangan)</div>
              </div>
              <div className="kom-stat-card">
                <div className="kom-stat-val">156</div>
                <div className="kom-stat-label">Penulis Terhubung</div>
              </div>
            </div>
          </section>

          {/* Filter Bar */}
          <section className="komunitas-filter-bar" style={{ marginBottom: "1.5rem" }}>
            <div className="kom-filter-tabs">
              <button className={`kom-filter-pill ${filterType === "all" ? "active" : ""}`} onClick={() => setFilterType("all")}>
                Semua Diskusi ({threads.length})
              </button>
              <button className={`kom-filter-pill ${filterType === "public" ? "active" : ""}`} onClick={() => setFilterType("public")}>
                Forum Publik ({threads.filter((t) => !t.isPrivate).length})
              </button>
              <button className={`kom-filter-pill ${filterType === "private" ? "active" : ""}`} onClick={() => setFilterType("private")}>
                Forum Private ({threads.filter((t) => t.isPrivate).length})
              </button>
            </div>

            <div className="kom-filter-actions">
              <select
                className="kom-category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter Kategori Topik"
              >
                <option value="all">Semua Kategori Topik</option>
                <option value="bedah_karya">Bedah Karya</option>
                <option value="puebi">PUEBI &amp; Tata Bahasa</option>
                <option value="antologi">Kolaborasi Antologi</option>
              </select>
            </div>
          </section>

          {/* 2-Column Layout */}
          <div className="komunitas-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem" }}>
            {/* Feed Left */}
            <section className="threads-feed-col" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {filteredThreads.map((th) => (
                <div
                  key={th.id}
                  style={{
                    background: "#fff",
                    borderRadius: "14px",
                    border: "1px solid var(--border-subtle)",
                    padding: "1.5rem",
                    boxShadow: "0 2px 4px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#eff6ff", color: "var(--primary-600)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                        {th.authorInitials}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-main)" }}>{th.author}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{th.authorRole} &bull; {th.region}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: "6px", background: th.isPrivate ? "#fef3c7" : "#eff6ff", color: th.isPrivate ? "#b45309" : "#1d4ed8" }}>
                      {th.isPrivate ? "🔒 PRIVATE" : "🌐 PUBLIK"}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.5rem" }}>
                    {th.title}
                  </h3>

                  <p style={{ fontSize: "0.875rem", color: "#334155", lineHeight: 1.6, marginBottom: "1rem" }}>
                    {th.content}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    <div>Diposting {th.date}</div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button
                        type="button"
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary-600)", fontWeight: "600" }}
                        onClick={() => alert(`Apresiasi untuk "${th.title}" berhasil dicatat!`)}
                      >
                        👍 {th.likes} Apresiasi
                      </button>
                      <span>💬 {th.comments?.length || 0} Komentar</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Sidebar Right */}
            <aside className="community-side-col" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Penulis Inspiratif */}
              <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid var(--border-subtle)", padding: "1.25rem" }}>
                <h4 style={{ fontWeight: 800, color: "var(--text-main)", marginBottom: "1rem" }}>
                  Penulis Inspiratif Bulan Ini
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#dbeafe", color: "#1e40af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "700" }}>
                        RD
                      </div>
                      <div>
                        <div style={{ fontSize: "0.8125rem", fontWeight: "700" }}>Raden</div>
                        <div style={{ fontSize: "0.6875rem", color: "#64748b" }}>Sejarah &amp; Budaya</div>
                      </div>
                    </div>
                    <button type="button" style={{ padding: "0.25rem 0.6rem", borderRadius: "6px", border: "1px solid var(--primary-600)", background: "#eff6ff", color: "var(--primary-600)", fontSize: "0.6875rem", fontWeight: "700", cursor: "pointer" }}>
                      ✓ Mengikuti
                    </button>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#ede9fe", color: "#6d28d9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "700" }}>
                        DP
                      </div>
                      <div>
                        <div style={{ fontSize: "0.8125rem", fontWeight: "700" }}>Dian Pratama</div>
                        <div style={{ fontSize: "0.6875rem", color: "#64748b" }}>Kurator Redaksi</div>
                      </div>
                    </div>
                    <button type="button" style={{ padding: "0.25rem 0.6rem", borderRadius: "6px", border: "1px solid var(--border-subtle)", background: "#fff", color: "#475569", fontSize: "0.6875rem", fontWeight: "700", cursor: "pointer" }}>
                      + Ikuti
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>

      {/* Modal Buat Diskusi Baru */}
      {showCreateModal && (
        <div
          className="modal-overlay active"
          onClick={() => setShowCreateModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
        >
          <div
            className="modal-card"
            style={{
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: "18px",
              background: "#ffffff",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-header"
              style={{
                flexShrink: 0,
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#ffffff",
              }}
            >
              <h3 style={{ fontSize: "1.125rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                Mulai Topik Diskusi Baru
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#64748b",
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={handleCreateThread}
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                overflowY: "auto",
                maxHeight: "calc(90vh - 75px)",
                flex: 1,
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Judul Diskusi
                </label>
                <input
                  type="text"
                  placeholder="Misal: Tanya Jawab Teknik Menulis Cerpen..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}
                >
                  <option value="bedah_karya">Bedah Karya</option>
                  <option value="puebi">PUEBI &amp; Tata Bahasa</option>
                  <option value="antologi">Kolaborasi Antologi</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  Uraian Topik Diskusi
                </label>
                <textarea
                  rows={4}
                  placeholder="Uraikan gagasan, pertanyaan, atau ajakan kolaborasi Anda..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)", fontSize: "0.875rem" }}
                  required
                />
              </div>

              {/* Pilihan Tipe Forum Diskusi (Radio Cards) */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  Tipe Forum Diskusi
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div
                    onClick={() => setNewIsPrivate(false)}
                    style={{
                      padding: "0.85rem",
                      borderRadius: "10px",
                      border: !newIsPrivate ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                      background: !newIsPrivate ? "#eff6ff" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: !newIsPrivate ? "#1d4ed8" : "#1e293b", marginBottom: "0.25rem" }}>
                      🌐 Forum Publik
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.4 }}>
                      Terbuka untuk semua penulis terdaftar, dapat dilihat dan dibalas bersama.
                    </div>
                  </div>

                  <div
                    onClick={() => setNewIsPrivate(true)}
                    style={{
                      padding: "0.85rem",
                      borderRadius: "10px",
                      border: newIsPrivate ? "2px solid #7c3aed" : "1.5px solid #e2e8f0",
                      background: newIsPrivate ? "#f5f3ff" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: newIsPrivate ? "#6d28d9" : "#1e293b", marginBottom: "0.25rem" }}>
                      🔒 Forum Private
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.4 }}>
                      Tertutup, hanya anggota yang diundang yang dapat membaca dan berdiskusi.
                    </div>
                  </div>
                </div>
              </div>

              {/* Kondisional: Fitur Undang Anggota untuk Forum Private */}
              {newIsPrivate && (
                <div
                  className="invite-members-box"
                  style={{
                    background: "#f8fafc",
                    border: "1.5px dashed #94a3b8",
                    borderRadius: "12px",
                    padding: "1rem",
                  }}
                >
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#1e3a8a", display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.5rem" }}>
                    <span>👥 Pilih Anggota yang Diundang (Minimal 2 Orang):</span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    {availableMembers.map((member) => {
                      const isSelected = selectedMembers.includes(member);
                      return (
                        <button
                          key={member}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedMembers(selectedMembers.filter((m) => m !== member));
                            } else {
                              setSelectedMembers([...selectedMembers, member]);
                            }
                          }}
                          style={{
                            background: isSelected ? "#1e3a8a" : "#ffffff",
                            color: isSelected ? "#ffffff" : "#1e293b",
                            border: isSelected ? "1px solid #1e3a8a" : "1px solid #cbd5e1",
                            borderRadius: "20px",
                            padding: "0.35rem 0.75rem",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <span>{isSelected ? "✓" : "+"}</span>
                          <span>{member}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tambah Nama Anggota Kustom */}
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder="Ketik nama anggota lain..."
                      value={customMemberInput}
                      onChange={(e) => setCustomMemberInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "0.45rem 0.65rem",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.75rem",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = customMemberInput.trim();
                        if (trimmed && !availableMembers.includes(trimmed)) {
                          setAvailableMembers([...availableMembers, trimmed]);
                          setSelectedMembers([...selectedMembers, trimmed]);
                          setCustomMemberInput("");
                        }
                      }}
                      style={{
                        padding: "0.45rem 0.75rem",
                        borderRadius: "6px",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Tambah
                    </button>
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: selectedMembers.length >= 2 ? "#059669" : "#dc2626", marginTop: "0.5rem", fontWeight: 600 }}>
                    {selectedMembers.length >= 2
                      ? `✓ ${selectedMembers.length} anggota terpilih`
                      : `⚠️ Pilih minimal ${2 - selectedMembers.length} anggota lagi`}
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #f1f5f9",
                  position: "sticky",
                  bottom: "-1.5rem",
                  background: "#ffffff",
                  paddingBottom: "0.5rem",
                  zIndex: 10,
                }}
              >
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary" style={{ padding: "0.65rem 1.25rem", fontWeight: 700 }}>
                  Terbitkan Diskusi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}
