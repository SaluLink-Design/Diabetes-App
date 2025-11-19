'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Activity, Send, Calendar, User, X, Plus } from 'lucide-react';
import { caseService, patientService, ongoingManagementService, referralService } from '@/lib/supabaseHelpers';
import type { Case, Patient, OngoingManagementActivity, ReferralLetter } from '@/types';
import { exportCaseToPDF } from '@/lib/pdfExport';
import { OngoingManagementModal } from './OngoingManagementModal';
import { ReferralLetterModal } from './ReferralLetterModal';
import { useAppStore } from '@/store/useAppStore';

interface CaseDetailsProps {
  caseId: string;
  onBack: () => void;
  onEditCase: (caseId: string) => void;
}

type TabType = 'summary' | 'ongoing' | 'referrals';

export const CaseDetails = ({ caseId, onBack, onEditCase }: CaseDetailsProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activities, setActivities] = useState<OngoingManagementActivity[]>([]);
  const [referrals, setReferrals] = useState<ReferralLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOngoingModal, setShowOngoingModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  useEffect(() => {
    loadCaseDetails();
  }, [caseId]);

  const loadCaseDetails = async () => {
    try {
      setLoading(true);
      const dbCase = await caseService.getCaseById(caseId);
      if (!dbCase) {
        alert('Case not found');
        onBack();
        return;
      }

      const patientDetails = await patientService.getPatientByIdNumber(
        (await patientService.getAllPatients()).find(p => p.id === dbCase.patient_id)?.patient_id_number || ''
      );

      const [activitiesData, referralsData] = await Promise.all([
        ongoingManagementService.getActivitiesByCaseId(caseId),
        referralService.getReferralsByCaseId(caseId),
      ]);

      const formattedCase: Case = {
        id: dbCase.id,
        patient_id: dbCase.patient_id,
        patientNote: (dbCase as any).patient_note || '',
        detectedConditions: Array.isArray((dbCase as any).detected_conditions) ? (dbCase as any).detected_conditions : [],
        confirmedCondition: (dbCase as any).confirmed_condition || '',
        selectedIcdCodes: (dbCase as any).selected_icd_codes || [],
        selectedTreatments: (dbCase as any).selected_treatments || [],
        selectedMedications: (dbCase as any).selected_medications || [],
        chronicRegistrationNote: (dbCase as any).chronic_registration_note || '',
        chronicRegistrationNotes: (dbCase as any).chronic_registration_notes || [],
        status: dbCase.status,
        createdAt: new Date((dbCase as any).created_at),
        updatedAt: new Date((dbCase as any).updated_at),
      };

      setCaseData(formattedCase);
      setPatient(patientDetails);
      setActivities(activitiesData);
      setReferrals(referralsData);
    } catch (error) {
      console.error('Error loading case details:', error);
      alert('Failed to load case details');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (caseData && patient) {
      exportCaseToPDF({ ...caseData, patient } as any);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!caseData || !patient) {
    return null;
  }

  const diagnosticItems = caseData.selectedTreatments?.filter(
    (t: any) => t.basketType === 'diagnostic'
  ) || [];

  const ongoingItems = caseData.selectedTreatments?.filter(
    (t: any) => t.basketType === 'ongoing'
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Cases
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleExportPDF}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => onEditCase(caseId)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Edit Case
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">{patient.full_name}</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ID:</span>
                  <span className="ml-2 font-medium">{patient.patient_id_number}</span>
                </div>
                <div>
                  <span className="text-gray-600">DOB:</span>
                  <span className="ml-2 font-medium">{new Date(patient.date_of_birth).toLocaleDateString()}</span>
                </div>
                {patient.medical_aid_number && (
                  <div>
                    <span className="text-gray-600">Medical Aid:</span>
                    <span className="ml-2 font-medium">{patient.medical_aid_number}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'summary'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                Case Summary
              </button>
              <button
                onClick={() => setActiveTab('ongoing')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'ongoing'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                Ongoing Management ({activities.length})
              </button>
              <button
                onClick={() => setActiveTab('referrals')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'referrals'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Send className="w-4 h-4" />
                Referrals ({referrals.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">ORIGINAL CLINICAL NOTE</h3>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{caseData.patientNote}</p>
                </div>

                <div className="border border-primary-200 bg-primary-50 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-primary-900 mb-2">CONFIRMED CONDITION</h3>
                  <p className="text-lg font-bold text-primary-700">{caseData.confirmedCondition}</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">SELECTED ICD-10 CODES</h3>
                  <div className="space-y-2">
                    {caseData.selectedIcdCodes?.map((code: any) => (
                      <div key={code.icdCode} className="flex items-start gap-3">
                        <span className="font-mono text-sm font-semibold text-primary-700 bg-primary-100 px-2 py-1 rounded">
                          {code.icdCode}
                        </span>
                        <p className="text-sm text-gray-700 flex-1">{code.icdDescription}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {diagnosticItems.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">DIAGNOSTIC BASKET</h3>
                    <div className="space-y-3">
                      {diagnosticItems.map((item: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-gray-900">{item.description}</p>
                          <div className="mt-1 text-sm text-gray-600">
                            <span>Code: {item.code}</span>
                            {' • '}
                            <span>Quantity: {item.selectedQuantity || 0} / {item.coverageLimit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {ongoingItems.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">ONGOING MANAGEMENT BASKET</h3>
                    <div className="space-y-3">
                      {ongoingItems.map((item: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <p className="font-medium text-gray-900">{item.description}</p>
                          <div className="mt-1 text-sm text-gray-600">
                            <span>Code: {item.code}</span>
                            {' • '}
                            <span>Initial Coverage: {item.selectedQuantity || 0} / {item.coverageLimit}</span>
                            {' • '}
                            <span className="font-bold text-primary-700">Used: {item.usageCount || 0} / {item.coverageLimit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ongoing' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Ongoing Management Activities</h3>
                  <button
                    onClick={() => {
                      useAppStore.getState().setReturnToCaseId(caseId);
                      onEditCase(caseId);
                    }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Activity
                  </button>
                </div>

                {activities.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No ongoing management activities yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                            {activity.activity_type.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(activity.activity_date).toLocaleDateString()}
                          </span>
                        </div>
                        {activity.specialist_type && (
                          <p className="text-sm text-gray-700 mb-2">
                            <span className="font-medium">Specialist:</span> {activity.specialist_type}
                          </p>
                        )}
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{activity.clinical_notes}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Referral Letters</h3>
                  <button
                    onClick={() => setShowReferralModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Referral
                  </button>
                </div>

                {referrals.length === 0 ? (
                  <div className="text-center py-12">
                    <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No referral letters yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {referrals.map((referral) => (
                      <div key={referral.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                              {referral.status.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                              referral.urgency_level === 'emergency'
                                ? 'bg-red-100 text-red-700'
                                : referral.urgency_level === 'urgent'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {referral.urgency_level.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {new Date(referral.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Referral to: {referral.specialist_type}</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          <span className="font-medium">Reason:</span> {referral.reason_for_referral}
                        </p>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{referral.clinical_summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showOngoingModal && (
        <OngoingManagementModal
          caseId={caseId}
          onClose={() => setShowOngoingModal(false)}
          onSuccess={() => {
            loadCaseDetails();
          }}
        />
      )}

      {showReferralModal && caseData && patient && (
        <ReferralLetterModal
          caseData={caseData}
          patient={patient}
          onClose={() => setShowReferralModal(false)}
          onSuccess={() => {
            loadCaseDetails();
          }}
        />
      )}
    </div>
  );
};
