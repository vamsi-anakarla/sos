import { useState } from 'react';
import {
  AlertTriangle,
  Ambulance,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Gauge,
  HeartPulse,
  Hospital,
  MapPin,
  Navigation,
  Phone,
  Radio,
  Shield,
  Smartphone,
  Star,
  User,
  XCircle,
  Zap,
} from 'lucide-react';
import type { Ambulance as AmbulanceType, AmbulanceRequest } from '@/types';

interface DualPovScreensProps {
  request: AmbulanceRequest | undefined;
  assignedAmbulance: AmbulanceType | undefined;
  currentSimStep: number;
  onAdvanceStage?: () => void;
  onOperatorDecline?: () => void;
  onOperatorAccept?: () => void;
}

export default function DualPovScreens({
  request,
  assignedAmbulance,
  currentSimStep,
  onAdvanceStage,
  onOperatorDecline,
  onOperatorAccept,
}: DualPovScreensProps) {
  const [patientRating, setPatientRating] = useState<number>(5);

  const amb = assignedAmbulance || {
    registration: 'KA-03-DEMO-202',
    operator: 'CityMed Transport',
    category: 'ALS',
    area: 'Koramangala',
    speed: 48,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 items-start">
      {/* =================================================================== */}
      {/* 1. PATIENT MOBILE APP POV */}
      {/* =================================================================== */}
      <div className="rounded-xl border-3 border-ink bg-white p-3.5 shadow-panel space-y-2.5">
        <div className="flex items-center justify-between border-b-2 border-ink pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-white font-display text-[11px]">
              POV 1
            </span>
            <span className="font-display text-base tracking-wide text-blue-900">
              Patient Mobile App Screen
            </span>
          </div>
          <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
            {currentSimStep === 1
              ? 'Opening Emergency App'
              : currentSimStep === 2
              ? 'Detecting Live GPS'
              : currentSimStep === 3
              ? 'Sending SOS Alert'
              : currentSimStep <= 5
              ? 'Finding Nearest Ambulance'
              : currentSimStep <= 7
              ? 'Ambulance Confirmed'
              : currentSimStep === 8
              ? 'Tracking Ambulance Live'
              : currentSimStep === 9
              ? 'Ambulance Arrived'
              : currentSimStep === 10
              ? 'Driving to Hospital'
              : 'Trip Complete & Rating'}
          </span>
        </div>

        {/* Mobile Device Mockup */}
        <div className="mx-auto max-w-[320px] rounded-[28px] border-4 border-ink bg-slate-900 p-2.5 shadow-panel-sm">
          <div className="min-h-[380px] rounded-[18px] bg-slate-50 p-3 text-ink flex flex-col justify-between overflow-hidden">
            {/* Top Bar */}
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 border-b pb-1">
              <span>RapidRelay SOS App</span>
              <span className="flex items-center gap-1 text-emerald-600 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {currentSimStep >= 2 ? 'GPS LOCKED' : 'SEARCHING GPS'}
              </span>
            </div>

            {/* Step 1: Emergency Happens & Opening App */}
            {currentSimStep === 1 && (
              <div className="my-auto space-y-2.5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-panel-sm animate-pulse">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-lg text-ink">Emergency SOS App Ready</p>
                  <p className="text-[11px] text-slate-600">
                    One-tap help for road accidents, heart attacks, child emergencies & elderly falls.
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-[11px] text-blue-900 font-semibold">
                  Tap anywhere to detect your live location instantly
                </div>
              </div>
            )}

            {/* Step 2: Live GPS Location Detected */}
            {currentSimStep === 2 && (
              <div className="my-auto space-y-2.5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-panel-sm">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-lg text-emerald-900">Your Location Locked!</p>
                  <p className="text-[11px] text-slate-600">
                    Pickup: <strong>{request?.pickupArea || 'Koramangala 4th Block, Bangalore'}</strong>
                  </p>
                </div>
                <div className="rounded bg-emerald-100 p-1.5 text-[10px] font-bold text-emerald-900">
                  ✓ High-accuracy satellite GPS (±3 meters)
                </div>
              </div>
            )}

            {/* Step 3: Emergency Type Selected & SOS Sent */}
            {currentSimStep === 3 && (
              <div className="my-auto space-y-2.5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-comic-red text-white shadow-panel-sm animate-pulse">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-lg text-ink">Emergency SOS Transmitted</p>
                  <p className="text-[11px] text-slate-600">
                    Connecting live to Bangalore Emergency Control...
                  </p>
                </div>
                <div className="rounded-lg border border-slate-300 bg-white p-2 text-[11px] text-left space-y-0.5">
                  <p className="text-slate-600">Patient: <strong>{request?.patientName || 'Unknown Patient'}</strong></p>
                  <p className="text-slate-600">Emergency: <strong>{request?.serviceType || 'Road Accident / Trauma'}</strong></p>
                  <p className="text-slate-600">Care Type: <span className="rounded bg-rose-100 text-rose-800 font-bold px-1">{request?.category || 'ALS'}</span></p>
                </div>
              </div>
            )}

            {/* Steps 4 & 5: Central Dispatch scanning nearby fleet */}
            {(currentSimStep === 4 || currentSimStep === 5) && (
              <div className="my-auto space-y-2.5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white animate-spin">
                  <Clock className="h-6 w-6" />
                </div>
                <p className="font-display text-base text-amber-900">Finding Closest Ambulance</p>
                <p className="text-[11px] text-slate-600">
                  Control Room is scanning 6 ambulances nearby to assign the fastest available vehicle.
                </p>
                <div className="rounded bg-blue-50 border border-blue-200 p-1.5 text-[11px] text-blue-800 font-semibold">
                  Incident Code: {request?.id || 'RR-SOS-BANGALORE'}
                </div>
              </div>
            )}

            {/* Steps 6 & 7: Ambulance Confirmed & Driver Alerted */}
            {(currentSimStep === 6 || currentSimStep === 7) && (
              <div className="my-auto space-y-2.5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-panel-sm animate-bounce">
                  <Ambulance className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-lg text-emerald-900">Ambulance Confirmed!</p>
                  <p className="text-[11px] text-slate-600">
                    Unit <strong>{amb.registration}</strong> has been assigned to your location.
                  </p>
                </div>
                <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50 p-2 text-[11px] text-left space-y-1">
                  <p className="font-bold text-emerald-900">Unit: {amb.registration} ({amb.category})</p>
                  <p className="text-slate-700">Crew Base: {amb.area} Sector</p>
                  <p className="text-emerald-800 font-bold">Estimated Time: ~3 mins</p>
                </div>
              </div>
            )}

            {/* Step 8: Live GPS Navigation to Patient */}
            {currentSimStep === 8 && (
              <div className="my-auto space-y-2.5">
                <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-2.5 shadow-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase animate-pulse">
                      AMBULANCE ON THE WAY
                    </span>
                    <span className="font-bold text-emerald-800">
                      ETA: ~{request?.etaMinutes ?? 3} mins
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0">
                      <Ambulance className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-display text-sm text-ink">{amb.registration}</p>
                      <p className="text-[10px] text-slate-600">{amb.operator} • {amb.category}</p>
                    </div>
                  </div>

                  <div className="mt-2 border-t border-emerald-200 pt-1.5 flex justify-between text-[10px] text-slate-700">
                    <span>Distance: <strong>{request?.distanceKm ?? 1.4} km</strong></span>
                    <span>Speed: <strong>{amb.speed ?? 48} km/h</strong></span>
                  </div>
                </div>

                <div className="rounded border border-slate-200 bg-white p-2 text-[11px]">
                  <p className="font-bold text-slate-700 flex items-center gap-1">
                    <Hospital className="h-3 w-3 text-comic-red" /> Target Hospital:
                  </p>
                  <p className="font-semibold text-ink truncate">{request?.hospital?.name || 'Manipal Trauma Hospital'}</p>
                </div>

                <div className="flex items-center justify-center gap-1.5 rounded bg-ink py-1.5 text-[11px] font-bold text-white">
                  <Phone className="h-3 w-3" /> Call Driver ({amb.registration})
                </div>
              </div>
            )}

            {/* Step 9: Ambulance Arrived on Scene */}
            {currentSimStep === 9 && (
              <div className="my-auto space-y-2.5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 border-2 border-emerald-600 text-emerald-700">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
                <p className="font-display text-lg text-emerald-900">Ambulance Arrived!</p>
                <p className="text-[11px] text-slate-600">
                  {amb.registration} has arrived at your spot. Paramedics are at your door.
                </p>
                <div className="rounded bg-emerald-50 p-2 text-[10px] font-bold text-emerald-800">
                  ✓ Paramedic check & stretcher loading in progress
                </div>
              </div>
            )}

            {/* Step 10: Rushing to Hospital */}
            {currentSimStep === 10 && (
              <div className="my-auto space-y-2.5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white animate-pulse">
                  <Hospital className="h-6 w-6" />
                </div>
                <p className="font-display text-lg text-rose-950">Rushing to Emergency Hospital</p>
                <p className="text-[11px] text-slate-600">
                  Patient is safely onboard and under medical care en route to {request?.hospital?.name || 'Manipal Hospital'}.
                </p>
                <div className="rounded bg-rose-50 p-2 text-[10px] font-bold text-rose-900 border border-rose-200">
                  Pre-alert sent to Emergency Room doctors
                </div>
              </div>
            )}

            {/* Step 11: Trip Complete & Rating */}
            {currentSimStep >= 11 && (
              <div className="my-auto space-y-2 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-5 w-5 stroke-[3]" />
                </div>
                <p className="font-display text-lg text-ink">Trip Completed Safely</p>
                <p className="text-[10px] text-slate-600">
                  Delivered to <strong>{request?.hospital?.name || 'Emergency Room'}</strong>.
                </p>

                <div className="rounded-lg border border-slate-200 bg-white p-2 space-y-1.5">
                  <p className="text-[11px] font-bold text-ink">How was our emergency response?</p>
                  <div className="flex justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setPatientRating(star)}
                        className="text-amber-400 p-0.5"
                      >
                        <Star className={`h-4 w-4 ${star <= patientRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                  <div className="rounded bg-emerald-100 p-1 text-[9px] font-bold text-emerald-800">
                    5★ Review Submitted - Patient in Good Care
                  </div>
                </div>
              </div>
            )}

            {/* Phone Footer */}
            <div className="border-t pt-1 text-center text-[9px] text-slate-400">
              Encrypted Medical Dispatch Channel
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. AMBULANCE OPERATOR IN-CAB TERMINAL POV */}
      {/* =================================================================== */}
      <div className="rounded-xl border-3 border-ink bg-white p-3.5 shadow-panel space-y-2.5">
        <div className="flex items-center justify-between border-b-2 border-ink pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-600 text-white font-display text-[11px]">
              POV 2
            </span>
            <span className="font-display text-base tracking-wide text-emerald-900">
              Ambulance Driver In-Cab Screen
            </span>
          </div>
          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
            {amb.registration} ({amb.category})
          </span>
        </div>

        {/* In-Cab Terminal Mockup */}
        <div className="mx-auto max-w-[320px] rounded-[28px] border-4 border-ink bg-emerald-950 p-2.5 shadow-panel-sm">
          <div className="min-h-[380px] rounded-[18px] bg-slate-900 p-3 text-white flex flex-col justify-between overflow-hidden">
            {/* Cab Status Bar */}
            <div className="flex items-center justify-between text-[10px] font-bold text-emerald-300 border-b border-emerald-800/60 pb-1">
              <span>IN-CAB TERMINAL • DRIVER SCREEN</span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE TELEMETRY
              </span>
            </div>

            {/* Steps 1-5: Driver on Standby at Base */}
            {currentSimStep <= 5 && (
              <div className="my-auto space-y-2.5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/60 border border-emerald-600 text-emerald-400">
                  <Ambulance className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-lg text-comic-yellow">Shift Active • On Standby</p>
                  <p className="text-[11px] text-emerald-200 mt-0.5">Station: {amb.area} Base • Ready for Dispatch</p>
                </div>
                <div className="rounded bg-emerald-900/40 border border-emerald-700/60 p-1.5 text-[10px] text-emerald-300 font-mono">
                  GPS Beacon Active • Vehicle Inspection Passed
                </div>
              </div>
            )}

            {/* Steps 6 & 7: Incoming Alert Ringing & Driver Action */}
            {(currentSimStep === 6 || currentSimStep === 7) && (
              <div className="my-auto space-y-2 rounded-xl border-2 border-amber-400 bg-amber-950/90 p-2.5 text-center shadow-lg animate-wiggle">
                <Bell className="mx-auto h-7 w-7 text-amber-400 animate-bounce" />
                <p className="font-display text-base text-comic-yellow">EMERGENCY CALL ALERT</p>
                <div className="rounded bg-black/60 p-2 text-left text-[11px] space-y-0.5">
                  <p><strong>Pickup:</strong> {request?.pickupArea || 'Koramangala 4th Block'}</p>
                  <p><strong>Emergency:</strong> {request?.serviceType || 'Road Accident'}</p>
                  <p><strong>Distance:</strong> {request?.distanceKm ?? 1.4} km (Est: {request?.etaMinutes ?? 3}m)</p>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onOperatorAccept}
                    className="flex-1 rounded bg-emerald-500 py-1.5 font-display text-xs tracking-wider text-black shadow-md hover:bg-emerald-400"
                  >
                    ✓ ACCEPT CALL
                  </button>
                  <button
                    type="button"
                    onClick={onOperatorDecline}
                    className="flex-1 rounded bg-red-600 py-1.5 font-display text-xs tracking-wider text-white shadow-md hover:bg-red-500"
                  >
                    ✕ DECLINE
                  </button>
                </div>
              </div>
            )}

            {/* Step 8: Driving to Patient */}
            {currentSimStep === 8 && (
              <div className="my-auto space-y-2.5">
                <div className="rounded border border-sky-500 bg-black/60 p-2.5">
                  <p className="text-[9px] font-bold text-sky-400 flex items-center gap-1">
                    <Navigation className="h-3 w-3" /> GPS NAVIGATION TO PATIENT
                  </p>
                  <p className="mt-0.5 font-display text-sm text-white">{request?.pickupArea || 'Koramangala 4th Block'}</p>
                  <p className="text-[10px] text-slate-300 truncate">Near 80ft Road Junction</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded bg-black/40 p-1.5 border border-slate-700">
                    <p className="text-slate-400 text-[9px]">Live Speed</p>
                    <p className="font-display text-base text-emerald-400">48 km/h</p>
                  </div>
                  <div className="rounded bg-black/40 p-1.5 border border-slate-700">
                    <p className="text-slate-400 text-[9px]">Distance</p>
                    <p className="font-display text-base text-comic-yellow">1.4 km</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onAdvanceStage}
                  className="w-full rounded bg-sky-500 py-1.5 font-display text-xs text-black shadow-md hover:bg-sky-400"
                >
                  MARK ARRIVED AT PATIENT
                </button>
              </div>
            )}

            {/* Step 9: At Scene & Patient Stretcher Boarding */}
            {currentSimStep === 9 && (
              <div className="my-auto space-y-2.5">
                <div className="rounded border border-emerald-500 bg-emerald-950/60 p-2.5 text-center">
                  <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-400" />
                  <p className="mt-1 font-display text-sm text-white">Arrived at Patient</p>
                  <p className="text-[10px] text-emerald-200">Paramedics providing stabilization & loading stretcher.</p>
                </div>

                <button
                  type="button"
                  onClick={onAdvanceStage}
                  className="w-full rounded bg-emerald-500 py-2 font-display text-xs text-black shadow-md hover:bg-emerald-400"
                >
                  PATIENT BOARDED → TO HOSPITAL
                </button>
              </div>
            )}

            {/* Step 10: Driving to Trauma Center */}
            {currentSimStep === 10 && (
              <div className="my-auto space-y-2.5">
                <div className="rounded border border-rose-500 bg-black/60 p-2.5">
                  <p className="text-[9px] font-bold text-rose-400 flex items-center gap-1">
                    <Hospital className="h-3 w-3" /> SIRENS ON → TO TRAUMA HOSPITAL
                  </p>
                  <p className="mt-0.5 font-display text-sm text-white truncate">{request?.hospital?.name || 'Manipal Hospital'}</p>
                  <p className="text-[10px] text-slate-300">Level 1 Emergency Trauma Ward</p>
                </div>

                <button
                  type="button"
                  onClick={onAdvanceStage}
                  className="w-full rounded bg-rose-600 py-2 font-display text-xs text-white shadow-md hover:bg-rose-500"
                >
                  DELIVERED TO EMERGENCY ROOM
                </button>
              </div>
            )}

            {/* Step 11: Handover Done & Available */}
            {currentSimStep >= 11 && (
              <div className="my-auto space-y-2.5">
                <div className="rounded border border-emerald-500 bg-black/60 p-2.5 text-center">
                  <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-400" />
                  <p className="mt-0.5 font-display text-sm text-white truncate">Hospital Handover Complete</p>
                  <p className="text-[10px] text-slate-300">Doctors have assumed care of patient.</p>
                </div>

                <div className="rounded bg-emerald-900/60 border border-emerald-600 p-1.5 text-center text-[11px] text-emerald-300 font-bold">
                  ✓ Ready for Next Emergency Call
                </div>
              </div>
            )}

            {/* In-Cab Footer */}
            <div className="border-t border-emerald-800/60 pt-1 text-center text-[9px] text-emerald-400">
              RapidRelay In-Cab MDT Navigation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
