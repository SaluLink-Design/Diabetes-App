'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'logo1' | 'logo2' | 'logo3'>('logo1');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('logo2');
    }, 1200);

    const timer2 = setTimeout(() => {
      setPhase('logo3');
    }, 2400);

    const timer3 = setTimeout(() => {
      setFadeOut(true);
    }, 3600);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-600 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
         style={{
           background: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 20%, #e0e7ff 40%, #dbeafe 60%, #e0f2fe 80%, #f0f9ff 100%)'
         }}>
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-[280px] h-[280px] mb-8">
          <div
            className={`absolute inset-0 transition-opacity duration-800 ease-in-out ${
              phase === 'logo1' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src="/167B135B-855B-4685-8F92-B280869F79B7.jpeg"
              alt="SaluLink Logo"
              width={280}
              height={280}
              priority
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          <div
            className={`absolute inset-0 transition-opacity duration-800 ease-in-out ${
              phase === 'logo2' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src="/89ACE8B3-C832-4C1A-8B6A-1077CCFE7ADA.jpeg"
              alt="SaluLink Logo"
              width={280}
              height={280}
              priority
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          <div
            className={`absolute inset-0 transition-opacity duration-800 ease-in-out ${
              phase === 'logo3' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src="/E891C2DC-E59F-410D-8380-3375D30C7586.jpeg"
              alt="SaluLink Logo"
              width={280}
              height={280}
              priority
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-800 font-medium">Powered by SaluLink AI</p>
        </div>
      </div>
    </div>
  );
};
