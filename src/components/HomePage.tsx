import Link from 'next/link';
import Image from 'next/image';
import logo from '../img/logo_png.png';
import rodo from '../img/rodo.jpg'
import { TestimonialCarousel,TestimonialCarousel2 } from './ui/testimonies';
import { ServicesCards } from './ui/servicescards';


export function HomePage() {
  return (
    <>
      <section className="w-full bodybg">
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
      <ServicesCards></ServicesCards>
       <section id="about" className="w-full py-12 md:py-24 lg:py-32 bodybg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl">About No Rush</h2>
              <p className="text-muted-foreground md:text-xl/relaxed text-neutral-950">
                Hi, I'm Rodrigo! After years of struggling to assemble my own flat-pack furniture and seeing friends go through the same frustration, I founded No Rush. My mission is simple: to provide reliable, friendly, and high-quality help for those small but important tasks around the house. We take the stress out of setting up your home so you can enjoy it, no rush.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src={rodo}
                alt="Founder of No Rush"
                width={600}
                height={600}
                className="rounded-full object-cover aspect-square"
                data-ai-hint="friendly person portrait"
              />
            </div>
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
          <TestimonialCarousel/>
          <TestimonialCarousel2/>
        </div>
      </section>
    </>
  );
}
