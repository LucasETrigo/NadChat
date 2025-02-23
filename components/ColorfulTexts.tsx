'use client';
import React from 'react';
import { ColourfulText } from './ui/colourful-text';
import { motion } from 'motion/react';

export function ColourfulTexts() {
    return (
        <div className='h-auto w-full flex items-center justify-center relative overflow-hidden '>
            <h1 className='text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans'>
                Welcome to <ColourfulText text='NadChat' /> <br />
            </h1>
        </div>
    );
}
