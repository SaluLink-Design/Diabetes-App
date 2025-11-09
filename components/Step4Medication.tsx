'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Medicine, MedicalPlan } from '@/types';
import { Filter, CheckCircle2, Eye, X, AlertCircle, Info } from 'lucide-react';

const MEDICAL_PLANS: MedicalPlan[] = [
  'KeyCare',
  'Core',
  'Priority',
  'Saver',
  'Executive',
  'Comprehensive',
];

const PLAN_DESCRIPTIONS: Record<MedicalPlan, string> = {
  KeyCare: 'Basic coverage - Limited medication formulary',
  Core: 'Standard coverage - General medications only',
  Priority: 'Enhanced coverage - Broader medication access',
  Saver: 'Value coverage - Cost-effective options',
  Executive: 'Premium coverage - Includes specialty medications',
  Comprehensive: 'Full coverage - All medications available',
};

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
  const [viewingClass, setViewingClass] = useState<string | null>(null);

  useEffect(() => {
    if (currentCase?.confirmedCondition) {
      const medicines = allMedicines.filter(
        (m) => m.condition === currentCase.confirmedCondition
      );
      setAvailableMedicines(medicines);

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

  useEffect(() => {
    const incompatibleMeds = selectedMedicines.filter(
      (med) => !isMedicineAvailable(med)
    );

    if (incompatibleMeds.length > 0) {
      const medNames = incompatibleMeds.map((m) => m.medicineNameStrength).join(', ');
      alert(
        `The following medications are not available on ${selectedPlan} plan and have been deselected:\n\n${medNames}`
      );
      setSelectedMedicines(
        selectedMedicines.filter((med) => isMedicineAvailable(med))
      );
    }
  }, [selectedPlan]);

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

    const hasIncompatible = selectedMedicines.some(
      (med) => !isMedicineAvailable(med)
    );

    if (hasIncompatible) {
      alert('Please remove medications that are not available on the selected plan.');
      return;
    }

    updateCurrentCase({
      selectedMedications: selectedMedicines,
    });
    nextStep();
  };

  const getSelectedCountForClass = (medicineClass: string): number => {
    return selectedMedicines.filter((m) => m.medicineClass === medicineClass).length;
  };

  const getAvailableCountForClass = (medicineClass: string): number => {
    const medicines = groupedMedicines.get(medicineClass) || [];
    return medicines.filter((m) => isMedicineAvailable(m)).length;
  };

  const getTotalAvailableMedicines = (): number => {
    return availableMedicines.filter((m) => isMedicineAvailable(m)).length;
  };

  const getTotalRestrictedMedicines = (): number => {
    return availableMedicines.filter((m) => !isMedicineAvailable(m)).length;
  };

  const getRestrictionReason = (medicine: Medicine): string => {
    if (medicine.plansExcluded?.includes('Core') &&
        medicine.plansExcluded?.includes('Priority') &&
        medicine.plansExcluded?.includes('Saver')) {
      return 'This is a specialty medication available only on Executive and Comprehensive plans.';
    }
    if (medicine.plansExcluded?.includes('KeyCare')) {
      return 'This medication is not covered under KeyCare plan.';
    }
    return `This medication is not available on ${selectedPlan} plan. Please select a higher-tier plan for access.`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Step 4: Medication Mapping and Selection
          </h2>
          <p className="text-gray-600">
            Select appropriate medications for the chronic condition. Click "View" to explore medications in each class.
          </p>
        </div>

        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">
              Select Medical Plan
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {MEDICAL_PLANS.map((plan) => (
              <button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`group relative px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedPlan === plan
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-300 hover:shadow-sm'
                }`}
                title={PLAN_DESCRIPTIONS[plan]}
              >
                {plan}
                {selectedPlan !== plan && (
                  <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                    {PLAN_DESCRIPTIONS[plan]}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              <span className="font-medium">Current Plan: {selectedPlan}</span> - {PLAN_DESCRIPTIONS[selectedPlan]}
            </p>
          </div>
        </div>

        {getTotalRestrictedMedicines() > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Plan Restrictions Apply
                </p>
                <p className="text-sm text-amber-800">
                  {getTotalRestrictedMedicines()} medication(s) are not available on <span className="font-semibold">{selectedPlan}</span> plan.
                  These will be shown as disabled. Consider selecting a higher-tier plan for full access.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 font-medium mb-1">Total Medications</p>
            <p className="text-2xl font-bold text-blue-900">{availableMedicines.length}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-600 font-medium mb-1">Available on {selectedPlan}</p>
            <p className="text-2xl font-bold text-green-900">{getTotalAvailableMedicines()}</p>
          </div>
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-xs text-primary-600 font-medium mb-1">Selected</p>
            <p className="text-2xl font-bold text-primary-900">{selectedMedicines.length}</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {Array.from(groupedMedicines.entries()).map(([medicineClass, medicines]) => {
            const selectedCount = getSelectedCountForClass(medicineClass);
            const availableCount = getAvailableCountForClass(medicineClass);
            const totalCount = medicines.length;

            return (
              <div
                key={medicineClass}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {medicineClass}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>
                        {availableCount} of {totalCount} available
                      </span>
                      {selectedCount > 0 && (
                        <span className="text-primary-600 font-medium">
                          • {selectedCount} selected
                        </span>
                      )}
                      {availableCount < totalCount && (
                        <span className="inline-flex items-center gap-1 text-amber-600">
                          <AlertCircle className="w-3 h-3" />
                          {totalCount - availableCount} restricted
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingClass(medicineClass)}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {selectedMedicines.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
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

        <div className="flex gap-4">
          <button
            onClick={previousStep}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedMedicines.length === 0}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Medication Selection
          </button>
        </div>
      </div>

      {viewingClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{viewingClass}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {getAvailableCountForClass(viewingClass)} of {groupedMedicines.get(viewingClass)?.length} available on {selectedPlan} Plan
                </p>
              </div>
              <button
                onClick={() => setViewingClass(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {groupedMedicines.get(viewingClass)?.map((medicine) => {
                  const isSelected = selectedMedicines.some(
                    (m) => m.medicineNameStrength === medicine.medicineNameStrength
                  );
                  const isAvailable = isMedicineAvailable(medicine);

                  return (
                    <div
                      key={medicine.medicineNameStrength}
                      className={`border-2 rounded-lg p-4 transition-all ${
                        !isAvailable
                          ? 'border-gray-300 bg-gray-100 opacity-75'
                          : isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
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
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded mt-1 disabled:opacity-50"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`font-medium ${isAvailable ? 'text-gray-900' : 'text-gray-600'}`}>
                                {medicine.medicineNameStrength}
                              </p>
                              {!isAvailable && (
                                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded flex items-start gap-2">
                                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-semibold text-amber-900">
                                      Not Available on {selectedPlan}
                                    </p>
                                    <p className="text-xs text-amber-700 mt-1">
                                      {getRestrictionReason(medicine)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-primary-600 ml-2" />
                            )}
                          </div>

                          <div className="mt-3 space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Active Ingredient:</span>
                              <p className={`font-medium ${isAvailable ? 'text-gray-900' : 'text-gray-600'}`}>
                                {medicine.activeIngredient}
                              </p>
                            </div>

                            {medicine.plansExcluded?.includes('Core') &&
                             medicine.plansExcluded?.includes('Priority') &&
                             medicine.plansExcluded?.includes('Saver') ? (
                              <div>
                                <span className="text-gray-600">CDA Amount:</span>
                                <p className={`font-medium ${isAvailable ? 'text-gray-900' : 'text-gray-600'}`}>
                                  {medicine.cdaExecutiveComprehensive}
                                  <span className="text-xs text-gray-500 ml-2">
                                    (Executive/Comprehensive only)
                                  </span>
                                </p>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <span className="text-gray-600">CDA (Core/Priority/Saver):</span>
                                  <p className={`font-medium ${isAvailable ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {medicine.cdaCorePrioritySaver}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-600">CDA (Executive/Comprehensive):</span>
                                  <p className={`font-medium ${isAvailable ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {medicine.cdaExecutiveComprehensive}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setViewingClass(null)}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
