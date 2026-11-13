import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import LocationStep from '@/components/request/LocationStep';
import PatientStep from '@/components/request/PatientStep';
import ReviewStep from '@/components/request/ReviewStep';
import RequestConfirmation from '@/components/request/RequestConfirmation';
import {
  validateLocation,
  validatePatient,
  type DraftErrors,
  type RequestDraft,
} from '@/lib/requestValidation';
import type { NewRequestFields } from '@/lib/channels';
import type { View } from '@/types';

interface RequestPageProps {
  onCreate: (input: NewRequestFields) => string;
  onNavigate: (view: View) => void;
}

const STEPS = ['Location', 'Patient', 'Review'] as const;

const EMPTY_DRAFT: RequestDraft = {
  pickupArea: '',
  pickupNote: '',
  patientName: '',
  patientPhone: '',
  patientAge: '',
  description: '',
  category: 'BLS',
};

export default function RequestPage({ onCreate, onNavigate }: RequestPageProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<RequestDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const update = <K extends keyof RequestDraft>(key: K, value: RequestDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const goNext = () => {
    const stepErrors = step === 0 ? validateLocation(draft) : validatePatient(draft);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = () => {
    const id = onCreate({
      channel: 'Mobile app',
      pickupArea: draft.pickupArea,
      pickupNote: draft.pickupNote.trim(),
      patientName: draft.patientName.trim(),
      patientPhone: draft.patientPhone.trim(),
      patientAge: draft.patientAge ? Number(draft.patientAge) : null,
      description: draft.description.trim(),
      category: draft.category,
      network: 'private',
      aiCaptured: false,
      externalRef: null,
    });
    setSubmittedId(id);
  };

  if (submittedId) {
    return (
      <RequestConfirmation
        requestId={submittedId}
        onNavigate={onNavigate}
        onNewRequest={() => {
          setSubmittedId(null);
          setDraft(EMPTY_DRAFT);
          setStep(0);
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8">
        <p className="font-display text-lg tracking-wider text-comic-red">Private ambulance network</p>
        <h1 className="mt-1 text-5xl text-ink sm:text-6xl">Request an ambulance</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/80">
          Share the details below. A human dispatcher reviews every request and decides which vehicle
          is suitable.
        </p>
      </header>

      <ol className="mb-8 grid grid-cols-3 gap-3" aria-label="Request progress">
        {STEPS.map((label, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li
              key={label}
              aria-current={current ? 'step' : undefined}
              className={`flex items-center gap-2 border-4 border-ink px-3 py-2 font-display text-lg tracking-wider transition-colors ${
                current
                  ? 'bg-comic-yellow-deep shadow-panel-sm'
                  : done
                    ? 'bg-ink text-comic-cream'
                    : 'bg-comic-cream text-ink/50'
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-current bg-comic-cream text-ink">
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </li>
          );
        })}
      </ol>

      <div className="comic-panel p-6 sm:p-8">
        {step === 0 && <LocationStep draft={draft} errors={errors} onChange={update} />}
        {step === 1 && <PatientStep draft={draft} errors={errors} onChange={update} />}
        {step === 2 && <ReviewStep draft={draft} />}

        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="comic-button-ghost"
          >
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={goNext} className="comic-button-primary">
              Continue <ArrowRight className="h-5 w-5" />
            </button>
          ) : (
            <button type="button" onClick={submit} className="comic-button-primary">
              Submit request <Check className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
