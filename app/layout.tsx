import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TicTacToe - Play Online",
  description: "Play Tic-tac-toe with friends or challenge our AI! Multiple game modes, real-time gameplay, and smart AI opponent.",
  metadataBase: new URL('https://khurram-tictactoe.netlify.app'),
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'TicTacToe - Play Online',
    description: 'Play Tic-tac-toe with friends or challenge our AI! Multiple game modes, real-time gameplay, and smart AI opponent.',
    images: [{
      url: '/social-preview.png',
      width: 1200,
      height: 630,
      alt: 'TicTacToe Game Preview',
    }],
    type: 'website',
    siteName: 'TicTacToe',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TicTacToe - Play Online',
    description: 'Play Tic-tac-toe with friends or challenge our AI! Multiple game modes, real-time gameplay, and smart AI opponent.',
    images: ['/social-preview.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <div style={{ paddingTop: '80px' }}>
          <main className="flex-grow flex items-center justify-center">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
