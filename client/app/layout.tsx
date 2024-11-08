import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Go with Go',
  description: 'The game Go!, built with Go'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
