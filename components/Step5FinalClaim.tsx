'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { exportCaseToPDF } from '@/lib/pdfExport';
import { FileText, Download, Save, CheckCircle2 } from 'lucide-react';

export const Step5FinalClaim = () => {
  const { currentCase, updateCurrentCase, saveCase, previousStep, createNewCase } = useAppStore();
  const [chronicNote, setChronicNote] = useState(
    currentCase?.chronicRegistrationNote || ''
  );
  const [saved, setSaved] = useState(false);

  const handleSaveCase = () => {
    updateCurrentCase({
      chronicRegistrationNote: chronicNote,
    });
    saveCase();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportPDF = () => {
    if (!currentCase || !currentCase.id) return;

    const completeCase = {
      ...currentCase,
      chronicRegistrationNote: chronicNote,
    };

    exportCaseToPDF(completeCase as any);
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
      <div className="bg-white rounded-[12px] shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1C1C1C] mb-2">
            Step 5: Final Claim Documentation and Export
          </h2>
          <p className="text-[#1C1C1C]/60">
            Review the complete case documentation and add a chronic registration note before exporting.
          </p>
        </div>

        {/* Case Summary */}
        <div className="space-y-6 mb-8">
          {/* Original Note */}
          <div className="border border-[rgba(28,28,28,0.2)] rounded-[12px] p-4">
            <h3 className="text-sm font-bold text-[#1C1C1C] mb-2">
              ORIGINAL CLINICAL NOTE
            </h3>
            <p className="text-sm text-[#1C1C1C] whitespace-pre-wrap">
              {currentCase?.patientNote}
            </p>
          </div>

          {/* Confirmed Condition */}
          <div className="border border-[rgba(28,28,28,0.2)] bg-[#1C1C1C]/5 rounded-[12px] p-4">
            <h3 className="text-sm font-bold text-[#1C1C1C] mb-2">
              CONFIRMED CONDITION
            </h3>
            <p className="text-lg font-bold text-[#1C1C1C]">
              {currentCase?.confirmedCondition}
            </p>
          </div>

          {/* ICD-10 Codes */}
          <div className="border border-[rgba(28,28,28,0.2)] rounded-[12px] p-4">
            <h3 className="text-sm font-bold text-[#1C1C1C] mb-3">
              SELECTED ICD-10 CODES
            </h3>
            <div className="space-y-2">
              {currentCase?.selectedIcdCodes?.map((code: any) => (
                <div key={code.icdCode} className="flex items-start gap-3">
                  <span className="font-mono text-sm font-semibold text-[#1C1C1C] bg-[#1C1C1C]/10 px-2 py-1 rounded">
                    {code.icdCode}
                  </span>
                  <p className="text-sm text-[#1C1C1C]/70 flex-1">
                    {code.icdDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Diagnostic Basket */}
          {diagnosticItems.length > 0 && (
            <div className="border border-[rgba(28,28,28,0.2)] rounded-[12px] p-4">
              <h3 className="text-sm font-bold text-[#1C1C1C] mb-3">
                DIAGNOSTIC BASKET
              </h3>
              <div className="space-y-3">
                {diagnosticItems.map((item: any, index: number) => (
                  <div key={index} className="bg-[#1C1C1C]/5 p-3 rounded">
                    <p className="font-medium text-[#1C1C1C]">{item.description}</p>
                    <div className="mt-1 text-sm text-[#1C1C1C]/60">
                      <span>Code: {item.code}</span>
                      {' • '}
                      <span>Covered: {item.numberCovered}</span>
                    </div>
                    {item.documentation?.note && (
                      <div className="mt-2 text-sm text-[#1C1C1C]/70 bg-white p-2 rounded border border-[rgba(28,28,28,0.2)]">
                        <span className="font-medium">Documentation:</span> {item.documentation.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ongoing Management Basket */}
          {ongoingItems.length > 0 && (
            <div className="border border-[rgba(28,28,28,0.2)] rounded-[12px] p-4">
              <h3 className="text-sm font-bold text-[#1C1C1C] mb-3">
                ONGOING MANAGEMENT BASKET
              </h3>
              <div className="space-y-3">
                {ongoingItems.map((item: any, index: number) => (
                  <div key={index} className="bg-[#1C1C1C]/5 p-3 rounded">
                    <p className="font-medium text-[#1C1C1C]">{item.description}</p>
                    <div className="mt-1 text-sm text-[#1C1C1C]/60">
                      <span>Code: {item.code}</span>
                      {' • '}
                      <span>Covered: {item.numberCovered}</span>
                      {item.specialistsCovered && (
                        <>
                          {' • '}
                          <span>Specialists: {item.specialistsCovered}</span>
                        </>
                      )}
                    </div>
                    {item.documentation?.note && (
                      <div className="mt-2 text-sm text-[#1C1C1C]/70 bg-white p-2 rounded border border-[rgba(28,28,28,0.2)]">
                        <span className="font-medium">Documentation:</span> {item.documentation.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Medications */}
          {currentCase?.selectedMedications && currentCase.selectedMedications.length > 0 && (
            <div className="border border-[rgba(28,28,28,0.2)] rounded-[12px] p-4">
              <h3 className="text-sm font-bold text-[#1C1C1C] mb-3">
                SELECTED MEDICATIONS
              </h3>
              <div className="space-y-3">
                {currentCase.selectedMedications.map((med: any, index: number) => (
                  <div key={index} className="bg-[#1C1C1C]/5 p-3 rounded">
                    <p className="font-medium text-[#1C1C1C]">{med.medicineNameStrength}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-[#1C1C1C]/60">
                      <div>
                        <span className="font-medium">Class:</span> {med.medicineClass}
                      </div>
                      <div>
                        <span className="font-medium">Active Ingredient:</span> {med.activeIngredient}
                      </div>
                      <div>
                        <span className="font-medium">CDA (Core/Priority/Saver):</span> {med.cdaCorePrioritySaver}
                      </div>
                      <div>
                        <span className="font-medium">CDA (Executive/Comprehensive):</span> {med.cdaExecutiveComprehensive}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chronic Registration Note */}
          <div className="border border-[rgba(28,28,28,0.2)] rounded-[12px] p-4">
            <h3 className="text-sm font-bold text-[#1C1C1C] mb-3">
              CHRONIC REGISTRATION NOTE
            </h3>
            <textarea
              value={chronicNote}
              onChange={(e) => setChronicNote(e.target.value)}
              placeholder="Enter chronic medication registration note..."
              className="w-full h-32 px-4 py-3 border border-[rgba(28,28,28,0.2)] rounded-[12px] focus:ring-2 focus:ring-[#1C1C1C] focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[12px] flex items-center">
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
              className="flex-1 bg-[#1C1C1C]/10 text-[#1C1C1C] py-3 px-6 rounded-[12px] font-medium hover:bg-[#1C1C1C]/20 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleSaveCase}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-[12px] font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Case
            </button>
          </div>

          <button
            onClick={handleExportPDF}
            className="w-full bg-[#1C1C1C] text-white py-3 px-6 rounded-[12px] font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export as PDF
          </button>

          <button
            onClick={handleNewCase}
            className="w-full bg-[#1C1C1C]/80 text-white py-3 px-6 rounded-[12px] font-medium hover:bg-[#1C1C1C] transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Start New Case
          </button>
        </div>
      </div>
    </div>
  );
};

