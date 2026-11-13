import { CircleCheck, Lock } from 'lucide-react';
import type { RequestDraft } from '@/lib/requestValidation';

interface ReviewStepProps {
  draft: RequestDraft;
}

export default function ReviewStep({ draft }: ReviewStepProps) {
  const rows: [string, string][] = [
    ['Area', draft.pickupArea],
    ['Landmark', draft.pickupNote],
    ['Patient', draft.patientName],
    ['Contact', draft.patientPhone],
    ['Age', draft.patientAge || 'Not provided'],
    ['Situation', draft.description],
    ['Assistance type', draft.category],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl text-ink">Review and submit</h2>
        <p className="text-sm text-ink/70">Check the details. A dispatcher will confirm them with you.</p>
      </div>

      <dl className="divide-y-2 divide-ink/20 border-4 border-ink bg-white">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[160px_1fr] sm:gap-4">
            <dt className="font-display text-lg tracking-wide text-ink/70">{label}</dt>
            <dd className="break-words text-base text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="space-y-3">
        <h3 className="font-display text-xl tracking-wider text-ink">Network</h3>
        <div className="flex items-start gap-3 border-4 border-ink bg-comic-yellow p-4 shadow-panel-sm">
          <CircleCheck className="mt-0.5 h-6 w-6 shrink-0" strokeWidth={2.5} />
          <div>
            <p className="font-display text-lg tracking-wide">Private ambulance network</p>
            <p className="text-sm text-ink/80">Selected. Requests go to registered private operators in the demo fleet.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 border-4 border-dashed border-ink/50 bg-comic-cream p-4 text-ink/70">
          <Lock className="mt-0.5 h-6 w-6 shrink-0" strokeWidth={2.5} />
          <div>
            <p className="font-display text-lg tracking-wide">Government 108 network</p>
            <p className="text-sm">
              Not available here. Integration needs official authorisation, so this demo cannot dispatch
              government ambulances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
