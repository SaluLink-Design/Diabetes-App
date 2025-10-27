'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Condition } from '@/types';
import { CheckCircle2, Circle } from 'lucide-react';

export const Step2IcdMapping = () => {
  const { currentCase, allConditions, updateCurrentCase, nextStep, previousStep } = useAppStore();
  const [availableIcdCodes, setAvailableIcdCodes] = useState<Condition[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<Condition[]>(
    currentCase?.selectedIcdCodes || []
  );

  useEffect(() => {
    if (currentCase?.confirmedCondition) {
      // Filter ICD codes for the confirmed condition
      const codes = allConditions.filter(
        (c) => c.name === currentCase.confirmedCondition
      );
      setAvailableIcdCodes(codes);
    }
  }, [currentCase?.confirmedCondition, allConditions]);

  const handleToggleCode = (code: Condition) => {
    const isSelected = selectedCodes.some((c) => c.icdCode === code.icdCode);
    
    if (isSelected) {
      setSelectedCodes(selectedCodes.filter((c) => c.icdCode !== code.icdCode));
    } else {
      setSelectedCodes([...selectedCodes, code]);
    }
  };

  const handleConfirm = () => {
    if (selectedCodes.length === 0) {
      alert('Please select at least one ICD-10 code.');
      return;
    }

    updateCurrentCase({
      selectedIcdCodes: selectedCodes,
    });
    nextStep();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-[12px] shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1C1C1C] mb-2">
            Step 2: ICD-10 Code Mapping
          </h2>
          <p className="text-[#1C1C1C]/60">
            Authi 1.0 has mapped the following ICD-10 codes for{' '}
            <span className="font-semibold text-[#1C1C1C]">
              {currentCase?.confirmedCondition}
            </span>
            . Select the appropriate codes for this case.
          </p>
        </div>

        {/* Confirmed Condition Display */}
        <div className="mb-6 p-4 bg-[#1C1C1C]/5 border border-[rgba(28,28,28,0.2)] rounded-[12px]">
          <p className="text-sm font-medium text-[#1C1C1C]">Confirmed Condition</p>
          <p className="text-lg font-bold text-[#1C1C1C] mt-1">
            {currentCase?.confirmedCondition}
          </p>
        </div>

        {/* ICD Codes List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-[#1C1C1C]">
              Available ICD-10 Codes ({availableIcdCodes.length})
            </label>
            <span className="text-sm text-[#1C1C1C]/60">
              {selectedCodes.length} selected
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto border border-[rgba(28,28,28,0.2)] rounded-[12px] p-4">
            {availableIcdCodes.map((code) => {
              const isSelected = selectedCodes.some((c) => c.icdCode === code.icdCode);
              
              return (
                <label
                  key={code.icdCode}
                  className={`flex items-start p-4 border-2 rounded-[12px] cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#1C1C1C] bg-[#1C1C1C]/5'
                      : 'border-[rgba(28,28,28,0.2)] hover:border-[#1C1C1C]/50'
                  }`}
                >
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleCode(code)}
                      className="w-4 h-4 text-[#1C1C1C] focus:ring-[#1C1C1C] rounded"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-[#1C1C1C] bg-[#1C1C1C]/10 px-2 py-1 rounded">
                        {code.icdCode}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#1C1C1C]" />
                      )}
                    </div>
                    <p className="text-sm text-[#1C1C1C]/70 mt-2">{code.icdDescription}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Selected Codes Summary */}
        {selectedCodes.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[12px]">
            <p className="text-sm font-medium text-green-900 mb-2">
              Selected ICD-10 Codes ({selectedCodes.length})
            </p>
            <div className="space-y-1">
              {selectedCodes.map((code) => (
                <div key={code.icdCode} className="text-sm text-green-800">
                  <span className="font-mono font-semibold">{code.icdCode}</span>
                  {' - '}
                  {code.icdDescription}
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
            disabled={selectedCodes.length === 0}
            className="flex-1 bg-[#1C1C1C] text-white py-3 px-6 rounded-[12px] font-medium hover:bg-black disabled:bg-[#1C1C1C]/30 disabled:cursor-not-allowed transition-colors"
          >
            Confirm ICD Codes
          </button>
        </div>
      </div>
    </div>
  );
};

