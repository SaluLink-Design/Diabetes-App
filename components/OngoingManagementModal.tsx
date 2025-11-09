'use client';

import { useState } from 'react';
import { X, Calendar, FileText, Activity } from 'lucide-react';
import { ongoingManagementService } from '@/lib/supabaseHelpers';

interface OngoingManagementModalProps {
  caseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const OngoingManagementModal = ({ caseId, onClose, onSuccess }: OngoingManagementModalProps) => {
  const [activityType, setActivityType] = useState<'specialist_visit' | 'diagnostic_test' | 'follow_up' | 'other'>('specialist_visit');
  const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
  const [specialistType, setSpecialistType] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
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
  };

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
              <option value="specialist_visit">Specialist Visit</option>
              <option value="diagnostic_test">Diagnostic Test</option>
              <option value="follow_up">Follow-up Consultation</option>
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
