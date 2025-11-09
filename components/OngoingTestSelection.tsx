'use client';

import { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { caseService } from '@/lib/supabaseHelpers';
import { DocumentationUpload } from './DocumentationUpload';
import type { TreatmentItem, DocumentFile } from '@/types';

interface TestWithDocumentation extends TreatmentItem {
  isSelected: boolean;
  documentation?: {
    note: string;
    files: DocumentFile[];
    timestamp: Date;
  };
}

interface OngoingTestSelectionProps {
  caseId: string;
  preSelectedTests: TestWithDocumentation[];
  onDone: (tests: TestWithDocumentation[]) => void;
  onCancel: () => void;
}

export const OngoingTestSelection = ({ caseId, preSelectedTests, onDone, onCancel }: OngoingTestSelectionProps) => {
  const [ongoingTests, setOngoingTests] = useState<TestWithDocumentation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [currentTestForDoc, setCurrentTestForDoc] = useState<TestWithDocumentation | null>(null);

  useEffect(() => {
    loadOngoingManagementTests();
  }, [caseId]);

  const loadOngoingManagementTests = async () => {
    try {
      setLoading(true);
      const caseData = await caseService.getCaseById(caseId);
      if (!caseData) return;

      const ongoingItems = ((caseData as any).selected_treatments || [])
        .filter((t: any) => t.basketType === 'ongoing')
        .map((item: any) => {
          const preSelected = preSelectedTests.find(p => p.code === item.code);
          return {
            ...item,
            isSelected: preSelected ? true : false,
            usageCount: item.usageCount || 0,
            selectedQuantity: item.selectedQuantity || 0,
            documentation: preSelected?.documentation,
          };
        });

      setOngoingTests(ongoingItems);
    } catch (error) {
      console.error('Error loading ongoing tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestToggle = (test: TestWithDocumentation) => {
    const usageCount = test.usageCount || 0;
    const limit = test.coverageLimit || 0;

    if (!test.isSelected && usageCount >= limit) {
      alert(`Cannot select ${test.description}. Usage limit reached (${usageCount}/${limit})`);
      return;
    }

    const updated = ongoingTests.map(t =>
      t.code === test.code ? { ...t, isSelected: !t.isSelected } : t
    );
    setOngoingTests(updated);
  };

  const handleAddDocumentation = (test: TestWithDocumentation) => {
    setCurrentTestForDoc(test);
    setShowDocModal(true);
  };

  const handleSaveDocumentation = (note: string, files: DocumentFile[], timestamp: Date) => {
    if (!currentTestForDoc) return;

    const updated = ongoingTests.map(t =>
      t.code === currentTestForDoc.code
        ? { ...t, documentation: { note, files, timestamp } }
        : t
    );
    setOngoingTests(updated);

    setShowDocModal(false);
    setCurrentTestForDoc(null);
  };

  const handleDone = () => {
    const selected = ongoingTests.filter(t => t.isSelected);
    onDone(selected);
  };

  const selectedCount = ongoingTests.filter(t => t.isSelected).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ongoing Management Basket</h2>
              <p className="text-sm text-gray-600 mt-1">Select tests performed during this follow-up consultation</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tests...</p>
            </div>
          ) : ongoingTests.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">No Ongoing Management Tests</p>
              <p className="text-gray-600">This case does not have any ongoing management tests configured.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ongoingTests.map((test) => {
                const usageCount = test.usageCount || 0;
                const limit = test.coverageLimit || 0;
                const isOverLimit = usageCount >= limit;

                return (
                  <div
                    key={test.code}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      test.isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : isOverLimit
                        ? 'border-red-200 bg-red-50 opacity-60'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={test.isSelected}
                        onChange={() => handleTestToggle(test)}
                        disabled={isOverLimit}
                        className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{test.description}</h4>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                              <span>Code: <span className="font-mono font-medium">{test.code}</span></span>
                              <span className={`font-medium ${isOverLimit ? 'text-red-600' : 'text-gray-900'}`}>
                                Usage: {usageCount}/{limit}
                              </span>
                              {test.specialistsCovered && (
                                <span>Specialists: {test.specialistsCovered}</span>
                              )}
                            </div>
                          </div>
                          {test.isSelected && (
                            <button
                              onClick={() => handleAddDocumentation(test)}
                              className="flex items-center gap-2 px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors ml-4"
                            >
                              <Upload className="w-4 h-4" />
                              {test.documentation ? 'Edit' : 'Add'} Documentation
                            </button>
                          )}
                        </div>
                        {test.documentation && (
                          <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">Documentation Added</span>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">{test.documentation.note}</p>
                            {test.documentation.files.length > 0 && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                                <ImageIcon className="w-3 h-3" />
                                <span>{test.documentation.files.length} file(s) attached</span>
                              </div>
                            )}
                          </div>
                        )}
                        {isOverLimit && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span>Coverage limit reached - cannot be selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-700">
            <span className="font-bold text-primary-600">{selectedCount}</span> test{selectedCount !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDone}
              disabled={selectedCount === 0}
              className="bg-primary-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {showDocModal && currentTestForDoc && (
        <DocumentationUpload
          item={currentTestForDoc}
          caseId={caseId}
          onSave={handleSaveDocumentation}
          onClose={() => {
            setShowDocModal(false);
            setCurrentTestForDoc(null);
          }}
        />
      )}
    </div>
  );
};
