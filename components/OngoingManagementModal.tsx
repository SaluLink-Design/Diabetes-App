'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, FileText, Activity, Upload, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { ongoingManagementService, caseService } from '@/lib/supabaseHelpers';
import { DocumentationUpload } from './DocumentationUpload';
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
  const [loading, setLoading] = useState(false);

  // For follow-up consultation
  const [ongoingTests, setOngoingTests] = useState<TestWithDocumentation[]>([]);
  const [selectedTests, setSelectedTests] = useState<TestWithDocumentation[]>([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [currentTestForDoc, setCurrentTestForDoc] = useState<TestWithDocumentation | null>(null);

  useEffect(() => {
    if (activityType === 'follow_up') {
      loadOngoingManagementTests();
    }
  }, [activityType, caseId]);

  const loadOngoingManagementTests = async () => {
    try {
      setLoading(true);
      const caseData = await caseService.getCaseById(caseId);
      if (!caseData) return;

      const ongoingItems = ((caseData as any).selected_treatments || [])
        .filter((t: any) => t.basketType === 'ongoing')
        .map((item: any) => ({
          ...item,
          isSelected: false,
          usageCount: item.usageCount || 0,
          selectedQuantity: item.selectedQuantity || 0,
        }));

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

    if (!test.isSelected) {
      setSelectedTests([...selectedTests, { ...test, isSelected: true }]);
    } else {
      setSelectedTests(selectedTests.filter(t => t.code !== test.code));
    }
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

    const updatedSelected = selectedTests.map(t =>
      t.code === currentTestForDoc.code
        ? { ...t, documentation: { note, files, timestamp } }
        : t
    );
    setSelectedTests(updatedSelected);

    setShowDocModal(false);
    setCurrentTestForDoc(null);
  };

  const handleSave = async () => {
    if (activityType === 'follow_up') {
      if (selectedTests.length === 0) {
        alert('Please select at least one test from the Ongoing Management Basket');
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Ongoing Management Basket</h3>
                  <span className="text-sm font-medium text-primary-600">
                    {selectedTests.length} selected
                  </span>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Loading tests...</p>
                  </div>
                ) : ongoingTests.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600">No ongoing management tests in this case</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
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
                                <div>
                                  <h4 className="font-bold text-gray-900">{test.description}</h4>
                                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                                    <span>Code: {test.code}</span>
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
                                    className="flex items-center gap-2 px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
                                  <span>Coverage limit reached</span>
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
