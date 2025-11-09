'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'logo1' | 'logo2' | 'logo3' | 'complete'>('logo1');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('logo2');
    }, 1000);

    const timer2 = setTimeout(() => {
      setPhase('logo3');
    }, 2000);

    const timer3 = setTimeout(() => {
      setPhase('complete');
    }, 3000);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="relative w-80 h-80">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            phase === 'logo1' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src="/167B135B-855B-4685-8F92-B280869F79B7.jpeg"
            alt="SaluLink Logo"
            width={320}
            height={320}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            phase === 'logo2' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src="/89ACE8B3-C832-4C1A-8B6A-1077CCFE7ADA.jpeg"
            alt="SaluLink Logo"
            width={320}
            height={320}
            priority
            className="w-full h-full object-contain"
          />
        </div>

        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            phase === 'logo3' || phase === 'complete' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src="/E891C2DC-E59F-410D-8380-3375D30C7586.jpeg"
            alt="SaluLink Logo"
            width={320}
            height={320}
            priority
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <div className="flex gap-2">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              phase === 'logo1'
                ? 'w-8 bg-gray-800'
                : 'bg-gray-300'
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              phase === 'logo2'
                ? 'w-8 bg-[#38b6ff]'
                : 'bg-gray-300'
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              phase === 'logo3' || phase === 'complete'
                ? 'w-8 bg-[#38b6ff]'
                : 'bg-gray-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
