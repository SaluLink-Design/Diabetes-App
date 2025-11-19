'use client';

import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2, Circle } from 'lucide-react';

const WORKFLOW_STEPS = [
  { step: 1, title: 'Clinical Note Input' },
  { step: 2, title: 'ICD - 10 Mapping' },
  { step: 3, title: 'Treatment Protocol' },
  { step: 4, title: 'Medication Selection' },
  { step: 5, title: 'Final Documentation' },
];

export const WorkflowProgress = () => {
  const { currentStep } = useAppStore();

  return (
    <div className="bg-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-center gap-8">
          {WORKFLOW_STEPS.map((step, index) => (
            <div key={step.step} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full transition-all ${
                  currentStep === step.step
                    ? 'bg-gradient-to-br from-purple-400 to-blue-400 text-white shadow-lg'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}
              >
                <span className="text-2xl font-bold">
                  {step.step}
                </span>
              </div>
              <p
                className={`text-sm font-medium mt-3 text-center max-w-[120px] ${
                  currentStep === step.step
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

