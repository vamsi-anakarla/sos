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
  return {
    fields: { ...base('API', payload, payload.situation, false), externalRef: payload.idempotencyKey },
  };
}

const SAMPLE_SCENARIOS: Array<() => InboundMessage> = [
  () =>
    fromPhoneCall({
      callerLanguage: 'Kannada',
      name: 'Sample Caller 1',
      phone: '+91 90000 00003',
      age: 68,
      area: 'Jayanagar',
      landmark: 'Near the 4th block complex gate',
      situation: 'Elderly man with chest pain, conscious and sweating.',
      category: 'ALS',
    }),
  () =>
    fromWhatsApp({
      detectedLanguage: 'Telugu',
      name: 'Sample Parent 2',
      phone: '+91 90000 00004',
      age: 9,
      area: 'Whitefield',
      landmark: 'Opposite the ITPL main gate',
      situation: 'Child fell from a bicycle with an arm injury. Bleeding controlled.',
      voiceNoteTranscript: 'Child fell from bicycle, arm is hurt, bleeding is slowing down.',
      category: 'BLS',
    }),
  () =>
    fromMobileApp({
      name: 'Sample Patient 3',
      phone: '+91 90000 00005',
      age: 45,
      area: 'Hebbal',
      landmark: 'Hospital discharge ward, ground floor',
      situation: 'Scheduled discharge transfer. Patient needs a stretcher.',
      category: 'Patient Transport',
    }),
  () =>
    fromPhoneCall({
      callerLanguage: 'Hindi',
      name: 'Sample Caller 4',
      phone: '+91 90000 00006',
      age: 30,
      area: 'BTM Layout',
      landmark: 'Outside the bus stop near the 16th main junction',
      situation: 'Two-wheeler accident. Rider has a head injury and is drowsy.',
      category: 'ALS',
    }),
  () =>
    fromPartnerApi({
      idempotencyKey: 'partner-demo-ward-transfer',
      name: 'Sample Ward Patient 5',
      phone: '+91 90000 00007',
      age: 72,
      area: 'Rajajinagar',
      landmark: 'Partner hospital ward 3B, main lobby',
      situation: 'Post-operative transfer from hospital ward to home. Stretcher required.',
      category: 'Patient Transport',
    }),
];

export function nextSimulatedMessage(index: number): InboundMessage {
  return SAMPLE_SCENARIOS[index % SAMPLE_SCENARIOS.length]();
}
