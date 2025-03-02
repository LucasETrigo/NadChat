// components/ClientWrapper.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { PrivyProvider } from '@privy-io/react-auth';
import { UserProvider } from '../Context/UserContext';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './navbar';
import MouseMoveEffect from './mouse-move-effect';

export default function ClientWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const prevPathname = useRef<string | null>(null);

    // Detect route changes via pathname
    useEffect(() => {
        if (
            prevPathname.current !== null &&
            prevPathname.current !== pathname
        ) {
            setIsLoading(true);
            const timeout = setTimeout(() => setIsLoading(false), 2000);
            return () => clearTimeout(timeout);
        }
        prevPathname.current = pathname;
    }, [pathname]);

    return (
        <PrivyProvider
            appId='cm7fozmc601wc6s7q953jq44y'
            config={{
                loginMethods: ['wallet'],
                appearance: {
                    theme: 'light',
                    accentColor: '#676FFF',
                },
            }}
        >
            <UserProvider>
                <Navbar />
                <MouseMoveEffect />
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            className='fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-[60]'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className='flex flex-col items-center gap-4'
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            >
                                <img
                                    src='/logo.png'
                                    alt='NadChat Loading'
                                    className='h-20 w-full'
                                />
                                <p className='text-gray-300 text-lg'>
                                    Loading...
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {children}
                <Toaster
                    position='top-right'
                    toastOptions={{ duration: 3000 }}
                />
            </UserProvider>
        </PrivyProvider>
    );
}
