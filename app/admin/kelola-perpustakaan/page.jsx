"use client";

import { useState } from "react";
import SidebarAdmin from "@/components/SidebarAdmin";
import TopHeader from "@/components/TopHeader";
import "@/css/dashboard.css";
import "@/css/admin.css";

const INITIAL_BOOKS = [
  { id: "1", title: "Bunga Rampai: Mozaik Kisah Benteng Heritage Tangerang", author: "Komunitas Penulis KERTAS KATA", isbn: "978-623-09-8812-4", pages: 184, isFree: true, downloads: 420 },
  { id: "2", title: "Panduan Literasi Kritis & Penulisan Opini Publik", author: "Tim Litbang Dispusipda Tangerang", isbn: "978-623-09-8813-1", pages: 142, isFree: true, downloads: 680 },
  { id: "3", title: "Menelusuri Jejak Pesisir Utara: Riwayat Nelayan Mauk & Kronjo", author: "Dian Pratama, M.Hum.", isbn: "978-623-09-8814-8", pages: 210, isFree: false, downloads: 150 },
];

export default function KelolaPerpustakaanPage() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newIsbn, setNewIsbn] = useState("");
  const [newPages, setNewPages] = useState(100);

  const handleAdd = (e) => {
    e.preventDefault();
    const nb = {
      id: String(Date.now()),
      title: newTitle,
      author: newAuthor,
      isbn: newIsbn || "978-623-09-xxxx-x",
      pages: newPages,
      isFree: true,
      downloads: 0,
    };
    setBooks([nb, ...books]);
    setShowAddModal(false);
    setNewTitle("");
    setNewAuthor("");
    alert("🎉 Buku digital baru berhasil ditambahkan ke perpustakaan!");
  };

  return (
    <div className="app-container">
      <SidebarAdmin activePath="/admin/kelola-perpustakaan" />

      <div className="main-wrapper" style={{ marginRight: 0 }}>
        <TopHeader isAdminMode={true} />

        <main className="content-body" style={{ marginRight: 0, maxWidth: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          <section className="admin-welcome-banner">
            <div className="admin-banner-glow"></div>
            <div className="admin-banner-content">
              <div className="admin-banner-texts">
                <h1>Kelola Koleksi <span>Perpustakaan Digital</span></h1>
                <p>Tambah koleksi buku digital, atur izin akses (publik/eksklusif), input nomor ISBN resmi, dan pantau angka unduhan koleksi literasi.</p>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                  style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)", border: "none", padding: "0.75rem 1.25rem", color: "#fff", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}
                >
                  + Unggah E-Book Baru
                </button>
              </div>
            </div>
          </section>

          <section className="review-queue-card">
            <div className="queue-header-bar">
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.15rem", fontWeight: 800 }}>
                Katalog Buku Digital ({books.length})
              </h2>
            </div>

            <div className="table-responsive-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Judul Buku</th>
                    <th>Penulis / Editor</th>
                    <th>Nomor ISBN</th>
                    <th>Tebal</th>
                    <th>Tipe Akses</th>
                    <th>Total Unduhan</th>
                    <th style={{ textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{b.title}</div>
                      </td>
                      <td>{b.author}</td>
                      <td><code>{b.isbn}</code></td>
                      <td>{b.pages} hlm</td>
                      <td>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: b.isFree ? "#059669" : "#b45309" }}>
                          {b.isFree ? "Gratis Publik" : "Premium"}
                        </span>
                      </td>
                      <td>{b.downloads} kali</td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus buku "${b.title}"?`)) {
                              setBooks(books.filter((item) => item.id !== b.id));
                            }
                          }}
                          style={{ padding: "0.35rem 0.65rem", borderRadius: "6px", border: "1px solid #fee2e2", background: "#fef2f2", color: "#dc2626", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {showAddModal && (
        <div className="modal-overlay active" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: "1.1rem" }}>Unggah E-Book Baru</h3>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAdd} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Judul Buku</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Penulis / Tim Penyusun</label>
                <input type="text" value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} required style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Nomor ISBN Perpusnas</label>
                <input type="text" placeholder="978-623-09-xxxx-x" value={newIsbn} onChange={(e) => setNewIsbn(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "0.25rem" }}>Jumlah Halaman</label>
                <input type="number" value={newPages} onChange={(e) => setNewPages(Number(e.target.value))} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--border-subtle)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Batal</button>
                <button type="submit" className="btn-primary">Simpan ke Perpustakaan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
