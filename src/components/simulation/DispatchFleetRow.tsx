import {
  Activity,
  AlertCircle,
  Ambulance,
  Compass,
  Gauge,
  MapPin,
  Navigation,
  Radio,
  Zap,
} from 'lucide-react';
import { calculateDistanceKm, getCoordinatesForArea } from '@/data/locations';
import type { Ambulance as AmbulanceType, AmbulanceRequest } from '@/types';

interface DispatchFleetRowProps {
  ambulances: AmbulanceType[];
  activeRequest?: AmbulanceRequest;
  onAssignAmbulance?: (ambulanceId: string) => void;
}

export default function DispatchFleetRow({
  ambulances,
  activeRequest,
  onAssignAmbulance,
}: DispatchFleetRowProps) {
  // Show up to 6 ambulances in one row
  const fleet6 = ambulances.slice(0, 6);

  const pickupCoords =
    activeRequest?.pickupCoords ||
    (activeRequest?.pickupArea
      ? getCoordinatesForArea(activeRequest.pickupArea)
      : { lat: 12.9352, lng: 77.6245 });

  return (
    <div className="space-y-3">
      {/* Header bar for the Fleet POV */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center border-2 border-ink bg-amber-500 text-white font-display text-sm shadow-xs">
            <Radio className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-xl tracking-wide text-ink">
              Central Dispatch Fleet (6 Ambulances In-Cab POV)
            </h3>
            <p className="text-xs text-ink/70">
              Live in-cab driver status across Bangalore sectors. Showing real-time distance from{' '}
              <strong>{activeRequest?.pickupArea || 'Incident Area'}</strong>.
            </p>
          </div>
        </div>

        <span className="comic-tag bg-comic-yellow text-xs font-bold">
          {fleet6.filter((a) => a.status === 'available').length} Units Standby • 1 Assigned
        </span>
      </div>

      {/* 6 Ambulances in ONE ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {fleet6.map((amb, index) => {
          const isAssigned = activeRequest?.ambulanceId === amb.id;
          const ambCoords = amb.coords || getCoordinatesForArea(amb.area);
          const distanceKm = calculateDistanceKm(ambCoords, pickupCoords);
          const isOutOfService = amb.status === 'out_of_service';

          // Determine driver POV action based on request stage
          let driverActionText = 'Standby at base station';
          let driverStatusColor = 'bg-slate-100 text-slate-700';

          if (isAssigned) {
            if (activeRequest?.status === 'assigned') {
              driverActionText = '🚨 Alert Received! Awaiting Accept';
              driverStatusColor = 'bg-amber-100 text-amber-900 animate-pulse';
            } else if (activeRequest?.status === 'accepted' || activeRequest?.status === 'en_route') {
              driverActionText = '🧭 GPS Nav: Driving to patient';
              driverStatusColor = 'bg-sky-100 text-sky-900 font-bold';
            } else if (activeRequest?.status === 'on_scene') {
              driverActionText = '🏥 Patient Picked Up: To Hospital';
              driverStatusColor = 'bg-rose-100 text-rose-900 font-bold';
            } else if (activeRequest?.status === 'completed') {
              driverActionText = '✓ Handover complete, clearing';
              driverStatusColor = 'bg-emerald-100 text-emerald-900';
            }
          } else if (isOutOfService) {
            driverActionText = 'Offline / Scheduled service';
            driverStatusColor = 'bg-red-50 text-red-700';
          }

          return (
            <div
              key={amb.id}
              className={`relative flex flex-col justify-between rounded-xl border-3 transition-all duration-300 p-2.5 ${
                isAssigned
                  ? 'border-4 border-ink bg-amber-50 shadow-panel ring-4 ring-amber-400 scale-[1.02] z-10'
                  : isOutOfService
                  ? 'border-2 border-slate-300 bg-slate-50 opacity-60'
                  : 'border-2 border-ink bg-white shadow-xs hover:border-ink hover:shadow-panel-sm'
              }`}
            >
              {/* Unit Tag Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-extrabold text-ink/75">
                    Unit #{index + 1}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase ${
                      amb.category === 'ALS'
                        ? 'bg-rose-600 text-white'
                        : amb.category === 'BLS'
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {amb.category}
                  </span>
                </div>

                {/* Registration & Operator */}
                <p className="mt-1 font-display text-sm leading-tight text-ink truncate">
                  {amb.registration}
                </p>
                <p className="truncate text-[10px] text-ink/65">{amb.operator}</p>

                {/* Base Area */}
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-ink/70">
                  <MapPin className="h-3 w-3 shrink-0 text-comic-red" />
                  <span className="truncate font-semibold">{amb.area}</span>
                </div>
              </div>

              {/* In-Cab Driver Mini-Screen (POV) */}
              <div className="mt-2.5 rounded-lg border-2 border-ink bg-black p-2 text-white">
                <div className="flex items-center justify-between text-[9px] font-mono text-emerald-400">
                  <span className="flex items-center gap-1">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isAssigned
                          ? 'bg-amber-400 animate-ping'
                          : isOutOfService
                          ? 'bg-red-500'
                          : 'bg-emerald-400'
                      }`}
                    />
                    {isAssigned ? 'ACTIVE CAB' : amb.status.toUpperCase()}
                  </span>
                  <span className="text-comic-yellow">{distanceKm} km</span>
                </div>

                {/* Live Telemetry Speed & Heading */}
                <div className="mt-1 flex items-center justify-between border-t border-white/20 pt-1 text-[10px]">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Gauge className="h-3 w-3 text-sky-400" />
                    <strong>{isAssigned && amb.speed ? `${amb.speed} km/h` : '0 km/h'}</strong>
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">
                    {isAssigned ? `ETA: ${activeRequest?.etaMinutes ?? 4}m` : 'STANDBY'}
                  </span>
                </div>
              </div>

              {/* Driver Action Banner */}
              <div
                className={`mt-2 rounded p-1.5 text-center text-[10px] font-bold leading-tight ${driverStatusColor}`}
              >
                {driverActionText}
              </div>

              {/* Assigned Badge or Quick Assign Button */}
              {isAssigned ? (
                <div className="mt-2 rounded bg-amber-500 py-1 text-center font-display text-[11px] tracking-wider text-black">
                  ★ ASSIGNED UNIT
                </div>
              ) : (
                activeRequest?.status === 'pending' &&
                !isOutOfService &&
                onAssignAmbulance && (
                  <button
                    type="button"
                    onClick={() => onAssignAmbulance(amb.id)}
                    className="mt-2 w-full rounded border border-ink bg-white py-1 text-[10px] font-bold text-ink hover:bg-comic-yellow"
                  >
                    Assign This Unit
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
