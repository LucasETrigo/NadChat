// components/CreateAccountModal.tsx
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface CreateAccountModalProps {
    isOpen: boolean;
    onClose: () => void; // Non-dismissible, but included for consistency
    onCreate: () => void;
    username: string;
    setUsername: (value: string) => void;
    profileImage: File | null;
    setProfileImage: (file: File | null) => void;
    loading: boolean;
}

export default function CreateAccountModal({
    isOpen,
    onClose,
    onCreate,
    username,
    setUsername,
    profileImage,
    setProfileImage,
    loading,
}: CreateAccountModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='div' className='relative z-10' onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black/70 backdrop-blur-md' />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4'>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-90'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-90'
                        >
                            <Dialog.Panel className='w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#181123] to-[#2a1b3d] border border-gray-700/50 shadow-xl shadow-purple-900/20 p-6'>
                                <Dialog.Title
                                    as='h3'
                                    className='text-2xl font-bold text-white tracking-tight'
                                >
                                    Join NadChat
                                </Dialog.Title>
                                <p className='mt-2 text-sm text-gray-300 leading-relaxed'>
                                    Please create an account to start chatting
                                    on Monad Testnet.
                                </p>
                                <div className='mt-6 space-y-4'>
                                    <input
                                        type='text'
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        placeholder='Your username'
                                        className='w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200'
                                        disabled={loading}
                                    />
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type='file'
                                            accept='image/*'
                                            onChange={(e) =>
                                                setProfileImage(
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                            className='w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all duration-200'
                                            disabled={loading}
                                        />
                                        {profileImage && (
                                            <img
                                                src={URL.createObjectURL(
                                                    profileImage
                                                )}
                                                alt='Preview'
                                                className='w-12 h-12 rounded-full object-cover'
                                            />
                                        )}
                                    </div>
                                    <button
                                        onClick={onCreate}
                                        className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg'
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className='flex items-center justify-center'>
                                                <svg
                                                    className='animate-spin h-5 w-5 mr-2'
                                                    viewBox='0 0 24 24'
                                                >
                                                    <circle
                                                        className='opacity-25'
                                                        cx='12'
                                                        cy='12'
                                                        r='10'
                                                        stroke='currentColor'
                                                        strokeWidth='4'
                                                        fill='none'
                                                    />
                                                    <path
                                                        className='opacity-75'
                                                        fill='currentColor'
                                                        d='M4 12a8 8 0 018-8v8h-8z'
                                                    />
                                                </svg>
                                                Creating...
                                            </span>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
