import { supabase } from './supabaseClient';
import type { Patient, Case, OngoingManagementActivity, ReferralLetter } from '@/types';

export const patientService = {
  async searchPatients(searchTerm: string): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .ilike('full_name', `%${searchTerm}%`)
      .order('full_name');

    if (error) throw error;
    return (data as any) || [];
  },

  async getPatientByIdNumber(idNumber: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('patient_id_number', idNumber)
      .maybeSingle();

    if (error) throw error;
    return data as any;
  },

  async createPatient(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .insert(patient as any)
      .select()
      .single();

    if (error) throw error;
    return data as any;
  },

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as any;
  },

  async getAllPatients(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('full_name');

    if (error) throw error;
    return (data as any) || [];
  },
};

export const caseService = {
  async getCasesByPatientId(patientId: string): Promise<Case[]> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as any) || [];
  },

  async getCaseById(caseId: string): Promise<Case | null> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .maybeSingle();

    if (error) throw error;
    return data as any;
  },

  async createCase(caseData: Omit<Case, 'id' | 'created_at' | 'updated_at'>): Promise<Case> {
    const { data, error } = await supabase
      .from('cases')
      .insert(caseData as any)
      .select()
      .single();

    if (error) throw error;
    return data as any;
  },

  async updateCase(caseId: string, updates: Partial<Case>): Promise<Case> {
    const { data, error } = await supabase
      .from('cases')
      .update(updates as any)
      .eq('id', caseId)
      .select()
      .single();

    if (error) throw error;
    return data as any;
  },

  async getAllCases(): Promise<Case[]> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as any) || [];
  },

  async deleteCase(caseId: string): Promise<void> {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', caseId);

    if (error) throw error;
  },
};

export const ongoingManagementService = {
  async getActivitiesByCaseId(caseId: string): Promise<OngoingManagementActivity[]> {
    const { data, error } = await supabase
      .from('ongoing_management_activities')
      .select('*')
      .eq('case_id', caseId)
      .order('activity_date', { ascending: false });

    if (error) throw error;
    return (data as any) || [];
  },

  async createActivity(activity: Omit<OngoingManagementActivity, 'id' | 'created_at'>): Promise<OngoingManagementActivity> {
    const { data, error } = await supabase
      .from('ongoing_management_activities')
      .insert(activity as any)
      .select()
      .single();

    if (error) throw error;
    return data as any;
  },

  async updateActivity(activityId: string, updates: Partial<OngoingManagementActivity>): Promise<OngoingManagementActivity> {
    const { data, error } = await supabase
      .from('ongoing_management_activities')
      .update(updates as any)
      .eq('id', activityId)
      .select()
      .single();

    if (error) throw error;
    return data as any;
  },

  async deleteActivity(activityId: string): Promise<void> {
    const { error } = await supabase
      .from('ongoing_management_activities')
      .delete()
      .eq('id', activityId);

    if (error) throw error;
  },
};

export const referralService = {
  async getReferralsByCaseId(caseId: string): Promise<ReferralLetter[]> {
    const { data, error } = await supabase
      .from('referral_letters')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as any) || [];
  },

  async getReferralsByPatientId(patientId: string): Promise<ReferralLetter[]> {
    const { data, error } = await supabase
      .from('referral_letters')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as any) || [];
  },

  async createReferral(referral: Omit<ReferralLetter, 'id' | 'created_at'>): Promise<ReferralLetter> {
    const { data, error } = await supabase
      .from('referral_letters')
      .insert(referral as any)
      .select()
      .single();

    if (error) throw error;
    return data as any;
  },

  async updateReferral(referralId: string, updates: Partial<ReferralLetter>): Promise<ReferralLetter> {
    const { data, error} = await supabase
      .from('referral_letters')
      .update(updates as any)
      .eq('id', referralId)
      .select()
      .single();

    if (error) throw error;
    return data as any;
  },

  async deleteReferral(referralId: string): Promise<void> {
    const { error } = await supabase
      .from('referral_letters')
      .delete()
      .eq('id', referralId);

    if (error) throw error;
  },
};
