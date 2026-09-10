import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'KERTAS KATA - Ekosistem Literasi & Publikasi Kabupaten Tangerang',
  description: 'Portal resmi literasi terpadu pendidik, pegiat literasi, dan komunitas membaca Kabupaten Tangerang. Menulis, kurasi naskah ber-ISBN, dan e-learning 32 JP.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
