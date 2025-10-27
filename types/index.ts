// Core Types for SaluLink Chronic Treatment App

export interface Condition {
  name: string;
  icdCode: string;
  icdDescription: string;
}

export interface Treatment {
  condition: string;
  diagnosticBasket: TreatmentItem[];
  ongoingManagementBasket: TreatmentItem[];
}

export interface TreatmentItem {
  description: string;
  code: string;
  numberCovered: string;
  coverageLimit: number;
  specialistsCovered?: string;
  selected?: boolean;
  selectedQuantity?: number;
  basketType?: 'diagnostic' | 'ongoing';
  documentation?: {
    note?: string;
    imageUrl?: string;
    files?: DocumentFile[];
    timestamp?: Date;
  };
}

export interface DocumentFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'other';
  size: number;
  uploadedAt: Date;
}

export interface Medicine {
  condition: string;
  cdaCorePrioritySaver: string;
  cdaExecutiveComprehensive: string;
  medicineClass: string;
  activeIngredient: string;
  medicineNameStrength: string;
  plansExcluded?: string[];
  selected?: boolean;
}

export type MedicalPlan = 
  | 'KeyCare' 
  | 'Core' 
  | 'Priority' 
  | 'Saver' 
  | 'Executive' 
  | 'Comprehensive';

export interface Case {
  id: string;
  patientNote: string;
  detectedConditions: string[];
  confirmedCondition: string;
  selectedIcdCodes: Condition[];
  selectedTreatments: TreatmentItem[];
  selectedMedications: Medicine[];
  chronicRegistrationNote: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  step: number;
  title: string;
  completed: boolean;
}

