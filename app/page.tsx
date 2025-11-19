'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Sidebar } from '@/components/Sidebar';
import { WorkflowProgress } from '@/components/WorkflowProgress';
import { Step1ClinicalNote } from '@/components/Step1ClinicalNote';
import { Step2IcdMapping } from '@/components/Step2IcdMapping';
import { Step3TreatmentProtocol } from '@/components/Step3TreatmentProtocol';
import { Step4Medication } from '@/components/Step4Medication';
import { Step5ChronicNote } from '@/components/Step5ChronicNote';
import { Step6ClaimSummary } from '@/components/Step6ClaimSummary';
import { SplashScreen } from '@/components/SplashScreen';
import { LandingPage } from '@/components/LandingPage';
import { ViewCases } from '@/components/ViewCases';
import { CaseDetails } from '@/components/CaseDetails';
import { loadConditionsData, loadMedicineData, loadTreatmentData } from '@/lib/dataLoader';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const {
    currentStep,
    currentCase,
    setAllConditions,
    setAllTreatments,
    setAllMedicines,
    createNewCase,
    returnToCaseId,
    setReturnToCaseId,
  } = useAppStore();

  const [showSplash, setShowSplash] = useState(true);
  const [showLanding, setShowLanding] = useState(false);
  const [showViewCases, setShowViewCases] = useState(false);
  const [viewCaseId, setViewCaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (returnToCaseId) {
      setViewCaseId(returnToCaseId);
      setReturnToCaseId(null);
      setShowLanding(false);
      setShowViewCases(false);
    }
  }, [returnToCaseId, setReturnToCaseId]);

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

        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load application data. Please refresh the page.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          setShowSplash(false);
          setShowLanding(true);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading SaluLink...</p>
          <p className="text-sm text-gray-500 mt-2">Initializing Authi 1.0</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Application</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (viewCaseId) {
    return (
      <CaseDetails
        caseId={viewCaseId}
        onBack={() => {
          setViewCaseId(null);
          setShowViewCases(true);
        }}
        onEditCase={(caseId) => {
          useAppStore.getState().loadCase(caseId);
          setViewCaseId(null);
          setShowViewCases(false);
          setShowLanding(false);
        }}
      />
    );
  }

  if (showViewCases) {
    return (
      <ViewCases
        onCaseSelect={(caseId) => {
          setViewCaseId(caseId);
          setShowViewCases(false);
        }}
        onClose={() => {
          setShowViewCases(false);
          setShowLanding(true);
        }}
      />
    );
  }

  if (showLanding || !currentCase) {
    return (
      <LandingPage
        onNewCase={() => {
          createNewCase();
          setShowLanding(false);
        }}
        onViewCases={() => {
          setShowViewCases(true);
          setShowLanding(false);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar onViewCases={() => setShowViewCases(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkflowProgress />
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
          <div className="py-8">
            {currentStep === 1 && <Step1ClinicalNote />}
            {currentStep === 2 && <Step2IcdMapping />}
            {currentStep === 3 && <Step3TreatmentProtocol />}
            {currentStep === 4 && <Step4Medication />}
            {currentStep === 5 && <Step5ChronicNote />}
            {currentStep === 6 && <Step6ClaimSummary />}
          </div>
        </div>

        {/* Powered by Badge */}
        <div className="bg-white px-6 py-3">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
            <span>Powered by Authi</span>
          </div>
        </div>
      </div>
    </div>
  );
}

