// components/navbar.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import Auth from './Auth';

export default function Navbar() {
    // Animation variants for links
    const linkVariants = {
        initial: {
            scale: 1,
            color: '#D1D5DB', // gray-300
            textShadow: 'none',
        },
        hover: {
            scale: 1.05,
            color: '#676FFF', // Your accent purple
            textShadow: '0px 0px 8px rgba(103, 111, 255, 0.5)', // Subtle purple glow
            transition: {
                duration: 0.2,
                ease: 'easeOut',
            },
        },
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className='fixed top-4 left-0 right-0 mx-auto z-50 w-[90%] max-w-4xl bg-gray-900/50 backdrop-blur-xl border border-gray-700/30 shadow-lg rounded-full py-3 px-6'
        >
            <div className='flex items-center justify-between'>
                {/* Logo */}
                <Link href='/' className='flex items-center space-x-2'>
                    <motion.img
                        src='/logo.png'
                        alt='NadChat Logo'
                        className='h-10 w-auto'
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                    />
                </Link>

                {/* Navigation Links */}
                <nav className='flex items-center space-x-6 text-sm font-medium'>
                    {['All Users', 'Chat', 'FAQs', 'About Us'].map((item) => (
                        <motion.div
                            key={item}
                            variants={linkVariants}
                            initial='initial'
                            whileHover='hover'
                            className='relative'
                        >
                            <Link
                                href={`/${item
                                    .toLowerCase()
                                    .replace(' ', '-')}`}
                                className='text-gray-300 transition-colors duration-200'
                            >
                                {item}
                            </Link>
                            {/* Glowing underline effect */}
                            <motion.div
                                className='absolute -bottom-1 left-0 w-full h-[2px] bg-[#676FFF] opacity-0'
                                whileHover={{ opacity: 1 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                            />
                        </motion.div>
                    ))}
                </nav>

                {/* Right Side */}
                <div className='flex items-center space-x-4'>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Link
                            href='https://github.com/lucasetrigo'
                            target='_blank'
                            rel='noreferrer'
                        >
                            <Button
                                variant='ghost'
                                size='icon'
                                className='text-gray-300 hover:text-blue-400'
                            >
                                <Github className='h-5 w-5' />
                                <span className='sr-only'>GitHub</span>
                            </Button>
                        </Link>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Button
                            variant='ghost'
                            size='sm'
                            className='text-gray-300 hover:text-blue-400'
                        >
                            Contact
                        </Button>
                    </motion.div>
                    <Auth />
                </div>
            </div>
        </motion.header>
    );
}
