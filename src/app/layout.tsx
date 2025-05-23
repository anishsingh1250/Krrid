import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Krrid - Learn Chess the Smart Way',
  description: 'Transform curiosity into strategic mastery with Krrid. Interactive chess learning platform for kids.',
  keywords: 'chess learning, kids chess, strategic thinking, educational chess, chess training',
  openGraph: {
    title: 'Krrid - Learn Chess the Smart Way',
    description: 'Transform curiosity into strategic mastery with Krrid.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}