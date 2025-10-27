'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Sidebar } from '@/components/Sidebar';
import { WorkflowProgress } from '@/components/WorkflowProgress';
import { Step1ClinicalNote } from '@/components/Step1ClinicalNote';
import { Step2IcdMapping } from '@/components/Step2IcdMapping';
import { Step3TreatmentProtocol } from '@/components/Step3TreatmentProtocol';
import { Step4Medication } from '@/components/Step4Medication';
import { Step5FinalClaim } from '@/components/Step5FinalClaim';
import { loadConditionsData, loadMedicineData, loadTreatmentData } from '@/lib/dataLoader';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const {
    currentStep,
    currentCase,
    setAllConditions,
    setAllTreatments,
    setAllMedicines,
    createNewCase,
  } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [conditions, treatments, medicines] = await Promise.all([
          loadConditionsData(),
          loadTreatmentData(),
          loadMedicineData(),
        ]);

        setAllConditions(conditions);
        setAllTreatments(treatments);
        setAllMedicines(medicines);

        // Create initial case if none exists
        if (!currentCase) {
          createNewCase();
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load application data. Please refresh the page.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F2F2F2]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#1C1C1C] animate-spin mx-auto mb-4" />
          <p className="text-[#1C1C1C] font-medium">Loading SaluLink...</p>
          <p className="text-sm text-[#1C1C1C]/60 mt-2">Initializing Authi 1.0</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F2F2F2]">
        <div className="text-center max-w-md p-8 bg-white rounded-[12px] shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">Error Loading Application</h2>
          <p className="text-[#1C1C1C]/60 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#1C1C1C] text-white px-6 py-2 rounded-[12px] hover:bg-black transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F2F2F2]">
        <div className="text-center max-w-md p-8 bg-white rounded-[12px] shadow-lg">
          <div className="w-20 h-20 bg-[#1C1C1C] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1C1C1C] mb-2">
            Welcome to SaluLink
          </h1>
          <p className="text-[#1C1C1C]/60 mb-6">
            Chronic Treatment Documentation powered by Authi 1.0
          </p>
          <button
            onClick={createNewCase}
            className="bg-[#1C1C1C] text-white px-8 py-3 rounded-[12px] hover:bg-black transition-colors font-medium"
          >
            Start New Case
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F2F2F2]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkflowProgress />
        <div className="flex-1 overflow-y-auto">
          <div className="py-8">
            {currentStep === 1 && <Step1ClinicalNote />}
            {currentStep === 2 && <Step2IcdMapping />}
            {currentStep === 3 && <Step3TreatmentProtocol />}
            {currentStep === 4 && <Step4Medication />}
            {currentStep === 5 && <Step5FinalClaim />}
          </div>
        </div>

        {/* Authi 1.0 Badge */}
        <div className="border-t border-[rgba(28,28,28,0.1)] bg-white px-6 py-3">
          <div className="flex items-center justify-center gap-2 text-sm text-[#1C1C1C]">
            <div className="w-6 h-6 bg-[#1C1C1C] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span>Powered by <span className="font-semibold text-[#1C1C1C]">Authi 1.0</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

