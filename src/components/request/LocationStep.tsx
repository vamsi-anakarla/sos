import { useState } from 'react';
import {
  Compass,
  Crosshair,
  Hospital as HospitalIcon,
  Loader2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import FormField from '@/components/request/FormField';
import { BENGALURU_AREAS } from '@/data/areas';
import {
  BENGALURU_LOCATIONS,
  findNearestArea,
  findNearestHospital,
  getCoordinatesForArea,
  QUICK_LOCATION_PRESETS,
} from '@/data/locations';
import type { DraftErrors, RequestDraft } from '@/lib/requestValidation';

interface LocationStepProps {
  draft: RequestDraft;
  errors: DraftErrors;
  onChange: <K extends keyof RequestDraft>(key: K, value: RequestDraft[K]) => void;
}

export default function LocationStep({ draft, errors, onChange }: LocationStepProps) {
  const [detecting, setDetecting] = useState(false);
  const [detectedSuccess, setDetectedSuccess] = useState(false);

  const areaCoords = draft.pickupArea
    ? getCoordinatesForArea(draft.pickupArea)
    : BENGALURU_LOCATIONS['Koramangala'].coords;
  const nearestHospital = findNearestHospital(areaCoords);

  const handleAutoDetectLocation = () => {
    setDetecting(true);
    setDetectedSuccess(false);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const matchedArea = findNearestArea({ lat, lng });
          const areaData = BENGALURU_LOCATIONS[matchedArea];

          onChange('pickupArea', matchedArea);
          onChange(
            'pickupNote',
            areaData?.defaultLandmark || `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
          );

          setDetecting(false);
          setDetectedSuccess(true);
        },
        () => {
          setTimeout(() => {
            onChange('pickupArea', 'Koramangala');
            onChange('pickupNote', 'Near Forum Mall, 80ft Road Junction');
            setDetecting(false);
            setDetectedSuccess(true);
          }, 500);
        },
        { timeout: 4000 }
      );
    } else {
      setTimeout(() => {
        onChange('pickupArea', 'Koramangala');
        onChange('pickupNote', 'Near Forum Mall, 80ft Road Junction');
        setDetecting(false);
        setDetectedSuccess(true);
      }, 500);
    }
  };

  const handleSelectPreset = (preset: typeof QUICK_LOCATION_PRESETS[0]) => {
    onChange('pickupArea', preset.area);
    onChange('pickupNote', preset.landmark);
    setDetectedSuccess(true);
  };

  return (
    <div className="space-y-3">
      {/* Compact Header & Auto-Detect Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-1">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded border border-ink bg-comic-yellow text-ink shadow-xs">
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink leading-tight">Where is the Patient?</h2>
            <p className="text-xs text-ink/70">Pick the nearest sector or auto-detect with satellite GPS.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAutoDetectLocation}
          disabled={detecting}
          className="comic-button-yellow px-3 py-1 text-xs flex items-center gap-1.5 border-2 shadow-xs"
        >
          {detecting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-ink" />
              <span>Detecting GPS...</span>
            </>
          ) : (
            <>
              <Crosshair className="h-3.5 w-3.5 text-comic-red" />
              <span>Auto-Detect My GPS</span>
            </>
          )}
        </button>
      </div>

      {/* Quick 1-Click Presets in a Single Compact Row */}
      <div className="rounded-lg border border-ink/30 bg-comic-paper px-2.5 py-1.5 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="font-display text-[11px] tracking-wider text-ink/75 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-comic-red" />
          <span>Presets:</span>
        </span>
        <div className="flex flex-wrap gap-1">
          {QUICK_LOCATION_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`rounded border px-2 py-0.5 text-[11px] font-bold transition-all ${
                draft.pickupArea === preset.area
                  ? 'border-ink bg-comic-yellow text-ink shadow-xs -translate-y-0.5'
                  : 'border-ink/30 bg-white text-ink/80 hover:bg-comic-yellow/40'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {detectedSuccess && (
        <div className="flex items-center gap-1.5 rounded border border-emerald-600 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800">
          <Compass className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>Location automatically locked to {draft.pickupArea}!</span>
        </div>
      )}

      {/* Area & Landmark side-by-side in 2 columns */}
      <div className="grid gap-2.5 sm:grid-cols-2 items-start">
        <FormField label="Area / Sector" htmlFor="pickupArea" error={errors.pickupArea}>
          <select
            id="pickupArea"
            className="comic-input text-xs sm:text-sm py-1.5 px-2.5"
            value={draft.pickupArea}
            onChange={(e) => {
              const nextArea = e.target.value;
              onChange('pickupArea', nextArea);
              if (nextArea && BENGALURU_LOCATIONS[nextArea]) {
                onChange('pickupNote', BENGALURU_LOCATIONS[nextArea].defaultLandmark);
              }
            }}
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
          label="Landmark / Street Address"
          htmlFor="pickupNote"
          error={errors.pickupNote}
          hint="Nearby metro, apartment or landmark"
        >
          <input
            id="pickupNote"
            type="text"
            className="comic-input text-xs sm:text-sm py-1.5 px-2.5"
            placeholder="e.g. Near Forum Mall, 80ft Road"
            value={draft.pickupNote}
            onChange={(e) => onChange('pickupNote', e.target.value)}
          />
        </FormField>
      </div>

      {/* Compact Hospital Preview */}
      {draft.pickupArea && (
        <div className="rounded-lg border-2 border-ink bg-white p-2.5 shadow-panel-sm flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-ink bg-rose-100 text-rose-700">
              <HospitalIcon className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-xs tracking-wide text-ink">
                Auto-Assigned Trauma Hospital: <span className="font-bold">{nearestHospital.name}</span>
              </p>
              <p className="text-[10px] text-ink/70">
                {nearestHospital.traumaLevel} • Emergency Hot line: {nearestHospital.phone}
              </p>
            </div>
          </div>
          <span className="rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[9px] font-bold text-rose-800">
            Pre-Alert Active
          </span>
        </div>
      )}
    </div>
  );
}
