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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="relative w-80 h-80 mb-8">
        <div
          className={`absolute inset-0 transition-opacity duration-800 ${
            phase === 'black' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src="/5.svg"
            alt="SaluLink Logo"
            width={320}
            height={320}
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
            width={320}
            height={320}
            priority
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <h1 className="text-5xl font-bold mb-12" style={{ color: phase === 'black' ? '#000000' : '#000000' }}>
        {phase === 'black' && 'SaluLink'}
        {phase === 'transition' && (
          <span>
            <span style={{ color: '#38b6ff' }}>Salu</span>
            <span style={{ color: '#000000' }}>Link</span>
          </span>
        )}
        {phase === 'blue' && (
          <span>
            <span style={{ color: '#38b6ff' }}>Salu</span>
            <span style={{ color: '#000000' }}>Link</span>
          </span>
        )}
      </h1>

      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center">
        <p className="text-sm text-gray-700 mb-4">Powered by SaluLink AI</p>
      </div>
    </div>
  );
};
