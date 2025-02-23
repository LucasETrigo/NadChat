// app/page.tsx (unchanged)
'use client';
import React from 'react';
import Hero from '@/components/hero';
import Features from '@/components/features';
import CTA from '@/components/cta';
import MouseMoveEffect from '@/components/mouse-move-effect';

export default function Home() {
    return (
        <div className='relative min-h-screen overflow-x-hidden bg-black text-white'>
            <div className='fixed inset-0 z-0 pointer-events-none'>
                <div className='absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900 opacity-80' />
                <div className='absolute top-[-10%] right-[-10%] h-[800px] w-[800px] bg-blue-500/10 blur-[150px] animate-float' />
                <div className='absolute bottom-[-10%] left-[-10%] h-[800px] w-[800px] bg-purple-500/10 blur-[150px] animate-float delay-2000' />
            </div>
            <MouseMoveEffect />
            <div className='relative z-10 flex flex-col min-h-screen pt-16'>
                <div className='flex-1'>
                    <Hero />
                    <div className='py-12 md:py-16'>
                        <Features />
                    </div>
                    <div className='py-12 md:py-16'>
                        <CTA />
                    </div>
                </div>
            </div>
        </div>
    );
}
