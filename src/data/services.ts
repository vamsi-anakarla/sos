import {
  Accessibility,
  AlertTriangle,
  Baby,
  Car,
  HeartPulse,
  Sparkles,
  Stethoscope,
  Wind,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { VehicleCategory } from '@/types';

export interface EmergencyServiceOption {
  id: string;
  title: string;
  shortLabel: string;
  tagline: string;
  descriptionTemplate: string;
  recommendedCategory: VehicleCategory;
  categoryReason: string;
  icon: LucideIcon;
  badge: string;
  defaultAge?: string;
  criticality: 'critical' | 'urgent' | 'routine';
}

export const MOST_USED_SERVICES: EmergencyServiceOption[] = [
  {
    id: 'accident',
    title: 'Road Accident & Trauma',
    shortLabel: 'Accident / Trauma',
    tagline: 'Collision, vehicle crash, head injury, severe bleeding',
    descriptionTemplate:
      'Road traffic accident victim with acute trauma, visible injuries, and bleeding. Immediate trauma stabilization required.',
    recommendedCategory: 'ALS',
    categoryReason: 'ALS crew needed for airway management and trauma stabilization',
    icon: Car,
    badge: 'Trauma Priority',
    criticality: 'critical',
  },
  {
    id: 'child',
    title: 'Child & Pediatric Emergency',
    shortLabel: 'Child Emergency',
    tagline: 'High fever, seizure, respiratory distress, choking, fall',
    descriptionTemplate:
      'Pediatric emergency: Child in acute distress with breathing difficulty/high fever seizure. Requires urgent pediatric care.',
    recommendedCategory: 'ALS',
    categoryReason: 'Pediatric emergency care with oxygen and vitals monitoring',
    icon: Baby,
    badge: 'Pediatric Care',
    defaultAge: '6',
    criticality: 'critical',
  },
  {
    id: 'cardiac',
    title: 'Heart Attack & Chest Pain',
    shortLabel: 'Cardiac / Heart',
    tagline: 'Severe chest tightness, heavy sweating, left arm pain',
    descriptionTemplate:
      'Acute central chest pain radiating to left arm/jaw, shortness of breath, and profuse sweating. Suspected acute coronary event.',
    recommendedCategory: 'ALS',
    categoryReason: 'ALS equipped with 12-lead ECG monitor and defibrillator',
    icon: HeartPulse,
    badge: 'Cardiac Golden Hour',
    criticality: 'critical',
  },
  {
    id: 'maternity',
    title: 'Pregnancy & Maternity Labor',
    shortLabel: 'Maternity / Labor',
    tagline: 'Active labor contractions, sudden delivery onset',
    descriptionTemplate:
      'Maternity emergency: Active labor contractions and delivery onset. Urgent transport to maternity emergency hospital required.',
    recommendedCategory: 'BLS',
    categoryReason: 'BLS crew equipped with sterile obstetrical delivery kit',
    icon: Sparkles,
    badge: 'Delivery Kit Ready',
    criticality: 'urgent',
  },
  {
    id: 'stroke',
    title: 'Stroke & Neurological (FAST)',
    shortLabel: 'Stroke / Neuro',
    tagline: 'Facial droop, unilateral arm weakness, slurred speech',
    descriptionTemplate:
      'Possible acute stroke: Patient presenting with sudden facial droop, arm weakness, and slurred speech (FAST protocol).',
    recommendedCategory: 'ALS',
    categoryReason: 'ALS rapid transport to comprehensive stroke center',
    icon: AlertTriangle,
    badge: 'FAST Protocol',
    criticality: 'critical',
  },
  {
    id: 'fall',
    title: 'Elderly Slip & Fall / Fracture',
    shortLabel: 'Elderly Fall',
    tagline: 'Fall inside residence, hip or spine injury, immobile',
    descriptionTemplate:
      'Elderly patient slip and fall at home with suspected hip fracture; unable to stand and requires spine-board stretcher transport.',
    recommendedCategory: 'BLS',
    categoryReason: 'BLS crew with scoop stretcher and immobilization splints',
    icon: Accessibility,
    badge: 'Immobilization Stretcher',
    defaultAge: '72',
    criticality: 'urgent',
  },
  {
    id: 'breathing',
    title: 'Severe Breathing / Asthma',
    shortLabel: 'Severe Breathlessness',
    tagline: 'Asthma attack, COPD, oxygen saturation dropping below 90%',
    descriptionTemplate:
      'Acute respiratory distress, severe wheezing and shortness of breath, oxygen saturation dropping. Nebulization needed.',
    recommendedCategory: 'ALS',
    categoryReason: 'ALS equipped with ventilator, suction and high-flow oxygen',
    icon: Wind,
    badge: 'High-Flow Oxygen',
    criticality: 'critical',
  },
  {
    id: 'transport',
    title: 'Planned Hospital Transfer / Dialysis',
    shortLabel: 'Routine Transfer',
    tagline: 'Inter-facility transfer, post-operative discharge, dialysis',
    descriptionTemplate:
      'Scheduled non-emergency transport for hospital discharge/regular dialysis session. Patient requires stretcher and attendant.',
    recommendedCategory: 'Patient Transport',
    categoryReason: 'Non-emergency stretcher van for stable transport',
    icon: Stethoscope,
    badge: 'Scheduled Van',
    criticality: 'routine',
  },
];
