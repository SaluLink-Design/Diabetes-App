'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { TreatmentItem } from '@/types';
import { CheckCircle2, AlertCircle, ArrowRight, SkipForward } from 'lucide-react';

export const Step5OptionalTests = () => {
  const { currentCase, allTreatments, updateCurrentCase, nextStep, previousStep } = useAppStore();
  const [ongoingTests, setOngoingTests] = useState<TreatmentItem[]>([]);
  const [selectedTests, setSelectedTests] = useState<TreatmentItem[]>([]);

  useEffect(() => {
    if (currentCase?.confirmedCondition) {
      const treatment = allTreatments.find(
        (t) => t.condition === currentCase.confirmedCondition
      );

      if (treatment) {
        setOngoingTests(treatment.ongoingManagementBasket);
      }

      if (currentCase.optionalTests) {
        setSelectedTests(currentCase.optionalTests);
      }
    }
  }, [currentCase?.confirmedCondition, allTreatments, currentCase]);

  const handleToggleTest = (test: TreatmentItem) => {
    const isSelected = selectedTests.some((t) => t.code === test.code);

    if (isSelected) {
      setSelectedTests(selectedTests.filter((t) => t.code !== test.code));
    } else {
      setSelectedTests([...selectedTests, { ...test, selectedQuantity: 1 }]);
    }
  };

  const handleQuantityChange = (code: string, quantity: number) => {
    setSelectedTests(
      selectedTests.map((t) =>
        t.code === code ? { ...t, selectedQuantity: quantity } : t
      )
    );
  };

  const handleContinue = () => {
    updateCurrentCase({
      optionalTests: selectedTests.length > 0 ? selectedTests : undefined,
    });
    nextStep();
  };

  const handleSkip = () => {
    updateCurrentCase({
      optionalTests: undefined,
    });
    nextStep();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Step 5: Optional Test Selection
          </h2>
          <p className="text-gray-600">
            Select tests from the ongoing management basket if needed, or skip this step to continue.
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">This step is optional</p>
              <p>
                You can select tests from the ongoing management basket for additional documentation,
                or click "Skip" to proceed directly to the chronic registration note.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Optional Tests Selected</p>
            <p className="text-2xl font-bold text-primary-600">{selectedTests.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Available Tests</p>
            <p className="text-lg font-semibold text-gray-900">{ongoingTests.length}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-primary-500">
            <h3 className="text-lg font-bold text-gray-900">Available Tests</h3>
            <span className="text-sm text-gray-600 bg-primary-100 px-3 py-1 rounded-full font-medium">
              {selectedTests.length} selected
            </span>
          </div>

          {ongoingTests.length === 0 ? (
            <div className="p-8 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600">No ongoing management tests available for this condition.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ongoingTests.map((test) => {
                const isSelected = selectedTests.some((t) => t.code === test.code);
                const selectedTest = selectedTests.find((t) => t.code === test.code);

                return (
                  <div
                    key={test.code}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleTest(test)}
                        className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-lg">
                              {test.description}
                            </p>
                            <div className="flex gap-4 mt-1 text-sm text-gray-600">
                              <span>
                                Code: <span className="font-mono font-medium">{test.code}</span>
                              </span>
                              <span>
                                Max Coverage: <span className="font-semibold">{test.coverageLimit}</span>
                              </span>
                              {test.specialistsCovered && (
                                <span>Specialists: {test.specialistsCovered}</span>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-6 h-6 text-primary-600 ml-3" />
                          )}
                        </div>

                        {isSelected && selectedTest && (
                          <div className="mt-4 pt-3 border-t border-primary-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Quantity
                            </label>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  const newQty = Math.max(1, (selectedTest.selectedQuantity || 1) - 1);
                                  handleQuantityChange(test.code, newQty);
                                }}
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-semibold"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                max={test.coverageLimit}
                                value={selectedTest.selectedQuantity || 1}
                                onChange={(e) => {
                                  e.preventDefault();
                                  const value = parseInt(e.target.value) || 1;
                                  handleQuantityChange(
                                    test.code,
                                    Math.min(Math.max(1, value), test.coverageLimit)
                                  );
                                }}
                                className="w-20 px-3 py-1 border border-gray-300 rounded text-center font-semibold"
                              />
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  const newQty = Math.min(
                                    test.coverageLimit,
                                    (selectedTest.selectedQuantity || 1) + 1
                                  );
                                  handleQuantityChange(test.code, newQty);
                                }}
                                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-semibold"
                              >
                                +
                              </button>
                              <span className="text-sm text-gray-600">
                                / {test.coverageLimit} max
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selectedTests.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-2">
              Selected Tests ({selectedTests.length})
            </p>
            <div className="space-y-1">
              {selectedTests.map((test) => (
                <div key={test.code} className="text-sm text-green-800">
                  • {test.description} - Quantity: {test.selectedQuantity || 1}
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
            onClick={handleSkip}
            className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-500 transition-colors flex items-center justify-center gap-2"
          >
            <SkipForward className="w-5 h-5" />
            Skip This Step
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
