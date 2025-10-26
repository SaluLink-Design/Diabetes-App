'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Treatment, TreatmentItem } from '@/types';
import { FileText, Upload, X } from 'lucide-react';

export const Step3TreatmentProtocol = () => {
  const { currentCase, allTreatments, updateCurrentCase, nextStep, previousStep } = useAppStore();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<any[]>([]);
  const [selectedOngoing, setSelectedOngoing] = useState<any[]>([]);
  const [documentationModal, setDocumentationModal] = useState<{
    open: boolean;
    item: any;
    basketType: 'diagnostic' | 'ongoing';
  } | null>(null);

  useEffect(() => {
    if (currentCase?.confirmedCondition) {
      const foundTreatment = allTreatments.find(
        (t) => t.condition === currentCase.confirmedCondition
      );
      setTreatment(foundTreatment || null);
    }
  }, [currentCase?.confirmedCondition, allTreatments]);

  const handleToggleDiagnostic = (item: TreatmentItem) => {
    const exists = selectedDiagnostic.find((i) => i.code === item.code);
    if (exists) {
      setSelectedDiagnostic(selectedDiagnostic.filter((i) => i.code !== item.code));
    } else {
      setSelectedDiagnostic([
        ...selectedDiagnostic,
        { ...item, basketType: 'diagnostic', documentation: { note: '', imageUrl: '' } },
      ]);
    }
  };

  const handleToggleOngoing = (item: TreatmentItem) => {
    const exists = selectedOngoing.find((i) => i.code === item.code);
    if (exists) {
      setSelectedOngoing(selectedOngoing.filter((i) => i.code !== item.code));
    } else {
      setSelectedOngoing([
        ...selectedOngoing,
        { ...item, basketType: 'ongoing', documentation: { note: '', imageUrl: '' } },
      ]);
    }
  };

  const handleOpenDocumentation = (item: any, basketType: 'diagnostic' | 'ongoing') => {
    setDocumentationModal({ open: true, item, basketType });
  };

  const handleSaveDocumentation = (note: string, imageUrl: string) => {
    if (!documentationModal) return;

    const { item, basketType } = documentationModal;
    
    if (basketType === 'diagnostic') {
      setSelectedDiagnostic(
        selectedDiagnostic.map((i) =>
          i.code === item.code
            ? { ...i, documentation: { note, imageUrl } }
            : i
        )
      );
    } else {
      setSelectedOngoing(
        selectedOngoing.map((i) =>
          i.code === item.code
            ? { ...i, documentation: { note, imageUrl } }
            : i
        )
      );
    }

    setDocumentationModal(null);
  };

  const handleConfirm = () => {
    if (selectedDiagnostic.length === 0 && selectedOngoing.length === 0) {
      alert('Please select at least one treatment procedure.');
      return;
    }

    updateCurrentCase({
      selectedTreatments: [...selectedDiagnostic, ...selectedOngoing],
    });
    nextStep();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Step 3: Treatment Protocol Generation
          </h2>
          <p className="text-gray-600">
            Select the appropriate diagnostic tests and ongoing management procedures for this case.
          </p>
        </div>

        {/* Diagnostic Basket */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Diagnostic Basket</h3>
            <span className="text-sm text-gray-500">
              {selectedDiagnostic.length} selected
            </span>
          </div>

          <div className="space-y-3">
            {treatment?.diagnosticBasket.map((item) => {
              const isSelected = selectedDiagnostic.some((i) => i.code === item.code);
              const selectedItem = selectedDiagnostic.find((i) => i.code === item.code);

              return (
                <div
                  key={item.code}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200'
                  }`}
                >
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleDiagnostic(item)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-900">{item.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>Code: <span className="font-mono">{item.code}</span></span>
                        <span>Covered: {item.numberCovered}</span>
                      </div>
                    </div>
                  </label>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-primary-200">
                      <button
                        onClick={() => handleOpenDocumentation(selectedItem, 'diagnostic')}
                        className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        {selectedItem?.documentation?.note || selectedItem?.documentation?.imageUrl
                          ? 'Edit Documentation'
                          : 'Add Documentation'}
                      </button>
                      {(selectedItem?.documentation?.note || selectedItem?.documentation?.imageUrl) && (
                        <div className="mt-2 text-xs text-green-600">
                          ✓ Documentation added
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ongoing Management Basket */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Ongoing Management Basket</h3>
            <span className="text-sm text-gray-500">
              {selectedOngoing.length} selected
            </span>
          </div>

          <div className="space-y-3">
            {treatment?.ongoingManagementBasket.map((item) => {
              const isSelected = selectedOngoing.some((i) => i.code === item.code);
              const selectedItem = selectedOngoing.find((i) => i.code === item.code);

              return (
                <div
                  key={item.code}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200'
                  }`}
                >
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleOngoing(item)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 rounded mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-900">{item.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>Code: <span className="font-mono">{item.code}</span></span>
                        <span>Tests Covered: {item.numberCovered}</span>
                        {item.specialistsCovered && (
                          <span>Specialists: {item.specialistsCovered}</span>
                        )}
                      </div>
                    </div>
                  </label>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-primary-200">
                      <button
                        onClick={() => handleOpenDocumentation(selectedItem, 'ongoing')}
                        className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        {selectedItem?.documentation?.note || selectedItem?.documentation?.imageUrl
                          ? 'Edit Documentation'
                          : 'Add Documentation'}
                      </button>
                      {(selectedItem?.documentation?.note || selectedItem?.documentation?.imageUrl) && (
                        <div className="mt-2 text-xs text-green-600">
                          ✓ Documentation added
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

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
            disabled={selectedDiagnostic.length === 0 && selectedOngoing.length === 0}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Treatment Selection
          </button>
        </div>
      </div>

      {/* Documentation Modal */}
      {documentationModal && (
        <DocumentationModal
          item={documentationModal.item}
          onSave={handleSaveDocumentation}
          onClose={() => setDocumentationModal(null)}
        />
      )}
    </div>
  );
};

// Documentation Modal Component
const DocumentationModal = ({
  item,
  onSave,
  onClose,
}: {
  item: any;
  onSave: (note: string, imageUrl: string) => void;
  onClose: () => void;
}) => {
  const [note, setNote] = useState(item.documentation?.note || '');
  const [imageUrl, setImageUrl] = useState(item.documentation?.imageUrl || '');

  const handleSave = () => {
    onSave(note, imageUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Add Documentation</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Procedure:</span> {item.description}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter clinical findings, results, or observations..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (Optional)
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL or upload link..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter a URL to an uploaded lab report, scan result, or other documentation.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Save Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

