import { useState } from 'react';
import ActivityLog from '@/components/dispatch/ActivityLog';
import AmbulanceFleet from '@/components/dispatch/AmbulanceFleet';
import AssignmentPanel from '@/components/dispatch/AssignmentPanel';
import AutomationControls from '@/components/dispatch/AutomationControls';
import KpiCards from '@/components/dispatch/KpiCards';
import RequestTable from '@/components/dispatch/RequestTable';
import type { Ambulance, AmbulanceRequest, DispatchEvent } from '@/types';

interface DispatchPageProps {
  loaded: boolean;
  loadError: string | null;
  saveError: string | null;
  onRetry: () => void;
  requests: AmbulanceRequest[];
  ambulances: Ambulance[];
  events: DispatchEvent[];
  autoDispatch: boolean;
  onAutoDispatchChange: (enabled: boolean) => void;
  feedEnabled: boolean;
  feedFinished: boolean;
  onFeedEnabledChange: (enabled: boolean) => void;
  onAssign: (requestId: string, ambulanceId: string) => void;
  onDecline: (requestId: string, reason: string) => void;
}

export default function DispatchPage({
  loaded,
  loadError,
  saveError,
  onRetry,
  requests,
  ambulances,
  events,
  autoDispatch,
  onAutoDispatchChange,
  feedEnabled,
  feedFinished,
  onFeedEnabledChange,
  onAssign,
  onDecline,
}: DispatchPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = requests.find((r) => r.id === selectedId) ?? requests[0];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-lg tracking-wider text-comic-red">Dispatch console</p>
          <h1 className="mt-1 text-5xl text-ink sm:text-6xl">Coordination centre</h1>
        </div>
        <p className="comic-tag bg-comic-yellow px-3 py-1.5 text-sm">Simulation - sample data only</p>
      </header>

      <AutomationControls
        autoDispatch={autoDispatch}
        onAutoDispatchChange={onAutoDispatchChange}
        feedEnabled={feedEnabled}
        feedFinished={feedFinished}
        onFeedEnabledChange={onFeedEnabledChange}
        loadError={loadError}
        saveError={saveError}
        onRetry={onRetry}
      />

      {!loaded && !loadError ? (
        <p className="comic-panel p-8 text-center font-display text-2xl tracking-wide">Loading dispatch data...</p>
      ) : (
        <>
          <KpiCards requests={requests} ambulances={ambulances} />

          <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <div className="space-y-3">
              <h2 className="text-3xl text-ink">Request queue</h2>
              <RequestTable
                requests={requests}
                ambulances={ambulances}
                selectedId={selected?.id ?? null}
                onSelect={setSelectedId}
              />
            </div>
            <AssignmentPanel
              request={selected}
              ambulances={ambulances}
              autoDispatch={autoDispatch}
              onAssign={onAssign}
              onDecline={onDecline}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
            <AmbulanceFleet ambulances={ambulances} />
            <ActivityLog events={events} />
          </div>
        </>
      )}
    </div>
  );
}
