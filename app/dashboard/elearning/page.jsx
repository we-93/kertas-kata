"use client";

import { useEffect, useState, useMemo } from "react";
import SidebarParticipant from "@/components/SidebarParticipant";
import TopHeader from "@/components/TopHeader";
import AuthGuard from "@/components/AuthGuard";
import api from "@/lib/api";
import "@/css/dashboard.css";
import "@/css/elearning.css";

const DEFAULT_MODULES = [
  {
    id: "modul-1",
    order: "01",
    title: "Modul 1: Fondasi Literasi & Berpikir Kritis",
    desc: "Membangun kebiasaan membaca analitis, membedakan fakta dan asumsi, serta menyusun kerangka berpikir logis dalam menuangkan gagasan ke dalam tulisan yang berbobot.",
    lessons: "📺 4 Video • 📄 2 Teks",
    score: "90 / 100",
    status: "completed",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "modul-2",
    order: "02",
    title: "Modul 2: Riset Budaya & Sejarah Lokal Tangerang",
    desc: "Teknik eksplorasi arsip sejarah Tangerang, wawancara sesepuh kampung, dan dokumentasi warisan budaya takbenda peranakan Benteng, pesisir utara, hingga pedesaan selatan.",
    lessons: "📺 5 Video • 📄 3 Teks",
    score: "85 / 100",
    status: "completed",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "modul-3",
    order: "03",
    title: "Modul 3: Seni Bercerita & Penulisan Cerpen",
    desc: "Merancang premis fiksi yang memikat, menghidupkan dialog tokoh yang natural, menciptakan ketegangan alur cerita, dan mendeskripsikan latar suasana khas kearifan lokal.",
    lessons: "📺 6 Video • 📄 2 Teks",
    score: "95 / 100",
    status: "completed",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "modul-4",
    order: "04",
    title: "Modul 4: Menulis Opini Publik & Esai Kebijakan",
    desc: "Teknik merumuskan pandangan kritis terhadap isu pelayanan masyarakat, fasilitas publik, dan tata kelola pembangunan desa di Kabupaten Tangerang secara santun dan solutif.",
    lessons: "📺 4 Video • 📄 3 Teks",
    score: "80 / 100",
    status: "completed",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "modul-5",
    order: "05",
    title: "Modul 5: Jurnalistik Warga & Berita Komunitas",
    desc: "Menghimpun fakta peristiwa di lingkungan sekitar dengan kaidah 5W+1H, verifikasi saksi mata di lapangan, teknik wawancara aparatur desa, dan kepatuhan kode etik pers warga.",
    lessons: "📺 3 Video • 📄 2 Teks",
    score: null,
    status: "active",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "modul-6",
    order: "06",
    title: "Modul 6: Estetika Puisi & Gaya Bahasa Figuratif",
    desc: "Menyelami rima, metafora alam, diksi puitik nusantara, dan musikalitas baris kata untuk merangkai antologi puisi komunitas yang memiliki daya pikat estetika mendalam.",
    lessons: "📺 4 Video • 📄 2 Teks",
    score: null,
    status: "locked",
    req: "Lulus Modul 5",
  },
  {
    id: "modul-7",
    order: "07",
    title: "Modul 7: Penulisan Artikel Ilmiah Populer",
    desc: "Menyederhanakan data statistik kecamatan, metodologi riset lapangan, dan teori akademis menjadi artikel ilmiah populer yang renyah dan mudah dipahami masyarakat awam.",
    lessons: "📺 5 Video • 📄 4 Teks",
    score: null,
    status: "locked",
    req: "Lulus Modul 6",
  },
  {
    id: "modul-8",
    order: "08",
    title: "Modul 8: Etika Siber, Hak Cipta & Digital Publishing",
    desc: "Memahami perlindungan hak cipta naskah, lisensi penerbitan, regulasi literasi digital, pencegahan plagiasi, hingga persiapan penerbitan buku cetak ISBN dan e-book komunitas.",
    lessons: "📺 4 Video • 📄 3 Teks",
    score: null,
    status: "locked",
    req: "Lulus Modul 7",
  },
];

