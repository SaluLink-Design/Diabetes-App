'use client';

import Image from 'next/image';

interface LandingPageProps {
  onNewCase: () => void;
  onViewCases: () => void;
}

export const LandingPage = ({ onNewCase, onViewCases }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-800 mb-8">Authi 1.0 AI Medical Assistant</p>

          <h1 className="text-6xl font-bold mb-12" style={{ lineHeight: '1.2' }}>
            <span style={{ color: '#a78bfa' }}>Hi Doctor. How Can I Assist You</span>
            <br />
            <span style={{ color: '#60a5fa' }}>Today?</span>
          </h1>

          <div className="w-80 h-80 mx-auto mb-12 flex items-center justify-center">
            <Image
              src="/5.svg"
              alt="SaluLink Logo"
              width={320}
              height={320}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="flex gap-6 justify-center max-w-2xl mx-auto">
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
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <p className="text-sm text-gray-700">Powered by SaluLink AI</p>
      </div>
    </div>
  );
};
