import Papa from 'papaparse';
import { Condition, Treatment, Medicine, TreatmentItem } from '@/types';

// Load and parse CSV data
export const loadConditionsData = async (): Promise<Condition[]> => {
  const response = await fetch('/Endocrine CONDITIONS.csv');
  const csvText = await response.text();
  
  const result = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: true,
  });

  const conditions: Condition[] = [];
  
  // Skip header row
  for (let i = 1; i < result.data.length; i++) {
    const row = result.data[i];
    if (row.length >= 3) {
      conditions.push({
        name: row[0].trim(),
        icdCode: row[1].trim(),
        icdDescription: row[2].trim(),
      });
    }
  }
  
  return conditions;
};

export const loadMedicineData = async (): Promise<Medicine[]> => {
  const response = await fetch('/Endocrine MEDICINE.csv');
  const csvText = await response.text();
  
  const result = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: true,
  });

  const medicines: Medicine[] = [];
  
  // Skip header row
  for (let i = 1; i < result.data.length; i++) {
    const row = result.data[i];
    if (row.length >= 6) {
      const medicineNameStrength = row[5]?.trim() || '';
      const plansExcluded: string[] = [];
      
      // Check for plan exclusions in the medicine name/strength field
      if (medicineNameStrength.includes('Not available on KeyCare')) {
        plansExcluded.push('KeyCare');
      }
      if (medicineNameStrength.includes('Only Executive and Comprehensive')) {
        plansExcluded.push('Core', 'Priority', 'Saver', 'KeyCare');
      }
      
      medicines.push({
        condition: row[0].trim(),
        cdaCorePrioritySaver: row[1].trim(),
        cdaExecutiveComprehensive: row[2].trim(),
        medicineClass: row[3].trim(),
        activeIngredient: row[4].trim(),
        medicineNameStrength: medicineNameStrength.split('\n')[0].trim(),
        plansExcluded,
        selected: false,
      });
    }
  }
  
  return medicines;
};

export const loadTreatmentData = async (): Promise<Treatment[]> => {
  const response = await fetch('/Endocrine TREATMENT.csv');
  const csvText = await response.text();
  
  const result = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: true,
  });

  const treatmentMap = new Map<string, Treatment>();
  
  // Skip first 2 header rows
  for (let i = 2; i < result.data.length; i++) {
    const row = result.data[i];
    if (row.length >= 8 && row[0]) {
      const condition = row[0].trim();
      
      if (!treatmentMap.has(condition)) {
        treatmentMap.set(condition, {
          condition,
          diagnosticBasket: [],
          ongoingManagementBasket: [],
        });
      }
      
      const treatment = treatmentMap.get(condition)!;
      
      // Add diagnostic basket item
      if (row[1]) {
        treatment.diagnosticBasket.push({
          description: row[1].trim(),
          code: row[2]?.trim() || '',
          numberCovered: row[3]?.trim() || '',
          selected: false,
        });
      }
      
      // Add ongoing management basket item
      if (row[4]) {
        treatment.ongoingManagementBasket.push({
          description: row[4].trim(),
          code: row[5]?.trim() || '',
          numberCovered: row[6]?.trim() || '',
          specialistsCovered: row[7]?.trim() || '',
          selected: false,
        });
      }
    }
  }
  
  return Array.from(treatmentMap.values());
};

// Group conditions by name
export const groupConditionsByName = (conditions: Condition[]): Map<string, Condition[]> => {
  const grouped = new Map<string, Condition[]>();
  
  conditions.forEach(condition => {
    if (!grouped.has(condition.name)) {
      grouped.set(condition.name, []);
    }
    grouped.get(condition.name)!.push(condition);
  });
  
  return grouped;
};

// Filter medicines by condition
export const getMedicinesByCondition = (medicines: Medicine[], condition: string): Medicine[] => {
  return medicines.filter(med => med.condition === condition);
};

// Filter treatments by condition
export const getTreatmentByCondition = (treatments: Treatment[], condition: string): Treatment | undefined => {
  return treatments.find(t => t.condition === condition);
};

