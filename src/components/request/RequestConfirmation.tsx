import { CheckCircle2, LayoutDashboard, RotateCcw } from 'lucide-react';
import type { View } from '@/types';

interface RequestConfirmationProps {
  requestId: string;
  onNavigate: (view: View) => void;
  onNewRequest: () => void;
}

export default function RequestConfirmation({
  requestId,
  onNavigate,
  onNewRequest,
}: RequestConfirmationProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="comic-panel animate-pop-in p-8 text-center sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center border-4 border-ink bg-comic-yellow-deep shadow-panel-sm">
          <CheckCircle2 className="h-11 w-11 text-ink" strokeWidth={2.5} />
        </div>
        <h1 className="mt-6 text-5xl text-ink">Request received!</h1>
        <p className="mt-3 text-base text-ink/80">
          Your request ID is{' '}
          <span className="inline-block border-2 border-ink bg-comic-yellow px-2 font-display text-xl tracking-wider">
            {requestId}
          </span>
          . It is now waiting for a dispatcher to review and assign a suitable ambulance.
        </p>
        <p className="mt-3 text-sm text-ink/70">
          For life-threatening emergencies, call 112 or 108 directly.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => onNavigate('dispatch')} className="comic-button-primary">
            <LayoutDashboard className="h-5 w-5" /> View dispatch queue
          </button>
          <button type="button" onClick={onNewRequest} className="comic-button-ghost">
            <RotateCcw className="h-5 w-5" /> New request
          </button>
        </div>
      </div>
    </div>
  );
}
