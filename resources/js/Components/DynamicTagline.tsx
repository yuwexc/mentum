import clsx from 'clsx';
import { HTMLAttributes, useEffect, useState } from 'react';

interface DynamicTaglineProps extends HTMLAttributes<HTMLHeadingElement> {
    phrases: string[];
}

export function DynamicTagline({ phrases, ...props }: DynamicTaglineProps) {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);

            setTimeout(() => {
                setIndex((prev) => (prev + 1) % phrases.length);
                setVisible(true);
            }, 300);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <span
            className={`text-6xl sm:text-8xl font-extrabold tracking-tight text-center text-indigo-600 max-w-xl h-[2em] transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
            {...props}
            aria-live="polite"
            aria-atomic="true"
        >
            {phrases[index]}
        </span>
    );
}