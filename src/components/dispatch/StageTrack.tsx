import { Check } from 'lucide-react';
import type { RequestStatus } from '@/types';

const STAGES: { status: RequestStatus; label: string }[] = [
  { status: 'pending', label: 'Received' },
  { status: 'assigned', label: 'Matched' },
  { status: 'accepted', label: 'Accepted' },
  { status: 'en_route', label: 'En route' },
  { status: 'on_scene', label: 'On scene' },
  { status: 'completed', label: 'Completed' },
];

export default function StageTrack({ status }: { status: RequestStatus }) {
  const current = STAGES.findIndex((s) => s.status === status);
  return (
    <ol className="grid grid-cols-6 gap-1" aria-label="Trip progress">
      {STAGES.map((stage, index) => {
        const done = index < current || status === 'completed';
        const active = index === current && status !== 'completed';
        return (
          <li key={stage.status} className="min-w-0 text-center">
            <span
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink font-display text-sm ${
                done
                  ? 'bg-ink text-comic-yellow'
                  : active
                    ? 'animate-pulse bg-comic-yellow-deep text-ink'
                    : 'bg-comic-cream text-ink/50'
              }`}
            >
              {done ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
            </span>
            <span className={`mt-1 block truncate text-[11px] font-bold ${active ? 'text-ink' : 'text-ink/60'}`}>
              {stage.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
