
import { services } from '@/lib/data';
import type { Service } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import logo from '../img/logo_png.png';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function HomePage() {
  return (
    <>
      <section className="w-full  bodybg">
        <div className="container mx-auto px-8 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-7">
              <div className="mt-8">
                <Image 
                  src={logo} 
                  alt="No Rush Logo"
                  width={200}
                  height={100}
                />
              </div>
              <div className="space-y-7">
                <h1 className="text-5xl sm:text-5xl xl:text-8xl/none">
                  Reliable Help, Just a Click Away
                </h1>
                <p className="md:text-xl text-[black]">
                  No Rush offers professional furniture assembly, mounting, and moving services to make your life easier.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="#services"
                  className="btnbg inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Explore Services
                </Link>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Image
                src="https://picsum.photos/seed/hero/1200/800"
                alt="Hero"
                width={1200}
                height={800}
                className="mx-auto rounded-xl object-cover w-full lg:aspect-square"
                data-ai-hint="organized living room"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <section id="services" className="w-full py-12 md:py-24 lg:py-32 bodybg relative">
        <Image
          src="https://picsum.photos/seed/services-bg/1920/1080"
          alt="Abstract background"
          fill
          quality={50}
          className="object-cover -z-10 opacity-20"
          data-ai-hint="abstract texture"
        />
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-5xl">Our Services</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-neutral-950">
                From assembling flat-pack furniture to mounting your new TV, we've got you covered.
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service: Service) => (
              <Card key={service.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <Image
                    src={service.imageUrl}
                    alt={service.name}
                    width={600}
                    height={400}
                    className="aspect-video w-full object-cover"
                    data-ai-hint={service.imageHint}
                  />
                </CardHeader>
                <CardContent className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <CardTitle className="mb-2 font-headline">{service.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-2xl font-bold text-primary">${service.price}</p>
                    <Button asChild>
                      <Link href={`/book/${service.id}`}>
                        Book Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section id="testimonies" className="w-full py-12 md:py-24 lg:py-32 bodybg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-5xl">Happy Customers</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-neutral-950">
                Hear what our clients have to say about our services.
              </p>
            </div>
          </div>
          <div className="mx-auto grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/1/100/100" data-ai-hint="person face" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="font-bold text-lg">Jessica Day</CardTitle>
                    <p className="text-sm text-muted-foreground">Homeowner</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">"No Rush was a lifesaver! They assembled our nursery furniture quickly and flawlessly. The team was professional, friendly, and so careful. Highly recommend!"</p>
              </CardContent>
              <CardFooter className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/2/100/100" data-ai-hint="person face" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="font-bold text-lg">Mark S.</CardTitle>
                    <p className="text-sm text-muted-foreground">Small Business Owner</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">"The local moving service was exceptional. They handled our office move with incredible efficiency and care. Not a single item was damaged. Worth every penny."</p>
              </CardContent>
              <CardFooter className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/3/100/100" data-ai-hint="person face" />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="font-bold text-lg">Emily R.</CardTitle>
                    <p className="text-sm text-muted-foreground">Renter</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">"I used them for TV mounting and shelf installation in my new apartment. The technician was punctual, did a perfect job, and even cleaned up afterward. So impressed!"</p>
              </CardContent>
              <CardFooter className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
                <Star className="w-5 h-5 fill-primary text-primary" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
