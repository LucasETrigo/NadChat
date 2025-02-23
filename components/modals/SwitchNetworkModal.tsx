// components/SwitchNetworkModal.tsx
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface SwitchNetworkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitch: () => void;
    loading: boolean;
}

export default function SwitchNetworkModal({
    isOpen,
    onClose,
    onSwitch,
    loading,
}: SwitchNetworkModalProps) {
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
                                    Switch Network
                                </Dialog.Title>
                                <p className='mt-2 text-sm text-gray-300 leading-relaxed'>
                                    NadChat runs on Monad Testnet. Switch your
                                    network to continue.
                                </p>
                                <div className='mt-6'>
                                    <button
                                        onClick={onSwitch}
                                        className='w-full bg-gradient-to-r from-purple-600 to-purple-900 text-white py-3 px-4 rounded-xl hover:from-purple-900 hover:to-purple-950 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center'
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className='flex items-center'>
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
                                                Switching...
                                            </span>
                                        ) : (
                                            'Switch to Monad Testnet'
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
