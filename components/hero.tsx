// components/hero.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ColourfulText } from './ui/colourful-text';
import { GlobeDemo } from './GlobeDemo';

export default function Hero() {
    const router = useRouter();

    // Navigate to /chat
    const handleStartChatting = () => {
        router.push('/chat');
    };

    // Navigate to /all-users
    const handleFindUsers = () => {
        router.push('/all-users');
    };

    return (
        <section className='relative min-h-[80vh] flex items-center justify-center pt-40 md:pt-48 pb-12 md:pb-16 overflow-hidden'>
            {/* Background Globe */}
            <div className='absolute inset-x-0 top-36 bottom-0 z-0 flex items-center justify-center'>
                <div className='w-full h-[70vh] max-h-[600px]'>
                    <GlobeDemo />
                </div>
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className='relative z-10 text-center max-w-4xl mx-auto px-4 mt-12 md:mt-16'
            >
                <h1 className='text-5xl md:text-7xl font-extrabold tracking-tight'>
                    Welcome to <ColourfulText text='NadChat' />
                </h1>
                <p className='mt-6 text-gray-300 text-lg md:text-2xl leading-relaxed max-w-2xl mx-auto'>
                    Unleash secure, lightning-fast messaging on Monad’s
                    cutting-edge EVM. Decentralized, encrypted, and built for
                    the future.
                </p>
                <div className='mt-10 flex gap-4 justify-center'>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={handleStartChatting}
                            size='lg'
                            className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg px-8 py-3 rounded-full glow-effect'
                        >
                            Start Chatting
                            <ArrowRight className='ml-2 h-5 w-5' />
                        </Button>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={handleFindUsers}
                            variant='outline'
                            size='lg'
                            className='border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 px-8 py-3 rounded-full'
                        >
                            Find Users
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Floating Particles */}
            <div className='absolute inset-0 z-5 pointer-events-none'>
                <div className='absolute top-20 left-20 h-2 w-2 bg-blue-400 rounded-full animate-particle' />
                <div className='absolute bottom-40 right-40 h-3 w-3 bg-purple-400 rounded-full animate-particle delay-500' />
            </div>
        </section>
    );
}
