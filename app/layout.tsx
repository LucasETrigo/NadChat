// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import ClientWrapper from '../components/ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en' className='dark'>
            <body
                className={`${inter.className} bg-background text-foreground antialiased`}
            >
                <ClientWrapper>{children}</ClientWrapper>
            </body>
        </html>
    );
}
