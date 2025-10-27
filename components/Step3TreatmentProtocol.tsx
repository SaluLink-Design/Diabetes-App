'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Treatment, TreatmentItem, DocumentFile } from '@/types';
import { FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ProcedureQuantityControl } from './ProcedureQuantityControl';
import { DocumentationUpload } from './DocumentationUpload';

export const Step3TreatmentProtocol = () => {
  const { currentCase, allTreatments, updateCurrentCase, nextStep, previousStep } = useAppStore();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<TreatmentItem[]>([]);
  const [selectedOngoing, setSelectedOngoing] = useState<TreatmentItem[]>([]);
  const [documentationModal, setDocumentationModal] = useState<{
    open: boolean;
    item: TreatmentItem;
    basketType: 'diagnostic' | 'ongoing';
  } | null>(null);

  useEffect(() => {
    if (currentCase?.confirmedCondition) {
      const foundTreatment = allTreatments.find(
        (t) => t.condition === currentCase.confirmedCondition
      );
      setTreatment(foundTreatment || null);

      if (currentCase.selectedTreatments) {
        const diagnostic = currentCase.selectedTreatments.filter(
          (t: any) => t.basketType === 'diagnostic'
        );
        const ongoing = currentCase.selectedTreatments.filter(
          (t: any) => t.basketType === 'ongoing'
        );
        setSelectedDiagnostic(diagnostic);
        setSelectedOngoing(ongoing);
      }
    }
  }, [currentCase?.confirmedCondition, allTreatments]);

  const handleToggleDiagnostic = (item: TreatmentItem) => {
    const exists = selectedDiagnostic.find((i) => i.code === item.code);
    if (exists) {
      setSelectedDiagnostic(selectedDiagnostic.filter((i) => i.code !== item.code));
    } else {
      setSelectedDiagnostic([
        ...selectedDiagnostic,
        {
          ...item,
          basketType: 'diagnostic' as any,
          selectedQuantity: 0,
          documentation: { note: '', files: [] },
        },
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
        {
          ...item,
          basketType: 'ongoing' as any,
          selectedQuantity: 0,
          documentation: { note: '', files: [] },
        },
      ]);
    }
  };

  const handleQuantityChange = (
    code: string,
    quantity: number,
    basketType: 'diagnostic' | 'ongoing'
  ) => {
    if (basketType === 'diagnostic') {
      setSelectedDiagnostic(
        selectedDiagnostic.map((i) =>
          i.code === code ? { ...i, selectedQuantity: quantity } : i
        )
      );
    } else {
      setSelectedOngoing(
        selectedOngoing.map((i) =>
          i.code === code ? { ...i, selectedQuantity: quantity } : i
        )
      );
    }
  };

  const handleOpenDocumentation = (item: TreatmentItem, basketType: 'diagnostic' | 'ongoing') => {
    setDocumentationModal({ open: true, item, basketType });
  };

  const handleSaveDocumentation = (note: string, files: DocumentFile[], timestamp: Date) => {
    if (!documentationModal) return;

    const { item, basketType } = documentationModal;

    if (basketType === 'diagnostic') {
      setSelectedDiagnostic(
        selectedDiagnostic.map((i) =>
          i.code === item.code
            ? { ...i, documentation: { note, files, timestamp } }
            : i
        )
      );
    } else {
      setSelectedOngoing(
        selectedOngoing.map((i) =>
          i.code === item.code
            ? { ...i, documentation: { note, files, timestamp } }
            : i
        )
      );
    }

    setDocumentationModal(null);
  };

  const handleConfirm = () => {
    const allSelected = [...selectedDiagnostic, ...selectedOngoing];

    const hasQuantityIssues = allSelected.some((item) => {
      const quantity = item.selectedQuantity || 0;
      return quantity === 0 || quantity > item.coverageLimit;
    });

    if (hasQuantityIssues) {
      alert('Please set valid quantities for all selected procedures (greater than 0 and within coverage limits).');
      return;
    }

    updateCurrentCase({
      selectedTreatments: allSelected,
    });
    nextStep();
  };

  const getTotalSelected = () => selectedDiagnostic.length + selectedOngoing.length;

  const hasDocumentation = (item: TreatmentItem) => {
    return (
      item.documentation?.note ||
      (item.documentation?.files && item.documentation.files.length > 0)
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Step 3: Treatment Protocol Generation
          </h2>
          <p className="text-gray-600">
            Select procedures, set quantities within coverage limits, and add documentation for each treatment.
          </p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Important Guidelines:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Set quantity for each selected procedure (must be greater than 0)</li>
                <li>Quantities cannot exceed coverage limits</li>
                <li>Add clinical documentation for selected procedures</li>
                <li>Upload supporting documents (JPG, PNG, PDF - Max 5MB)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Total Procedures Selected</p>
            <p className="text-2xl font-bold text-primary-600">{getTotalSelected()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Condition</p>
            <p className="text-lg font-semibold text-gray-900">
              {currentCase?.confirmedCondition}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-primary-500">
            <h3 className="text-lg font-bold text-gray-900">Diagnostic Basket</h3>
            <span className="text-sm text-gray-600 bg-primary-100 px-3 py-1 rounded-full font-medium">
              {selectedDiagnostic.length} selected
            </span>
          </div>

          <div className="space-y-4">
            {treatment?.diagnosticBasket.map((item) => {
              const isSelected = selectedDiagnostic.some((i) => i.code === item.code);
              const selectedItem = selectedDiagnostic.find((i) => i.code === item.code);

              return (
                <div
                  key={item.code}
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
                      onChange={() => handleToggleDiagnostic(item)}
                      className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-lg">
                            {item.description}
                          </p>
                          <div className="flex gap-4 mt-1 text-sm text-gray-600">
                            <span>
                              Code: <span className="font-mono font-medium">{item.code}</span>
                            </span>
                            <span>
                              Max Coverage: <span className="font-semibold">{item.coverageLimit}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {isSelected && selectedItem && (
                        <div className="mt-4 space-y-3 pt-3 border-t border-primary-200">
                          <ProcedureQuantityControl
                            item={selectedItem}
                            onQuantityChange={(quantity) =>
                              handleQuantityChange(item.code, quantity, 'diagnostic')
                            }
                          />

                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleOpenDocumentation(selectedItem, 'diagnostic')}
                              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              <FileText className="w-4 h-4" />
                              {hasDocumentation(selectedItem)
                                ? 'Edit Documentation'
                                : 'Add Documentation'}
                            </button>
                            {hasDocumentation(selectedItem) && (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Documented</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-green-500">
            <h3 className="text-lg font-bold text-gray-900">Ongoing Management Basket</h3>
            <span className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-full font-medium">
              {selectedOngoing.length} selected
            </span>
          </div>

          <div className="space-y-4">
            {treatment?.ongoingManagementBasket.map((item) => {
              const isSelected = selectedOngoing.some((i) => i.code === item.code);
              const selectedItem = selectedOngoing.find((i) => i.code === item.code);

              return (
                <div
                  key={item.code}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    isSelected
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleOngoing(item)}
                      className="w-5 h-5 text-green-600 focus:ring-green-500 rounded mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-lg">
                            {item.description}
                          </p>
                          <div className="flex gap-4 mt-1 text-sm text-gray-600">
                            <span>
                              Code: <span className="font-mono font-medium">{item.code}</span>
                            </span>
                            <span>
                              Max Coverage: <span className="font-semibold">{item.coverageLimit}</span>
                            </span>
                            {item.specialistsCovered && (
                              <span>Specialists: {item.specialistsCovered}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isSelected && selectedItem && (
                        <div className="mt-4 space-y-3 pt-3 border-t border-green-200">
                          <ProcedureQuantityControl
                            item={selectedItem}
                            onQuantityChange={(quantity) =>
                              handleQuantityChange(item.code, quantity, 'ongoing')
                            }
                          />

                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleOpenDocumentation(selectedItem, 'ongoing')}
                              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                              <FileText className="w-4 h-4" />
                              {hasDocumentation(selectedItem)
                                ? 'Edit Documentation'
                                : 'Add Documentation'}
                            </button>
                            {hasDocumentation(selectedItem) && (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Documented</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={previousStep}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleConfirm}
            disabled={getTotalSelected() === 0}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Treatment Selection
          </button>
        </div>
      </div>

      {documentationModal && (
        <DocumentationUpload
          item={documentationModal.item}
          caseId={currentCase?.id || 'unknown'}
          onSave={handleSaveDocumentation}
          onClose={() => setDocumentationModal(null)}
        />
      )}
    </div>
  );
};
