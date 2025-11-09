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
  usageCount?: number;
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

export interface ChronicRegistrationNote {
  medication: Medicine;
  medicationBrief: string;
  additionalNotes: string;
  fullNote: string;
}

export interface Patient {
  id: string;
  full_name: string;
  patient_id_number: string;
  date_of_birth: string;
  medical_aid_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: string;
  patient_id: string;
  patientNote: string;
  detectedConditions: string[];
  confirmedCondition: string;
  selectedIcdCodes: Condition[];
  selectedTreatments: TreatmentItem[];
  selectedMedications: Medicine[];
  chronicRegistrationNote: string;
  chronicRegistrationNotes: ChronicRegistrationNote[];
  status: 'active' | 'completed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseWithPatient extends Case {
  patient: Patient;
}

export interface OngoingManagementActivity {
  id: string;
  case_id: string;
  activity_type: 'specialist_visit' | 'diagnostic_test' | 'follow_up' | 'other';
  activity_date: string;
  specialist_type: string | null;
  clinical_notes: string;
  attachments: any[];
  created_at: string;
  created_by: string;
}

export interface ReferralLetter {
  id: string;
  case_id: string;
  patient_id: string;
  specialist_type: string;
  reason_for_referral: string;
  urgency_level: 'routine' | 'urgent' | 'emergency';
  clinical_summary: string;
  referral_document: any;
  status: 'pending' | 'sent' | 'completed' | 'cancelled';
  created_at: string;
  sent_at: string | null;
}

export interface WorkflowStep {
  step: number;
  title: string;
  completed: boolean;
}

