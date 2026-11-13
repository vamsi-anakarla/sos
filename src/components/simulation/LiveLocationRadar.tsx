import { useState } from 'react';
import {
  AlertCircle,
  Ambulance,
  Compass,
  Crosshair,
  Gauge,
  Hospital as HospitalIcon,
  MapPin,
  Navigation,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  BENGALURU_LOCATIONS,
  BENGALURU_HOSPITALS,
  calculateDistanceKm,
} from '@/data/locations';
import type { Ambulance as AmbulanceType, AmbulanceRequest, GeoPoint } from '@/types';

interface LiveLocationRadarProps {
  ambulances: AmbulanceType[];
  requests: AmbulanceRequest[];
  selectedRequest?: AmbulanceRequest;
  onSelectRequest?: (req: AmbulanceRequest) => void;
}

export default function LiveLocationRadar({
  ambulances,
  requests,
  selectedRequest,
  onSelectRequest,
}: LiveLocationRadarProps) {
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string | null>(null);

  const activeRequest = selectedRequest ?? requests.find((r) => r.status !== 'completed') ?? requests[0];
  const assignedAmbulance = ambulances.find((a) => a.id === activeRequest?.ambulanceId);
  const focusedAmbulance = ambulances.find((a) => a.id === selectedAmbulanceId) ?? assignedAmbulance ?? ambulances[0];

  // Map coordinate bounds for Bengaluru
  // Lat: 12.82 (South) to 13.08 (North)
  // Lng: 77.52 (West) to 77.78 (East)
  const MIN_LAT = 12.82;
  const MAX_LAT = 13.08;
  const MIN_LNG = 77.52;
  const MAX_LNG = 77.78;

  // Convert GPS (lat, lng) to SVG percentage (0 - 100)
  const geoToSvg = (point: GeoPoint) => {
    const x = ((point.lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;
    // Invert Y because SVG y=0 is at top (North)
    const y = ((MAX_LAT - point.lat) / (MAX_LAT - MIN_LAT)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  };

  const pickupPoint = activeRequest?.pickupCoords ?? BENGALURU_LOCATIONS['Koramangala'].coords;
  const hospitalPoint = activeRequest?.hospital?.coords ?? BENGALURU_HOSPITALS[0].coords;
  const ambulancePoint = assignedAmbulance?.coords ?? focusedAmbulance?.coords ?? BENGALURU_LOCATIONS['Jayanagar'].coords;

  const pickupSvg = geoToSvg(pickupPoint);
  const hospitalSvg = geoToSvg(hospitalPoint);
  const ambulanceSvg = geoToSvg(ambulancePoint);

  return (
    <div className="comic-panel overflow-hidden bg-ink-soft p-5 text-comic-cream">
      {/* Radar HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center border-2 border-white bg-comic-red font-display text-sm text-white">
              <Crosshair className="h-4 w-4" />
            </span>
            <h3 className="font-display text-2xl tracking-wider text-comic-yellow">
              Bengaluru Emergency Geo-Radar
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-comic-cream/70">
            Real-time automated GPS fleet tracking • Live route telemetry • Traffic-aware ETA calculation
          </p>
        </div>

        {/* Telemetry Status Readout */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 border-2 border-white/20 bg-black/40 px-3 py-1 font-mono">
            <Gauge className="h-3.5 w-3.5 text-comic-yellow" />
            <span>Speed: <strong>{focusedAmbulance?.speed ?? 38} km/h</strong></span>
          </div>
          <div className="flex items-center gap-1.5 border-2 border-white/20 bg-black/40 px-3 py-1 font-mono">
            <Navigation className="h-3.5 w-3.5 text-emerald-400" />
            <span>
              ETA: <strong>{activeRequest?.etaMinutes ?? 4} min</strong> (
              {activeRequest?.distanceKm ?? 1.8} km)
            </span>
          </div>
          <div className="flex items-center gap-1.5 border-2 border-white/20 bg-black/40 px-3 py-1 font-mono text-comic-yellow">
            <Zap className="h-3.5 w-3.5 animate-pulse" />
            <span>GPS: <strong>AUTOMATED BEACON</strong></span>
          </div>
        </div>
      </div>

      {/* Main Vector Map Display */}
      <div className="relative mt-4 aspect-[16/10] sm:aspect-[16/9] w-full rounded-md border-4 border-ink bg-[#141d26] overflow-hidden shadow-inner">
        {/* Radar concentric circular sweeps & grid backdrop */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        {/* Radar Scanner Sweep Animation */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-full w-full rounded-full border border-sky-500/20 opacity-30 animate-ping"></div>
        </div>

        {/* SVG Route lines & markers */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Active Navigation Route: Ambulance -> Patient Pickup */}
          {activeRequest && (
            <>
              {/* Outer Glow */}
              <line
                x1={ambulanceSvg.x}
                y1={ambulanceSvg.y}
                x2={pickupSvg.x}
                y2={pickupSvg.y}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="2,2"
                strokeOpacity="0.4"
                filter="url(#glow)"
              />
              {/* Animated Inner Dash Line */}
              <line
                x1={ambulanceSvg.x}
                y1={ambulanceSvg.y}
                x2={pickupSvg.x}
                y2={pickupSvg.y}
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="2,1.5"
                className="animate-pulse"
              />

              {/* Transit Route: Patient Pickup -> Destination Hospital */}
              <line
                x1={pickupSvg.x}
                y1={pickupSvg.y}
                x2={hospitalSvg.x}
                y2={hospitalSvg.y}
                stroke="#f43f5e"
                strokeWidth="1.2"
                strokeDasharray="1.5,1.5"
                strokeOpacity="0.7"
              />
            </>
          )}

          {/* Sector zones / City landmarks */}
          {Object.entries(BENGALURU_LOCATIONS).map(([name, data]) => {
            const pos = geoToSvg(data.coords);
            return (
              <g key={name} className="opacity-40">
                <circle cx={pos.x} cy={pos.y} r="1" fill="#94a3b8" />
                <text
                  x={pos.x + 1.5}
                  y={pos.y + 0.8}
                  fill="#94a3b8"
                  fontSize="2.4"
                  fontWeight="600"
                  fontFamily="Rubik, sans-serif"
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* HTML Markers overlay for sharp icons & badges */}

        {/* 1. Hospitals (Red Cross pins) */}
        {BENGALURU_HOSPITALS.map((hosp) => {
          const pos = geoToSvg(hosp.coords);
          const isTarget = activeRequest?.hospital?.id === hosp.id;
          return (
            <div
              key={hosp.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              title={`${hosp.name} (${hosp.traumaLevel})`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-md border-2 border-ink shadow-md transition-transform hover:scale-125 ${
                  isTarget ? 'bg-rose-600 ring-2 ring-rose-400 animate-pulse' : 'bg-rose-950/80'
                }`}
              >
                <HospitalIcon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="pointer-events-none absolute left-7 top-0 whitespace-nowrap rounded border border-white/20 bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {hosp.name}
              </span>
            </div>
          );
        })}

        {/* 2. Patient Pickup SOS Pin (Pulsing Red Beacon) */}
        {activeRequest && (
          <div
            style={{ left: `${pickupSvg.x}%`, top: `${pickupSvg.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer"
          >
            {/* Pulse beacon rings */}
            <span className="absolute -inset-2.5 rounded-full bg-red-500 opacity-40 animate-ping"></span>
            <span className="absolute -inset-1 rounded-full bg-red-400 opacity-60"></span>

            <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-comic-red shadow-panel-sm">
              <MapPin className="h-5 w-5 text-comic-yellow" />
            </div>

            {/* Popup Tag */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-ink bg-comic-yellow px-2 py-0.5 text-[10px] font-bold text-ink shadow-sm">
              SOS: {activeRequest.pickupArea} ({activeRequest.patientName})
            </div>
          </div>
        )}

        {/* 3. Ambulance Fleet (Moving units) */}
        {ambulances.map((amb) => {
          const ambCoords = amb.coords ?? BENGALURU_LOCATIONS[amb.area]?.coords ?? { lat: 12.97, lng: 77.59 };
          const pos = geoToSvg(ambCoords);
          const isAssigned = activeRequest?.ambulanceId === amb.id;
          const isSelected = selectedAmbulanceId === amb.id;

          const statusColor =
            amb.status === 'available'
              ? 'bg-emerald-500 border-emerald-900'
              : amb.status === 'busy'
              ? 'bg-amber-500 border-amber-950 ring-2 ring-amber-300'
              : 'bg-slate-600 border-slate-900 opacity-50';

          return (
            <div
              key={amb.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => setSelectedAmbulanceId(amb.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-30 cursor-pointer transition-all duration-1000 ease-linear"
            >
              <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-ink shadow-panel-sm transition-transform hover:scale-125 ${statusColor} ${
                  isAssigned ? 'scale-110 ring-4 ring-sky-400' : ''
                }`}
              >
                <Ambulance className="h-4 w-4 text-white" strokeWidth={2.5} />
                {isAssigned && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-comic-red text-[8px] font-bold text-white">
                    !
                  </span>
                )}
              </div>

              {/* Driver tag */}
              <div className="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-white/20 bg-black/90 px-1.5 py-0.5 text-[9px] font-bold text-comic-cream">
                {amb.registration} ({amb.category})
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Unit Information Drawer */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs">
        <div className="border-2 border-white/20 bg-black/30 p-3 rounded">
          <p className="font-display text-sm tracking-wide text-comic-yellow">Selected Unit</p>
          <p className="mt-1 font-bold text-sm text-white">
            {focusedAmbulance?.registration} ({focusedAmbulance?.category})
          </p>
          <p className="text-comic-cream/70">Operator: {focusedAmbulance?.operator}</p>
          <p className="text-comic-cream/70">Base Sector: {focusedAmbulance?.area}</p>
        </div>

        <div className="border-2 border-white/20 bg-black/30 p-3 rounded">
          <p className="font-display text-sm tracking-wide text-comic-yellow">Emergency Destination</p>
          <p className="mt-1 font-bold text-sm text-white">
            {activeRequest?.hospital?.name ?? BENGALURU_HOSPITALS[0].name}
          </p>
          <p className="text-comic-cream/70">
            Capability: {activeRequest?.hospital?.traumaLevel ?? 'Level 1 Trauma Care'}
          </p>
          <p className="text-comic-cream/70">Emergency Hotline: {activeRequest?.hospital?.phone ?? '112'}</p>
        </div>

        <div className="border-2 border-white/20 bg-black/30 p-3 rounded">
          <p className="font-display text-sm tracking-wide text-comic-yellow">Automated Dispatch Status</p>
          <p className="mt-1 font-bold text-sm text-emerald-400">
            {activeRequest ? `Active for ${activeRequest.id}` : 'All Units on Standby'}
          </p>
          <p className="text-comic-cream/70">
            Auto-calculated ETA: <strong>{activeRequest?.etaMinutes ?? 4} min</strong>
          </p>
          <p className="text-comic-cream/70">
            Current Stage: <span className="font-bold text-comic-yellow">{activeRequest?.status ?? 'Standby'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
