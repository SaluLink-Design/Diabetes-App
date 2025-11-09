'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Medicine, ChronicRegistrationNote } from '@/types';
import { FileText, CheckCircle2, AlertCircle, ArrowRight, Edit2, Save } from 'lucide-react';

export const Step5ChronicNote = () => {
  const { currentCase, selectedPlan, updateCurrentCase, nextStep, previousStep } = useAppStore();
  const [chronicNotes, setChronicNotes] = useState<ChronicRegistrationNote[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNotes, setEditingNotes] = useState('');

  useEffect(() => {
    if (currentCase?.selectedMedications && currentCase.selectedMedications.length > 0) {
      // Initialize notes for all medications if not already present
      if (currentCase.chronicRegistrationNotes && currentCase.chronicRegistrationNotes.length > 0) {
        setChronicNotes(currentCase.chronicRegistrationNotes);
      } else {
        const initialNotes = currentCase.selectedMedications.map((med) => ({
          medication: med,
          medicationBrief: generateMedicationBrief(med),
          additionalNotes: '',
          fullNote: '',
        }));
        setChronicNotes(initialNotes);
      }
    }
  }, [currentCase?.selectedMedications]);

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

  const handleEditNotes = (index: number) => {
    setEditingIndex(index);
    setEditingNotes(chronicNotes[index].additionalNotes);
  };

  const handleSaveNotes = (index: number) => {
    const updatedNotes = [...chronicNotes];
    updatedNotes[index] = {
      ...updatedNotes[index],
      additionalNotes: editingNotes,
      fullNote: `${updatedNotes[index].medicationBrief}\n\n--- Additional Clinical Notes ---\n${editingNotes}`,
    };
    setChronicNotes(updatedNotes);
    setEditingIndex(null);
    setEditingNotes('');
  };

  const handleConfirm = () => {
    const incompleteNotes = chronicNotes.filter((note) => !note.additionalNotes.trim());

    if (incompleteNotes.length > 0) {
      alert(
        `Please add clinical notes for all ${chronicNotes.length} medications before proceeding.\n\n${incompleteNotes.length} medication(s) still need notes.`
      );
      return;
    }

    // Generate full notes for all medications
    const finalNotes = chronicNotes.map((note) => ({
      ...note,
      fullNote: `${note.medicationBrief}\n\n--- Additional Clinical Notes ---\n${note.additionalNotes}`,
    }));

    updateCurrentCase({
      chronicRegistrationNotes: finalNotes,
    });
    nextStep();
  };

  const medications = currentCase?.selectedMedications || [];
  const allNotesComplete = chronicNotes.every((note) => note.additionalNotes.trim());

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="glass rounded-2xl shadow-2xl p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Step 5: Chronic Registration Notes
          </h2>
          <p className="text-gray-600">
            Generate a chronic registration note for each selected medication. Add clinical notes for all {medications.length} medication(s).
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Multiple Medications Selected</p>
              <p>
                You have selected {medications.length} medication(s). A separate chronic registration note will be generated for each medication.
                Please add clinical notes for all medications.
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
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Progress</p>
                  <p className="text-lg font-bold text-gray-900">
                    {chronicNotes.filter((n) => n.additionalNotes.trim()).length} of {chronicNotes.length} completed
                  </p>
                </div>
                {allNotesComplete && (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                )}
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {chronicNotes.map((note, index) => (
                <div
                  key={note.medication.medicineNameStrength}
                  className={`border-2 rounded-lg p-6 transition-all ${
                    note.additionalNotes.trim()
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          Medication {index + 1} of {chronicNotes.length}
                        </h3>
                        {note.additionalNotes.trim() && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-lg font-semibold text-primary-600">
                        {note.medication.medicineNameStrength}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {note.medication.activeIngredient} • {note.medication.medicineClass}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Medication Brief (Auto-Generated)
                    </h4>
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
                      <pre className="text-xs text-gray-900 whitespace-pre-wrap font-sans">
                        {note.medicationBrief}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-900">
                        Additional Clinical Notes
                      </h4>
                      {editingIndex !== index && (
                        <button
                          onClick={() => handleEditNotes(index)}
                          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Edit2 className="w-3 h-3" />
                          {note.additionalNotes.trim() ? 'Edit' : 'Add Notes'}
                        </button>
                      )}
                    </div>

                    {editingIndex === index ? (
                      <div>
                        <textarea
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          placeholder="Add clinical notes for this medication... (e.g., dosage instructions, monitoring requirements, patient-specific considerations)"
                          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                          autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSaveNotes(index)}
                            disabled={!editingNotes.trim()}
                            className="flex items-center gap-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            <Save className="w-3 h-3" />
                            Save Notes
                          </button>
                          <button
                            onClick={() => {
                              setEditingIndex(null);
                              setEditingNotes('');
                            }}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : note.additionalNotes.trim() ? (
                      <div className="bg-white border border-gray-300 rounded-lg p-3">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                          {note.additionalNotes}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {note.additionalNotes.trim().length} characters
                        </p>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800 font-medium">
                          Clinical notes required for this medication
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {allNotesComplete && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      All chronic registration notes completed
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {chronicNotes.length} separate note(s) will be included in the final claim documentation.
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
            disabled={medications.length === 0 || !allNotesComplete}
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
