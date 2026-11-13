import { CircleCheck, Lock } from 'lucide-react';
import type { RequestDraft } from '@/lib/requestValidation';

interface ReviewStepProps {
  draft: RequestDraft;
}

export default function ReviewStep({ draft }: ReviewStepProps) {
  const rows: [string, string][] = [
    ['Area & Pickup', `${draft.pickupArea || 'Not specified'} (${draft.pickupNote || 'No landmark'})`],
    ['Patient Name', draft.patientName.trim() || 'Unknown Patient'],
    ['Contact Phone', draft.patientPhone || 'Not provided'],
    ['Age', draft.patientAge ? `${draft.patientAge} years` : 'Not provided'],
    ['Emergency Service', draft.serviceType || 'General Emergency'],
    ['Life Support Type', draft.category],
    ['Situation Notes', draft.description || 'Standard emergency protocol'],
  ];

  return (
    <div className="space-y-3">
      <div className="border-b-2 border-ink pb-1">
        <h2 className="font-display text-xl sm:text-2xl text-ink leading-tight">Review & Confirm Request</h2>
        <p className="text-xs text-ink/70">Verify details before transmitting to Central Dispatch.</p>
      </div>

      {/* Compact 2-column or grid summary */}
      <div className="rounded-lg border-2 border-ink bg-white overflow-hidden text-xs divide-y divide-ink/15">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[140px_1fr] items-center px-3 py-1.5 gap-2">
            <span className="font-display text-ink/70">{label}:</span>
            <span className="font-semibold text-ink truncate">{value}</span>
          </div>
        ))}
      </div>

      {/* Compact Network Badge */}
      <div className="flex items-center gap-2 rounded-lg border-2 border-ink bg-comic-yellow px-3 py-2 shadow-xs text-xs">
        <CircleCheck className="h-4 w-4 text-ink shrink-0" strokeWidth={2.5} />
        <div>
          <span className="font-display tracking-wide font-bold">Private Ambulance Network: </span>
          <span className="text-ink/80">Request will be instantly beamed to registered city fleet operators.</span>
        </div>
      </div>
    </div>
  );
}
