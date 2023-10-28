'use client';

import React, { useState, useEffect } from 'react';
import BlinkingCursor from './blinking-cursor';

interface TypewriterProps {
    text: string;
    delay: number;
    startDelay?: number;
    showCursor?: boolean;
}

const Typewriter = ({
    text,
    delay,
    startDelay = 0,
    showCursor,
}: TypewriterProps) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [startTyping, setStartTyping] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStartTyping(true);
        }, startDelay);

        return () => clearTimeout(timeout);
    }, [startDelay]);

    useEffect(() => {
        if (startTyping && currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText((prevText) => prevText + text[currentIndex]);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, startTyping, text]);

    const renderCursor = () => {
        return showCursor && <BlinkingCursor />;
    };

    return (
        <span className="font-bold text-3xl sm:text-4xl">
            {currentText}
            {renderCursor()}
        </span>
    );
};

export default Typewriter;
