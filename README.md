# KERTAS KATA — Platform Literasi Digital Kabupaten Tangerang

Platform ekosistem literasi digital terintegrasi untuk Kabupaten Tangerang yang memfasilitasi penulisan naskah, kurasi editorial dengan AI Assistant, kelas e-learning, perpustakaan digital, forum komunitas, dan layanan penerbitan cetak mandiri ber-ISBN.

---

## 🌟 Fitur Utama

- **Studio Menulis Bebas Distraksi**: Editor teks kaya dengan penghitung kata real-time, autosave ke database, dan pengajuan kurasi otomatis.
- **Meja Kurasi Admin & AI Assistant**: Sistem penelaahan naskah editorial terintegrasi dengan Google Gemini 1.5 Flash (analisis tata bahasa PUEBI/KBBI, estimasi plagiasi, dan rekomendasi editorial).
- **Katalog Publikasi Karya Saya**: Pelacakan status naskah anggota secara transparan (*Draf*, *Sedang Review*, *Revisi*, *Terbit*) dan pembaca publik editorial.
- **Akademi E-Learning & Kuis**: Modul pembelajaran menulis berjenjang dengan evaluasi kuis kelulusan otomatis.
- **Perpustakaan Digital E-Book**: Koleksi bacaan gratis dan premium dengan pratinjau bab interaktif serta fitur rak buku personal.
- **Ruang Komunitas Literasi**: Forum diskusi publik dan ruang dialog privat untuk pegiat literasi di 28 kecamatan.
- **Layanan Cetak Naskah**: Kalkulator estimasi biaya cetak mandiri dan proyek antologi bunga rampai ber-ISBN.
- **Verifikasi E-Sertifikat 32 JP**: Validasi keaslian nomor sertifikat digital secara publik.

---

## 🛠️ Arsitektur Teknologi

- **Frontend**: HTML5 Semantik, CSS3 Modern (Vanilla Design System, Glassmorphism, Micro-animations), Vanilla JavaScript (ES6+ Modules).
- **Backend**: Node.js & Express.js REST API.
- **ORM & Database**: Prisma ORM.
  - **Lokal**: SQLite (`dev.db`) — tanpa instalasi server database terpisah.
  - **Produksi**: MySQL / MariaDB di aaPanel.
- **Keamanan**: JWT (JSON Web Token), bcryptjs password hashing, CORS protection, helmet security headers.

---

## 🚀 Panduan Menjalankan di Komputer Lokal

### 1. Prasyarat
- Node.js (versi 18 ke atas) & npm.

### 2. Instalasi Dependensi
```bash
cd server
npm install
```

### 3. Konfigurasi Environment
Salin template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
*(Opsional: Masukkan `GEMINI_API_KEY` dari [Google AI Studio](https://aistudio.google.com/) untuk mengaktifkan AI live).*

### 4. Setup Database SQLite & Seeding
```bash
# Generate Prisma Client & buat file dev.db
npx prisma db push

# Jalankan Seeding (Otomatis mengisi akun demo & sampel data untuk pengujian lokal)
node prisma/seed.js
```

### 5. Jalankan Server
```bash
npm run dev
```

Buka peramban di:
- **Web Portal**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 🔑 Akun Bersih Pengujian (Hasil Seeding)
- **Administrator Kurasi**: `admin@kertaskata.my.id` | Password: `Semua123@`
- **Anggota Peserta**: `raden@gmail.com` | Password: `Semua123@`

---

## 🌐 Panduan Deployment di VPS aaPanel

Panduan langkah demi langkah lengkap untuk konfigurasi MySQL, PM2 Node.js Project Manager, Nginx Reverse Proxy, dan SSL Let's Encrypt gratis dapat dibaca di berkas **[DEPLOYMENT_AAPANEL_GUIDE.md](DEPLOYMENT_AAPANEL_GUIDE.md)**.

### Ringkasan Perintah di Terminal VPS:
```bash
# 1. Clone repository dari GitHub
git clone https://github.com/we-93/kertas-kata.git /www/wwwroot/kertaskata.my.id
cd /www/wwwroot/kertaskata.my.id/server

# 2. Install dependensi
npm install --production

# 3. Setup .env produksi (Pastikan NODE_ENV=production dan DATABASE_URL mengarah ke MySQL aaPanel)
cp .env.example .env
nano .env

# 4. Push skema database MySQL
npx prisma db push --schema=prisma/schema.mysql.prisma

# 5. Seeding Produksi (BERSIH: hanya membuat akun Super Admin & master badges, TANPA dummy data)
NODE_ENV=production node prisma/seed.js

# 6. Jalankan via Node.js Project Manager / PM2 di aaPanel
pm2 start src/server.js --name "kertas-kata-backend"
```

---

## 📄 Lisensi
Hak Cipta © 2026 Komunitas KERTAS KATA Kabupaten Tangerang. Seluruh hak cipta dilindungi.
