"use client"

import {useRef}  from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image';
import furnitureImage from '../../img/landing/3.png';
import mountingImage from '../../img/landing/2.png';
import trashImage from '../../img/landing/trashremoval.png';
import movingImage from '../../img/landing/mount2.png';

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
                      alt="Expert furniture assembly service by No Rush in New York City"
                      className="rounded-3xl mx-auto"
                      quality={90}
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </CarouselItem>
                <CarouselItem>
                    <Image
                      src={mountingImage}
                      alt="Professional TV and wall mounting service in NYC"
                      className="rounded-3xl mx-auto"
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </CarouselItem>
                <CarouselItem>
                    <Image
                      src={trashImage}
                      alt="Prompt furniture and trash removal service"
                      className="rounded-3xl mx-auto"
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </CarouselItem>
                <CarouselItem>
                    <Image
                      src={movingImage}
                      alt="Local residential and office moving service in New York"
                      className="rounded-3xl mx-auto"
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
    )
}
