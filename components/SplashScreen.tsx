'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [currentLogo, setCurrentLogo] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const logos = [
    '/1.png', // All black logo
    '/2.png', // Blue "Salu" and black "Link"
    '/3.png', // Black "Salu" and blue "Link"
  ];

  useEffect(() => {
    const logoTimings = [
      { show: 0, hide: 1200 },      // Logo 1: 0-1200ms
      { show: 1300, hide: 2500 },   // Logo 2: 1300-2500ms
      { show: 2600, hide: 3800 },   // Logo 3: 2600-3800ms
    ];

    const timers: NodeJS.Timeout[] = [];

    logoTimings.forEach((timing, index) => {
      // Show logo
      timers.push(setTimeout(() => {
        setCurrentLogo(index);
        setFadeOut(false);
      }, timing.show));

      // Start fade out
      timers.push(setTimeout(() => {
        setFadeOut(true);
      }, timing.hide));
    });

    // Complete animation and transition to landing page
    timers.push(setTimeout(() => {
      onComplete();
    }, 4100));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 transition-opacity duration-500">
      <div className="relative w-full max-w-md px-8">
        <div className="relative aspect-square flex items-center justify-center">
          {logos.map((logo, index) => (
            <div
              key={logo}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                currentLogo === index && !fadeOut
                  ? 'opacity-100'
                  : 'opacity-0'
              }`}
            >
              <Image
                src={logo}
                alt="SaluLink Logo"
                width={400}
                height={400}
                priority
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-16 left-0 right-0 flex justify-center">
          <div className="flex gap-2">
            {logos.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  currentLogo === index
                    ? 'bg-blue-500 w-8'
                    : currentLogo > index
                    ? 'bg-blue-400 opacity-50'
                    : 'bg-gray-300 opacity-30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
