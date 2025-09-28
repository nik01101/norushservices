
"use client";

import { Instagram, Facebook, Music } from 'lucide-react';
import Image from 'next/image';
import rodo from '../../img/rodo.png';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface SocialCardProps {
  id: number;
  platform: string;
  handle: string;
  icon: React.ElementType;
  link: string;
  alt: string;
}

const SocialCard: React.FC<SocialCardProps> = ({ id, platform, handle, icon: Icon, link }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      anime({
        targets: card,
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.05,
        duration: 300,
        easing: 'easeOutSine',
      });
    };

    const handleMouseLeave = () => {
      anime({
        targets: card,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 500,
        easing: 'easeOutElastic(1, .5)',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Link href={link} target="_blank" rel="noopener noreferrer">
      <div ref={cardRef} className="w-64 h-96 bg-black text-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col justify-between items-center p-6 cursor-pointer" style={{ transformStyle: 'preserve-3d' }}>
          <div className='flex flex-col items-center gap-2 mb-4' style={{ transform: 'translateZ(20px)' }}>
              <Icon className='h-10 w-10 text-white'/>
              <h3 className='font-bold text-2xl uppercase'>{platform}</h3>
          </div>
          <div className='relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#00D6A8] flex items-center justify-center' style={{ transform: 'translateZ(40px)' }}>
              <Image
                  src={rodo}
                  alt="Rodrigo, founder of No Rush"
                  layout='fill'
                  className='w-full h-full object-cover'
              />
          </div>
          <p className='mt-4 text-xl font-semibold text-[#00D6A8]' style={{ transform: 'translateZ(20px)' }}>{handle}</p>
      </div>
    </Link>
  );
};


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
             <div className="space-y-4 text-center mb-12">
                <h2 className="text-4xl sm:text-5xl">Follow Us</h2>
                <p className="max-w-[900px] mx-auto text-neutral-950 md:text-xl/relaxed">
                    Check out our latest projects and updates on social media.
                </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8 px-4" style={{ perspective: '1000px' }}>
                {socialCardsData.map((card) => (
                    <SocialCard key={card.id} {...card} />
                ))}
            </div>
        </div>
    );
}
