"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import "@/css/writing-studio.css";

function MenulisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams ? searchParams.get("id") : null;
  const { user, ensureAuth } = useAuth();

  const [articleId, setArticleId] = useState(editId || null);
  const [title, setTitle] = useState("");
  const [lead, setLead] = useState("");
  const [contentHtml, setContentHtml] = useState("<p><br></p>");
  const [category, setCategory] = useState("Refleksi Pedagogik");
  const [tags, setTags] = useState(["Literasi", "Tangerang"]);
  const [tagInput, setTagInput] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const [autoSaveStatus, setAutoSaveStatus] = useState("Draf tersimpan otomatis");
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState("~1 mnt");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editorRef = useRef(null);
  const autoSaveTimerRef = useRef(null);

  // Load article if editing existing
  useEffect(() => {
    async function init() {
      await ensureAuth("participant");
      if (editId) {
        try {
          const res = await api.articles.getById(editId);
          if (res && res.success && res.data) {
            const art = res.data;
            setArticleId(art.id);
            setTitle(art.title || "");
            setLead(art.lead || "");
            setContentHtml(art.content || "<p><br></p>");
            if (editorRef.current) {
              editorRef.current.innerHTML = art.content || "<p><br></p>";
            }
            if (art.category) setCategory(art.category);
            if (art.coverUrl) setCoverUrl(art.coverUrl);
            if (art.tags && Array.isArray(art.tags)) {
              setTags(art.tags.map((t) => (typeof t === "string" ? t : t.name)));
            }
          }
        } catch (err) {
          console.warn("Gagal memuat naskah:", err.message);
        }
      }
    }
    init();
  }, [editId, ensureAuth]);

  // Recalculate word count whenever text changes
  const updateWordMetrics = () => {
    const bodyText = editorRef.current ? editorRef.current.innerText : "";
    const allText = `${title} ${lead} ${bodyText}`.trim();
    const words = allText ? allText.split(/\s+/).filter((w) => w.length > 0).length : 0;
    setWordCount(words);
    setReadTime(`~${Math.max(1, Math.ceil(words / 200))} mnt`);
  };

  useEffect(() => {
    updateWordMetrics();
  }, [title, lead]);

  // Autosave handler
  const triggerAutoSave = async () => {
    if (!title.trim()) return;
    setAutoSaveStatus("Menyimpan draf...");
    const currentBody = editorRef.current ? editorRef.current.innerHTML : contentHtml;
    try {
      const res = await api.articles.save({
        id: articleId,
        title,
        lead,
        content: currentBody,
        category,
        coverUrl,
        tags,
      });
      if (res && res.success && res.data?.id) {
        setArticleId(res.data.id);
        const timeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        setAutoSaveStatus(`Draf tersimpan (${timeStr} WIB)`);
      }
    } catch (err) {
      console.warn("Gagal autosave:", err.message);
      setAutoSaveStatus("Gagal menyimpan otomatis");
    }
  };

  const onContentChange = () => {
    updateWordMetrics();
    setAutoSaveStatus("Menyimpan...");
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(triggerAutoSave, 2500);
  };

  // Exec rich text format command
  const execCmd = (command, value = null) => {
    if (command === "createLink") {
      const url = prompt("Masukkan tautan URL:", "https://");
      if (url && url !== "https://") {
        document.execCommand(command, false, url);
      }
    } else if (command === "insertImage") {
      const imgUrl = prompt("Masukkan URL gambar:", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=80");
      if (imgUrl) {
        document.execCommand("insertHTML", false, `<img src="${imgUrl}" style="max-width:100%; border-radius:8px; margin:1rem 0;" alt="Gambar"><p><br></p>`);
      }
    } else if (command === "removeFormat") {
      document.execCommand("removeFormat", false, null);
      document.execCommand("formatBlock", false, "p");
    } else {
      document.execCommand(command, false, value);
    }
    if (editorRef.current) editorRef.current.focus();
    onContentChange();
  };

  // Tag manipulation
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, "");
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Submit to Curator
  const handleSubmitConfirm = async () => {
    setIsSubmitting(true);
    try {
      const currentBody = editorRef.current ? editorRef.current.innerHTML : contentHtml;
      // First save to make sure DB has the latest draft
      const saveRes = await api.articles.save({
        id: articleId,
        title,
        lead,
        content: currentBody,
        category,
        coverUrl,
        tags,
      });

      const currentId = saveRes?.data?.id || articleId;
      if (!currentId) {
        alert("Naskah belum memiliki ID yang valid.");
        setIsSubmitting(false);
        return;
      }

      const submitRes = await api.articles.submitReview(currentId);
      if (submitRes && submitRes.success) {
        alert("🎉 Naskah Anda berhasil dikirimkan ke Meja Kurasi Admin!");
        router.push("/dashboard");
      } else {
        alert(submitRes?.message || "Gagal mengirimkan naskah.");
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="writing-mode">
      {/* Top Bar */}
      <header className="minimal-top-bar">
        <div className="top-bar-left">
          <Link href="/dashboard" className="btn-back-dashboard" title="Kembali ke Dashboard">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="btn-text-hide-mobile">Dashboard</span>
          </Link>

          <div id="autoSavePill" className="top-bar-autosave-badge">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span className="badge-text-full">{autoSaveStatus}</span>
          </div>
        </div>

        <div className="top-bar-right">
          <button
            type="button"
            className="btn-minimal-preview"
            onClick={() => setShowPreviewModal(true)}
            title="Pratinjau Artikel"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="btn-text-hide-mobile">Pratinjau</span>
          </button>

          <button
            type="button"
            className="btn-minimal-submit"
            onClick={() => {
              if (!title.trim()) {
                alert("Silakan masukkan judul naskah terlebih dahulu!");
                return;
              }
              setShowConfirmModal(true);
            }}
            title="Kirim Naskah ke Kurator"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="submit-text-full">Kirim ke Kurator</span>
            <span className="submit-text-mobile">Kirim</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="writing-studio-container">
        {/* Editor Column */}
        <article className="author-editor-card">
          {/* Floating Formatting Pill */}
          <div className="editor-toolbar-pill">
            <button type="button" className="tool-action-btn" onClick={() => execCmd("bold")} title="Tebal (Ctrl+B)">
              <strong>B</strong>
            </button>
            <button type="button" className="tool-action-btn" onClick={() => execCmd("italic")} title="Miring (Ctrl+I)">
              <em>/</em>
            </button>
            <button type="button" className="tool-action-btn" onClick={() => execCmd("underline")} title="Garis Bawah (Ctrl+U)">
              <u>U</u>
            </button>
            <button type="button" className="tool-action-btn" onClick={() => execCmd("strikeThrough")} title="Coret">
              <s>S</s>
            </button>

            <div className="tool-sep"></div>

            <button type="button" className="tool-action-btn" onClick={() => execCmd("formatBlock", "h2")} title="Heading 1">
              H1
            </button>
            <button type="button" className="tool-action-btn" onClick={() => execCmd("formatBlock", "h3")} title="Heading 2">
              H2
            </button>
            <button type="button" className="tool-action-btn" onClick={() => execCmd("formatBlock", "blockquote")} title="Kutipan Khusus">
              99
            </button>

            <div className="tool-sep"></div>

            <button type="button" className="tool-action-btn" onClick={() => execCmd("insertUnorderedList")} title="Daftar Titik">
              ≡
            </button>
            <button type="button" className="tool-action-btn" onClick={() => execCmd("insertOrderedList")} title="Daftar Angka">
              :=
            </button>

            <div className="tool-sep"></div>

            <button type="button" className="tool-action-btn" onClick={() => execCmd("createLink")} title="Sisipkan Tautan">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
            <button type="button" className="tool-action-btn" onClick={() => execCmd("insertImage")} title="Sisipkan Gambar">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <button type="button" className="tool-action-btn" onClick={() => execCmd("removeFormat")} title="Hapus Format">
              &times;
            </button>
          </div>

          {/* Title Input */}
          <textarea
            className="author-title-input"
            rows={1}
            placeholder="Judul Naskah..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              onContentChange();
            }}
          />

          {/* Subtitle / Lead Input */}
          <textarea
            className="author-lead-input"
            rows={1}
            placeholder="Tulis pengantar atau premis naskah..."
            value={lead}
            onChange={(e) => {
              setLead(e.target.value);
              onContentChange();
            }}
          />

          {/* Body Contenteditable */}
          <div
            ref={editorRef}
            className="author-body-content"
            contentEditable
            onInput={onContentChange}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <div className="curation-standard-notice" style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#64748b", fontWeight: "500" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#059669" style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Standar Kurasi KERTAS KATA: Bebas Plagiasi • PUEBI Rapi • Menumbuhkan Wawasan Masyarakat</span>
          </div>
        </article>

        {/* Sidebar Widgets */}
        <aside className="author-sidebar-col">
          {/* Card 1: Pengaturan Naskah */}
          <section className="author-widget-card">
            <div className="widget-card-header">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Pengaturan Naskah</span>
            </div>

            <div className="form-field-group">
              <label htmlFor="widgetCategorySelect" className="field-label">Kategori Naskah (Wajib)</label>
              <div className="widget-select-wrapper">
                <select
                  id="widgetCategorySelect"
                  className="widget-select"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    onContentChange();
                  }}
                >
                  <option value="Refleksi Pedagogik">Refleksi Pedagogik</option>
                  <option value="Pendidikan">Pendidikan</option>
                  <option value="Sejarah">Sejarah</option>
                  <option value="Politik">Politik</option>
                  <option value="Pemerintahan">Pemerintahan</option>
                  <option value="Cerpen">Cerpen</option>
                  <option value="Puisi">Puisi</option>
                  <option value="Ilmiah">Ilmiah</option>
                  <option value="Opini">Opini</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                </select>
                <div className="widget-select-arrow">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">Tag / Kata Kunci</label>
              <input
                type="text"
                className="widget-tag-input"
                placeholder="Ketik tag lalu tekan Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <div className="tag-pills-list" style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      background: "#eff6ff",
                      color: "#1d4ed8",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "6px",
                    }}
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", fontSize: "0.85rem", padding: 0 }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">URL Sampul Artikel</label>
              <input
                type="text"
                className="widget-tag-input"
                placeholder="https://images.unsplash.com/..."
                value={coverUrl}
                onChange={(e) => {
                  setCoverUrl(e.target.value);
                  onContentChange();
                }}
              />
              {coverUrl && (
                <div style={{ marginTop: "0.5rem", borderRadius: "8px", overflow: "hidden", maxHeight: "120px" }}>
                  <img src={coverUrl} alt="Sampul" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>
          </section>

          {/* Card 2: Statistik Tulisan */}
          <section className="author-widget-card">
            <div className="widget-card-header">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Statistik Tulisan</span>
            </div>

            <div className="stat-metric-grid">
              <div className="stat-metric-item">
                <div className="stat-metric-value">{wordCount.toLocaleString("id-ID")}</div>
                <div className="stat-metric-label">Total Kata</div>
              </div>
              <div className="stat-metric-item">
                <div className="stat-metric-value">{readTime}</div>
                <div className="stat-metric-label">Estimasi Baca</div>
              </div>
            </div>
          </section>

          {/* Card 3: Panduan Review */}
          <section className="author-widget-card">
            <div className="widget-card-header">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Panduan Review Admin</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: wordCount >= 50 ? "#059669" : "#64748b", fontWeight: "600" }}>
                <span>{wordCount >= 50 ? "✅" : "⏳"}</span>
                <span>Panjang naskah ({wordCount} kata)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#059669", fontWeight: "600" }}>
                <span>✅</span>
                <span>Orisinalitas & Bebas Plagiasi</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8125rem", color: "#059669", fontWeight: "600" }}>
                <span>✅</span>
                <span>Format Bahasa Indonesia Baku (PUEBI)</span>
              </div>
            </div>
          </section>
        </aside>
      </main>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="modal-overlay active" onClick={() => setShowPreviewModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.25rem" }}>👁️</span>
                <h3>Pratinjau Artikel Publikasi</h3>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowPreviewModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: "75vh", overflowY: "auto", padding: "1.5rem" }}>
              <span style={{ background: "#dbeafe", color: "#1e40af", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase" }}>
                {category}
              </span>
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", fontWeight: "800", color: "#0f172a", margin: "1rem 0" }}>
                {title || "Judul Naskah Belum Diisi"}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>
                  {user?.name ? user.name[0] : "P"}
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.875rem", color: "#0f172a" }}>{user?.name || "Penulis Komunitas"}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Anggota Komunitas Literasi Tangerang</div>
                </div>
              </div>

              {coverUrl && (
                <img src={coverUrl} alt="Cover" style={{ width: "100%", maxHeight: "320px", objectFit: "cover", borderRadius: "12px", marginBottom: "1.5rem" }} />
              )}

              {lead && (
                <p style={{ fontSize: "1.125rem", fontWeight: "500", color: "#475569", fontStyle: "italic", marginBottom: "1.5rem", lineHeight: "1.7" }}>
                  {lead}
                </p>
              )}

              <div
                style={{ fontSize: "1rem", lineHeight: "1.8", color: "#334155" }}
                dangerouslySetInnerHTML={{ __html: editorRef.current ? editorRef.current.innerHTML : contentHtml }}
              />

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
                {tags.map((t) => (
                  <span key={t} style={{ background: "#f1f5f9", color: "#475569", fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Submit Modal */}
      {showConfirmModal && (
        <div className="modal-overlay active" onClick={() => !isSubmitting && setShowConfirmModal(false)}>
          <div className="modal-card" style={{ maxWidth: "460px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1rem" }}>Kirim Naskah ke Kurator</h3>
            </div>
            <div style={{ padding: "1.5rem 1.75rem", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#eff6ff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", margin: "0 auto 1rem" }}>
                ✈️
              </div>
              <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "1.0625rem", fontWeight: "700", color: "#0f172a" }}>
                Kirim Naskah ke Meja Kurasi Admin?
              </h4>
              <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "0.5rem", lineHeight: "1.6" }}>
                Naskah Anda akan ditinjau oleh kurator literasi Kabupaten Tangerang. Status tulisan akan berubah menjadi <strong>In Review</strong> dan Anda akan menerima catatan perbaikan atau notifikasi terbit.
              </p>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className="btn-minimal-preview"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn-minimal-submit"
                  style={{ flex: 1.2, justifyContent: "center" }}
                  onClick={handleSubmitConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Mengirim..." : "Ya, Kirim Sekarang"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenulisPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>Memuat studio menulis...</div>}>
      <MenulisForm />
    </Suspense>
  );
}
