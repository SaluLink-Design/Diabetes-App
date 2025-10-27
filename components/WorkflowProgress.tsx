'use client';

import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2, Circle } from 'lucide-react';

const WORKFLOW_STEPS = [
  { step: 1, title: 'Clinical Note Analysis' },
  { step: 2, title: 'ICD-10 Mapping' },
  { step: 3, title: 'Treatment Protocol' },
  { step: 4, title: 'Medication Selection' },
  { step: 5, title: 'Final Documentation' },
];

export const WorkflowProgress = () => {
  const { currentStep } = useAppStore();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          {WORKFLOW_STEPS.map((step, index) => (
            <div key={step.step} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep > step.step
                      ? 'bg-green-500 border-green-500'
                      : currentStep === step.step
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-white border-gray-300'
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
                        : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
              {index < WORKFLOW_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.step
                      ? 'bg-green-500'
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

