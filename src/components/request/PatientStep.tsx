import { useState } from 'react';
import {
  Accessibility,
  Check,
  HeartPulse,
  Sparkles,
  Stethoscope,
  UserX,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import FormField from '@/components/request/FormField';
import { MOST_USED_SERVICES, type EmergencyServiceOption } from '@/data/services';
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
    title: 'Basic Life Support (BLS)',
    body: 'Stable patients needing monitored oxygen or vitals transport.',
    icon: Stethoscope,
  },
  {
    value: 'ALS',
    title: 'Advanced Life Support (ALS)',
    body: 'Trauma equipment, defibrillator & paramedics for critical cases.',
    icon: HeartPulse,
  },
  {
    value: 'Patient Transport',
    title: 'Patient Transport',
    body: 'Non-emergency movement with stretcher or wheelchair.',
    icon: Accessibility,
  },
];

const inputClass = 'comic-input text-xs sm:text-sm py-1.5 px-2.5';

export default function PatientStep({ draft, errors, onChange }: PatientStepProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    draft.serviceType ?? null
  );

  const handleSelectService = (service: EmergencyServiceOption) => {
    setSelectedServiceId(service.id);
    onChange('serviceType', service.title);
    onChange('description', service.descriptionTemplate);
    onChange('category', service.recommendedCategory);

    if (!draft.patientAge && service.defaultAge) {
      onChange('patientAge', service.defaultAge);
    }
  };

  const activeService = MOST_USED_SERVICES.find((s) => s.id === selectedServiceId);
  const isUnknown = draft.patientName === 'Unknown Patient';

  return (
    <div className="space-y-3.5">
      {/* Compact Title */}
      <div className="flex flex-wrap items-baseline justify-between gap-1 border-b-2 border-ink pb-1">
        <div>
          <h2 className="font-display text-xl sm:text-2xl text-ink leading-tight">Who Needs Help?</h2>
          <p className="text-xs text-ink/70">
            Emergency crew will verify vital details upon arrival.
          </p>
        </div>
        <span className="text-[11px] font-mono text-ink/60">Step 2 of 3</span>
      </div>

      {/* Single-Row Compact Contact Info (3 columns on md screens) */}
      <div className="grid gap-2.5 sm:grid-cols-12 items-start">
        {/* Patient Name (5 cols) */}
        <div className="sm:col-span-5">
          <FormField
            label="Patient Name"
            htmlFor="patientName"
            error={errors.patientName}
          >
            <div className="flex gap-1.5">
              <input
                id="patientName"
                className={`${inputClass} flex-1`}
                placeholder="Name (or click Unknown)"
                value={draft.patientName}
                onChange={(e) => onChange('patientName', e.target.value)}
                autoComplete="name"
              />
              <button
                type="button"
                onClick={() =>
                  onChange('patientName', isUnknown ? '' : 'Unknown Patient')
                }
                className={`shrink-0 rounded border-2 px-2 py-1 text-xs font-bold transition-all flex items-center gap-1 ${
                  isUnknown
                    ? 'border-ink bg-comic-yellow text-ink shadow-xs'
                    : 'border-ink/40 bg-white text-ink/75 hover:bg-slate-100'
                }`}
                title="Mark patient as unknown (e.g. road accident / unconscious victim)"
              >
                <UserX className="h-3 w-3" />
                <span>{isUnknown ? 'Unknown ✓' : 'Unknown'}</span>
              </button>
            </div>
          </FormField>
        </div>

        {/* Contact Phone (4 cols) */}
        <div className="sm:col-span-4">
          <FormField label="Contact Number" htmlFor="patientPhone" error={errors.patientPhone}>
            <input
              id="patientPhone"
              type="tel"
              className={inputClass}
              placeholder="+91 98765 43210"
              value={draft.patientPhone}
              onChange={(e) => onChange('patientPhone', e.target.value)}
              autoComplete="tel"
            />
          </FormField>
        </div>

        {/* Age (3 cols) */}
        <div className="sm:col-span-3">
          <FormField label="Age (Optional)" htmlFor="patientAge" error={errors.patientAge}>
            <input
              id="patientAge"
              type="number"
              min={0}
              max={120}
              className={inputClass}
              placeholder="e.g. 6 or 65"
              value={draft.patientAge}
              onChange={(e) => onChange('patientAge', e.target.value)}
            />
          </FormField>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* COMPACT MOST-USED EMERGENCY SERVICES PILLS (Saves massive space) */}
      {/* ===================================================================== */}
      <div className="rounded-xl border-2 border-ink bg-comic-paper p-2.5 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
          <span className="font-display text-xs sm:text-sm tracking-wide text-ink flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-comic-red" />
            <span>Most-Used Emergency Presets (1-Click Fill):</span>
          </span>
          {activeService && (
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
              Selected: {activeService.shortLabel} ({activeService.recommendedCategory})
            </span>
          )}
        </div>

        {/* Compact 4-col chip grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {MOST_USED_SERVICES.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedServiceId === service.id;

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => handleSelectService(service)}
                className={`flex items-center gap-2 p-1.5 rounded-lg border-2 text-left transition-all text-xs ${
                  isSelected
                    ? 'border-ink bg-comic-yellow text-ink shadow-xs font-bold ring-1 ring-comic-red'
                    : 'border-ink/30 bg-white text-ink/80 hover:border-ink hover:bg-amber-50/50'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border ${
                    isSelected ? 'bg-comic-red text-white border-ink' : 'bg-slate-100 text-ink border-slate-300'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-[11px] leading-tight">{service.shortLabel}</p>
                  <p className="text-[9px] text-ink/60 truncate">{service.recommendedCategory}</p>
                </div>
                {isSelected && <Check className="h-3 w-3 text-emerald-700 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* What is happening? textarea (Compact 2 rows) */}
      <FormField
        label="Emergency Description"
        htmlFor="description"
        error={errors.description}
        hint="Brief symptoms or incident details (auto-filled by emergency preset above)."
      >
        <textarea
          id="description"
          rows={2}
          className={`${inputClass} resize-none`}
          placeholder="e.g. Road accident with head trauma, severe pain, patient responsive..."
          value={draft.description}
          onChange={(e) => onChange('description', e.target.value)}
        />
      </FormField>

      {/* Assistance Type (Compact 3 cards) */}
      <fieldset className="space-y-1.5">
        <div className="flex items-center justify-between">
          <legend className="font-display text-sm sm:text-base tracking-wide text-ink">
            Vehicle Life Support Level
          </legend>
          {activeService && (
            <span className="text-[10px] font-bold text-comic-red">
              Recommended: {activeService.recommendedCategory}
            </span>
          )}
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {CATEGORIES.map(({ value, title, body, icon: Icon }) => {
            const selected = draft.category === value;
            const isRecommended = activeService?.recommendedCategory === value;

            return (
              <label
                key={value}
                className={`relative cursor-pointer rounded-lg border-2 border-ink p-2 transition-all ${
                  selected
                    ? 'bg-comic-yellow text-ink shadow-xs ring-1 ring-comic-red -translate-y-0.5'
                    : 'bg-white text-ink/80 hover:bg-slate-50'
                }`}
              >
                {isRecommended && (
                  <span className="absolute -top-2 right-2 rounded bg-comic-red px-1 py-0.2 text-[8px] font-bold text-white shadow-xs">
                    Recommended
                  </span>
                )}
                <input
                  type="radio"
                  name="category"
                  value={value}
                  checked={selected}
                  onChange={() => onChange('category', value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-comic-red" />
                  <span className="font-display text-xs tracking-wide">{title}</span>
                </div>
                <span className="mt-0.5 block text-[10px] leading-snug text-ink/70">{body}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
