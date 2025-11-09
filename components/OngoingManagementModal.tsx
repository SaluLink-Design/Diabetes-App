'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, FileText, Activity, ChevronRight } from 'lucide-react';
import { ongoingManagementService, caseService } from '@/lib/supabaseHelpers';
import { OngoingTestSelection } from './OngoingTestSelection';
import type { TreatmentItem, DocumentFile } from '@/types';

interface OngoingManagementModalProps {
  caseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface TestWithDocumentation extends TreatmentItem {
  isSelected: boolean;
  documentation?: {
    note: string;
    files: DocumentFile[];
    timestamp: Date;
  };
}

export const OngoingManagementModal = ({ caseId, onClose, onSuccess }: OngoingManagementModalProps) => {
  const [activityType, setActivityType] = useState<'specialist_visit' | 'diagnostic_test' | 'follow_up' | 'other'>('follow_up');
  const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
  const [specialistType, setSpecialistType] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // For follow-up consultation
  const [selectedTests, setSelectedTests] = useState<TestWithDocumentation[]>([]);
  const [showTestSelection, setShowTestSelection] = useState(false);

  const handleTestSelectionDone = (tests: TestWithDocumentation[]) => {
    setSelectedTests(tests);
    setShowTestSelection(false);
  };

  const handleSave = async () => {
    if (activityType === 'follow_up') {
      if (selectedTests.length === 0) {
        alert('Please select tests from the Ongoing Management Basket');
        return;
      }

      if (!clinicalNotes.trim()) {
        alert('Please enter overall clinical notes for this follow-up consultation');
        return;
      }

      try {
        setSaving(true);

        // Prepare test data with documentation
        const testsPerformed = selectedTests.map(test => ({
          code: test.code,
          description: test.description,
          basketType: test.basketType,
          documentation: test.documentation,
          usageCount: (test.usageCount || 0) + 1,
        }));

        // Save activity
        await ongoingManagementService.createActivity({
          case_id: caseId,
          activity_type: activityType,
          activity_date: activityDate,
          specialist_type: null,
          clinical_notes: clinicalNotes,
          attachments: testsPerformed,
          created_by: 'Doctor',
        });

        // Update case with incremented usage counts
        const caseData = await caseService.getCaseById(caseId);
        const updatedTreatments = ((caseData as any).selected_treatments || []).map((t: any) => {
          const performedTest = testsPerformed.find(pt => pt.code === t.code);
          if (performedTest && t.basketType === 'ongoing') {
            return {
              ...t,
              usageCount: performedTest.usageCount,
            };
          }
          return t;
        });

        await caseService.updateCase(caseId, {
          selected_treatments: updatedTreatments,
        } as any);

        onSuccess();
        onClose();
      } catch (error) {
        console.error('Error saving follow-up activity:', error);
        alert('Failed to save follow-up consultation. Please try again.');
      } finally {
        setSaving(false);
      }
    } else {
      // Handle other activity types
      if (!clinicalNotes.trim()) {
        alert('Please enter clinical notes');
        return;
      }

      if (activityType === 'specialist_visit' && !specialistType.trim()) {
        alert('Please specify the specialist type');
        return;
      }

      try {
        setSaving(true);
        await ongoingManagementService.createActivity({
          case_id: caseId,
          activity_type: activityType,
          activity_date: activityDate,
          specialist_type: specialistType || null,
          clinical_notes: clinicalNotes,
          attachments: [],
          created_by: 'Doctor',
        });

        onSuccess();
        onClose();
      } catch (error) {
        console.error('Error saving activity:', error);
        alert('Failed to save activity. Please try again.');
      } finally {
        setSaving(false);
      }
    }
  };

  if (showTestSelection) {
    return (
      <OngoingTestSelection
        caseId={caseId}
        preSelectedTests={selectedTests}
        onDone={handleTestSelectionDone}
        onCancel={() => setShowTestSelection(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Add Ongoing Management Activity</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity Type *
              </div>
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="follow_up">Follow-up Consultation</option>
              <option value="specialist_visit">Specialist Visit</option>
              <option value="diagnostic_test">Diagnostic Test</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Activity Date *
              </div>
            </label>
            <input
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {activityType === 'follow_up' ? (
            <>
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">Ongoing Management Basket</h3>
                  <span className="text-sm font-medium text-primary-600">
                    {selectedTests.length} selected
                  </span>
                </div>

                {selectedTests.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-600 mb-4">No tests selected yet</p>
                    <button
                      onClick={() => setShowTestSelection(true)}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
                    >
                      Select Tests
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      {selectedTests.map((test) => (
                        <div key={test.code} className="border border-primary-200 bg-primary-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{test.description}</h4>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                                <span>Code: {test.code}</span>
                                <span>Usage: {(test.usageCount || 0) + 1}/{test.coverageLimit}</span>
                              </div>
                            </div>
                            {test.documentation && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Documented
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowTestSelection(true)}
                      className="w-full border-2 border-primary-600 text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                    >
                      Modify Selection
                    </button>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Overall Clinical Notes for Follow-up *
                  </div>
                </label>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Enter overall findings and observations from this follow-up consultation..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>
            </>
          ) : (
            <>
              {activityType === 'specialist_visit' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialist Type *
                  </label>
                  <input
                    type="text"
                    value={specialistType}
                    onChange={(e) => setSpecialistType(e.target.value)}
                    placeholder="e.g., Cardiologist, Endocrinologist, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}

              {(activityType === 'diagnostic_test' || activityType === 'other') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activityType === 'diagnostic_test' ? 'Test Type' : 'Activity Description'}
                  </label>
                  <input
                    type="text"
                    value={specialistType}
                    onChange={(e) => setSpecialistType(e.target.value)}
                    placeholder={activityType === 'diagnostic_test' ? 'e.g., Blood Test, X-Ray, etc.' : 'Brief description'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Clinical Notes *
                  </div>
                </label>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Enter detailed clinical notes about this activity..."
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>
            </>
          )}
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
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Activity'}
          </button>
        </div>
      </div>
    </div>
  );
};
