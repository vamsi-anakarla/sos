export type View = 'home' | 'request' | 'dispatch';

export type Network = 'private' | 'government';

export type VehicleCategory = 'BLS' | 'ALS' | 'Patient Transport';

export type AmbulanceStatus = 'available' | 'busy' | 'out_of_service';

export type Channel = 'Mobile app' | 'Phone' | 'WhatsApp' | 'API';

export interface Ambulance {
  id: string;
  registration: string;
  operator: string;
  category: VehicleCategory;
  network: Network;
  status: AmbulanceStatus;
  area: string;
  lastGpsAt: number;
}

export type RequestStatus =
  | 'pending'
  | 'assigned'
  | 'accepted'
  | 'en_route'
  | 'on_scene'
  | 'completed';

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
  createdAt: number;
  stageAt: number;
  status: RequestStatus;
  ambulanceId: string | null;
  declinedAmbulanceIds: string[];
  alerts: string[];
  aiCaptured: boolean;
  externalRef: string | null;
}

export interface DispatchEvent {
  id: string;
  requestId: string | null;
  message: string;
  createdAt: number;
}
