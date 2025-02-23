// components/ClientWrapper.tsx
'use client';
import { PrivyProvider } from '@privy-io/react-auth';
import { UserProvider } from '../Context/UserContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './navbar';
import Footer from './footer';
import MouseMoveEffect from './mouse-move-effect';
export default function ClientWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
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
                {children}
                <Toaster
                    position='top-right'
                    toastOptions={{ duration: 3000 }}
                />
            </UserProvider>
        </PrivyProvider>
    );
}
