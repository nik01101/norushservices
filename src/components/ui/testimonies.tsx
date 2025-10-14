"use client"

import * as React from "react"
import AutoScroll from "embla-carousel-auto-scroll"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { Badge } from '@/components/ui/badge';

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
      service: "Furniture Assembly",
      avatarSeed: 1,
      fallback: "SL",
      quote: `“No Rush assembled my IKEA wardrobe perfectly. Super sturdy and quick.”`,
      stars: 5,
    },
    {
      name: "Michael R.",
      location: "Jersey City",
      service: "Furniture Assembly",
      avatarSeed: 2,
      fallback: "MR",
      quote: `“Jose was amazing! He built my bed frame and dresser in under two hours.”`,
      stars: 5,
    },
    {
      name: "Anna P.",
      location: "Brooklyn",
      service: "Furniture Assembly",
      avatarSeed: 3,
      fallback: "AP",
      quote: `“They put together my entire living room set—professional and friendly.”`,
      stars: 5,
    },
    {
      name: "Luis G.",
      location: "Union City",
      service: "Furniture Assembly",
      avatarSeed: 4,
      fallback: "LG",
      quote: `“Fast, careful, and my bunk beds look great. Highly recommend No Rush.”`,
      stars: 5,
    },
    {
      name: "Emily D.",
      location: "Manhattan",
      service: "Furniture Assembly",
      avatarSeed: 5,
      fallback: "ED",
      quote: `“Jose handled my dining table and six chairs flawlessly.”`,
      stars: 5,
    },
    {
      name: "Brian K.",
      location: "Queens",
      service: "Furniture Assembly",
      avatarSeed: 6,
      fallback: "BK",
      quote: `“IKEA gave me a headache, but No Rush made it stress-free.”`,
      stars: 5,
    },
    {
      name: "Karen J.",
      location: "Weehawken",
      service: "Furniture Assembly",
      avatarSeed: 7,
      fallback: "KJ",
      quote: `“They even cleaned up all the boxes after assembling my office desk.”`,
      stars: 5,
    },
    {
      name: "Sophia M.",
      location: "Williamsburg",
      service: "Furniture Assembly",
      avatarSeed: 8,
      fallback: "SM",
      quote: `“Professional, detailed, and my West Elm console looks amazing.”`,
      stars: 5,
    },
    {
      name: "David H.",
      location: "Astoria",
      service: "Furniture Assembly",
      avatarSeed: 9,
      fallback: "DH",
      quote: `“Punctual, efficient, and very polite. Great experience.”`,
      stars: 5,
    },
    {
      name: "Nina S.",
      location: "Midtown NYC",
      service: "Furniture Assembly",
      avatarSeed: 10,
      fallback: "NS",
      quote: `“They assembled my Peloton and shelving perfectly. Worth every penny.”`,
      stars: 5,
    },
    {
      name: "Tomás F.",
      location: "Brooklyn Heights",
      service: "Furniture Assembly",
      avatarSeed: 11,
      fallback: "TF",
      quote: `“Super patient even with a complicated IKEA closet.”`,
      stars: 5,
    },
    {
      name: "Julia K.",
      location: "Lower East Side",
      service: "Furniture Assembly",
      avatarSeed: 12,
      fallback: "JK",
      quote: `“Quick, solid assembly and friendly service. Five stars!”`,
      stars: 5,
    },
    {
      name: "Carlos M.",
      location: "Union City",
      service: "Moving",
      avatarSeed: 13,
      fallback: "CM",
      quote: `“No Rush helped me move my one-bedroom safely and quickly.”`,
      stars: 5,
    },
    {
      name: "Diana H.",
      location: "Upper West Side",
      service: "Moving",
      avatarSeed: 14,
      fallback: "DH",
      quote: `“Best moving service I’ve had in NYC—friendly and reliable.”`,
      stars: 5,
    },
    {
      name: "Kevin P.",
      location: "Jersey City",
      service: "Moving",
      avatarSeed: 15,
      fallback: "KP",
      quote: `“Jose and his helper made moving day stress-free.”`,
      stars: 5,
    },
    {
      name: "Melissa F.",
      location: "Brooklyn",
      service: "Moving",
      avatarSeed: 16,
      fallback: "MF",
      quote: `“Careful with everything and super efficient. Great value.”`,
      stars: 5,
    },
    {
      name: "Alex R.",
      location: "Hoboken",
      service: "Moving",
      avatarSeed: 17,
      fallback: "AR",
      quote: `“On time, strong, and very organized. Made moving easy.”`,
      stars: 5,
    },
    {
      name: "Patricia V.",
      location: "Washington Heights",
      service: "Moving",
      avatarSeed: 18,
      fallback: "PV",
      quote: `“They handled heavy furniture up narrow stairs with no issues.”`,
      stars: 5,
    },
    {
      name: "Jason L.",
      location: "Queens",
      service: "Moving",
      avatarSeed: 19,
      fallback: "JL",
      quote: `“Great communication, fair price, and smooth move.”`,
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
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3 h-full">
              <div className="p-1 h-full">
                {/* Added flex, flex-col, and h-full to make cards equal height */}
                <Card className="bg-[white] flex flex-col h-full">
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
                  {/* Added flex-grow to make content area fill available space */}
                  <CardContent className="flex-grow">
                    {/* --- THIS IS THE NEW LINE --- */}
                    {/* Displaying the 'service' from your JSON as a Badge */}
                    <Badge variant="secondary" className="mb-3">{testimonial.service}</Badge>
                    
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
      name: "John W.",
      location: "Hoboken",
      service: "Mounting",
      avatarSeed: 20,
      fallback: "JW",
      quote: `“They mounted my 65” TV perfectly—centered and secure.”`,
      stars: 5,
    },
    {
      name: "Amira S.",
      location: "Downtown Brooklyn",
      service: "Mounting",
      avatarSeed: 21,
      fallback: "AS",
      quote: `“Mounted three TVs and two shelves, all flawless.”`,
      stars: 5,
    },
    {
      name: "Eric D.",
      location: "Astoria",
      service: "Mounting",
      avatarSeed: 22,
      fallback: "ED",
      quote: `“Very precise and professional. My TV looks amazing.”`,
      stars: 5,
    },
    {
      name: "Natalie B.",
      location: "Jersey City",
      service: "Mounting",
      avatarSeed: 23,
      fallback: "NB",
      quote: `“Jose explained the options and made sure I loved the placement.”`,
      stars: 5,
    },
    {
      name: "Samantha K.",
      location: "Manhattan",
      service: "Trash & Furniture Removal",
      avatarSeed: 24,
      fallback: "SK",
      quote: `“Removed my old couch and rug quickly. Affordable and easy.”`,
      stars: 5,
    },
    {
      name: "George L.",
      location: "Queens",
      service: "Trash & Furniture Removal",
      avatarSeed: 25,
      fallback: "GL",
      quote: `“Jose handled all the heavy lifting for disposal. Super convenient.”`,
      stars: 5,
    },
    {
      name: "Isabella P.",
      location: "Hoboken",
      service: "Trash & Furniture Removal",
      avatarSeed: 26,
      fallback: "IP",
      quote: `“They cleared out a whole room of furniture in under an hour.”`,
      stars: 5,
    },
    {
      name: "Anthony S.",
      location: "Jersey City",
      service: "Trash & Furniture Removal",
      avatarSeed: 27,
      fallback: "AS",
      quote: `“No Rush made disposal stress-free. Great communication.”`,
      stars: 5,
    },
    {
      name: "Marina C.",
      location: "Brooklyn",
      service: "Trash & Furniture Removal",
      avatarSeed: 28,
      fallback: "MC",
      quote: `“Prompt pickup and no hidden fees. Very professional.”`,
      stars: 5,
    },
    {
      name: "Daniel M.",
      location: "Weehawken",
      service: "Trash & Furniture Removal",
      avatarSeed: 29,
      fallback: "DM",
      quote: `“They even swept up after removing old furniture. Above and beyond.”`,
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
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3 h-full">
              <div className="p-1 h-full">
                {/* Added flex, flex-col, and h-full to make cards equal height */}
                <Card className="bg-[white] flex flex-col h-full">
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
                  {/* Added flex-grow to make content area fill available space */}
                  <CardContent className="flex-grow">
                    {/* --- THIS IS THE NEW LINE --- */}
                    {/* Displaying the 'service' from your JSON as a Badge */}
                    <Badge variant="secondary" className="mb-3">{testimonial.service}</Badge>
                    
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