export default function ElearningPage() {
  const [modules, setModules] = useState(DEFAULT_MODULES);
  const [filter, setFilter] = useState("all");
  const [selectedModule, setSelectedModule] = useState(null);
  const [classroomData, setClassroomData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    async function loadApiModules() {
      try {
        const res = await api.elearning.getModules();
        if (res && res.success && res.data && res.data.length > 0) {
          // Process API data to compute status, desc, and req
          let foundActive = false;
          const processedModules = res.data.map((m, index) => {
            let status = "locked";
            let req = index > 0 ? `Lulus Modul ${res.data[index - 1].orderIndex}` : "";

            if (m.isCompleted) {
              status = "completed";
            } else if (!foundActive) {
              status = "active";
              foundActive = true;
            }

            return {
              ...m,
              id: m.id,
              order: m.orderIndex < 10 ? `0${m.orderIndex}` : `${m.orderIndex}`,
              title: m.title,
              desc: m.description || "Belum ada deskripsi",
              lessons: `📺 ${m.videoUrl ? 1 : 0} Video • 📝 ${m.quizzesCount || 0} Kuis`,
              score: m.quizScore ? `${m.quizScore} / 100` : null,
              status,
              req: status === "locked" ? req : "",
              videoUrl: m.videoUrl,
            };
          });

          setModules(processedModules);
        }
      } catch (err) {
        // Fallback to default curriculum modules
      }
    }
    loadApiModules();
  }, []);

  const completedCount = modules.filter((m) => m.status === "completed").length;
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  const filteredModules = useMemo(() => {
    if (filter === "all") return modules;
    return modules.filter((m) => m.status === filter);
  }, [modules, filter]);

  const openClassroom = async (mod) => {
    setSelectedModule(mod);
    setClassroomData(null);
    setQuizAnswers({});
    try {
      const res = await api.elearning.getClassroom(mod.id || mod.slug);
      if (res.success) {
        setClassroomData(res.data);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!classroomData || !classroomData.quizzes) return;
    
    // Validate that all questions have answers
    if (Object.keys(quizAnswers).length < classroomData.quizzes.length) {
      return alert("Harap jawab semua pertanyaan kuis terlebih dahulu.");
    }

    try {
      setSubmittingQuiz(true);
      const res = await api.elearning.submitQuiz(classroomData.id, quizAnswers);
      if (res.success) {
        alert(res.message);
        setSelectedModule(null); // Close modal
        // Trigger reload to update completion status (we can just reload page or recall fetch)
        window.location.reload(); 
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert("Gagal mengirim kuis.");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  return (
    <AuthGuard requiredRole="anggota">
      <div className="app-container">
      <SidebarParticipant activePath="/elearning" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box" }}>


          {/* Hero Banner */}
          <section className="catalog-hero-banner" style={{ marginBottom: "2rem" }}>
            <div className="catalog-hero-content">
              <div className="catalog-hero-text">
                <h1>Akademi Menulis &amp; Literasi KERTAS KATA</h1>
                <p>
                  Kurikulum terstruktur {modules.length} modul untuk membimbing pegiat literasi dan masyarakat Kabupaten Tangerang mulai dari dasar penalaran kritis, penulisan cerpen, liputan warga desa, hingga penerbitan buku fisik ber-ISBN.
                </p>
              </div>

              {/* Stats Counters */}
              <div className="catalog-hero-stats">
                <div className="hero-stat-item">
                  <span className="hero-stat-val">{modules.length}</span>
                  <span className="hero-stat-label">Total Modul</span>
                </div>
                <div className="hero-stat-item">
                  <span className="hero-stat-val" style={{ color: "#6ee7b7" }}>{completedCount}</span>
                  <span className="hero-stat-label">Lulus Kuis</span>
                </div>
                <div className="hero-stat-item">
                  <span className="hero-stat-val" style={{ color: "#fcd34d" }}>1</span>
                  <span className="hero-stat-label">Sedang Aktif</span>
                </div>
                <div className="hero-stat-item">
                  <span className="hero-stat-val" style={{ color: "#cbd5e1" }}>{Math.max(0, modules.length - completedCount - 1)}</span>
                  <span className="hero-stat-label">Terkunci</span>
                </div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", zIndex: 2, marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", fontWeight: 600, color: "#fff" }}>
                <span>Progress Pembelajaran Anda</span>
                <span>{progressPercent}% Selesai ({completedCount} dari {modules.length} Modul)</span>
              </div>
              <div className="stat-progress-bar" style={{ background: "rgba(255, 255, 255, 0.2)", height: "8px" }}>
                <div className="stat-progress-fill" style={{ width: `${progressPercent}%`, background: "var(--accent-500)" }}></div>
              </div>
            </div>
          </section>

          {/* Filter Pills */}
          <div className="catalog-filter-row" style={{ marginBottom: "1.5rem" }}>
            <div className="filter-tab-pills">
              <button className={`filter-pill-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
                Semua Modul ({modules.length})
              </button>
              <button className={`filter-pill-btn ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>
                ✓ Selesai ({completedCount})
              </button>
              <button className={`filter-pill-btn ${filter === "active" ? "active" : ""}`} onClick={() => setFilter("active")}>
                ▶ Sedang Aktif (1)
              </button>
              <button className={`filter-pill-btn ${filter === "locked" ? "active" : ""}`} onClick={() => setFilter("locked")}>
                🔒 Terkunci ({Math.max(0, modules.length - completedCount - 1)})
              </button>
            </div>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              Luluskan kuis tiap modul (min. 70%) untuk membuka modul berikutnya.
            </div>
          </div>

          {/* Modules Grid */}
          <section className="modules-catalog-grid" style={{ marginBottom: "2rem" }}>
            {filteredModules.map((mod) => (
              <div key={mod.id} className={`catalog-module-card ${mod.status}`}>
                <div className="card-header-row">
                  <span className="card-order-badge">Modul {mod.order}</span>
                  <span className={`card-status-pill status-${mod.status}`}>
                    {mod.status === "completed" ? "✓ Selesai" : mod.status === "active" ? "▶ Sedang Aktif" : "🔒 Terkunci"}
                  </span>
                </div>

                <h3 className="card-module-title">{mod.title}</h3>
                <p className="card-module-desc">
                  {mod.desc && mod.desc.length > 80 ? mod.desc.substring(0, 80) + "..." : mod.desc}
                </p>

                <div className="card-meta-row">
                  <span className="card-lesson-count">{mod.lessons}</span>
                  {mod.score ? (
                    <div className="card-score-info">
                      <span>Nilai Kuis:</span>
                      <span className="score-badge-green">{mod.score}</span>
                    </div>
                  ) : mod.status === "active" ? (
                    <div style={{ fontSize: "0.75rem", color: "#b45309", fontWeight: 700 }}>
                      Progres: Aktif
                    </div>
                  ) : (
                    <span style={{ fontSize: "0.6875rem", color: "var(--text-light)", fontWeight: 600 }}>
                      Syarat: {mod.req}
                    </span>
                  )}
                </div>

                {mod.status === "completed" ? (
                  <button type="button" className="card-action-btn btn-card-review" onClick={() => openClassroom(mod)}>
                    Ulas Kembali Materi
                  </button>
                ) : mod.status === "active" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                      <span>Progress Kuis</span>
                      <span style={{ fontWeight: 600 }}>0/100</span>
                    </div>
                    <button type="button" className="card-action-btn btn-card-active" onClick={() => openClassroom(mod)}>
                      Lanjutkan Materi &amp; Kuis
                    </button>
                  </div>
                ) : (
                  <button type="button" className="card-action-btn btn-card-locked" disabled>
                    🔒 Terkunci ({mod.req})
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Target Kelulusan Milestone Card */}
          <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)", borderRadius: "18px", padding: "1.75rem 2rem", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "rgba(255, 255, 255, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", flexShrink: 0 }}>
                🎓
              </div>
              <div>
                <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.125rem", fontWeight: 700 }}>Target Kelulusan: E-Sertifikat 32 JP &amp; Hak Cetak Buku</h4>
                <p style={{ fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.85)", marginTop: "0.25rem", maxWidth: "600px" }}>
                  Tuntaskan seluruh {modules.length} modul di atas untuk mendapatkan E-Sertifikat 32 JP ber-barcode resmi dan membuka fasilitas kurasi naskah cetak mandiri ber-ISBN!
                </p>
              </div>
            </div>
              <button
                type="button"
                className="btn-primary"
                style={{ background: "var(--accent-500)", padding: "0.75rem 1.5rem", fontSize: "0.875rem", borderRadius: "10px", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}
                onClick={() => {
                  const active = modules.find((m) => m.status === "active");
                  if (active) openClassroom(active);
                }}
              >
                Lanjutkan Modul {modules.find((m) => m.status === "active")?.order || (modules.length > 0 ? "Selanjutnya" : "")} →
              </button>
          </div>
        </main>
      </div>

      {/* Classroom Video & Material Drawer Modal */}
      {selectedModule && (
        <div className="modal-overlay active" onClick={() => setSelectedModule(null)}>
          <div className="modal-card" style={{ maxWidth: "780px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--primary-600)", fontWeight: 700 }}>RUANG BELAJAR VIRTUAL</span>
                <h3 style={{ fontSize: "1.2rem", margin: "0.25rem 0 0" }}>{selectedModule.title}</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedModule(null)}>
                &times;
              </button>
            </div>
            <div style={{ padding: "1.5rem", maxHeight: "75vh", overflowY: "auto" }}>
              <div style={{ borderRadius: "12px", overflow: "hidden", background: "#000", aspectRatio: "16/9", marginBottom: "1.25rem" }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedModule.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                  title={selectedModule.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <h4 style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "0.5rem" }}>Ringkasan Materi</h4>
              <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.7, marginBottom: "2rem" }}>
                {selectedModule.desc}
              </p>

              {classroomData && classroomData.quizzes && classroomData.quizzes.length > 0 && (
                <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e3a8a", marginBottom: "1.5rem" }}>📝 Evaluasi &amp; Kuis</h4>
                  {selectedModule.status === "completed" ? (
                    <div style={{ padding: "1rem", background: "#ecfdf5", color: "#065f46", borderRadius: "8px", border: "1px solid #a7f3d0" }}>
                      <strong>✓ Anda sudah lulus kuis modul ini.</strong><br/>
                      Nilai Anda: {selectedModule.score}
                    </div>
                  ) : (
                    <form onSubmit={handleQuizSubmit}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {classroomData.quizzes.map((q, i) => (
                          <div key={q.id}>
                            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#334155", marginBottom: "0.75rem" }}>
                              {i + 1}. {q.question}
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                              {q.options && q.options.map((opt, idx) => {
                                const val = ["A", "B", "C", "D"][idx];
                                return (
                                  <label key={idx} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#475569", cursor: "pointer", background: "#fff", padding: "0.75rem", borderRadius: "8px", border: quizAnswers[q.id] === val ? "1px solid #3b82f6" : "1px solid #e2e8f0" }}>
                                    <input 
                                      type="radio" 
                                      name={`quiz-${q.id}`} 
                                      value={val} 
                                      checked={quizAnswers[q.id] === val}
                                      onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: val })}
                                    />
                                    <span style={{ fontWeight: 600 }}>{val}.</span> {opt}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
                        <button type="submit" className="btn-primary" disabled={submittingQuiz}>
                          {submittingQuiz ? "Mengirim Jawaban..." : "Kirim Jawaban Kuis"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedModule(null)}>
                  Tutup Modul
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}
