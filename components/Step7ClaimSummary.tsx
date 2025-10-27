'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { exportCaseToPDF } from '@/lib/pdfExport';
import { FileText, Download, Save, CheckCircle2 } from 'lucide-react';

export const Step7ClaimSummary = () => {
  const { currentCase, updateCurrentCase, saveCase, previousStep, createNewCase } = useAppStore();
  const [saved, setSaved] = useState(false);

  const handleSaveCase = () => {
    saveCase();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportPDF = () => {
    if (!currentCase || !currentCase.id) return;
    exportCaseToPDF(currentCase as any);
  };

  const handleNewCase = () => {
    createNewCase();
  };

  const diagnosticItems = currentCase?.selectedTreatments?.filter(
    (t: any) => t.basketType === 'diagnostic'
  ) || [];

  const ongoingItems = currentCase?.selectedTreatments?.filter(
    (t: any) => t.basketType === 'ongoing'
  ) || [];

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Step 7: Claim Summary and Export
          </h2>
          <p className="text-gray-600">
            Review the complete case documentation including all selected items and export your claim.
          </p>
        </div>

        {/* Case Summary */}
        <div className="space-y-6 mb-8">
          {/* Original Note */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-2">
              ORIGINAL CLINICAL NOTE
            </h3>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">
              {currentCase?.patientNote}
            </p>
          </div>

          {/* Confirmed Condition */}
          <div className="border border-primary-200 bg-primary-50 rounded-lg p-4">
            <h3 className="text-sm font-bold text-primary-900 mb-2">
              CONFIRMED CONDITION
            </h3>
            <p className="text-lg font-bold text-primary-700">
              {currentCase?.confirmedCondition}
            </p>
          </div>

          {/* ICD-10 Codes */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">
              SELECTED ICD-10 CODES
            </h3>
            <div className="space-y-2">
              {currentCase?.selectedIcdCodes?.map((code: any) => (
                <div key={code.icdCode} className="flex items-start gap-3">
                  <span className="font-mono text-sm font-semibold text-primary-700 bg-primary-100 px-2 py-1 rounded">
                    {code.icdCode}
                  </span>
                  <p className="text-sm text-gray-700 flex-1">
                    {code.icdDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Basket */}
          {diagnosticItems.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                DIAGNOSTIC BASKET
              </h3>
              <div className="space-y-3">
                {diagnosticItems.map((item: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-900">{item.description}</p>
                    <div className="mt-1 text-sm text-gray-600">
                      <span>Code: {item.code}</span>
                      {' • '}
                      <span>Quantity: {item.selectedQuantity || 0} / {item.coverageLimit}</span>
                    </div>
                    {item.documentation?.note && (
                      <div className="mt-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                        <span className="font-medium">Clinical Note:</span> {item.documentation.note}
                      </div>
                    )}
                    {item.documentation?.files && item.documentation.files.length > 0 && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Attached Files ({item.documentation.files.length}):</span>
                        <ul className="list-disc list-inside ml-2 mt-1">
                          {item.documentation.files.map((file: any, i: number) => (
                            <li key={i}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.documentation?.timestamp && (
                      <div className="mt-1 text-xs text-gray-500">
                        Documented: {new Date(item.documentation.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ongoing Management Basket */}
          {ongoingItems.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                ONGOING MANAGEMENT BASKET
              </h3>
              <div className="space-y-3">
                {ongoingItems.map((item: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-900">{item.description}</p>
                    <div className="mt-1 text-sm text-gray-600">
                      <span>Code: {item.code}</span>
                      {' • '}
                      <span>Quantity: {item.selectedQuantity || 0} / {item.coverageLimit}</span>
                      {item.specialistsCovered && (
                        <>
                          {' • '}
                          <span>Specialists: {item.specialistsCovered}</span>
                        </>
                      )}
                    </div>
                    {item.documentation?.note && (
                      <div className="mt-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                        <span className="font-medium">Clinical Note:</span> {item.documentation.note}
                      </div>
                    )}
                    {item.documentation?.files && item.documentation.files.length > 0 && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Attached Files ({item.documentation.files.length}):</span>
                        <ul className="list-disc list-inside ml-2 mt-1">
                          {item.documentation.files.map((file: any, i: number) => (
                            <li key={i}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {item.documentation?.timestamp && (
                      <div className="mt-1 text-xs text-gray-500">
                        Documented: {new Date(item.documentation.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Medications */}
          {currentCase?.selectedMedications && currentCase.selectedMedications.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                SELECTED MEDICATIONS
              </h3>
              <div className="space-y-3">
                {currentCase.selectedMedications.map((med: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-900">{med.medicineNameStrength}</p>
                    <div className="mt-2 space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Class:</span> {med.medicineClass}
                      </div>
                      <div>
                        <span className="font-medium">Active Ingredient:</span> {med.activeIngredient}
                      </div>
                      {med.plansExcluded?.includes('Core') &&
                       med.plansExcluded?.includes('Priority') &&
                       med.plansExcluded?.includes('Saver') ? (
                        <div>
                          <span className="font-medium">CDA Amount:</span> {med.cdaExecutiveComprehensive}
                          <span className="text-xs text-gray-500 ml-2">
                            (Executive/Comprehensive only)
                          </span>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="font-medium">CDA (Core/Priority/Saver):</span> {med.cdaCorePrioritySaver}
                          </div>
                          <div>
                            <span className="font-medium">CDA (Executive/Comprehensive):</span> {med.cdaExecutiveComprehensive}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Tests */}
          {currentCase?.optionalTests && currentCase.optionalTests.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                OPTIONAL TESTS SELECTED
              </h3>
              <div className="space-y-3">
                {currentCase.optionalTests.map((test: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-gray-900">{test.description}</p>
                    <div className="mt-1 text-sm text-gray-600">
                      <span>Code: {test.code}</span>
                      {' • '}
                      <span>Quantity: {test.selectedQuantity || 1}</span>
                      {test.specialistsCovered && (
                        <>
                          {' • '}
                          <span>Specialists: {test.specialistsCovered}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chronic Registration Note */}
          {currentCase?.chronicRegistrationNote && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                CHRONIC REGISTRATION NOTE
              </h3>
              <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-sm text-gray-900">
                {currentCase.chronicRegistrationNote}
              </div>
            </div>
          )}
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-sm font-medium text-green-800">
              Case saved successfully!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={previousStep}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleSaveCase}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Case
            </button>
          </div>

          <button
            onClick={handleExportPDF}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export as PDF
          </button>

          <button
            onClick={handleNewCase}
            className="w-full bg-gray-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Start New Case
          </button>
        </div>
      </div>
    </div>
  );
};

