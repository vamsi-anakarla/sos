import { HeartPulse, Stethoscope, Accessibility } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import FormField from '@/components/request/FormField';
import type { DraftErrors, RequestDraft } from '@/lib/requestValidation';

interface PatientStepProps {
  draft: RequestDraft;
  errors: DraftErrors;
  onChange: <K extends keyof RequestDraft>(key: K, value: RequestDraft[K]) => void;
}

const CATEGORIES: {
  value: RequestDraft['category'];
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    value: 'BLS',
    title: 'Basic life support',
    body: 'Trained crew for stable patients who need monitored transport.',
    icon: Stethoscope,
  },
  {
    value: 'ALS',
    title: 'Advanced life support',
    body: 'Advanced equipment for patients who may deteriorate on the way.',
    icon: HeartPulse,
  },
  {
    value: 'Patient Transport',
    title: 'Patient transport',
    body: 'Planned, non-emergency movement for patients who need a stretcher or wheelchair.',
    icon: Accessibility,
  },
];

const inputClass = 'comic-input';

export default function PatientStep({ draft, errors, onChange }: PatientStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl text-ink">Who needs help?</h2>
        <p className="text-sm text-ink/70">
          Contact details let the dispatcher call back. Qualified crew decide the final vehicle type.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Patient name" htmlFor="patientName" error={errors.patientName}>
          <input
            id="patientName"
            className={inputClass}
            value={draft.patientName}
            onChange={(e) => onChange('patientName', e.target.value)}
            autoComplete="name"
          />
        </FormField>
        <FormField label="Contact number" htmlFor="patientPhone" error={errors.patientPhone}>
          <input
            id="patientPhone"
            type="tel"
            className={inputClass}
            placeholder="+91 "
            value={draft.patientPhone}
            onChange={(e) => onChange('patientPhone', e.target.value)}
            autoComplete="tel"
          />
        </FormField>
        <FormField label="Age (optional)" htmlFor="patientAge" error={errors.patientAge}>
          <input
            id="patientAge"
            type="number"
            min={0}
            max={120}
            className={inputClass}
            value={draft.patientAge}
            onChange={(e) => onChange('patientAge', e.target.value)}
          />
        </FormField>
      </div>

      <FormField
        label="What is happening?"
        htmlFor="description"
        error={errors.description}
        hint="Describe symptoms or the injury in your own words. Do not wait for a perfect description."
      >
        <textarea
          id="description"
          rows={4}
          className={inputClass}
          value={draft.description}
          onChange={(e) => onChange('description', e.target.value)}
        />
      </FormField>

      <fieldset className="space-y-3">
        <legend className="mb-2 font-display text-xl tracking-wider text-ink">Assistance type</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {CATEGORIES.map(({ value, title, body, icon: Icon }) => {
            const selected = draft.category === value;
            return (
              <label
                key={value}
                className={`group cursor-pointer border-4 border-ink p-4 transition-all duration-150 ${
                  selected
                    ? 'bg-comic-yellow-deep shadow-panel -translate-x-0.5 -translate-y-0.5'
                    : 'bg-white shadow-panel-sm hover:-translate-y-0.5'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={value}
                  checked={selected}
                  onChange={() => onChange('category', value)}
                  className="sr-only"
                />
                <Icon className="h-7 w-7" strokeWidth={2.5} />
                <span className="mt-2 block font-display text-xl tracking-wide">{title}</span>
                <span className="mt-1 block text-xs leading-snug text-ink/75">{body}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
