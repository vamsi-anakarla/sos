export interface RequestDraft {
  pickupArea: string;
  pickupNote: string;
  patientName: string;
  patientPhone: string;
  patientAge: string;
  description: string;
  category: 'BLS' | 'ALS' | 'Patient Transport';
  serviceType?: string;
}

export type DraftErrors = Partial<Record<keyof RequestDraft, string>>;

export function validateLocation(draft: RequestDraft): DraftErrors {
  const errors: DraftErrors = {};
  if (!draft.pickupArea) errors.pickupArea = 'Choose the area closest to the patient.';
  if (draft.pickupNote.trim().length < 5) {
    errors.pickupNote = 'Add a landmark or street so the crew can find the patient.';
  }
  return errors;
}

export function validatePatient(draft: RequestDraft): DraftErrors {
  const errors: DraftErrors = {};
  // Patient name can be unknown (e.g. road accident, bystander report, or unconscious victim)
  // Only validate if a custom name is entered and is too short
  if (draft.patientName.trim().length === 1) {
    errors.patientName = 'Enter at least 2 characters, or leave empty if unknown.';
  }
  const digits = draft.patientPhone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) {
    errors.patientPhone = 'Enter a valid contact number with 10 digits.';
  }
  if (draft.patientAge && (Number(draft.patientAge) < 0 || Number(draft.patientAge) > 120)) {
    errors.patientAge = 'Enter an age between 0 and 120.';
  }
  if (draft.description.trim().length < 10) {
    errors.description = 'Describe the situation in a sentence or two.';
  }
  return errors;
}
