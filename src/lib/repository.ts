import { supabase } from '@/lib/supabase';
import type {
  Ambulance,
  AmbulanceRequest,
  DispatchEvent,
  VehicleCategory,
  Network,
  AmbulanceStatus,
  Channel,
  RequestStatus,
} from '@/types';

interface AmbulanceRow {
  id: string;
  registration: string;
  operator: string;
  category: VehicleCategory;
  network: Network;
  status: AmbulanceStatus;
  area: string;
  last_gps_at: string;
}

interface RequestRow {
  id: string;
  channel: Channel;
  network: Network;
  pickup_area: string;
  pickup_note: string;
  patient_name: string;
  patient_phone: string;
  patient_age: number | null;
  description: string;
  category: VehicleCategory;
  status: RequestStatus;
  ambulance_id: string | null;
  declined_ambulance_ids: string[];
  alerts: string[];
  ai_captured: boolean;
  external_ref: string | null;
  created_at: string;
  stage_at: string;
}

interface EventRow {
  id: string;
  request_id: string | null;
  message: string;
  created_at: string;
}

const REQUEST_LIMIT = 200;
const EVENT_LIMIT = 100;

function fail(action: string, message: string): never {
  throw new Error(`Could not ${action}: ${message}`);
}

function toAmbulance(row: AmbulanceRow): Ambulance {
  return {
    id: row.id,
    registration: row.registration,
    operator: row.operator,
    category: row.category,
    network: row.network,
    status: row.status,
    area: row.area,
    lastGpsAt: Date.parse(row.last_gps_at),
  };
}

function toRequest(row: RequestRow): AmbulanceRequest {
  return {
    id: row.id,
    channel: row.channel,
    network: row.network,
    pickupArea: row.pickup_area,
    pickupNote: row.pickup_note,
    patientName: row.patient_name,
    patientPhone: row.patient_phone,
    patientAge: row.patient_age,
    description: row.description,
    category: row.category,
    status: row.status,
    ambulanceId: row.ambulance_id,
    declinedAmbulanceIds: row.declined_ambulance_ids,
    alerts: row.alerts,
    aiCaptured: row.ai_captured,
    externalRef: row.external_ref,
    createdAt: Date.parse(row.created_at),
    stageAt: Date.parse(row.stage_at),
  };
}

function toEvent(row: EventRow): DispatchEvent {
  return {
    id: row.id,
    requestId: row.request_id,
    message: row.message,
    createdAt: Date.parse(row.created_at),
  };
}

function toRequestRow(request: AmbulanceRequest): RequestRow {
  return {
    id: request.id,
    channel: request.channel,
    network: request.network,
    pickup_area: request.pickupArea,
    pickup_note: request.pickupNote,
    patient_name: request.patientName,
    patient_phone: request.patientPhone,
    patient_age: request.patientAge,
    description: request.description,
    category: request.category,
    status: request.status,
    ambulance_id: request.ambulanceId,
    declined_ambulance_ids: request.declinedAmbulanceIds,
    alerts: request.alerts,
    ai_captured: request.aiCaptured,
    external_ref: request.externalRef,
    created_at: new Date(request.createdAt).toISOString(),
    stage_at: new Date(request.stageAt).toISOString(),
  };
}

export async function fetchDispatchSnapshot(): Promise<{
  ambulances: Ambulance[];
  requests: AmbulanceRequest[];
  events: DispatchEvent[];
}> {
  const [fleet, requests, events] = await Promise.all([
    supabase.from('ambulances').select('*').order('id'),
    supabase
      .from('ambulance_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(REQUEST_LIMIT),
    supabase.from('dispatch_events').select('*').order('created_at', { ascending: false }).limit(EVENT_LIMIT),
  ]);

  if (fleet.error) fail('load the fleet', fleet.error.message);
  if (requests.error) fail('load requests', requests.error.message);
  if (events.error) fail('load the activity log', events.error.message);

  return {
    ambulances: (fleet.data as AmbulanceRow[]).map(toAmbulance),
    requests: (requests.data as RequestRow[]).map(toRequest),
    events: (events.data as EventRow[]).map(toEvent),
  };
}

export async function saveRequest(request: AmbulanceRequest): Promise<void> {
  const { error } = await supabase.from('ambulance_requests').upsert(toRequestRow(request));
  if (error) fail('save request', error.message);
}

export async function saveAmbulanceStatus(ambulanceId: string, status: AmbulanceStatus): Promise<void> {
  const { error } = await supabase.from('ambulances').update({ status }).eq('id', ambulanceId);
  if (error) fail('update ambulance', error.message);
}

export async function saveEvent(entry: DispatchEvent): Promise<void> {
  const { error } = await supabase.from('dispatch_events').insert({
    id: entry.id,
    request_id: entry.requestId,
    message: entry.message,
    created_at: new Date(entry.createdAt).toISOString(),
  });
  if (error) fail('save activity', error.message);
}
