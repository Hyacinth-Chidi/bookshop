import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import QueryProvider from '@/components/providers/QueryProvider';
// import { StudentAuthProvider } from '@/context/StudentAuthContext'; // INACTIVE

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ESUT Bookshop - Check Book Availability Online',
  description: 'Browse and check availability of academic books at ESUT Bookshop before visiting.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AdminAuthProvider>
            {/* ================================================
                INACTIVE FEATURE - STUDENT AUTH PROVIDER
                ================================================
                To activate:
                1. Uncomment the import above
                2. Uncomment the provider below
                ================================================ */}
            {/* <StudentAuthProvider> */}
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#1f150f',
                },
                success: {
                  iconTheme: {
                    primary: '#4a7a57',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#c94b38',
                    secondary: '#fff',
                  },
                },
              }}
            />
            {/* </StudentAuthProvider> */}
          </AdminAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
