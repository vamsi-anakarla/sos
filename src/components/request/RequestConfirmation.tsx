import { useState } from 'react';
import {
  Ambulance,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Hospital,
  LayoutDashboard,
  MapPin,
  RotateCcw,
  Star,
  Zap,
} from 'lucide-react';
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
  const [rating, setRating] = useState<number>(5);
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="comic-panel animate-pop-in p-6 sm:p-8 text-center bg-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center border-4 border-ink bg-comic-yellow-deep shadow-panel-sm">
          <CheckCircle2 className="h-9 w-9 text-ink" strokeWidth={2.5} />
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl text-ink">Emergency Request Transmitted!</h1>
        <p className="mt-2 text-sm text-ink/80">
          Request Reference:{' '}
          <span className="inline-block border-2 border-ink bg-comic-yellow px-2 font-display text-lg tracking-wider">
            {requestId}
          </span>
        </p>

        {/* Lane 1 BPMN Patient App Lifecycle Tracker */}
        <div className="mt-6 border-4 border-blue-600 bg-blue-50/60 p-4 rounded-lg text-left space-y-3">
          <div className="flex items-center justify-between border-b border-blue-200 pb-2">
            <span className="font-display text-sm tracking-wide text-blue-900">
              📱 Patient App Workflow (Swimlane 1)
            </span>
            <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase animate-pulse">
              Live Channel Open
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="rounded border-2 border-emerald-600 bg-emerald-100 p-2 font-bold text-emerald-900">
              <span className="block text-[10px] text-emerald-700">Step 1</span>
              ✓ Request Submitted
            </div>
            <div className="rounded border-2 border-amber-500 bg-amber-100 p-2 font-bold text-amber-900 animate-pulse">
              <span className="block text-[10px] text-amber-700">Step 2</span>
              ⚡ Central Dispatch Matching
            </div>
            <div className="rounded border-2 border-slate-300 bg-white p-2 text-slate-500">
              <span className="block text-[10px] text-slate-400">Step 3</span>
              Track Ambulance
            </div>
            <div className="rounded border-2 border-slate-300 bg-white p-2 text-slate-500">
              <span className="block text-[10px] text-slate-400">Step 4</span>
              Trip Completed
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('simulation')}
            className="comic-button-primary px-5 py-2.5 text-base flex items-center gap-2"
          >
            <Zap className="h-5 w-5" /> Track in BPMN Simulation Demo
          </button>
          <button
            type="button"
            onClick={() => onNavigate('dispatch')}
            className="comic-button-yellow px-5 py-2.5 text-base flex items-center gap-2"
          >
            <LayoutDashboard className="h-5 w-5" /> View Dispatch Console
          </button>
          <button
            type="button"
            onClick={onNewRequest}
            className="comic-button-ghost px-5 py-2.5 text-base flex items-center gap-2"
          >
            <RotateCcw className="h-5 w-5" /> New Request
          </button>
        </div>
      </div>
    </div>
  );
}
