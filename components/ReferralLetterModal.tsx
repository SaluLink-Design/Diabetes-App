'use client';

import { useState } from 'react';
import { X, Send, FileText, AlertCircle } from 'lucide-react';
import { referralService } from '@/lib/supabaseHelpers';
import type { Case, Patient } from '@/types';
import jsPDF from 'jspdf';

interface ReferralLetterModalProps {
  caseData: Case;
  patient: Patient;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReferralLetterModal = ({ caseData, patient, onClose, onSuccess }: ReferralLetterModalProps) => {
  const [specialistType, setSpecialistType] = useState('');
  const [reasonForReferral, setReasonForReferral] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [saving, setSaving] = useState(false);

  const generateReferralPDF = (referralData: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDICAL REFERRAL LETTER', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PATIENT INFORMATION', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${patient.full_name}`, 20, yPos);
    yPos += 6;
    doc.text(`ID Number: ${patient.patient_id_number}`, 20, yPos);
    yPos += 6;
    doc.text(`Date of Birth: ${new Date(patient.date_of_birth).toLocaleDateString()}`, 20, yPos);
    yPos += 6;
    if (patient.medical_aid_number) {
      doc.text(`Medical Aid: ${patient.medical_aid_number}`, 20, yPos);
      yPos += 6;
    }
    yPos += 5;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('REFERRAL DETAILS', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Referring to: ${specialistType}`, 20, yPos);
    yPos += 6;
    doc.text(`Urgency: ${urgencyLevel.toUpperCase()}`, 20, yPos);
    yPos += 6;
    doc.text(`Reason for Referral: ${reasonForReferral}`, 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CLINICAL SUMMARY', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Diagnosis: ${caseData.confirmedCondition}`, 20, yPos);
    yPos += 10;

    if (caseData.selectedIcdCodes && caseData.selectedIcdCodes.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('ICD-10 Codes:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      caseData.selectedIcdCodes.forEach((code: any) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${code.icdCode}: ${code.icdDescription}`, 25, yPos);
        yPos += 6;
      });
      yPos += 5;
    }

    if (clinicalSummary) {
      doc.setFont('helvetica', 'bold');
      doc.text('Additional Clinical Notes:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const summaryLines = doc.splitTextToSize(clinicalSummary, pageWidth - 40);
      summaryLines.forEach((line: string) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 20, yPos);
        yPos += 6;
      });
      yPos += 5;
    }

    if (caseData.selectedMedications && caseData.selectedMedications.length > 0) {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text('Current Medications:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      caseData.selectedMedications.forEach((med: any) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`- ${med.medicineNameStrength}`, 25, yPos);
        yPos += 6;
      });
    }

    doc.save(`Referral_${patient.full_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleSave = async () => {
    if (!specialistType.trim() || !reasonForReferral.trim() || !clinicalSummary.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);

      const referralDocument = {
        patient: {
          full_name: patient.full_name,
          patient_id_number: patient.patient_id_number,
          date_of_birth: patient.date_of_birth,
          medical_aid_number: patient.medical_aid_number,
        },
        diagnosis: caseData.confirmedCondition,
        icd_codes: caseData.selectedIcdCodes,
        medications: caseData.selectedMedications,
        clinical_summary: clinicalSummary,
        generated_date: new Date().toISOString(),
      };

      await referralService.createReferral({
        case_id: caseData.id,
        patient_id: caseData.patient_id,
        specialist_type: specialistType,
        reason_for_referral: reasonForReferral,
        urgency_level: urgencyLevel,
        clinical_summary: clinicalSummary,
        referral_document: referralDocument,
        status: 'pending',
        sent_at: null,
      });

      generateReferralPDF(referralDocument);

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving referral:', error);
      alert('Failed to save referral. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Generate Referral Letter</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Patient: {patient.full_name}</p>
                <p>Diagnosis: {caseData.confirmedCondition}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialist Type *
            </label>
            <input
              type="text"
              value={specialistType}
              onChange={(e) => setSpecialistType(e.target.value)}
              placeholder="e.g., Cardiologist, Endocrinologist, Neurologist"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setUrgencyLevel('routine')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  urgencyLevel === 'routine'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Routine
              </button>
              <button
                onClick={() => setUrgencyLevel('urgent')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  urgencyLevel === 'urgent'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Urgent
              </button>
              <button
                onClick={() => setUrgencyLevel('emergency')}
                className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                  urgencyLevel === 'emergency'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Emergency
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Referral *
            </label>
            <input
              type="text"
              value={reasonForReferral}
              onChange={(e) => setReasonForReferral(e.target.value)}
              placeholder="Brief reason for this referral"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Clinical Summary *
              </div>
            </label>
            <textarea
              value={clinicalSummary}
              onChange={(e) => setClinicalSummary(e.target.value)}
              placeholder="Provide detailed clinical information relevant to this referral, including symptoms, test results, and treatment history..."
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Note:</span> The referral letter will automatically include the patient's diagnosis, ICD-10 codes, and current medications.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {saving ? 'Generating...' : 'Generate & Save Referral'}
          </button>
        </div>
      </div>
    </div>
  );
};
