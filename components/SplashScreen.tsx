'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'allBlack' | 'babyBlueSalu' | 'babyBlueLink'>('allBlack');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('babyBlueSalu');
    }, 1000);

    const timer2 = setTimeout(() => {
      setPhase('babyBlueLink');
    }, 2000);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
        <Image
          src="/Authi.svg"
          alt="Authi Icon"
          width={256}
          height={256}
          priority
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative mb-12 transition-opacity duration-700 ease-in-out">
        {phase === 'allBlack' && (
          <Image
            src="/1.svg"
            alt="SaluLink Logo - All Black"
            width={226}
            height={110}
            priority
            className="transition-opacity duration-700 ease-in-out"
          />
        )}
        {phase === 'babyBlueSalu' && (
          <Image
            src="/3.svg"
            alt="SaluLink Logo - Baby Blue Salu"
            width={226}
            height={110}
            priority
            className="transition-opacity duration-700 ease-in-out"
          />
        )}
        {phase === 'babyBlueLink' && (
          <Image
            src="/2.svg"
            alt="SaluLink Logo - Baby Blue Link"
            width={226}
            height={110}
            priority
            className="transition-opacity duration-700 ease-in-out"
          />
        )}
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center">
        <p className="text-sm text-gray-700">Powered by SaluLink AI</p>
      </div>
    </div>
  );
};
