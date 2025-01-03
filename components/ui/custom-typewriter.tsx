'use client';

import { FC } from 'react';
import Typewriter, { TypewriterClass } from 'typewriter-effect';

interface CustomTypewriterProps {
    strings?: string | string[];
    typeString?: string;
    delay?: number;
    autoStart?: boolean;
    loop?: boolean;
    cursor?: string;
    className?: string;
    hideCursorOnComplete?: boolean;
    onInit?: ((typewriter: TypewriterClass) => void) | undefined;
    onCompleteCallback?: () => void;
}

const CustomTypewriter: FC<CustomTypewriterProps> = ({
    strings,
    typeString,
    delay = 50,
    autoStart = false,
    loop = false,
    cursor = '|',
    className = '',
    hideCursorOnComplete = false,
    onInit,
    onCompleteCallback,
}) => {
    return (
        <Typewriter
            options={{
                wrapperClassName: `text-lg ${className}`,
                delay,
                cursor,
                loop,
                autoStart,
                strings,
            }}
            onInit={(typewriter) => {
                if (onInit) {
                    onInit(typewriter);
                } else if (typeString) {
                    typewriter
                        .start()
                        .typeString(typeString)
                        .callFunction(() => {
                            if (onCompleteCallback) {
                                onCompleteCallback();
                            }
                            if (hideCursorOnComplete) {
                                hideCursor();
                            }
                        });
                }
            }}
        />
    );
};

function hideCursor() {
    const cursorElement = document.querySelector('.Typewriter__cursor') as HTMLElement;
    if (cursorElement) {
        cursorElement.style.display = 'none';
    }
}

export default CustomTypewriter;
