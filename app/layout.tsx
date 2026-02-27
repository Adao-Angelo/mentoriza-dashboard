import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

import { Providers } from './providers';

import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'Mentoriza',
  description: 'Back-office da Mentoriza.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt' suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} antialiased font-body bg-white`}
      >
        <Providers>
          {children}
          <ConfirmDialog />
        </Providers>
      </body>
    </html>
  );
}
