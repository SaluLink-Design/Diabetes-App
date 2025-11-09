import { create } from 'zustand';
import { Case, Condition, Treatment, Medicine, TreatmentItem, MedicalPlan, ChronicRegistrationNote, Patient } from '@/types';
import { caseService, patientService } from '@/lib/supabaseHelpers';

interface AppState {
  // Data
  allConditions: Condition[];
  allTreatments: Treatment[];
  allMedicines: Medicine[];

  // Current Case
  currentCase: Partial<Case> | null;
  savedCases: Case[];

  // Patient
  selectedPatient: Patient | null;

  // Workflow State
  currentStep: number;

  // Selected Medical Plan
  selectedPlan: MedicalPlan;

  // Actions
  setAllConditions: (conditions: Condition[]) => void;
  setAllTreatments: (treatments: Treatment[]) => void;
  setAllMedicines: (medicines: Medicine[]) => void;

  // Patient Management
  setSelectedPatient: (patient: Patient | null) => void;

  // Case Management
  createNewCase: () => void;
  updateCurrentCase: (updates: Partial<Case>) => void;
  saveCase: () => Promise<void>;
  loadCase: (caseId: string) => Promise<void>;
  deleteCase: (caseId: string) => Promise<void>;

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
  selectedPatient: null,
  currentStep: 1,
  selectedPlan: 'Core',
  
  // Data Setters
  setAllConditions: (conditions) => set({ allConditions: conditions }),
  setAllTreatments: (treatments) => set({ allTreatments: treatments }),
  setAllMedicines: (medicines) => set({ allMedicines: medicines }),

  // Patient Management
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  
  // Case Management
  createNewCase: () => {
    const newCase: Partial<Case> = {
      patientNote: '',
      detectedConditions: [],
      confirmedCondition: '',
      selectedIcdCodes: [],
      selectedTreatments: [],
      selectedMedications: [],
      chronicRegistrationNote: '',
      chronicRegistrationNotes: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set({ currentCase: newCase, currentStep: 1, selectedPatient: null });
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
  
  saveCase: async () => {
    const { currentCase, selectedPatient } = get();
    if (!currentCase || !selectedPatient) {
      throw new Error('Cannot save case without patient');
    }

    try {
      const caseData: any = {
        patient_id: selectedPatient.id,
        patient_note: currentCase.patientNote || '',
        detected_conditions: currentCase.detectedConditions || [],
        confirmed_condition: currentCase.confirmedCondition || '',
        selected_icd_codes: currentCase.selectedIcdCodes || [],
        selected_treatments: currentCase.selectedTreatments || [],
        selected_medications: currentCase.selectedMedications || [],
        chronic_registration_note: currentCase.chronicRegistrationNote || '',
        chronic_registration_notes: currentCase.chronicRegistrationNotes || [],
        status: currentCase.status || 'active',
      };

      let savedCase;
      if (currentCase.id) {
        savedCase = await caseService.updateCase(currentCase.id, caseData);
      } else {
        savedCase = await caseService.createCase(caseData);
      }

      set({
        currentCase: {
          ...currentCase,
          id: savedCase.id,
          patient_id: savedCase.patient_id,
        }
      });
    } catch (error) {
      console.error('Error saving case:', error);
      throw error;
    }
  },
  
  loadCase: async (caseId) => {
    try {
      const caseData = await caseService.getCaseById(caseId);
      if (!caseData) {
        throw new Error('Case not found');
      }

      const patientData = await patientService.getAllPatients();
      const patient = patientData.find(p => p.id === caseData.patient_id);

      const dbCase: any = caseData;
      const formattedCase: Partial<Case> = {
        id: dbCase.id,
        patient_id: dbCase.patient_id,
        patientNote: dbCase.patient_note || '',
        detectedConditions: Array.isArray(dbCase.detected_conditions) ? dbCase.detected_conditions : [],
        confirmedCondition: dbCase.confirmed_condition || '',
        selectedIcdCodes: Array.isArray(dbCase.selected_icd_codes) ? dbCase.selected_icd_codes : [],
        selectedTreatments: Array.isArray(dbCase.selected_treatments) ? dbCase.selected_treatments : [],
        selectedMedications: Array.isArray(dbCase.selected_medications) ? dbCase.selected_medications : [],
        chronicRegistrationNote: dbCase.chronic_registration_note || '',
        chronicRegistrationNotes: Array.isArray(dbCase.chronic_registration_notes) ? dbCase.chronic_registration_notes : [],
        status: dbCase.status,
        createdAt: new Date(dbCase.created_at),
        updatedAt: new Date(dbCase.updated_at),
      };

      set({
        currentCase: formattedCase,
        selectedPatient: patient || null,
        currentStep: 1
      });
    } catch (error) {
      console.error('Error loading case:', error);
      throw error;
    }
  },
  
  deleteCase: async (caseId) => {
    try {
      await caseService.deleteCase(caseId);
    } catch (error) {
      console.error('Error deleting case:', error);
      throw error;
    }
  },
  
  // Workflow
  setCurrentStep: (step) => set({ currentStep: step }),
  
  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 6) {
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

