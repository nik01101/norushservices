"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image';
import furnitureImage from '../../img/furniture.png';
import mountingImage from '../../img/mounting.png';
import trashImage from '../../img/trashremoval.png';
import movingImage from '../../img/moving.png';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel"


  export function LandingCarousel() {
    const plugin = React.useRef(
      Autoplay({
        delay:2000,
        playOnInit: true,
        stopOnInteraction: false
      })
    )


    return (
        <div className="flex justify-center items-center">
              <Carousel
              plugins={[plugin.current]}
              >
                <CarouselContent>
                <CarouselItem>
                    <Image
                      src={furnitureImage}
                      alt="waawaaa"
                      className="rounded-3xl"
                    />
                </CarouselItem>
                <CarouselItem>
                    <Image
                      src={mountingImage}
                      alt="waawaaa"
                      className="rounded-3xl"
                    />
                </CarouselItem>
                <CarouselItem>
                    <Image
                      src={trashImage}
                      alt="waawaaa"
                      className="rounded-3xl"
                    />
                </CarouselItem>
                <CarouselItem>
                    <Image
                      src={movingImage}
                      alt="waawaaa"
                      className="rounded-3xl"
                    />
                </CarouselItem>
                </CarouselContent>
              </Carousel>
            </div>
    )
}