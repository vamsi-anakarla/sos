import { useState } from 'react';
import { AlertTriangle, MapPin, UserRound } from 'lucide-react';
import StageTrack from '@/components/dispatch/StageTrack';
import StatusBadge from '@/components/dispatch/StatusBadge';
import { DECLINE_REASONS } from '@/lib/dispatch';
import { rankCandidates } from '@/lib/matching';
import type { Ambulance, AmbulanceRequest } from '@/types';

interface AssignmentPanelProps {
  request: AmbulanceRequest | undefined;
  ambulances: Ambulance[];
  autoDispatch: boolean;
  onAssign: (requestId: string, ambulanceId: string) => void;
  onDecline: (requestId: string, reason: string) => void;
}

export default function AssignmentPanel({
  request,
  ambulances,
  autoDispatch,
  onAssign,
  onDecline,
}: AssignmentPanelProps) {
  if (!request) {
    return (
      <aside className="comic-panel-dark flex min-h-[320px] items-center justify-center p-6 text-center">
        <p className="font-display text-2xl tracking-wide text-comic-yellow">
          Select a request to see its trip progress.
        </p>
      </aside>
    );
  }

  return (
    <RequestDetail
      key={request.id}
      request={request}
      ambulances={ambulances}
      autoDispatch={autoDispatch}
      onAssign={onAssign}
      onDecline={onDecline}
    />
  );
}

function RequestDetail({
  request,
  ambulances,
  autoDispatch,
  onAssign,
  onDecline,
}: AssignmentPanelProps & { request: AmbulanceRequest }) {
  const [declineReason, setDeclineReason] = useState<string>(DECLINE_REASONS[0]);
  const assigned = ambulances.find((a) => a.id === request.ambulanceId);
  const candidates = rankCandidates(ambulances, request);

  return (
    <aside className="comic-panel animate-pop-in space-y-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-3xl text-ink">{request.id}</h2>
        <StatusBadge status={request.status} />
      </div>

      <StageTrack status={request.status} />

      <dl className="space-y-3 text-sm">
        <div className="flex gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <dt className="sr-only">Pickup</dt>
            <dd>
              <span className="font-bold">{request.pickupArea}</span> - {request.pickupNote}
            </dd>
          </div>
        </div>
        <div className="flex gap-2">
          <UserRound className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <dt className="sr-only">Patient</dt>
            <dd>
              {request.patientName}
              {request.patientAge !== null ? `, ${request.patientAge} yrs` : ''} - {request.patientPhone}
            </dd>
          </div>
        </div>
        <div className="border-2 border-ink bg-white p-3">
          <dt className="font-display text-base tracking-wide text-ink/70">Reported situation</dt>
          <dd className="mt-1 text-ink">{request.description}</dd>
        </div>
      </dl>

      <p className="text-xs text-ink/70">
        Needs {request.category} via {request.channel}.
        {request.aiCaptured ? ' Details were captured by AI. Confirm critical details with the caller.' : ''}
      </p>

      {request.alerts.length > 0 && (
        <div role="alert" className="space-y-2">
          {request.alerts.map((alert, index) => (
            <p
              key={`${alert}-${index}`}
              className="flex items-start gap-2 border-4 border-ink bg-comic-red p-3 text-sm font-bold text-comic-cream"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {alert}
            </p>
          ))}
        </div>
      )}

      {request.status === 'pending' && (
        <section className="space-y-3">
          <h3 className="font-display text-xl tracking-wider">
            {autoDispatch ? 'Override assignment' : 'Suitable ambulances'}
          </h3>
          {candidates.length === 0 ? (
            <p className="border-4 border-ink bg-comic-red p-3 text-sm font-bold text-comic-cream">
              No suitable ambulance is free right now. The system keeps checking and will match automatically.
            </p>
          ) : (
            <ul className="space-y-2">
              {candidates.map((ambulance, index) => (
                <li
                  key={ambulance.id}
                  className="flex items-center justify-between gap-3 border-4 border-ink bg-white p-3 shadow-panel-sm"
                >
                  <div className="min-w-0">
                    <p className="font-display text-lg tracking-wide">
                      {ambulance.registration}
                      {index === 0 && <span className="ml-2 comic-tag bg-comic-yellow">Best match</span>}
                    </p>
                    <p className="truncate text-xs text-ink/70">
                      {ambulance.category} - {ambulance.area}
                      {ambulance.area === request.pickupArea ? ' (same area)' : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAssign(request.id, ambulance.id)}
                    className="comic-button-yellow px-4 py-2 text-lg"
                  >
                    Assign
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {request.status === 'assigned' && assigned && (
        <section className="space-y-3">
          <p className="text-sm">
            <span className="font-bold">{assigned.registration}</span> ({assigned.operator}) has been alerted and
            is expected to respond automatically.
          </p>
          <details className="border-4 border-ink bg-white p-3">
            <summary className="cursor-pointer font-display text-base tracking-wide">
              Testing: simulate operator decline
            </summary>
            <div className="mt-3 flex flex-wrap gap-2">
              <select
                aria-label="Decline reason"
                className="comic-input min-w-0 flex-1 py-2 text-sm"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              >
                {DECLINE_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => onDecline(request.id, declineReason)}
                className="comic-button-ghost px-4 py-2 text-base"
              >
                Decline
              </button>
            </div>
          </details>
        </section>
      )}

      {request.status === 'completed' && (
        <p className="border-4 border-ink bg-ink p-3 font-display text-lg tracking-wide text-comic-yellow">
          Trip completed. Ambulance is available again.
        </p>
      )}
    </aside>
  );
}
