// components/mouse-move-effect.tsx
'use client';
import { useEffect, useState } from 'react';

export default function MouseMoveEffect() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className='pointer-events-none fixed inset-0 z-1 transition-opacity duration-300'>
            <div
                style={{
                    background: `radial-gradient(400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 80%)`,
                }}
                className='absolute inset-0'
            />
            <div
                style={{
                    background: `radial-gradient(200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.05), transparent 80%)`,
                }}
                className='absolute inset-0'
            />
        </div>
    );
}
