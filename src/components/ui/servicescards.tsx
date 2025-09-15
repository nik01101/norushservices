
"use client"

import * as React from "react"
import { services } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';
import type { Service } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

export function ServicesCards() {

    return (
        <section id="services" className="w-full py-12 md:py-24 lg:py-32 sectionbg relative">
            <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                <h2 className="text-4xl sm:text-5xl">Our Services</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-neutral-950">
                    From assembling flat-pack furniture to mounting your new TV, we've got you covered.
                </p>
                </div>
            </div>
            <div className="mx-auto grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
                {services.map((service: Service) => (
                <Card key={service.id} className="bg-black text-white rounded-3xl overflow-hidden flex flex-col shadow-lg border-none">
                    <div className="p-2">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-blue-400">
                        <Image
                        src={service.imageUrl}
                        alt={service.name}
                        fill
                        className="object-cover"
                        data-ai-hint={service.imageHint}
                        />
                    </div>
                    </div>
                    <CardContent className="p-6 flex-grow flex flex-col">
                    <h3 className="font-headline text-3xl font-[Akira] uppercase text-[#00D6A8] leading-tight">{service.name}</h3>
                    <p className="mt-2 text-white/90 flex-grow">{service.description}</p>
                     {service.extraFee && (
                        <p className="mt-2 text-sm text-[#00D6A8]">{service.extraFee}</p>
                    )}
                    <div className="mt-6 flex justify-between items-end">
                        <p className="text-4xl font-bold text-[#00D6A8]">${service.price}/hr</p>
                        <Button asChild className="bg-[#00D6A8] text-black rounded-lg hover:bg-[#00b38f]">
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
    );
}
