'use client';

import { Plus, Eye } from 'lucide-react';
import Image from 'next/image';

interface LandingPageProps {
  onNewCase: () => void;
  onViewCases: () => void;
}

export const LandingPage = ({ onNewCase, onViewCases }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="mb-8 flex justify-center">
            <Image
              src="/6 copy.svg"
              alt="SaluLink Logo"
              width={300}
              height={120}
              priority
              className="w-auto h-24"
            />
          </div>

          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#38b6ff] to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white font-bold text-4xl">A</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              Authi 1.0
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              AI Medical Assistant
            </p>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              Clinical documentation and treatment management for chronic disease patients
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-md mx-auto">
          <button
            onClick={onNewCase}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-5 px-8 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-6 h-6" />
            New Case
          </button>

          <button
            onClick={onViewCases}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 py-5 px-8 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 border-2 border-gray-900 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Eye className="w-6 h-6" />
            View Cases
          </button>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-400">
            Powered by SaluLink Health Solutions
          </p>
        </div>
      </div>
    </div>
  );
};
