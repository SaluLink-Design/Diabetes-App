'use client';

import { useState, useEffect } from 'react';
import { User, Search, Calendar, CreditCard, Hash } from 'lucide-react';
import { patientService } from '@/lib/supabaseHelpers';
import type { Patient } from '@/types';

interface PatientIdentificationProps {
  onPatientSelected: (patient: Patient) => void;
  initialPatient?: Patient | null;
}

export const PatientIdentification = ({ onPatientSelected, initialPatient }: PatientIdentificationProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(initialPatient || null);

  const [newPatient, setNewPatient] = useState({
    full_name: '',
    patient_id_number: '',
    date_of_birth: '',
    medical_aid_number: '',
  });

  useEffect(() => {
    if (initialPatient) {
      setSelectedPatient(initialPatient);
    }
  }, [initialPatient]);

  useEffect(() => {
    const searchPatients = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await patientService.searchPatients(searchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching patients:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchPatients, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSelectExistingPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    onPatientSelected(patient);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleCreateNewPatient = async () => {
    try {
      const existingPatient = await patientService.getPatientByIdNumber(newPatient.patient_id_number);
      if (existingPatient) {
        alert('A patient with this ID number already exists.');
        return;
      }

      const createdPatient = await patientService.createPatient(newPatient);
      setSelectedPatient(createdPatient);
      onPatientSelected(createdPatient);
      setShowNewPatientForm(false);
      setNewPatient({
        full_name: '',
        patient_id_number: '',
        date_of_birth: '',
        medical_aid_number: '',
      });
    } catch (error) {
      console.error('Error creating patient:', error);
      alert('Failed to create patient. Please try again.');
    }
  };

  const isNewPatientFormValid = () => {
    return (
      newPatient.full_name.trim() !== '' &&
      newPatient.patient_id_number.trim() !== '' &&
      newPatient.date_of_birth !== ''
    );
  };

  if (selectedPatient && !showNewPatientForm) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Patient Information</h3>
          <button
            onClick={() => setSelectedPatient(null)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Change Patient
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Full Name</p>
            <p className="font-medium text-gray-900">{selectedPatient.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Patient ID Number</p>
            <p className="font-medium text-gray-900">{selectedPatient.patient_id_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date of Birth</p>
            <p className="font-medium text-gray-900">
              {new Date(selectedPatient.date_of_birth).toLocaleDateString()}
            </p>
          </div>
          {selectedPatient.medical_aid_number && (
            <div>
              <p className="text-sm text-gray-600">Medical Aid Number</p>
              <p className="font-medium text-gray-900">{selectedPatient.medical_aid_number}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Patient Identification</h3>

      {!showNewPatientForm ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or ID number..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {isSearching && (
            <p className="text-sm text-gray-600">Searching...</p>
          )}

          {searchResults.length > 0 && (
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto">
              {searchResults.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectExistingPatient(patient)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">{patient.full_name}</p>
                  <p className="text-sm text-gray-600">ID: {patient.patient_id_number}</p>
                  <p className="text-sm text-gray-600">
                    DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowNewPatientForm(true)}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              + New Patient
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </div>
            </label>
            <input
              type="text"
              value={newPatient.full_name}
              onChange={(e) => setNewPatient({ ...newPatient, full_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter patient's full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Patient ID Number *
              </div>
            </label>
            <input
              type="text"
              value={newPatient.patient_id_number}
              onChange={(e) => setNewPatient({ ...newPatient, patient_id_number: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter ID or passport number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of Birth *
              </div>
            </label>
            <input
              type="date"
              value={newPatient.date_of_birth}
              onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Medical Aid Number
              </div>
            </label>
            <input
              type="text"
              value={newPatient.medical_aid_number}
              onChange={(e) => setNewPatient({ ...newPatient, medical_aid_number: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Optional"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setShowNewPatientForm(false);
                setNewPatient({
                  full_name: '',
                  patient_id_number: '',
                  date_of_birth: '',
                  medical_aid_number: '',
                });
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNewPatient}
              disabled={!isNewPatientFormValid()}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create Patient
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
