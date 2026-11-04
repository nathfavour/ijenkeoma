import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0B0F19',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Ìjènkéọ́mā — Multimodal Transit & Ground-Truth Intelligence',
  description: "Africa's real-time multimodal navigation, visual proofing, ground-truth transit consensus pricing, and B2B mobility data intelligence engine.",
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ìjènkéọ́mā',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Ìjènkéọ́mā Multimodal Transit Engine',
    description: "Africa's real-time multimodal navigation, visual proofing, ground-truth transit consensus pricing, and B2B mobility data intelligence engine.",
    type: 'website',
    url: 'https://ijenkeoma.com',
    siteName: 'Ìjènkéọ́mā',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ìjènkéọ́mā Multimodal Transit Engine',
    description: "Africa's real-time multimodal navigation, visual proofing, ground-truth transit consensus pricing, and B2B mobility data intelligence engine.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
