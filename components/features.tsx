// components/features.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Define features data
const features = [
    {
        name: 'Secure Conversations',
        description:
            'With end-to-end encryption, your messages are locked tight—only you and your recipient can see them. No third parties, not even us, can peek inside. Powered by state-of-the-art cryptographic techniques, NadChat ensures your privacy isn’t just a promise—it’s a guarantee.',
        bullets: [
            'No server-side storage of plaintext',
            'Secure by default—no setup needed',
            'Zero-knowledge architecture',
            'Tamper-proof message integrity',
        ],
        drawPath: 'M10 2L2 8v8l8 6 8-6V8l-8-6zm-4 8h8v4h-8v-4z',
        className: 'col-start-1 col-end-3 row-start-1 row-end-3',
    },
    {
        name: 'Instant Delivery',
        description:
            'Powered by Monad Testnet high-performance EVM, NadChat ensures that your messages are delivered instantly, no matter where you are in the world. Say goodbye to waiting times and hello to real-time communication.',
        bullets: [
            'Fastest blockchain for messaging',
            'Real-time chat functionality',
            'No delays, ever',
        ],
        drawPath: 'M13 2L3 14h7v8l10-12h-7V2zm-2 6l4 4',
        className: 'col-start-3 col-end-5 row-start-1 row-end-2',
    },
    {
        name: 'Decentralized Control',
        description:
            'NadChat operates on a decentralized network, meaning there’s no single point of failure or control. Your data is yours, stored on the blockchain, ensuring transparency and immutability—no censorship, no tampering.',
        bullets: [
            'No central server to hack',
            'Data ownership guaranteed',
            'Immutable records',
        ],
        drawPath:
            'M16 11a6 6 0 00-12 0c0 2 1 3 3 4h6c2-1 3-2 3-4zm-2 0a2 2 0 11-4 0 2 2 0 014 0z',
        className: 'col-start-3 col-end-4 row-start-2 row-end-3',
    },
    {
        name: 'AI-Driven Insights',
        description:
            'Leveraging cutting-edge AI, NadChat offers smart features like message summarization, real-time translation, and predictive text, making chats more efficient and enjoyable. More enhancements are on the way!',
        bullets: [
            'Message summarization',
            'Real-time translation',
            'Predictive text',
        ],
        drawPath:
            'M10 2a8 8 0 00-8 8c0 4 3 7 8 7s8-3 8-7a8 8 0 00-8-8zm0 4a4 4 0 110 8 4 4 0 010-8z',
        className: 'col-start-4 col-end-5 row-start-2 row-end-3',
    },
];

// Animation variants
const drawVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 1.5, ease: 'easeInOut' },
    },
};

// Slower, cinematic text draw
const textDrawVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 1.2, delay: i * 1, ease: [0.19, 1, 0.22, 1] }, // Slower, dramatic ease
    }),
};

// Pulsing glow animation
const glowVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: [0.5, 1, 0.5], // Pulsing effect
        transition: {
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: 2,
        },
    },
};

export default function Features() {
    const nadchatLines = ['NadChat', 'built on', 'Monad'];

    return (
        <section className='container py-12 md:py-16'>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className='text-4xl md:text-5xl font-bold tracking-tight text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-12'
            >
                Why NadChat?
            </motion.h2>

            <div className='grid grid-cols-4 grid-rows-2 gap-4 max-w-6xl mx-auto'>
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.03 }}
                        className={cn(
                            'relative bg-gray-900/80 backdrop-blur-md p-6 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-colors overflow-hidden flex flex-col',
                            feature.className
                        )}
                    >
                        <svg
                            width='40'
                            height='40'
                            viewBox='0 0 20 20'
                            className='mb-4 text-blue-400'
                        >
                            <motion.path
                                d={feature.drawPath}
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                variants={drawVariants}
                                initial='hidden'
                                whileInView='visible'
                            />
                        </svg>
                        <h3 className='text-xl font-semibold text-white mb-2'>
                            {feature.name}
                        </h3>
                        <p className='text-gray-300 text-sm mb-4'>
                            {feature.description}
                        </p>
                        {feature.name === 'Secure Conversations' && (
                            <motion.div
                                className='relative text-center mb-4 flex-grow flex flex-col items-center justify-center overflow-hidden'
                                initial='hidden'
                                whileInView='visible'
                            >
                                <div className='relative z-10'>
                                    {nadchatLines.map((line, i) => (
                                        <motion.span
                                            key={i}
                                            custom={i}
                                            variants={textDrawVariants}
                                            className={cn(
                                                'cursive-text block',
                                                {
                                                    'text-6xl': i === 0, // "NadChat" massive
                                                    'text-3xl': i === 1, // "built on" smaller
                                                    'text-5xl': i === 2, // "Monad" bold
                                                }
                                            )}
                                        >
                                            {line}
                                        </motion.span>
                                    ))}
                                </div>
                                <motion.div
                                    className='absolute inset-0 text-purple-400'
                                    variants={glowVariants}
                                    initial='hidden'
                                    whileInView='visible'
                                    style={{
                                        filter: 'blur(20px)',
                                        background:
                                            'radial-gradient(circle at center, rgba(167, 139, 250, 0.5), transparent 70%)',
                                    }}
                                />
                            </motion.div>
                        )}
                        {feature.bullets && (
                            <ul className='text-gray-400 text-xs space-y-1 mt-auto'>
                                {feature.bullets.map((bullet, i) => (
                                    <li key={i}>• {bullet}</li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
