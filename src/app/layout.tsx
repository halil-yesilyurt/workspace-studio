import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Workspace Builder | Bali Rental Concept',
  description: 'Design your Bali workspace. Choose a standing desk, chair and accessories, see a live preview, and explore equipment rental at monis.rent.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
