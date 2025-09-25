
import Image from 'next/image';
import { galleryImages } from '@/app/lib/placeholder-images.json';
import { Card } from '@/components/ui/card';

export default function GalleryPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl sm:text-5xl">Our Work</h1>
        <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-neutral-950">
          A collection of our recently completed projects.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryImages.map((image) => (
          <Card key={image.id} className="overflow-hidden rounded-lg shadow-lg">
            <div className="relative aspect-square">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                data-ai-hint={image.hint}
                width={400}
                height={400}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
