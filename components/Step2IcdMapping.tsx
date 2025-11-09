'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Condition } from '@/types';
import { CheckCircle2, Circle, Search } from 'lucide-react';

export const Step2IcdMapping = () => {
  const { currentCase, allConditions, updateCurrentCase, nextStep, previousStep } = useAppStore();
  const [availableIcdCodes, setAvailableIcdCodes] = useState<Condition[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<Condition[]>(
    currentCase?.selectedIcdCodes || []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCodes, setFilteredCodes] = useState<Condition[]>([]);

  useEffect(() => {
    if (currentCase?.confirmedCondition) {
      const codes = allConditions.filter(
        (c) => c.name === currentCase.confirmedCondition
      );
      setAvailableIcdCodes(codes);
      setFilteredCodes(codes);
    }
  }, [currentCase?.confirmedCondition, allConditions]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCodes(availableIcdCodes);
    } else {
      const filtered = availableIcdCodes.filter(
        (code) =>
          code.icdCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          code.icdDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCodes(filtered);
    }
  }, [searchTerm, availableIcdCodes]);

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
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Step 2: ICD-10 Code Mapping
          </h2>
          <p className="text-gray-600">
            Authi 1.0 has mapped the following ICD-10 codes for{' '}
            <span className="font-semibold text-primary-600">
              {currentCase?.confirmedCondition}
            </span>
            . Select the appropriate codes for this case.
          </p>
        </div>

        {/* Confirmed Condition Display */}
        <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-sm font-medium text-primary-900">Confirmed Condition</p>
          <p className="text-lg font-bold text-primary-700 mt-1">
            {currentCase?.confirmedCondition}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ICD-10 codes by code or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* ICD Codes List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Available ICD-10 Codes ({filteredCodes.length} of {availableIcdCodes.length})
            </label>
            <span className="text-sm text-gray-500">
              {selectedCodes.length} selected
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {filteredCodes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No ICD-10 codes found matching your search.</p>
            ) : (
              filteredCodes.map((code) => {
              const isSelected = selectedCodes.some((c) => c.icdCode === code.icdCode);
              
              return (
                <label
                  key={code.icdCode}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center h-6">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleCode(code)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-primary-700 bg-primary-100 px-2 py-1 rounded">
                        {code.icdCode}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-primary-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{code.icdDescription}</p>
                  </div>
                </label>
              );
            })
            )}
          </div>
        </div>

        {/* Selected Codes Summary */}
        {selectedCodes.length > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
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
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedCodes.length === 0}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Confirm ICD Codes
          </button>
        </div>
      </div>
    </div>
  );
};

