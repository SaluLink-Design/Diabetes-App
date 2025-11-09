'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LandingPageProps {
  onNewCase: () => void;
  onViewCases: () => void;
}

export const LandingPage = ({ onNewCase, onViewCases }: LandingPageProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const messages = [
    { line1: 'Hi Doctor. How Can I Assist You', line2: 'Today?' },
    { line1: 'Ready to speed up your', line2: 'workflow?' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center p-6">
      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 10px rgba(167, 139, 250, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(167, 139, 250, 0.8)) drop-shadow(0 0 40px rgba(96, 165, 250, 0.6));
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .icon-animate {
          animation: glow 3s ease-in-out infinite, bounce 3s ease-in-out infinite;
        }

        .text-fade-out {
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.5s ease-in-out;
        }

        .text-fade-in {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.5s ease-in-out;
        }
      `}</style>

      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-800 mb-8">Authi 1.0 AI Medical Assistant</p>

          <h1
            className={`text-6xl font-bold mb-12 ${isAnimating ? 'text-fade-out' : 'text-fade-in'}`}
            style={{ lineHeight: '1.2' }}
          >
            <span style={{ color: '#a78bfa' }}>{messages[messageIndex].line1}</span>
            <br />
            <span style={{ color: '#60a5fa' }}>{messages[messageIndex].line2}</span>
          </h1>

          <div className="w-64 h-64 mx-auto mb-12 flex items-center justify-center icon-animate">
            <Image
              src="/Authi copy.svg"
              alt="Authi Icon"
              width={256}
              height={256}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="flex gap-6 justify-center max-w-2xl mx-auto mb-8">
          <button
            onClick={onNewCase}
            className="bg-white hover:bg-gray-50 text-black py-4 px-12 rounded-full font-medium text-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            + New Case
          </button>

          <button
            onClick={onViewCases}
            className="bg-white hover:bg-gray-50 text-black py-4 px-12 rounded-full font-medium text-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View Cases
          </button>
        </div>

        <div className="flex justify-center items-center gap-2">
          <span className="text-sm text-gray-700">Powered by</span>
          <div className="flex items-center gap-1">
            <Image
              src="/Authi copy copy.svg"
              alt="Authi Icon"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="text-sm font-medium text-gray-700">Authi</span>
          </div>
        </div>
      </div>
    </div>
  );
};
