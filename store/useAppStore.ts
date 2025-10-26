import { create } from 'zustand';
import { Case, Condition, Treatment, Medicine, TreatmentItem, MedicalPlan } from '@/types';

interface AppState {
  // Data
  allConditions: Condition[];
  allTreatments: Treatment[];
  allMedicines: Medicine[];
  
  // Current Case
  currentCase: Partial<Case> | null;
  savedCases: Case[];
  
  // Workflow State
  currentStep: number;
  
  // Selected Medical Plan
  selectedPlan: MedicalPlan;
  
  // Actions
  setAllConditions: (conditions: Condition[]) => void;
  setAllTreatments: (treatments: Treatment[]) => void;
  setAllMedicines: (medicines: Medicine[]) => void;
  
  // Case Management
  createNewCase: () => void;
  updateCurrentCase: (updates: Partial<Case>) => void;
  saveCase: () => void;
  loadCase: (caseId: string) => void;
  deleteCase: (caseId: string) => void;
  
  // Workflow
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Plan Selection
  setSelectedPlan: (plan: MedicalPlan) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  allConditions: [],
  allTreatments: [],
  allMedicines: [],
  currentCase: null,
  savedCases: [],
  currentStep: 1,
  selectedPlan: 'Core',
  
  // Data Setters
  setAllConditions: (conditions) => set({ allConditions: conditions }),
  setAllTreatments: (treatments) => set({ allTreatments: treatments }),
  setAllMedicines: (medicines) => set({ allMedicines: medicines }),
  
  // Case Management
  createNewCase: () => {
    const newCase: Partial<Case> = {
      id: `case-${Date.now()}`,
      patientNote: '',
      detectedConditions: [],
      confirmedCondition: '',
      selectedIcdCodes: [],
      selectedTreatments: [],
      selectedMedications: [],
      chronicRegistrationNote: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set({ currentCase: newCase, currentStep: 1 });
  },
  
  updateCurrentCase: (updates) => {
    const { currentCase } = get();
    if (currentCase) {
      set({
        currentCase: {
          ...currentCase,
          ...updates,
          updatedAt: new Date(),
        },
      });
    }
  },
  
  saveCase: () => {
    const { currentCase, savedCases } = get();
    if (currentCase && currentCase.id) {
      const existingIndex = savedCases.findIndex(c => c.id === currentCase.id);
      
      const completeCase: Case = {
        id: currentCase.id,
        patientNote: currentCase.patientNote || '',
        detectedConditions: currentCase.detectedConditions || [],
        confirmedCondition: currentCase.confirmedCondition || '',
        selectedIcdCodes: currentCase.selectedIcdCodes || [],
        selectedTreatments: currentCase.selectedTreatments || [],
        selectedMedications: currentCase.selectedMedications || [],
        chronicRegistrationNote: currentCase.chronicRegistrationNote || '',
        createdAt: currentCase.createdAt || new Date(),
        updatedAt: new Date(),
      };
      
      if (existingIndex >= 0) {
        const updatedCases = [...savedCases];
        updatedCases[existingIndex] = completeCase;
        set({ savedCases: updatedCases });
      } else {
        set({ savedCases: [...savedCases, completeCase] });
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('salulink-cases', JSON.stringify([...savedCases, completeCase]));
      }
    }
  },
  
  loadCase: (caseId) => {
    const { savedCases } = get();
    const caseToLoad = savedCases.find(c => c.id === caseId);
    if (caseToLoad) {
      set({ currentCase: caseToLoad, currentStep: 1 });
    }
  },
  
  deleteCase: (caseId) => {
    const { savedCases } = get();
    const updatedCases = savedCases.filter(c => c.id !== caseId);
    set({ savedCases: updatedCases });
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('salulink-cases', JSON.stringify(updatedCases));
    }
  },
  
  // Workflow
  setCurrentStep: (step) => set({ currentStep: step }),
  
  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 5) {
      set({ currentStep: currentStep + 1 });
    }
  },
  
  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },
  
  // Plan Selection
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
}));

// Load saved cases from localStorage on initialization
if (typeof window !== 'undefined') {
  const savedCasesJson = localStorage.getItem('salulink-cases');
  if (savedCasesJson) {
    try {
      const savedCases = JSON.parse(savedCasesJson);
      useAppStore.setState({ savedCases });
    } catch (error) {
      console.error('Error loading saved cases:', error);
    }
  }
}

