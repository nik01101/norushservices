
import Image from 'next/image';
import rodo from '../../img/rodopic.jpg';

export default function AboutPage() {
  return (
    <div className="w-full py-12 md:py-24 lg:py-32 bodybg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl">About No Rush</h1>
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
              className="rounded-full object-cover aspect-square shadow-lg"
              data-ai-hint="friendly person portrait"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
