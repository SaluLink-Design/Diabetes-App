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
      <style jsx>{`
        @keyframes float-glow {
          0%, 100% {
            transform: translateY(0) scale(1);
            filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.4)) drop-shadow(0 0 40px rgba(147, 197, 253, 0.3));
          }
          50% {
            transform: translateY(-20px) scale(1.05);
            filter: drop-shadow(0 0 40px rgba(96, 165, 250, 0.7)) drop-shadow(0 0 60px rgba(147, 197, 253, 0.5));
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            filter: blur(20px);
          }
          50% {
            opacity: 0.9;
            filter: blur(30px);
          }
        }

        @keyframes fade-slide {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .icon-float {
          animation: float-glow 3s ease-in-out infinite;
        }

        .logo-fade {
          animation: fade-in-up 0.7s ease-out forwards;
        }

        .glow-circle {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(96, 165, 250, 0.3), transparent 70%);
          animation: pulse-glow 3s ease-in-out infinite;
          pointer-events: none;
        }

        .powered-by {
          animation: fade-slide 1s ease-out 2s forwards;
          opacity: 0;
        }
      `}</style>

      <div className="glow-circle"></div>

      <div className="relative w-64 h-64 mb-8 flex items-center justify-center icon-float">
        <Image
          src="/Authi.svg"
          alt="Authi Icon"
          width={256}
          height={256}
          priority
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative mb-12 transition-opacity duration-700 ease-in-out logo-fade">
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

      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center powered-by">
        <p className="text-sm text-gray-700">Powered by Authi</p>
      </div>
    </div>
  );
};
