import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery of Completed Projects',
  description: 'View photos of recently completed furniture assembly, custom TV mounting, and home organization projects across New York City.',
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
