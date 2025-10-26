// Authi 1.0 - Automated Treatment and Healthcare Information System
// Maps confirmed conditions to ICD-10 codes, treatments, and medications

import { Condition, Treatment, Medicine } from '@/types';
import { 
  groupConditionsByName, 
  getMedicinesByCondition, 
  getTreatmentByCondition 
} from './dataLoader';

export interface AuthiMappingResult {
  condition: string;
  icdCodes: Condition[];
  treatment: Treatment | null;
  medications: Medicine[];
}

/**
 * Maps a confirmed condition to all relevant clinical data
 * @param condition - The confirmed condition name
 * @param allConditions - All available condition data
 * @param allTreatments - All available treatment data
 * @param allMedicines - All available medicine data
 * @returns Complete mapping of condition to ICD codes, treatments, and medications
 */
export const mapConditionToData = (
  condition: string,
  allConditions: Condition[],
  allTreatments: Treatment[],
  allMedicines: Medicine[]
): AuthiMappingResult => {
  // Get all ICD codes for this condition
  const icdCodes = allConditions.filter(c => c.name === condition);
  
  // Get treatment protocol
  const treatment = getTreatmentByCondition(allTreatments, condition);
  
  // Get medications
  const medications = getMedicinesByCondition(allMedicines, condition);
  
  return {
    condition,
    icdCodes,
    treatment: treatment || null,
    medications,
  };
};

/**
 * Validates ICD code selection
 * @param selectedCodes - Array of selected ICD codes
 * @returns Boolean indicating if selection is valid
 */
export const validateIcdSelection = (selectedCodes: Condition[]): boolean => {
  return selectedCodes.length > 0;
};

/**
 * Validates treatment selection
 * @param treatment - Treatment object with selected items
 * @returns Boolean indicating if selection is valid
 */
export const validateTreatmentSelection = (treatment: Treatment | null): boolean => {
  if (!treatment) return false;
  
  const hasSelectedDiagnostic = treatment.diagnosticBasket.some(item => item.selected);
  const hasSelectedOngoing = treatment.ongoingManagementBasket.some(item => item.selected);
  
  return hasSelectedDiagnostic || hasSelectedOngoing;
};

/**
 * Validates medication selection
 * @param medications - Array of medications with selection status
 * @returns Boolean indicating if selection is valid
 */
export const validateMedicationSelection = (medications: Medicine[]): boolean => {
  return medications.some(med => med.selected);
};

/**
 * Filters medications by medical plan
 * @param medications - Array of all medications
 * @param plan - Selected medical plan
 * @returns Filtered medications with availability status
 */
export const filterMedicationsByPlan = (
  medications: Medicine[],
  plan: string
): Medicine[] => {
  return medications.map(med => ({
    ...med,
    available: !med.plansExcluded?.includes(plan),
  })) as Medicine[];
};

/**
 * Generates a summary of the case for documentation
 * @param mappingResult - The Authi mapping result
 * @param selectedIcdCodes - Selected ICD codes
 * @param selectedTreatments - Selected treatment items
 * @param selectedMedications - Selected medications
 * @param chronicNote - Chronic registration note
 * @returns Formatted summary string
 */
export const generateCaseSummary = (
  patientNote: string,
  mappingResult: AuthiMappingResult,
  selectedIcdCodes: Condition[],
  selectedTreatments: any[],
  selectedMedications: Medicine[],
  chronicNote: string
): string => {
  let summary = '=== SALULINK CHRONIC TREATMENT DOCUMENTATION ===\n\n';
  
  summary += '--- ORIGINAL CLINICAL NOTE ---\n';
  summary += patientNote + '\n\n';
  
  summary += '--- CONFIRMED CONDITION ---\n';
  summary += mappingResult.condition + '\n\n';
  
  summary += '--- SELECTED ICD-10 CODES ---\n';
  selectedIcdCodes.forEach(code => {
    summary += `${code.icdCode}: ${code.icdDescription}\n`;
  });
  summary += '\n';
  
  summary += '--- DIAGNOSTIC BASKET ---\n';
  const diagnosticItems = selectedTreatments.filter(t => t.basketType === 'diagnostic');
  diagnosticItems.forEach(item => {
    summary += `• ${item.description}\n`;
    summary += `  Code: ${item.code}\n`;
    summary += `  Number Covered: ${item.numberCovered}\n`;
    if (item.documentation?.note) {
      summary += `  Documentation: ${item.documentation.note}\n`;
    }
    summary += '\n';
  });
  
  summary += '--- ONGOING MANAGEMENT BASKET ---\n';
  const ongoingItems = selectedTreatments.filter(t => t.basketType === 'ongoing');
  ongoingItems.forEach(item => {
    summary += `• ${item.description}\n`;
    summary += `  Code: ${item.code}\n`;
    summary += `  Number Covered: ${item.numberCovered}\n`;
    if (item.specialistsCovered) {
      summary += `  Specialists Covered: ${item.specialistsCovered}\n`;
    }
    if (item.documentation?.note) {
      summary += `  Documentation: ${item.documentation.note}\n`;
    }
    summary += '\n';
  });
  
  summary += '--- SELECTED MEDICATIONS ---\n';
  selectedMedications.forEach(med => {
    summary += `• ${med.medicineNameStrength}\n`;
    summary += `  Class: ${med.medicineClass}\n`;
    summary += `  Active Ingredient: ${med.activeIngredient}\n`;
    summary += `  CDA (Core/Priority/Saver): ${med.cdaCorePrioritySaver}\n`;
    summary += `  CDA (Executive/Comprehensive): ${med.cdaExecutiveComprehensive}\n`;
    summary += '\n';
  });
  
  summary += '--- CHRONIC REGISTRATION NOTE ---\n';
  summary += chronicNote + '\n\n';
  
  summary += '=== END OF DOCUMENTATION ===\n';
  
  return summary;
};

