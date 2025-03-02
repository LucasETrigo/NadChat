// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-6'>
            <div className='text-center'>
                <h1 className='text-6xl font-bold text-purple-500 mb-4'>404</h1>
                <p className='text-2xl text-gray-300 mb-6'>Page Not Found</p>
                <p className='text-gray-400 mb-8'>
                    Looks like you’ve hit a dead end. Let’s get you back on
                    track.
                </p>
                <Link
                    href='/'
                    className='inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full'
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
