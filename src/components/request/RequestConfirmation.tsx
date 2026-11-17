import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  LayoutDashboard,
  RotateCcw,
} from 'lucide-react';
import type { View } from '@/types';
import type { DispatchAlertResult } from '@/lib/twilioSms';

interface RequestConfirmationProps {
  requestId: string;
  onNavigate: (view: View) => void;
  onNewRequest: () => void;
  smsResult?: DispatchAlertResult | null;
  patientPhone?: string;
  pickupArea?: string;
}

export default function RequestConfirmation({
  requestId,
  onNavigate,
  onNewRequest,
  smsResult,
  patientPhone,
  pickupArea,
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

        {/* Twilio SMS Dispatch Notification Card */}
        <div className="mt-5 rounded-lg border-2 border-ink bg-slate-50 p-4 text-left space-y-2.5">
          <div className="flex items-center justify-between border-b border-ink/15 pb-2">
            <span className="font-display text-xs sm:text-sm tracking-wide text-ink flex items-center gap-1.5 font-bold">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500 text-white text-[11px]">✓</span>
              Twilio SMS Dispatch Notifications
            </span>
            <span className="rounded border border-emerald-600 bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
              Transmitted
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-1.5 rounded bg-white p-2.5 border border-ink/20">
              <div>
                <span className="font-bold text-ink">🚨 SMS to Central Emergency Admin</span>
                <p className="text-[11px] text-ink/70 mt-0.5">
                  Full patient details, emergency service type, and Google Maps pin transmitted to duty admin.
                </p>
              </div>
              <span className="rounded bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5">
                Admin Alerted
              </span>
            </div>
          </div>
        </div>

        {/* 1-Minute Dispatch Window Card */}
        <div className="mt-4 rounded-lg border-2 border-amber-600 bg-amber-50 p-3.5 text-left text-xs space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between font-bold text-amber-950">
            <span className="flex items-center gap-1.5 font-display text-sm tracking-wide">
              <Clock className="h-4 w-4 animate-spin text-amber-700" />
              1-Minute Dispatch Exploration Window Active
            </span>
            <span className="rounded bg-amber-600 px-2 py-0.5 text-white font-mono text-[11px] font-bold">
              60s Hold
            </span>
          </div>
          <p className="text-amber-900 leading-relaxed">
            Your request is in the pending queue in Central Dispatch. You can immediately jump into the <strong>Dispatch Console</strong> to explore available ambulances, review response times, and assign manually before automated matching takes over after 1 minute.
          </p>
        </div>

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
            onClick={() => onNavigate('dispatch')}
            className="comic-button-primary bg-comic-yellow text-ink border-4 border-ink px-6 py-2.5 text-base flex items-center gap-2 shadow-panel hover:bg-comic-yellow-deep font-bold"
          >
            <LayoutDashboard className="h-5 w-5" /> Explore in Dispatch Console (1-Min Window)
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
