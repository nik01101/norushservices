
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { galleryImages as imageManifest } from '@/app/lib/placeholder-images.json';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

// Dynamically import all images from the gallery folder
const imageContext = require.context('../../img/gallery', false, /\.(png|jpe?g|svg)$/);
const galleryImages = imageManifest.map(image => {
    const imageName = image.src.split('/').pop();
    return {
        ...image,
        src: imageContext(`./${imageName}`).default,
    };
});


export default function GalleryPage() {
  const [open, setOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openCarousel = (index: number) => {
    setSelectedIndex(index);
    setOpen(true);
  };
  
  useEffect(() => {
    if (open && carouselApi) {
        carouselApi.scrollTo(selectedIndex, true);
    }
  }, [open, carouselApi, selectedIndex]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl sm:text-5xl">Our Work</h1>
        <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-neutral-950">
          A collection of our recently completed projects.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {galleryImages.map((image, index) => (
          <Card
            key={image.id}
            className="overflow-hidden rounded-lg shadow-lg group cursor-pointer"
            onClick={() => openCarousel(index)}
          >
            <div className="relative aspect-square">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-90"
                data-ai-hint={image.hint}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder="blur"
              />
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-transparent border-none shadow-none p-0 w-full max-w-none h-screen flex items-center justify-center sm:max-w-none">
          <Carousel
            setApi={setCarouselApi}
            opts={{
              loop: true,
              startIndex: selectedIndex,
            }}
            className="w-full h-full"
          >
            <CarouselContent className="h-full">
              {galleryImages.map((image) => (
                <CarouselItem key={image.id} className="flex items-center justify-center p-4">
                  <div className="relative w-full h-[80vh] max-w-6xl">
                     <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-contain"
                        data-ai-hint={image.hint}
                        sizes="100vw"
                        placeholder="blur"
                      />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 text-white bg-black/50 hover:bg-black/75" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 text-white bg-black/50 hover:bg-black/75" />
          </Carousel>
        </DialogContent>
      </Dialog>
    </div>
  );
}
