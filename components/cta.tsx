// components/cta.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const drawVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 1.5, ease: 'easeInOut' },
    },
};

export default function CTA() {
    return (
        <section className='container py-12 md:py-16'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className='relative bg-gray-900/80 backdrop-blur-md p-8 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors max-w-3xl mx-auto text-center overflow-hidden'
            >
                <svg
                    width='40'
                    height='40'
                    viewBox='0 0 20 20'
                    className='mx-auto mb-4 text-blue-400'
                >
                    <motion.path
                        d='M10 2l8 8-8 8-8-8 8-8zm-2 6h4v4h-4v-4z' // Arrow with inner square
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        variants={drawVariants}
                        initial='hidden'
                        whileInView='visible'
                    />
                </svg>
                <h2 className='text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                    Join the Future of Messaging
                </h2>
                <p className='mt-4 text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl mx-auto'>
                    Experience the freedom, security, and speed of
                    blockchain-powered chat. Start your journey with NadChat
                    today and be part of the decentralized communication
                    revolution powered by Monad’s cutting-edge technology.
                </p>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='mt-6'
                >
                    <Button
                        size='lg'
                        className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg glow-effect px-8 py-3 rounded-full'
                    >
                        Get Started Now
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    );
}
