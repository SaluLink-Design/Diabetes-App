'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/store/useAppStore';
import { analyzeClinicalNote, isDiabetesRelated } from '@/lib/clinicalBERT';
import { Loader2, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { PatientIdentification } from './PatientIdentification';
import type { Patient } from '@/types';

export const Step1ClinicalNote = () => {
  const { currentCase, updateCurrentCase, nextStep, selectedPatient, setSelectedPatient } = useAppStore();
  const [note, setNote] = useState(currentCase?.patientNote || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedConditions, setDetectedConditions] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [error, setError] = useState<string>('');

  const exampleNote = `Patient presents with polyuria and polydipsia.
Blood glucose: 8.5 mmol/L
HbA1c: 7.8%
History of Type 2 Diabetes Mellitus
Currently on Metformin 850mg BD`;

  const handleLoadExample = () => {
    setNote(exampleNote);
    setDetectedConditions([]);
    setSelectedCondition('');
    setError('');
  };

  const handleAnalyze = async () => {
    setError('');
    
    if (!note.trim()) {
      setError('Please enter a clinical note before analyzing.');
      return;
    }

    // Check if note is diabetes-related
    if (!isDiabetesRelated(note)) {
      setError('The clinical note does not appear to be related to diabetes conditions. Please review and try again.');
      return;
    }

    setIsAnalyzing(true);

    // Simulate API call delay for ClinicalBERT analysis
    setTimeout(() => {
      const conditions = analyzeClinicalNote(note);
      
      if (conditions.length === 0) {
        setError('No diabetes conditions detected in the note. Please ensure the note contains relevant clinical information.');
        setIsAnalyzing(false);
        return;
      }

      setDetectedConditions(conditions);
      updateCurrentCase({
        patientNote: note,
        detectedConditions: conditions,
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleConfirmCondition = () => {
    if (!selectedCondition) {
      setError('Please select a condition to confirm.');
      return;
    }

    if (!selectedPatient) {
      setError('Please select a patient before proceeding.');
      return;
    }

    updateCurrentCase({
      confirmedCondition: selectedCondition,
    });
    nextStep();
  };

  const handlePatientSelected = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-8">
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Clinical Note Input Analysis
          </h2>
          <p className="text-gray-600">
            Enter or paste the patient's clinical notes. Select 'Analyse' to identify potential chronic conditions
          </p>
        </div>

        <PatientIdentification
          onPatientSelected={handlePatientSelected}
          initialPatient={selectedPatient}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          {/* Clinical Note Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-lg font-semibold text-gray-900">
                Patient Notes:
              </label>
              <button
                onClick={handleLoadExample}
                disabled={isAnalyzing || detectedConditions.length > 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                Load Example Note
              </button>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter patient clinical note here..."
              className="w-full h-64 px-6 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none text-base bg-gray-50"
              disabled={isAnalyzing || detectedConditions.length > 0}
            />
          </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Analyze Button */}
        {detectedConditions.length === 0 && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !note.trim()}
            className="bg-white border-2 border-gray-300 text-gray-700 py-3 px-10 rounded-full font-medium hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </button>
        )}

        {/* Detected Conditions */}
        {detectedConditions.length > 0 && (
          <div className="mt-6">
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Analysis Complete</p>
                <p className="text-sm text-green-700 mt-1">
                  ClinicalBERT has identified the following condition(s):
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select the most accurate condition:
              </label>
              {detectedConditions.map((condition) => (
                <label
                  key={condition}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedCondition === condition
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="condition"
                    value={condition}
                    checked={selectedCondition === condition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-gray-900 font-medium">{condition}</span>
                </label>
              ))}
            </div>

            {/* Confirm Button */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => {
                  setDetectedConditions([]);
                  setSelectedCondition('');
                  setError('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-full font-medium hover:bg-gray-300 transition-colors"
              >
                Re-analyze
              </button>
              <button
                onClick={handleConfirmCondition}
                disabled={!selectedCondition}
                className="flex-1 bg-gradient-to-r from-purple-400 to-blue-400 text-white py-3 px-6 rounded-full font-medium hover:from-purple-500 hover:to-blue-500 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Condition
              </button>
            </div>
          </div>
        )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-gray-600">
          <span className="text-sm">Powered by</span>
          <div className="flex items-center gap-1">
            <Image
              src="/Authi copy copy.svg"
              alt="Authi Icon"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="text-sm font-medium">Authi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

