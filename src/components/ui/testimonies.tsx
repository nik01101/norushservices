"use client"

import * as React from "react"
import AutoScroll from "embla-carousel-auto-scroll"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

export function TestimonialCarousel() {
  const plugin = React.useRef(
    AutoScroll({
      playOnInit: true,
      stopOnInteraction: false
    })
  )

  const testimonials = [
    {
      name: "Sarah L.",
      location: "Hoboken",
      avatarSeed: 1,
      fallback: "JD",
      quote: `“No Rush assembled my IKEA wardrobe perfectly. Super sturdy and quick.”`,
      stars: 5,
    },
    {
      name: "Michael R.",
      location: "Jersey City",
      avatarSeed: 2,
      fallback: "MS",
      quote: `“Jose was amazing! He built my bed frame and dresser in under two hours.”`,
      stars: 5,
    },
    {
      name: "Anna P.",
      location: "Brooklyn",
      avatarSeed: 3,
      fallback: "ER",
      quote: `“They put together my entire living room set—professional and friendly.”`,
      stars: 5,
    },
    {
      name: "Carlos M.",
      location: "Union City",
      avatarSeed: 4,
      fallback: "AP",
      quote: `“No Rush helped me move my one-bedroom safely and quickly.”`,
      stars: 5,
    },
    {
      name: "Diana H.",
      location: "Upper West Side",
      avatarSeed: 5,
      fallback: "SL",
      quote: `“Best moving service I’ve had in NYC—friendly and reliable.”`,
      stars: 5,
    }
  ];

  return (
    <div id="testcarousel" className="relative">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true, 
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`https://picsum.photos/seed/${testimonial.avatarSeed}/100/100`} />
                        <AvatarFallback>{testimonial.fallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="font-bold text-lg">{testimonial.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{testimonial.quote}</p>
                  </CardContent>
                  <CardFooter className="flex items-center gap-1">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export function TestimonialCarousel2() {
  const plugin = React.useRef(
    AutoScroll({
      playOnInit: true,
      stopOnInteraction: false,
      direction: "backward"
    })
  )

  const testimonials = [
    {
      name: "Sarah L.",
      location: "Hoboken",
      avatarSeed: 1,
      fallback: "JD",
      quote: `“No Rush assembled my IKEA wardrobe perfectly. Super sturdy and quick.”`,
      stars: 5,
    },
    {
      name: "Michael R.",
      location: "Jersey City",
      avatarSeed: 2,
      fallback: "MS",
      quote: `“Jose was amazing! He built my bed frame and dresser in under two hours.”`,
      stars: 5,
    },
    {
      name: "Anna P.",
      location: "Brooklyn",
      avatarSeed: 3,
      fallback: "ER",
      quote: `“They put together my entire living room set—professional and friendly.”`,
      stars: 5,
    },
    {
      name: "Carlos M.",
      location: "Union City",
      avatarSeed: 4,
      fallback: "AP",
      quote: `“No Rush helped me move my one-bedroom safely and quickly.”`,
      stars: 5,
    },
    {
      name: "Diana H.",
      location: "Upper West Side",
      avatarSeed: 5,
      fallback: "SL",
      quote: `“Best moving service I’ve had in NYC—friendly and reliable.”`,
      stars: 5,
    }
  ];

  return (
    <div id="testcarousel" className="relative">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true, 
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-1">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`https://picsum.photos/seed/${testimonial.avatarSeed}/100/100`} />
                        <AvatarFallback>{testimonial.fallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="font-bold text-lg">{testimonial.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{testimonial.quote}</p>
                  </CardContent>
                  <CardFooter className="flex items-center gap-1">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}