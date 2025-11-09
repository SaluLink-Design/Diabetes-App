'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'initial' | 'phase2' | 'phase3' | 'final'>('initial');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('phase2');
    }, 800);

    const timer2 = setTimeout(() => {
      setPhase('phase3');
    }, 1600);

    const timer3 = setTimeout(() => {
      setPhase('final');
    }, 2400);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="relative w-80 h-80 mb-8 flex items-center justify-center">
        <Image
          src="/5.svg"
          alt="Authi Icon"
          width={320}
          height={320}
          priority
          className="w-full h-full object-contain"
        />
      </div>

      <h1 className="text-6xl font-bold mb-12 transition-all duration-500">
        {phase === 'initial' && (
          <span style={{ color: '#d1d5db' }}>SaluLink</span>
        )}
        {phase === 'phase2' && (
          <span style={{ color: '#000000' }}>SaluLink</span>
        )}
        {phase === 'phase3' && (
          <span>
            <span style={{ color: '#38b6ff' }}>Salu</span>
            <span style={{ color: '#000000' }}>Link</span>
          </span>
        )}
        {phase === 'final' && (
          <span>
            <span style={{ color: '#60a5fa' }}>Salu</span>
            <span style={{ color: '#000000' }}>Link</span>
          </span>
        )}
      </h1>

      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center">
        <p className="text-sm text-gray-700">Powered by SaluLink AI</p>
      </div>
    </div>
  );
};
