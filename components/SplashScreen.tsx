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

      <h1 className="text-6xl font-bold mb-12 transition-all duration-700 ease-in-out">
        {phase === 'allBlack' && (
          <span style={{ color: '#1a1a1a' }}>SaluLink</span>
        )}
        {phase === 'babyBlueSalu' && (
          <span>
            <span className="transition-colors duration-700 ease-in-out" style={{ color: '#7dd3fc' }}>Salu</span>
            <span className="transition-colors duration-700 ease-in-out" style={{ color: '#1a1a1a' }}>Link</span>
          </span>
        )}
        {phase === 'babyBlueLink' && (
          <span>
            <span className="transition-colors duration-700 ease-in-out" style={{ color: '#1a1a1a' }}>Salu</span>
            <span className="transition-colors duration-700 ease-in-out" style={{ color: '#7dd3fc' }}>Link</span>
          </span>
        )}
      </h1>

      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center">
        <p className="text-sm text-gray-700">Powered by SaluLink AI</p>
      </div>
    </div>
  );
};
