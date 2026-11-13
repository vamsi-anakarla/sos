import { MapPin } from 'lucide-react';
import FormField from '@/components/request/FormField';
import { BENGALURU_AREAS } from '@/data/areas';
import type { DraftErrors, RequestDraft } from '@/lib/requestValidation';

interface LocationStepProps {
  draft: RequestDraft;
  errors: DraftErrors;
  onChange: <K extends keyof RequestDraft>(key: K, value: RequestDraft[K]) => void;
}

export default function LocationStep({ draft, errors, onChange }: LocationStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center border-4 border-ink bg-comic-yellow-deep shadow-panel-sm">
          <MapPin className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <div>
          <h2 className="text-3xl text-ink">Where is the patient?</h2>
          <p className="text-sm text-ink/70">Pick the nearest area, then add a landmark.</p>
        </div>
      </div>

      <FormField label="Area" htmlFor="pickupArea" error={errors.pickupArea}>
        <select
          id="pickupArea"
          className="comic-input"
          value={draft.pickupArea}
          onChange={(e) => onChange('pickupArea', e.target.value)}
        >
          <option value="">Select an area</option>
          {BENGALURU_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Landmark or address"
        htmlFor="pickupNote"
        error={errors.pickupNote}
        hint="For example: opposite the metro station exit, near the park gate."
      >
        <input
          id="pickupNote"
          type="text"
          className="comic-input"
          placeholder="Building, road or landmark"
          value={draft.pickupNote}
          onChange={(e) => onChange('pickupNote', e.target.value)}
        />
      </FormField>
    </div>
  );
}
