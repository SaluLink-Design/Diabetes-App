'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, Calendar, User, ChevronRight, Filter, X } from 'lucide-react';
import { patientService, caseService } from '@/lib/supabaseHelpers';
import type { Patient, CaseWithPatient } from '@/types';

interface ViewCasesProps {
  onCaseSelect: (caseId: string) => void;
  onClose: () => void;
}

export const ViewCases = ({ onCaseSelect, onClose }: ViewCasesProps) => {
  const [cases, setCases] = useState<CaseWithPatient[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');

  useEffect(() => {
    loadCasesAndPatients();
  }, []);

  const loadCasesAndPatients = async () => {
    try {
      setLoading(true);
      const [allCases, allPatients] = await Promise.all([
        caseService.getAllCases(),
        patientService.getAllPatients(),
      ]);

      const patientsMap = new Map(allPatients.map(p => [p.id, p]));

      const casesWithPatients: CaseWithPatient[] = allCases.map(c => ({
        id: c.id,
        patient_id: c.patient_id,
        patient: patientsMap.get(c.patient_id)!,
        patientNote: (c as any).patient_note || '',
        detectedConditions: Array.isArray((c as any).detected_conditions) ? (c as any).detected_conditions : [],
        confirmedCondition: (c as any).confirmed_condition || '',
        selectedIcdCodes: (c as any).selected_icd_codes || [],
        selectedTreatments: (c as any).selected_treatments || [],
        selectedMedications: (c as any).selected_medications || [],
        chronicRegistrationNote: (c as any).chronic_registration_note || '',
        chronicRegistrationNotes: (c as any).chronic_registration_notes || [],
        status: c.status,
        createdAt: new Date((c as any).created_at),
        updatedAt: new Date((c as any).updated_at),
      }));

      setCases(casesWithPatients);
      setPatients(allPatients);
    } catch (error) {
      console.error('Error loading cases:', error);
      alert('Failed to load cases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.patient?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patient?.patient_id_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.confirmedCondition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const groupedCases = filteredCases.reduce((acc, c) => {
    const patientId = c.patient_id;
    if (!acc[patientId]) {
      acc[patientId] = [];
    }
    acc[patientId].push(c);
    return acc;
  }, {} as Record<string, CaseWithPatient[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Cases</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by patient name, ID, or condition..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'active'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'completed'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {filteredCases.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No cases found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedCases).map(([patientId, patientCases]) => {
                const patient = patientCases[0]?.patient;
                if (!patient) return null;

                return (
                  <div key={patientId} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-600" />
                        <div>
                          <h3 className="font-bold text-gray-900">{patient.full_name}</h3>
                          <p className="text-sm text-gray-600">
                            ID: {patient.patient_id_number} • DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {patientCases.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => onCaseSelect(c.id)}
                          className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  c.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : c.status === 'completed'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {c.status.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-600 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="font-medium text-gray-900 mb-1">{c.confirmedCondition}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{c.patientNote}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
