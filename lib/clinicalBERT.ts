// ClinicalBERT Integration for Condition Detection
// This is a client-side implementation that uses semantic matching
// In production, this would connect to a ClinicalBERT API endpoint

export const TARGET_CONDITIONS = [
  'Diabetes Insipidus',
  'Diabetes Mellitus Type 1',
  'Diabetes Mellitus Type 2',
];

// Keywords and patterns for each condition
const CONDITION_PATTERNS: Record<string, string[]> = {
  'Diabetes Insipidus': [
    'diabetes insipidus',
    'di',
    'polyuria',
    'polydipsia',
    'excessive thirst',
    'excessive urination',
    'vasopressin',
    'desmopressin',
    'ddavp',
    'nephrogenic',
    'central diabetes insipidus',
  ],
  'Diabetes Mellitus Type 1': [
    'diabetes mellitus type 1',
    'type 1 diabetes',
    't1d',
    't1dm',
    'insulin dependent',
    'iddm',
    'juvenile diabetes',
    'autoimmune diabetes',
    'ketoacidosis',
    'dka',
    'insulin therapy',
    'beta cell',
  ],
  'Diabetes Mellitus Type 2': [
    'diabetes mellitus type 2',
    'type 2 diabetes',
    't2d',
    't2dm',
    'non-insulin dependent',
    'niddm',
    'adult onset diabetes',
    'insulin resistance',
    'metabolic syndrome',
    'metformin',
    'oral hypoglycemic',
  ],
};

// Common diabetes-related terms that might appear in notes
const DIABETES_GENERAL_TERMS = [
  'hyperglycemia',
  'hypoglycemia',
  'glucose',
  'blood sugar',
  'hba1c',
  'glycemic control',
  'diabetic',
];

/**
 * Analyzes clinical notes to identify potential diabetes conditions
 * @param clinicalNote - The clinical note text to analyze
 * @returns Array of detected condition names
 */
export const analyzeClinicalNote = (clinicalNote: string): string[] => {
  const normalizedNote = clinicalNote.toLowerCase();
  const detectedConditions: string[] = [];
  const confidenceScores: Map<string, number> = new Map();

  // Initialize confidence scores
  TARGET_CONDITIONS.forEach(condition => {
    confidenceScores.set(condition, 0);
  });

  // Check for each condition's patterns
  Object.entries(CONDITION_PATTERNS).forEach(([condition, patterns]) => {
    let score = 0;
    
    patterns.forEach(pattern => {
      const regex = new RegExp(`\\b${pattern.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      const matches = normalizedNote.match(regex);
      
      if (matches) {
        // Weight longer, more specific patterns higher
        const weight = pattern.split(' ').length;
        score += matches.length * weight;
      }
    });
    
    confidenceScores.set(condition, score);
  });

  // Sort conditions by confidence score
  const sortedConditions = Array.from(confidenceScores.entries())
    .filter(([_, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([condition, _]) => condition);

  return sortedConditions;
};

/**
 * Validates if the clinical note contains diabetes-related content
 * @param clinicalNote - The clinical note text to validate
 * @returns Boolean indicating if note is diabetes-related
 */
export const isDiabetesRelated = (clinicalNote: string): boolean => {
  const normalizedNote = clinicalNote.toLowerCase();
  
  // Check for general diabetes terms
  const hasDiabetesTerm = DIABETES_GENERAL_TERMS.some(term => 
    normalizedNote.includes(term.toLowerCase())
  );
  
  // Check for specific condition patterns
  const hasConditionPattern = Object.values(CONDITION_PATTERNS).some(patterns =>
    patterns.some(pattern => {
      const regex = new RegExp(`\\b${pattern.replace(/\s+/g, '\\s+')}\\b`, 'i');
      return regex.test(normalizedNote);
    })
  );
  
  return hasDiabetesTerm || hasConditionPattern;
};

/**
 * Extracts key clinical information from the note
 * @param clinicalNote - The clinical note text
 * @returns Object containing extracted clinical data
 */
export const extractClinicalData = (clinicalNote: string) => {
  const data: {
    symptoms: string[];
    medications: string[];
    labValues: string[];
  } = {
    symptoms: [],
    medications: [],
    labValues: [],
  };

  const normalizedNote = clinicalNote.toLowerCase();

  // Extract symptoms
  const symptomPatterns = [
    'polyuria', 'polydipsia', 'polyphagia', 'weight loss',
    'fatigue', 'blurred vision', 'neuropathy', 'ketoacidosis',
  ];
  
  symptomPatterns.forEach(symptom => {
    if (normalizedNote.includes(symptom)) {
      data.symptoms.push(symptom);
    }
  });

  // Extract medications
  const medicationPatterns = [
    'insulin', 'metformin', 'gliclazide', 'desmopressin',
    'ddavp', 'pioglitazone',
  ];
  
  medicationPatterns.forEach(med => {
    if (normalizedNote.includes(med)) {
      data.medications.push(med);
    }
  });

  // Extract lab values (simplified pattern matching)
  const labPatterns = [
    /hba1c[:\s]+(\d+\.?\d*)/gi,
    /glucose[:\s]+(\d+\.?\d*)/gi,
    /blood sugar[:\s]+(\d+\.?\d*)/gi,
  ];
  
  labPatterns.forEach(pattern => {
    const matches = clinicalNote.match(pattern);
    if (matches) {
      data.labValues.push(...matches);
    }
  });

  return data;
};

