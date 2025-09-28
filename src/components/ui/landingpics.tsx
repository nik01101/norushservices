"use client"

import {useRef}  from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image';
import furnitureImage from '../../img/gallery/1.png';
import mountingImage from '../../img/gallery/2.png';
import trashImage from '../../img/gallery/3.png';
import movingImage from '../../img/gallery/4.png';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel"


  export function LandingCarousel() {
    const plugin = useRef(
      Autoplay({
        delay:2000,
        playOnInit: true,
        stopOnInteraction: false
      })
    )


    return (
        <div>
              <Carousel
              plugins={[plugin.current]}
              >
                <CarouselContent className="gap-4">
                <CarouselItem>
                    <Image
                      src={furnitureImage}
                      alt="waawaaa"
                      className="rounded-3xl"
                      quality="100"
                    />
                </CarouselItem>
                <CarouselItem>
                    <Image
                      src={mountingImage}
                      alt="waawaaa"
                      className="rounded-3xl"
                      quality="100"
                    />
                </CarouselItem>
                <CarouselItem>
                    <Image
                      src={trashImage}
                      alt="waawaaa"
                      className="rounded-3xl"
                      quality="100"
                    />
                </CarouselItem>
                <CarouselItem>
                    <Image
                      src={movingImage}
                      alt="waawaaa"
                      className="rounded-3xl"
                      quality="100"
                    />
                </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
    )
}
