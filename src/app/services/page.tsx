
import type { Metadata } from 'next';
import { ServicesCards } from '@/components/ui/servicescards';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore furniture assembly, TV wall mounting, trash removal, and local moving services in New York City with No Rush.',
};

export default function ServicesPage() {
  return (
    <div>
        <ServicesCards />
    </div>
  );
}
