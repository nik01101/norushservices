
import Link from 'next/link';
import Image from 'next/image';
import type { Service } from '@/lib/types';
import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import furnitureImage from '../../img/landing/1.png';
import mountingImage from '../../img/landing/2.png';
import trashImage from '../../img/landing/3.png';
import movingImage from '../../img/landing/4.png';

const localServices = [
    { id: 1, serviceId: 'furniture-assembly', name: 'Furniture Assembly', description: 'Expert assembly for your flat-pack furniture. Quick, reliable, and hassle-free.', price: 50, imageUrl: furnitureImage, imageHint: 'furniture assembly', extraFee: 'The minimum service time is 2 hours.'},
    { id: 2, serviceId: 'tv-mounting', name: 'Mounting', description: 'Secure and professional mounting services for any wall type.', price: 50, imageUrl: mountingImage, imageHint: 'living room'},
    { id: 3, serviceId: 'trash-removal', name: 'Trash Removal Furniture', description: 'Efficient removal of unwanted furniture and trash. Extra fee may apply based on weight.', price: 50, imageUrl: trashImage, imageHint: 'trash furniture removal', extraFee: 'Extra fee depending on weight'},
    { id: 4, serviceId: 'local-moving', name: 'Moving', description: 'Efficient and careful moving services for your home or office within the city.', price: 80, imageUrl: movingImage, imageHint: 'moving boxes'},
];

export function ServicesCards() {
    const services = localServices;

    return (
        <section id="services" className="w-full py-12 md:py-24 lg:py-32 sectionbg relative">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                <h2 className="text-4xl sm:text-5xl">Our Services</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-neutral-950">
                    From assembling flat-pack furniture to mounting your new TV, we've got you covered.
                </p>
                </div>
            </div>
            <div className="container mx-auto px-8 md:px-6 py-9">
                    <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4 justify-center">
                        {services.map((service) => (
                        <Card key={service.serviceId} className="mx-auto bg-black text-white rounded-3xl overflow-hidden flex flex-col shadow-lg border-none max-w-sm">
                            <div className="p-2">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ">
                                <Image
                                src={service.imageUrl}
                                alt={service.name}
                                fill
                                className="object-cover"
                                data-ai-hint={service.imageHint}
                                quality="100"
                                placeholder="blur"
                                />
                            </div>
                            </div>
                            <CardContent className="p-6 flex-grow flex flex-col">
                            <h3 className="font-headline text-3xl font-[Akira] uppercase text-[white] leading-tight">{service.name}</h3>
                            <p className="mt-2 text-white/90 flex-grow">{service.description}</p>
                            {service.extraFee && (
                                <p className="mt-2 text-sm text-[#00D6A8]">{service.extraFee}</p>
                            )}
                            <div className="mt-6 flex justify-between items-end">
                                <p className="text-4xl font-bold text-[#00D6A8]">${service.price}/hr</p>
                                <Button asChild className="bg-[#00D6A8] text-black rounded-lg hover:bg-[#00b38f]">
                                <Link href={`/book/${service.serviceId}`}>
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
