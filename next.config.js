/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: false,
  async rewrites() {
    return [
      // Proxy API requests ke Express backend
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api/:path*',
      },
      // Proxy static uploads ke Express backend
      {
        source: '/uploads/:path*',
        destination: 'http://127.0.0.1:5000/uploads/:path*',
      },
      // Clean flat aliases untuk halaman manajemen admin
      {
        source: '/kelola-anggota',
        destination: '/admin/kelola-anggota',
      },
      {
        source: '/kelola-elearning',
        destination: '/admin/kelola-elearning',
      },
      {
        source: '/kelola-publikasi',
        destination: '/admin/kelola-publikasi',
      },
      {
        source: '/kelola-perpustakaan',
        destination: '/admin/kelola-perpustakaan',
      },
      {
        source: '/kelola-komunitas',
        destination: '/admin/kelola-komunitas',
      },
      {
        source: '/kelola-cetak',
        destination: '/admin/kelola-cetak',
      },
      {
        source: '/kelola-sertifikat',
        destination: '/admin/kelola-sertifikat',
      },
      {
        source: '/kelola-pengaturan',
        destination: '/admin/kelola-pengaturan',
      },
    ];
  },
};

module.exports = nextConfig;
