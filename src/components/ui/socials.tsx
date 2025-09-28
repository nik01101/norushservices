
"use client";

import { Instagram, Facebook, Music } from 'lucide-react';
import Image from 'next/image';
import rodo from '../../img/rodo.png';
import Link from 'next/link';

export function SocialMedia() {
    const socialCardsData = [
        {
            id: 1,
            platform: 'Instagram',
            handle: '@norushfurniture',
            icon: Instagram,
            link: 'https://www.instagram.com/norushfurniture/',
            alt: 'Instagram'
        },
        {
            id: 2,
            platform: 'Facebook',
            handle: '@norushfurniture',
            icon: Facebook,
            link: 'https://www.facebook.com/norushfurniture/',
            alt: 'Facebook'
        },
        {
            id: 3,
            platform: 'TikTok',
            handle: '@norushfurniture',
            icon: Music, 
            link: 'https://www.tiktok.com/@norushfurniture',
            alt: 'TikTok'
        },
    ];

    return (
        <div className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden flex flex-col items-center justify-center bg-[#00D6A8]">
            <div className="absolute w-64 h-64 bg-white/20 rounded-full top-10 left-10 blur-3xl animate-blob"></div>
            <div className="absolute w-64 h-64 bg-white/20 rounded-full bottom-10 right-10 blur-3xl animate-blob animation-delay-2000"></div>

             <div className="space-y-4 text-center mb-12">
                <h2 className="text-4xl sm:text-5xl">Follow Us</h2>
                <p className="max-w-[900px] mx-auto text-neutral-950 md:text-xl/relaxed">
                    Check out our latest projects and updates on social media.
                </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8 px-4">
                {socialCardsData.map((card) => (
                    <Link key={card.id} href={card.link} target="_blank" rel="noopener noreferrer">
                        <div className="w-64 h-96 bg-black text-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col justify-between items-center p-6 cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-3xl">
                            <div className='flex flex-col items-center gap-2 mb-4'>
                                <card.icon className='h-10 w-10 text-white'/>
                                <h3 className='font-bold text-2xl uppercase'>{card.platform}</h3>
                            </div>
                            <div className='relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#00D6A8] flex items-center justify-center'>
                                <Image
                                    src={rodo}
                                    alt="Rodrigo, founder of No Rush"
                                    layout='fill'
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <p className='mt-4 text-xl font-semibold text-[#00D6A8]'>{card.handle}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
