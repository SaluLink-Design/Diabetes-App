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
    <div className="glass border-b border-white/30 px-6 py-6 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {WORKFLOW_STEPS.map((step, index) => (
            <div key={step.step} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep > step.step
                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 shadow-xl'
                      : currentStep === step.step
                      ? 'bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 border-purple-500 shadow-xl scale-110'
                      : 'bg-white/70 border-gray-300'
                  }`}
                >
                  {currentStep > step.step ? (
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  ) : (
                    <span
                      className={`text-base font-bold ${
                        currentStep === step.step
                          ? 'text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.step}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block">
                  <p
                    className={`text-sm font-semibold ${
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
                  className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
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

