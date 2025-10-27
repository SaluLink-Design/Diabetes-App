'use client';

import { Plus, Eye } from 'lucide-react';
import Image from 'next/image';

interface LandingPageProps {
  onNewCase: () => void;
  onViewCases: () => void;
}

export const LandingPage = ({ onNewCase, onViewCases }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-16">
          <div className="mb-12 flex justify-center">
            <Image
              src="/6 copy copy.svg"
              alt="SaluLink Logo"
              width={400}
              height={160}
              priority
              className="w-auto h-32"
            />
          </div>

          <div className="mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 via-purple-300 to-blue-300 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-400/20"></div>
              <span className="text-white font-bold text-5xl relative z-10">A</span>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              Authi 1.0
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 max-w-xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              AI Medical Assistant
            </h2>
            <p className="text-lg text-gray-600">
              Clinical documentation and treatment management for chronic disease patients
            </p>
          </div>
        </div>

        <div className="space-y-5 max-w-lg mx-auto">
          <button
            onClick={onNewCase}
            className="w-full bg-black hover:bg-gray-900 text-white py-6 px-8 rounded-2xl font-bold text-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-7 h-7" strokeWidth={3} />
            New Case
          </button>

          <button
            onClick={onViewCases}
            className="w-full bg-white hover:bg-gray-50 text-black py-6 px-8 rounded-2xl font-bold text-xl transition-all duration-200 flex items-center justify-center gap-3 border-3 border-black shadow-md hover:shadow-lg"
            style={{ borderWidth: '3px' }}
          >
            <Eye className="w-7 h-7" strokeWidth={2.5} />
            View Cases
          </button>
        </div>
      </div>
    </div>
  );
};
