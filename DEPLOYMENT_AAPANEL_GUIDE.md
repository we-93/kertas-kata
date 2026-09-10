# 🚀 PANDUAN DEPLOYMENT KERTAS KATA KE VPS aaPanel
## Domain: **`kertaskata.my.id`**

Panduan praktis dan lengkap langkah demi langkah untuk men-deploy platform **KERTAS KATA** ke server Linux VPS Anda yang menggunakan panel kontrol **aaPanel** dan database **MySQL / MariaDB**.

---

## 🏛️ Arsitektur Server di aaPanel

```
                             [ Pengunjung / Browser ]
                                        │
                                        ▼ HTTPS (Port 443 - SSL Let's Encrypt)
                          ┌───────────────────────────┐
                          │   Nginx Web Server        │
                          │   (aaPanel Website)       │
                          └─────────────┬─────────────┘
                                        │
              ┌─────────────────────────┴─────────────────────────┐
              ▼                                                   ▼
      Rute Static HTML/CSS/JS                              Rute `/api/*`
    (21 Halaman Frontend)                           (Reverse Proxy ke Port 5000)
              │                                                   │
  /www/wwwroot/kertaskata.my.id/                                  ▼
                                                    ┌───────────────────────────┐
                                                    │   Node.js / PM2 Backend   │
                                                    │   (Express.js REST API)   │
                                                    └─────────────┬─────────────┘
                                                                  │ Prisma ORM
                                                                  ▼
                                                    ┌───────────────────────────┐
                                                    │   MySQL / MariaDB         │
                                                    │   (Database aaPanel)      │
                                                    └───────────────────────────┘
```

---

## 📋 Langkah 1: Buat Database MySQL di aaPanel

1. Buka dashboard web **aaPanel** Anda (misal `http://IP_VPS:8888`).
2. Masuk ke menu **Database** pada sidebar kiri.
3. Klik tombol **Add Database**:
   * **DBName:** `kertas_kata`
   * **DBType:** `MySQL` (utf8mb4)
   * **Username:** `kertas_kata`
   * **Password:** *(Buat password yang kuat dan catat)*
   * **Access Permission:** `Local server`
4. Klik **Submit**.
5. *(Opsional)*: Anda dapat mengklik tombol **phpMyAdmin** di baris database tersebut kapan saja untuk melihat isi tabel dan data secara visual.

---

## 📂 Langkah 2: Upload File Project ke VPS

1. Masuk ke menu **Files** di aaPanel, navigasi ke direktori `/www/wwwroot/`.
2. Buat folder baru dengan nama `kertaskata.my.id` (jika belum ada).
3. Upload seluruh file project repositori ini ke dalam `/www/wwwroot/kertaskata.my.id/`.
   * Struktur yang terbentuk di VPS:
     ```
     /www/wwwroot/kertaskata.my.id/
     ├── index.html
     ├── dashboard.html
     ├── admin.html
     ├── css/
     ├── js/
     │   └── api.js
     └── server/
         ├── package.json
         ├── .env
         ├── prisma/
         │   └── schema.mysql.prisma
         └── src/
     ```

---

## ⚙️ Langkah 3: Konfigurasi Database & Jalankan Migrasi di Server

Buka menu **Terminal** di aaPanel (atau login via SSH PuTTY/Terminal), lalu jalankan perintah berikut:

```bash
# 1. Pindah ke direktori backend server
cd /www/wwwroot/kertaskata.my.id/server

# 2. Salin skema MySQL menjadi skema aktif
cp prisma/schema.mysql.prisma prisma/schema.prisma

# 3. Edit file .env untuk mengisi password database
nano .env
```

Sesuaikan isi file `.env` di server:
```env
PORT=5000
NODE_ENV=production
DATABASE_URL="mysql://kertas_kata:PASSWORD_DATABASE_ANDA@localhost:3306/kertas_kata"
JWT_SECRET="kertas_kata_super_secure_jwt_key_tangerang_2026"
JWT_EXPIRES_IN="7d"
APP_URL="https://kertaskata.my.id"
CLIENT_URL="https://kertaskata.my.id"
```

Setelah disimpan (`Ctrl+O`, `Enter`, lalu `Ctrl+X`), jalankan:
```bash
# 4. Install dependencies
npm install

# 5. Sinkronisasi tabel ke database MySQL aaPanel
npx prisma db push

# 6. Masukkan data awal (Admin, E-Learning, E-Book, Kategori)
node prisma/seed.js
```

---

## 🚀 Langkah 4: Jalankan Node.js Service via aaPanel PM2

1. Di dashboard aaPanel, masuk ke menu **App Store** di sidebar kiri.
2. Cari dan pastikan **Node.js Version Manager** (atau **PM2 Manager**) sudah terinstal.
   * Pilih Node.js versi **v18.x** atau **v20.x** (LTS).
3. Buka **Node.js Project Manager** (atau PM2 Manager):
   * Klik **Add Node Project**:
     * **Project Name:** `kertas-kata-api`
     * **Path:** `/www/wwwroot/kertaskata.my.id/server`
     * **Run Opt:** `src/server.js`
     * **Run User:** `www`
     * **Port:** `5000`
   * Klik **Submit**.
4. Status proyek akan berubah menjadi **Running** (hijau).
   * *Fitur ini menjamin jika server VPS restart atau aplikasi mengalami error, PM2 akan otomatis menyalakannya kembali secara mandiri.*

---

## 🌐 Langkah 5: Setup Domain & Nginx Reverse Proxy di aaPanel

1. Masuk ke menu **Website** di sidebar aaPanel.
2. Klik **Add site**:
   * **Domain:** `kertaskata.my.id`
   * **Root Directory:** `/www/wwwroot/kertaskata.my.id`
   * **FTP & Database:** Tidak perlu dibuat ulang (karena database sudah dibuat di Langkah 1).
   * **PHP Version:** `pure static` (karena frontend berupa HTML statis dan API dilayani Node.js).
   * Klik **Submit**.

3. **Pasang SSL Gratis (HTTPS)**:
   * Pada baris situs `kertaskata.my.id`, klik tautan **SSL**.
   * Pilih tab **Let's Encrypt**.
   * Centang nama domain `kertaskata.my.id`.
   * Klik **Apply** -> Tunggu beberapa detik hingga sertifikat terbit.
   * Aktifkan toggle **Force HTTPS**.

4. **Konfigurasi Nginx Reverse Proxy untuk API**:
   * Masih pada pop-up setting situs `kertaskata.my.id`, pilih tab **Configuration file** (atau **URL rewrite / Reverse Proxy**).
   * Tambahkan blok berikut tepat di dalam blok `server { ... }`:

   ```nginx
   # 1. Reverse Proxy ke Backend API Express (Port 5000)
   location /api/ {
       proxy_pass http://127.0.0.1:5000/api/;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_cache_bypass $http_upgrade;
   }

   # 2. Layanan File Unggahan (Cover, Naskah PDF, E-Book)
   location /uploads/ {
       alias /www/wwwroot/kertaskata.my.id/server/uploads/;
       expires 30d;
       access_log off;
   }
   ```
   * Klik **Save**. Nginx akan otomatis memuat ulang konfigurasinya.

---

## 🔐 Kredensial Akun Default (Hasil Seeding Awal)

Setelah menjalankan `node prisma/seed.js`, akun berikut langsung dapat digunakan untuk login:

| Peran | Email | Kata Sandi | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Admin Utama** | `admin@kertaskata.my.id` | `AdminPassword2026!` | Akses penuh seluruh modul di `admin.html` & `kelola-*.html` |
| **Mentor Literasi** | `mentor.dian@kertaskata.my.id` | `MentorPassword2026!` | Akses review tulisan, inline review, & moderasi komunitas |
| **Anggota Sampel** | `rahmat.hidayat@gmail.com` | `MemberPassword2026!` | Akses `dashboard.html`, writing studio, & modul e-learning |

---

## 🩺 Pengujian & Verifikasi Setelah Deploy

1. Buka browser dan kunjungi: **`https://kertaskata.my.id`**
   * Halaman Landing Page publik harus terbuka cepat dengan gembok hijau HTTPS.
2. Uji endpoint API di browser: **`https://kertaskata.my.id/api/health`**
   * Output JSON yang benar:
     ```json
     {
       "status": "ok",
       "platform": "KERTAS KATA Kabupaten Tangerang API"
     }
     ```
3. Login ke Dashboard:
   * Klik tombol **Masuk** di navigasi `index.html`.
   * Masukkan email `admin@kertaskata.my.id` dan sandi `AdminPassword2026!`.
   * Sistem akan mengarahkan ke dashboard dengan token aktif!
