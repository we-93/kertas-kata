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

1. Di dashboard aaPanel, pastikan **Node.js** (versi v18.x atau v20.x LTS) dan **PM2** sudah terpasang.
2. Jalankan dua layanan menggunakan PM2:

### A. Layanan 1: Backend API Express (Port 5000)
Di terminal VPS:
```bash
cd /www/wwwroot/kertaskata.my.id/server
npm install
npx prisma generate
pm2 start src/server.js --name "kertaskata-api"
```

### B. Layanan 2: Next.js Frontend App Router (Port 3000)
Di root direktori repositori:
```bash
cd /www/wwwroot/kertaskata.my.id
npm install
npm run build
pm2 start npm --name "kertaskata-next" -- start -- -p 3000
```

Simpan konfigurasi PM2 agar otomatis menyala saat server VPS restart:
```bash
pm2 save
pm2 startup
```

---

## 🌐 Langkah 5: Setup Domain & Nginx Reverse Proxy di aaPanel

1. Masuk ke menu **Website** di sidebar aaPanel.
2. Klik **Add site**:
   * **Domain:** `kertaskata.my.id`
   * **Root Directory:** `/www/wwwroot/kertaskata.my.id`
   * **PHP Version:** `pure static`
   * Klik **Submit**.

3. **Pasang SSL Gratis (HTTPS)**:
   * Pada baris situs `kertaskata.my.id`, klik tautan **SSL**.
   * Pilih tab **Let's Encrypt**.
   * Centang nama domain `kertaskata.my.id`.
   * Klik **Apply** -> Aktifkan toggle **Force HTTPS**.

4. **Konfigurasi Nginx Reverse Proxy**:
   * Masih pada pop-up setting situs `kertaskata.my.id`, pilih tab **Configuration file**.
   * Ganti blok `location / { ... }` dengan proxy ke Next.js (Port 3000) dan Express (Port 5000):

```nginx
    # 1. Reverse Proxy Utama ke Aplikasi Next.js (Port 3000)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 2. Reverse Proxy ke Backend API Express (Port 5000)
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

    # 3. Layanan File Unggahan Fisik (Cover, Dokumen, E-Book)
    location /uploads/ {
        alias /www/wwwroot/kertaskata.my.id/server/uploads/;
        expires 30d;
        access_log off;
    }
```
   * Klik **Save**. Nginx akan otomatis memuat ulang konfigurasinya.

---

## 🔐 Kredensial Akun Default (Hasil Seeding Awal)

Setelah menjalankan `node prisma/seed.js` di folder `server/`, akun berikut langsung dapat digunakan untuk login:

| Peran | Email | Kata Sandi | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Admin Utama (Bersih)** | `admin@kertaskata.my.id` | `Semua123@` | Akses portal kurasi `/admin` dan seluruh menu `/admin/kelola-*` |
| **Anggota Peserta (Bersih)** | `raden@gmail.com` | `Semua123@` | Akses private `/dashboard`, studio `/menulis`, `/profil`, `/pengaturan`, `/elearning` |

---

## 🩺 Pengujian & Verifikasi Setelah Deploy

1. Buka browser dan kunjungi: **`https://kertaskata.my.id`**
   * Landing Page terbuka dengan URL bersih tanpa `.html`.
2. Buka Dashboard: **`https://kertaskata.my.id/dashboard`**
   * Menampilkan data statistik tulisan riil dari database.
3. Buka Portal Admin: **`https://kertaskata.my.id/admin`**
   * Menampilkan antrean naskah masuk, analitik, dan tools kurasi AI.
4. Buka Rute Kelola:
   * **`https://kertaskata.my.id/kelola-komunitas`** atau **`https://kertaskata.my.id/admin/kelola-komunitas`**
   * Kedua format URL terbuka sempurna.

