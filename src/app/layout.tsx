import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { fontList } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Print Studio',
  description: 'Preview a wide variety of fonts for your 3D printing projects.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        {fontList.map(([fontName, _]) => (
          <link
            key={fontName}
            href={`https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`}
            rel="stylesheet"
          />
        ))}
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
