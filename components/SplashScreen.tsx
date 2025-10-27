'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'black' | 'transition' | 'blue'>('black');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('transition');
    }, 800);

    const timer2 = setTimeout(() => {
      setPhase('blue');
    }, 1600);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative w-64 h-64">
        <div
          className={`absolute inset-0 transition-opacity duration-800 ${
            phase === 'black' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src="/5.svg"
            alt="SaluLink Logo"
            width={256}
            height={256}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        <div
          className={`absolute inset-0 transition-opacity duration-800 ${
            phase === 'blue' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src="/6.svg"
            alt="SaluLink Logo"
            width={256}
            height={256}
            priority
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <div className="flex gap-2">
          <div
            className={`w-2 h-2 rounded-full bg-primary-600 transition-opacity duration-300 ${
              phase === 'black' ? 'opacity-100' : 'opacity-30'
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full bg-primary-600 transition-opacity duration-300 ${
              phase === 'transition' ? 'opacity-100' : 'opacity-30'
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full bg-primary-600 transition-opacity duration-300 ${
              phase === 'blue' ? 'opacity-100' : 'opacity-30'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
