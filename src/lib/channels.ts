import {
  calculateDistanceKm,
  calculateEtaMinutes,
  findNearestHospital,
  getCoordinatesForArea,
} from '@/data/locations';
import type { AmbulanceRequest, Channel, VehicleCategory } from '@/types';

export type NewRequestFields = Omit<
  AmbulanceRequest,
  'id' | 'createdAt' | 'stageAt' | 'status' | 'ambulanceId' | 'declinedAmbulanceIds' | 'alerts'
>;

export interface InboundMessage {
  fields: NewRequestFields;
}

interface PatientDetails {
  name: string;
  phone: string;
  age: number | null;
  area: string;
  landmark: string;
  situation: string;
  category: VehicleCategory;
}

export interface PhoneCallPayload extends PatientDetails {
  callerLanguage: string;
}

export interface WhatsAppPayload extends PatientDetails {
  detectedLanguage: string;
  voiceNoteTranscript: string;
}

export type AppFormPayload = PatientDetails;

export interface PartnerApiPayload extends PatientDetails {
  idempotencyKey: string;
}

function base(channel: Channel, details: PatientDetails, description: string, aiCaptured: boolean): NewRequestFields {
  const pickupCoords = getCoordinatesForArea(details.area);
  const hospital = findNearestHospital(pickupCoords);
  const distanceKm = calculateDistanceKm(pickupCoords, hospital.coords);
  const etaMinutes = calculateEtaMinutes(distanceKm);

  return {
    channel,
    network: 'private',
    pickupArea: details.area,
    pickupNote: details.landmark,
    patientName: details.name,
    patientPhone: details.phone,
    patientAge: details.age,
    description,
    category: details.category,
    aiCaptured,
    externalRef: null,
    pickupCoords,
    hospital,
    distanceKm,
    etaMinutes,
    workflowStep: 'disp_check',
  };
}

export function fromPhoneCall(call: PhoneCallPayload): InboundMessage {
  const description = `${call.situation} (Caller spoke ${call.callerLanguage}; translated by AI.)`;
  return { fields: base('Phone', call, description, true) };
}

export function fromWhatsApp(chat: WhatsAppPayload): InboundMessage {
  const description = `${chat.voiceNoteTranscript} (Voice note in ${chat.detectedLanguage}; translated by AI.)`;
  return { fields: base('WhatsApp', chat, description, true) };
}

export function fromMobileApp(form: AppFormPayload): InboundMessage {
  return { fields: base('Mobile app', form, form.situation, false) };
}

export function fromPartnerApi(payload: PartnerApiPayload): InboundMessage {
  const fields = base('API', payload, payload.situation, false);
  return {
    fields: { ...fields, externalRef: payload.idempotencyKey },
  };
}

const SAMPLE_SCENARIOS: Array<() => InboundMessage> = [
  () =>
    fromPhoneCall({
      callerLanguage: 'Kannada',
      name: 'Ramesh Gowda',
      phone: '+91 98440 21901',
      age: 68,
      area: 'Jayanagar',
      landmark: 'Near 4th Block Complex Gate, 11th Main',
      situation: 'Elderly man with severe chest pressure radiating to left arm. Conscious and sweating.',
      category: 'ALS',
    }),
  () =>
    fromWhatsApp({
      detectedLanguage: 'Telugu',
      name: 'Sunitha Reddy',
      phone: '+91 97420 54321',
      age: 9,
      area: 'Whitefield',
      landmark: 'Opposite ITPL Main Tech Park Gate',
      situation: 'Child fell from bicycle near gate; left forearm deformity and swelling.',
      voiceNoteTranscript: 'Child fell from bicycle, arm is hurt badly, swelling is visible.',
      category: 'BLS',
    }),
  () =>
    fromMobileApp({
      name: 'Kavita Menon',
      phone: '+91 99001 87654',
      age: 45,
      area: 'Hebbal',
      landmark: 'Esteem Mall Service Road, near Flyover',
      situation: 'Scheduled discharge transfer for post-op orthopedic patient. Needs stretcher.',
      category: 'Patient Transport',
    }),
  () =>
    fromPhoneCall({
      callerLanguage: 'Hindi',
      name: 'Vikram Sharma',
      phone: '+91 98801 33221',
      age: 31,
      area: 'BTM Layout',
      landmark: 'Outside Bus Stop near Udupi Garden Signal',
      situation: 'Two-wheeler collision at signal. Rider has road rash and dizziness.',
      category: 'ALS',
    }),
  () =>
    fromMobileApp({
      name: 'Deepak Kumar',
      phone: '+91 99805 11223',
      age: 52,
      area: 'Indiranagar',
      landmark: '100ft Road, opposite Metro Pillar 142',
      situation: 'Sudden high fever, breathlessness and low oxygen saturation (88%).',
      category: 'ALS',
    }),
  () =>
    fromPartnerApi({
      idempotencyKey: 'partner-demo-ward-transfer',
      name: 'Prabha Venkatesh',
      phone: '+91 94480 66778',
      age: 74,
      area: 'Rajajinagar',
      landmark: 'Partner Clinic Main Lobby, 2nd Block',
      situation: 'Post-operative transfer from nursing home to specialized trauma center.',
      category: 'Patient Transport',
    }),
];

export function nextSimulatedMessage(index: number): InboundMessage {
  return SAMPLE_SCENARIOS[index % SAMPLE_SCENARIOS.length]();
}
