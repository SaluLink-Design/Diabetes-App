'use client';

import { Plus, Eye } from 'lucide-react';
import Image from 'next/image';

interface LandingPageProps {
  onNewCase: () => void;
  onViewCases: () => void;
}

export const LandingPage = ({ onNewCase, onViewCases }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-16">
          <div className="mb-16 flex justify-center">
            <Image
              src="/E891C2DC-E59F-410D-8380-3375D30C7586.jpeg"
              alt="SaluLink Logo"
              width={400}
              height={160}
              priority
              className="w-auto h-40 drop-shadow-xl"
            />
          </div>

          <div className="glass rounded-3xl shadow-2xl p-12 mb-12 max-w-xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              SaluLink
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              AI Medical Assistant
            </p>
            <p className="text-base text-gray-600">
              Clinical documentation and treatment management for chronic disease patients
            </p>
          </div>
        </div>

        <div className="space-y-5 max-w-lg mx-auto">
          <button
            onClick={onNewCase}
            className="w-full bg-gray-900 hover:bg-black text-white py-6 px-8 rounded-2xl font-semibold text-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
            New Case
          </button>

          <button
            onClick={onViewCases}
            className="w-full glass hover:bg-white text-gray-900 py-6 px-8 rounded-2xl font-semibold text-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
          >
            <Eye className="w-6 h-6" strokeWidth={2.5} />
            View Cases
          </button>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-600">Powered by SaluLink AI</p>
        </div>
      </div>
    </div>
  );
};
