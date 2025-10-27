'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Medicine } from '@/types';
import { FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const Step6ChronicNote = () => {
  const { currentCase, selectedPlan, updateCurrentCase, nextStep, previousStep } = useAppStore();
  const [selectedMedication, setSelectedMedication] = useState<Medicine | null>(null);
  const [medicationBrief, setMedicationBrief] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState(
    currentCase?.chronicRegistrationNote || ''
  );

  useEffect(() => {
    if (currentCase?.selectedMedications && currentCase.selectedMedications.length > 0) {
      if (!selectedMedication) {
        setSelectedMedication(currentCase.selectedMedications[0]);
      }
    }
  }, [currentCase?.selectedMedications]);

  useEffect(() => {
    if (selectedMedication) {
      const brief = generateMedicationBrief(selectedMedication);
      setMedicationBrief(brief);
    }
  }, [selectedMedication]);

  const generateMedicationBrief = (med: Medicine): string => {
    const cdaAmount =
      med.plansExcluded?.includes('Core') &&
      med.plansExcluded?.includes('Priority') &&
      med.plansExcluded?.includes('Saver')
        ? med.cdaExecutiveComprehensive
        : selectedPlan === 'Executive' || selectedPlan === 'Comprehensive'
        ? med.cdaExecutiveComprehensive
        : med.cdaCorePrioritySaver;

    return `Medication: ${med.medicineNameStrength}
Active Ingredient: ${med.activeIngredient}
Medicine Class: ${med.medicineClass}
CDA Amount: ${cdaAmount}
Plan Coverage: ${selectedPlan}

This medication has been prescribed for the management of ${currentCase?.confirmedCondition}. The patient should take this medication as directed by their healthcare provider.`;
  };

  const handleConfirm = () => {
    if (!additionalNotes.trim()) {
      alert('Please add additional notes before proceeding.');
      return;
    }

    const fullNote = `${medicationBrief}\n\n--- Additional Clinical Notes ---\n${additionalNotes}`;

    updateCurrentCase({
      chronicRegistrationNote: fullNote,
    });
    nextStep();
  };

  const medications = currentCase?.selectedMedications || [];

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Step 6: Chronic Registration Note
          </h2>
          <p className="text-gray-600">
            Select a medication to generate a brief description, then add additional clinical notes.
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Medication Brief Auto-Generated</p>
              <p>
                When you select a medication, a brief description will be automatically created.
                Add your additional clinical notes in the text area below.
              </p>
            </div>
          </div>
        </div>

        {medications.length === 0 ? (
          <div className="mb-8 p-8 bg-red-50 border border-red-200 rounded-lg text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <p className="text-red-900 font-semibold">No medications selected</p>
            <p className="text-red-700 text-sm mt-1">
              Please go back to Step 4 and select at least one medication.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Select Medication for Brief
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {medications.map((med) => (
                  <button
                    key={med.medicineNameStrength}
                    onClick={() => setSelectedMedication(med)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      selectedMedication?.medicineNameStrength === med.medicineNameStrength
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {med.medicineNameStrength}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {med.activeIngredient} • {med.medicineClass}
                        </p>
                      </div>
                      {selectedMedication?.medicineNameStrength === med.medicineNameStrength && (
                        <CheckCircle2 className="w-6 h-6 text-primary-600 ml-3" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Medication Brief (Auto-Generated)
              </h3>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">
                  {medicationBrief}
                </pre>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                This brief is automatically generated based on the selected medication and will be
                included in the final claim documentation.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Additional Clinical Notes
              </h3>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Add your clinical notes here... (e.g., dosage instructions, monitoring requirements, patient-specific considerations)"
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter additional clinical information, dosage instructions, monitoring requirements,
                or any patient-specific considerations.
              </p>
            </div>

            {additionalNotes.trim() && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      Additional notes added ({additionalNotes.trim().length} characters)
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Your clinical notes will be combined with the medication brief in the final
                      claim.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex gap-4">
          <button
            onClick={previousStep}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleConfirm}
            disabled={medications.length === 0 || !additionalNotes.trim()}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            Confirm and Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
