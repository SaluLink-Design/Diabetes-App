'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { analyzeClinicalNote, isDiabetesRelated } from '@/lib/clinicalBERT';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Step1ClinicalNote = () => {
  const { currentCase, updateCurrentCase, nextStep } = useAppStore();
  const [note, setNote] = useState(currentCase?.patientNote || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedConditions, setDetectedConditions] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [error, setError] = useState<string>('');

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

    updateCurrentCase({
      confirmedCondition: selectedCondition,
    });
    nextStep();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      <div className="glass rounded-3xl shadow-2xl p-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Clinical Note Input and Analysis
          </h2>
          <p className="text-lg text-gray-600">
            Enter the patient's clinical note below for AI analysis
          </p>
        </div>

        {/* Clinical Note Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Patient Clinical Note
            </label>
            <button
              onClick={() => {
                const exampleNote = `Patient presents with polyuria and polydipsia.
Blood glucose: 8.5 mmol/L
HbA1c: 7.8%
History of Type 2 Diabetes Mellitus
Currently on Metformin 850mg BD`;
                setNote(exampleNote);
              }}
              disabled={isAnalyzing || detectedConditions.length > 0}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Load Example Note
            </button>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Enter patient clinical note here..."
            className="w-full h-56 px-5 py-4 bg-white/70 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none transition-all duration-200 text-base"
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
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing with ClinicalBERT...
              </>
            ) : (
              'Analyze Note'
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
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Re-analyze
              </button>
              <button
                onClick={handleConfirmCondition}
                disabled={!selectedCondition}
                className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Confirm Condition
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

