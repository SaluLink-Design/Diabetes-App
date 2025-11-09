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
    <div
      className={`fixed inset-0 z-50 w-screen h-screen flex items-center justify-center transition-opacity duration-600 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{
        background: 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 20%, #e0e7ff 40%, #dbeafe 60%, #e0f2fe 80%, #f0f9ff 100%)'
      }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        <div className="relative w-[400px] h-[400px] mb-12">
          <div
            className={`absolute inset-0 transition-opacity duration-800 ease-in-out ${
              phase === 'logo1' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src="/Image 2025-11-09 at 13.05.jpeg"
              alt="SaluLink Logo"
              width={400}
              height={400}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          <div
            className={`absolute inset-0 transition-opacity duration-800 ease-in-out ${
              phase === 'logo2' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src="/Image 2025-11-09 at 13.06.jpeg"
              alt="SaluLink Logo"
              width={400}
              height={400}
              priority
              className="w-full h-full object-contain"
            />
          </div>

          <div
            className={`absolute inset-0 transition-opacity duration-800 ease-in-out ${
              phase === 'logo3' ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src="/Image 2025-11-09 at 13.07.jpeg"
              alt="SaluLink Logo"
              width={400}
              height={400}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="absolute bottom-16 left-0 right-0 text-center">
          <p className="text-base text-gray-800 font-medium">Powered by SaluLink AI</p>
        </div>
      </div>
    </div>
  );
};
