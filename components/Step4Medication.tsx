'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Medicine, MedicalPlan } from '@/types';
import { Filter, CheckCircle2 } from 'lucide-react';

const MEDICAL_PLANS: MedicalPlan[] = [
  'KeyCare',
  'Core',
  'Priority',
  'Saver',
  'Executive',
  'Comprehensive',
];

export const Step4Medication = () => {
  const {
    currentCase,
    allMedicines,
    selectedPlan,
    setSelectedPlan,
    updateCurrentCase,
    nextStep,
    previousStep,
  } = useAppStore();

  const [availableMedicines, setAvailableMedicines] = useState<Medicine[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<Medicine[]>(
    currentCase?.selectedMedications || []
  );
  const [groupedMedicines, setGroupedMedicines] = useState<
    Map<string, Medicine[]>
  >(new Map());

  useEffect(() => {
    if (currentCase?.confirmedCondition) {
      const medicines = allMedicines.filter(
        (m) => m.condition === currentCase.confirmedCondition
      );
      setAvailableMedicines(medicines);

      // Group by medicine class
      const grouped = new Map<string, Medicine[]>();
      medicines.forEach((med) => {
        if (!grouped.has(med.medicineClass)) {
          grouped.set(med.medicineClass, []);
        }
        grouped.get(med.medicineClass)!.push(med);
      });
      setGroupedMedicines(grouped);
    }
  }, [currentCase?.confirmedCondition, allMedicines]);

  const handleToggleMedicine = (medicine: Medicine) => {
    const isSelected = selectedMedicines.some(
      (m) => m.medicineNameStrength === medicine.medicineNameStrength
    );

    if (isSelected) {
      setSelectedMedicines(
        selectedMedicines.filter(
          (m) => m.medicineNameStrength !== medicine.medicineNameStrength
        )
      );
    } else {
      setSelectedMedicines([...selectedMedicines, medicine]);
    }
  };

  const isMedicineAvailable = (medicine: Medicine): boolean => {
    return !medicine.plansExcluded?.includes(selectedPlan);
  };

  const handleConfirm = () => {
    if (selectedMedicines.length === 0) {
      alert('Please select at least one medication.');
      return;
    }

    updateCurrentCase({
      selectedMedications: selectedMedicines,
    });
    nextStep();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-[12px] shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1C1C1C] mb-2">
            Step 4: Medication Mapping and Selection
          </h2>
          <p className="text-[#1C1C1C]/60">
            Select appropriate medications for the chronic condition. Medications are filtered by the selected medical plan.
          </p>
        </div>

        {/* Plan Filter */}
        <div className="mb-6 p-4 bg-[#1C1C1C]/5 border border-[rgba(28,28,28,0.2)] rounded-[12px]">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-[#1C1C1C]/60" />
            <label className="text-sm font-medium text-[#1C1C1C]">
              Filter by Medical Plan
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {MEDICAL_PLANS.map((plan) => (
              <button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`px-4 py-2 rounded-[12px] font-medium transition-all ${
                  selectedPlan === plan
                    ? 'bg-[#1C1C1C] text-white'
                    : 'bg-white text-[#1C1C1C] border border-[rgba(28,28,28,0.2)] hover:border-[#1C1C1C]/50'
                }`}
              >
                {plan}
              </button>
            ))}
          </div>
        </div>

        {/* Medications by Class */}
        <div className="space-y-6 mb-8">
          {Array.from(groupedMedicines.entries()).map(([medicineClass, medicines]) => (
            <div key={medicineClass} className="border border-[rgba(28,28,28,0.2)] rounded-[12px] p-4">
              <h3 className="text-lg font-bold text-[#1C1C1C] mb-4">
                {medicineClass}
              </h3>

              <div className="space-y-3">
                {medicines.map((medicine) => {
                  const isSelected = selectedMedicines.some(
                    (m) => m.medicineNameStrength === medicine.medicineNameStrength
                  );
                  const isAvailable = isMedicineAvailable(medicine);

                  return (
                    <div
                      key={medicine.medicineNameStrength}
                      className={`border-2 rounded-[12px] p-4 transition-all ${
                        !isAvailable
                          ? 'border-[rgba(28,28,28,0.2)] bg-[#1C1C1C]/5 opacity-60'
                          : isSelected
                          ? 'border-[#1C1C1C] bg-[#1C1C1C]/5'
                          : 'border-[rgba(28,28,28,0.2)] hover:border-[#1C1C1C]/50'
                      }`}
                    >
                      <label
                        className={`flex items-start ${
                          isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleMedicine(medicine)}
                          disabled={!isAvailable}
                          className="w-4 h-4 text-[#1C1C1C] focus:ring-[#1C1C1C] rounded mt-1 disabled:opacity-50"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-[#1C1C1C]">
                                {medicine.medicineNameStrength}
                              </p>
                              {!isAvailable && (
                                <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                                  Not available on {selectedPlan}
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-[#1C1C1C] ml-2" />
                            )}
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-[#1C1C1C]/60">Active Ingredient:</span>
                              <p className="font-medium text-[#1C1C1C]">
                                {medicine.activeIngredient}
                              </p>
                            </div>
                            <div>
                              <span className="text-[#1C1C1C]/60">CDA (Core/Priority/Saver):</span>
                              <p className="font-medium text-[#1C1C1C]">
                                {medicine.cdaCorePrioritySaver}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-[#1C1C1C]/60">CDA (Executive/Comprehensive):</span>
                              <p className="font-medium text-[#1C1C1C]">
                                {medicine.cdaExecutiveComprehensive}
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Medications Summary */}
        {selectedMedicines.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[12px]">
            <p className="text-sm font-medium text-green-900 mb-2">
              Selected Medications ({selectedMedicines.length})
            </p>
            <div className="space-y-1">
              {selectedMedicines.map((med) => (
                <div key={med.medicineNameStrength} className="text-sm text-green-800">
                  • {med.medicineNameStrength} ({med.medicineClass})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={previousStep}
            className="flex-1 bg-[#1C1C1C]/10 text-[#1C1C1C] py-3 px-6 rounded-[12px] font-medium hover:bg-[#1C1C1C]/20 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedMedicines.length === 0}
            className="flex-1 bg-[#1C1C1C] text-white py-3 px-6 rounded-[12px] font-medium hover:bg-black disabled:bg-[#1C1C1C]/30 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Medication Selection
          </button>
        </div>
      </div>
    </div>
  );
};

