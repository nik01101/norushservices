
"use client";

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Instagram, Facebook, Music } from 'lucide-react';
import Image from 'next/image';
import rodo from '../../img/rodo.png';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SocialCardProps {
  id: number;
  platform: string;
  handle: string;
  icon: React.ElementType;
  link: string;
  alt: string;
  className?: string;
}

const SocialCard: React.FC<SocialCardProps> = ({ platform, handle, icon: Icon, link, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    const rotateX = -((y / height) * 2 - 1) * 15;
    const rotateY = ((x / width) * 2 - 1) * 15;

    anime({
      targets: cardRef.current,
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 300,
      easing: 'easeOutSine',
      transformPerspective: 1000,
    });
  };

  const handleMouseLeave = () => {
    anime({
      targets: cardRef.current,
      rotateX: 0,
      rotateY: 0,
      duration: 500,
      easing: 'easeOutElastic(1, .5)',
      transformPerspective: 1000,
    });
  };

  useEffect(() => {
    const cardElement = cardRef.current;
    if (cardElement) {
      cardElement.addEventListener('mousemove', handleMouseMove);
      cardElement.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (cardElement) {
        cardElement.removeEventListener('mousemove', handleMouseMove);
        cardElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <Link href={link} target="_blank" rel="noopener noreferrer" className="group transform-style-3d">
      <div 
        ref={cardRef} 
        className={cn("bg-black text-white rounded-lg overflow-hidden shadow-lg flex items-center p-4 transition-transform duration-300 ease-in-out group-hover:shadow-2xl relative", className)}
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#00D6A8] flex-shrink-0" style={{ transform: 'translateZ(20px)' }}>
          <Image
            src={rodo}
            alt="Rodrigo, founder of No Rush"
            layout='fill'
            className='object-cover'
          />
        </div>
        <div className="ml-4" style={{ transform: 'translateZ(10px)' }}>
          <div className='flex items-center gap-2'>
            <Icon className='h-5 w-5 text-white' />
            <h3 className='font-bold text-lg uppercase'>{platform}</h3>
          </div>
          <p className='text-md text-[#00D6A8]'>{handle}</p>
        </div>
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
            alt: 'Instagram',
            className: 'lg:row-start-2 lg:col-start-1'
        },
        {
            id: 2,
            platform: 'Facebook',
            handle: '@norushfurniture',
            icon: Facebook,
            link: 'https://www.facebook.com/norushfurniture/',
            alt: 'Facebook',
            className: 'lg:row-start-1 lg:col-start-2'
        },
        {
            id: 3,
            platform: 'TikTok',
            handle: '@norushfurniture',
            icon: Music, 
            link: 'https://www.tiktok.com/@norushfurniture',
            alt: 'TikTok',
            className: 'lg:row-start-2 lg:col-start-3'
        },
    ];

    return (
        <div className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center bg-[#00D6A8] relative overflow-hidden">
             <div className="relative z-10 space-y-4 text-center mb-12 px-4">
                <h2 className="text-4xl sm:text-5xl">Follow Us</h2>
                <p className="max-w-[900px] mx-auto text-neutral-950 md:text-xl/relaxed">
                    Check out our latest projects and updates on social media.
                </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 w-full max-w-6xl">
                {socialCardsData.map((card) => (
                    <SocialCard key={card.id} {...card} />
                ))}
            </div>
        </div>
    );
}
