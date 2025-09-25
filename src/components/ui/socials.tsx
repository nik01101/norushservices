"use client";
import React, { useState, useEffect, useRef } from 'react'; 
import { Instagram, Facebook, Music } from 'lucide-react';
import Image from 'next/image';
import { animate, createScope } from 'animejs';
import rodo from '../../img/rodo.png'

export function SocialMedia() {
    const socialCardsData = [
        {
            id: 1,
            platform: 'instagram',
            handle: '@norushfurniture',
            icon: Instagram,
            link: 'https://www.instagram.com/norushfurniture/',
            alt: 'Instagram'
        },
        {
            id: 2,
            platform: 'facebook',
            handle: '@norushfurniture',
            icon: Facebook,
            link: 'https://www.facebook.com/norushfurniture/',
            alt: 'Facebook'
        },
        {
            id: 3,
            platform: 'tiktok',
            handle: '@norushfurniture',
            icon: Music, 
            link: 'https://www.tiktok.com/@norushfurniture',
            alt: 'TikTok'
        },
    ];

    const [centeredCardId, setCenteredCardId] = useState(socialCardsData[1].id);
    const [isMobile, setIsMobile] = useState(false);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const totalCards = socialCardsData.length;
    const cardAngle = 110 / totalCards;

    // Initialize card positions
    const getCardPosition = (index: number, centeredIndex: number) => {
        // Calculate the relative position from the centered card
        let relativeIndex = index - centeredIndex;
        
        // Wrap around for circular positioning
        if (relativeIndex > Math.floor(totalCards / 2)) {
            relativeIndex -= totalCards;
        } else if (relativeIndex < -Math.floor(totalCards / 2)) {
            relativeIndex += totalCards;
        }
        
        const rotationY = relativeIndex * cardAngle;
        // Responsive depth - less depth on mobile for better interaction
        const translateZ = isMobile ? 350 : 600;
        const scale = relativeIndex === 0 ? 1.1 : 0.9;
        const blur = relativeIndex === 0 ? 0 : 2;
        const zIndex = relativeIndex === 0 ? 20 : 10;
        
        return { rotationY, translateZ, scale, blur, zIndex };
    };

    const animateCards = (targetCenteredId: number) => {
        const centeredIndex = socialCardsData.findIndex(card => card.id === targetCenteredId);
        const currentCenteredIndex = socialCardsData.findIndex(card => card.id === centeredCardId);
        
        socialCardsData.forEach((card, index) => {
            const cardElement = cardsRef.current[index];
            const cardContent = cardElement?.querySelector('.card-content') as HTMLElement;
            
            if (cardElement && cardContent) {
                const { rotationY, translateZ, scale, blur, zIndex } = getCardPosition(index, centeredIndex);
                
                // Determine which card should flip to backface
                const isClickedCard = index === centeredIndex; // The card being moved to center
                const isCurrentCenter = index === currentCenteredIndex; // The card currently in center
                const isOtherSideCard = !isClickedCard && !isCurrentCenter; // The third card
                
                if (isOtherSideCard) {
                    // This card flips to show backface during transition, making it invisible
                    animate(cardElement, {
                        rotateY: `${rotationY + 180}deg`, // Add 180deg to show backface initially
                        translateZ: `${translateZ}px`,
                        duration: 400, // First half - flip to backface
                        ease: 'inCubic',
                        complete: () => {
                            // Add a delay before flipping back
                            setTimeout(() => {
                                animate(cardElement, {
                                    rotateY: `${rotationY}deg`,
                                    duration: 400,
                                    ease: 'outCubic'
                                });
                            }, 200); // 200ms delay before flip back
                        }
                    });
                } else {
                    // Normal animation for clicked card and current center
                    animate(cardElement, {
                        rotateY: `${rotationY}deg`,
                        translateZ: `${translateZ}px`,
                        duration: 800,
                        ease: 'outCubic'
                    });
                }
                
                // Content animation remains the same for all cards
                animate(cardContent, {
                    scale: scale,
                    filter: `blur(${blur}px)`,
                    duration: 800,
                    ease: 'outCubic',
                    begin: () => {
                        cardContent.style.zIndex = zIndex.toString();
                    }
                });
            }
        });
    };

    const handleCardClick = (cardId: number, link: string) => {
        console.log(`Clicked card ${cardId} (${socialCardsData.find(c => c.id === cardId)?.platform}), centered card is ${centeredCardId} (${socialCardsData.find(c => c.id === centeredCardId)?.platform})`);
        
        if (cardId === centeredCardId) {
            console.log('Opening link - this card is centered');
            window.open(link, '_blank');
        } else {
            console.log('Rotating to center - this card is on the side');
            setCenteredCardId(cardId);
        }
    };

    // Handle screen size detection
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        
        // Check on mount
        checkScreenSize();
        
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Initial setup and animation trigger
    useEffect(() => {
        animateCards(centeredCardId);
    }, [centeredCardId, isMobile]); // Re-animate when screen size changes

    // Initial positioning
    useEffect(() => {
        const centeredIndex = socialCardsData.findIndex(card => card.id === centeredCardId);
        
        socialCardsData.forEach((card, index) => {
            const cardElement = cardsRef.current[index];
            const cardContent = cardElement?.querySelector('.card-content') as HTMLElement;
            
            if (cardElement && cardContent) {
                const { rotationY, translateZ, scale, blur, zIndex } = getCardPosition(index, centeredIndex);
                
                // Set initial positions without animation
                cardElement.style.transform = `rotateY(${rotationY}deg) translateZ(${translateZ}px)`;
                cardContent.style.transform = `scale(${scale})`;
                cardContent.style.filter = `blur(${blur}px)`;
                cardContent.style.zIndex = zIndex.toString();
            }
        });
    }, []);

    return (
        <div className="relative w-full h-[600px] overflow-hidden flex items-center justify-center bg-[#00D6A8]">
            <div className="absolute w-64 h-64 bg-white opacity-20 rounded-full top-10 left-10 blur-3xl animate-blob"></div>
            <div className="absolute w-64 h-64 bg-white opacity-20 rounded-full bottom-10 right-10 blur-3xl animate-blob animation-delay-2000"></div>

            <div 
                ref={containerRef}
                className="relative w-[300px] h-[400px]"
                style={{
                    perspective: '3000px', // Increased from 2500px to accommodate greater depth
                    transformStyle: 'preserve-3d'
                }}
            >
                {socialCardsData.map((card, index) => {
                    const isCentered = card.id === centeredCardId;
                    
                    return (
                        <div
                            key={card.id}
                            ref={el => {
                                if (cardsRef.current) {
                                    cardsRef.current[index] = el;
                                }
                            }}
                            className="absolute w-full h-full flex justify-center items-center"
                            style={{
                                transformStyle: 'preserve-3d',
                                backfaceVisibility: 'hidden'
                            }}
                            onClick={() => handleCardClick(card.id, card.link)}
                        >
                            <div 
                                className="card-content w-64 h-96 bg-black text-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col justify-between items-center p-6 cursor-pointer hover:shadow-3xl"
                                style={{
                                    backfaceVisibility: 'hidden'
                                }}
                            >
                                <div className='flex flex-col items-center gap-2 mb-4'>
                                    <card.icon className='h-10 w-10 text-white'/>
                                    <h3 className='font-bold text-2xl uppercase'>{card.platform}</h3>
                                </div>
                                <div className='relative w-40 h-40 rounded-full overflow-hidden border-4 border-[#00D6A8] flex items-center justify-center'>
                                    <Image
                                        src={rodo}
                                        alt="wawaaa"
                                        layout='fill'
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                <p className='mt-4 text-xl font-semibold text-[#00D6A8]'>{card.handle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}