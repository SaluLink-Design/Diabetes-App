'use client';

import Image from 'next/image';

interface LandingPageProps {
  onNewCase: () => void;
  onViewCases: () => void;
}

export const LandingPage = ({ onNewCase, onViewCases }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-6xl flex flex-col items-center">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-900 font-medium mb-8">
            Authi 1.0 AI Medical Assistant
          </p>

          <h1 className="text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Hi Doctor. How Can I Assist You
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Today?
            </span>
          </h1>
        </div>

        <div className="mb-12">
          <Image
            src="/E891C2DC-E59F-410D-8380-3375D30C7586.jpeg"
            alt="SaluLink Logo"
            width={280}
            height={280}
            priority
            className="drop-shadow-2xl"
          />
        </div>

        <div className="flex gap-6 mb-12">
          <button
            onClick={onNewCase}
            className="px-12 py-4 bg-white/70 backdrop-blur-sm hover:bg-white text-gray-900 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            + New Case
          </button>

          <button
            onClick={onViewCases}
            className="px-12 py-4 bg-white/70 backdrop-blur-sm hover:bg-white text-gray-900 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            View Cases
          </button>
        </div>

        <div className="absolute bottom-8">
          <p className="text-sm text-gray-800 font-medium">Powered by SaluLink AI</p>
        </div>
      </div>
    </div>
  );
};
