'use client';

import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2, Circle } from 'lucide-react';

const WORKFLOW_STEPS = [
  { step: 1, title: 'Clinical Note Analysis' },
  { step: 2, title: 'ICD-10 Mapping' },
  { step: 3, title: 'Treatment Protocol' },
  { step: 4, title: 'Medication Selection' },
  { step: 5, title: 'Chronic Note' },
  { step: 6, title: 'Claim Summary' },
];

export const WorkflowProgress = () => {
  const { currentStep } = useAppStore();

  return (
    <div className="glass border-b border-white/20 px-6 py-4 shadow-lg">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          {WORKFLOW_STEPS.map((step, index) => (
            <div key={step.step} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    currentStep > step.step
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 shadow-lg'
                      : currentStep === step.step
                      ? 'bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 border-purple-400 shadow-lg'
                      : 'bg-white/60 border-gray-300'
                  }`}
                >
                  {currentStep > step.step ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <span
                      className={`text-sm font-bold ${
                        currentStep === step.step
                          ? 'text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.step}
                    </span>
                  )}
                </div>
                <div className="hidden md:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.step
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
              {index < WORKFLOW_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                    currentStep > step.step
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

