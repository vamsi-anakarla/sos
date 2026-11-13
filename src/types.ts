export type View = 'home' | 'request' | 'dispatch' | 'simulation';

export type Network = 'private' | 'government';

export type VehicleCategory = 'BLS' | 'ALS' | 'Patient Transport';

export type AmbulanceStatus = 'available' | 'busy' | 'out_of_service';

export type Channel = 'Mobile app' | 'Phone' | 'WhatsApp' | 'API';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Hospital {
  id: string;
  name: string;
  area: string;
  coords: GeoPoint;
  traumaLevel: string;
  phone: string;
}

export interface Ambulance {
  id: string;
  registration: string;
  operator: string;
  category: VehicleCategory;
  network: Network;
  status: AmbulanceStatus;
  area: string;
  lastGpsAt: number;
  coords?: GeoPoint;
  speed?: number; // km/h
  heading?: number;
}

export type RequestStatus =
  | 'pending'
  | 'assigned'
  | 'accepted'
  | 'en_route'
  | 'on_scene'
  | 'completed';

export type WorkflowStepId =
  // Patient swimlane
  | 'pat_need'
  | 'pat_open'
  | 'pat_location'
  | 'pat_details'
  | 'pat_submit'
  | 'pat_track'
  | 'pat_arrives'
  | 'pat_status'
  | 'pat_feedback'
  | 'pat_complete'
  // Central Dispatch swimlane
  | 'disp_received'
  | 'disp_check'
  | 'disp_select'
  | 'disp_gateway'
  | 'disp_confirm'
  | 'disp_sent'
  // Ambulance Operator swimlane
  | 'amb_start'
  | 'amb_login'
  | 'amb_availability'
  | 'amb_receive'
  | 'amb_gateway'
  | 'amb_decline_task'
  | 'amb_declined'
  | 'amb_navigate_patient'
  | 'amb_picked_up'
  | 'amb_navigate_hospital'
  | 'amb_complete_trip'
  | 'amb_complete';

export interface AmbulanceRequest {
  id: string;
  channel: Channel;
  network: Network;
  pickupArea: string;
  pickupNote: string;
  patientName: string;
  patientPhone: string;
  patientAge: number | null;
  description: string;
  category: VehicleCategory;
  serviceType?: string;
  createdAt: number;
  stageAt: number;
  status: RequestStatus;
  ambulanceId: string | null;
  declinedAmbulanceIds: string[];
  alerts: string[];
  aiCaptured: boolean;
  externalRef: string | null;
  pickupCoords?: GeoPoint;
  hospital?: Hospital;
  distanceKm?: number;
  etaMinutes?: number;
  rating?: number;
  feedback?: string;
  workflowStep?: WorkflowStepId;
}

export interface DispatchEvent {
  id: string;
  requestId: string | null;
  message: string;
  createdAt: number;
}
