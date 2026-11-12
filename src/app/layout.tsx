import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Workspace Studio | Build a space for your best work',
  description: 'Make yourself at home in Bali. Build your ideal work setup, see it come together, and explore flexible equipment rental.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
