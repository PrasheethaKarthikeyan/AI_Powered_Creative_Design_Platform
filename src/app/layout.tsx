import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })


export const metadata: Metadata = {
  title: 'Visionary Care',
  description: 'An AI-powered application for daily eye health tracking and wellness.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
