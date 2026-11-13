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
  FileText,
  Hospital,
  MapPin,
  Navigation,
  Phone,
  Send,
  Shield,
  Smartphone,
  Star,
  User,
  XCircle,
  Zap,
} from 'lucide-react';
import { calculateDistanceKm } from '@/data/locations';
import type { Ambulance as AmbulanceType, AmbulanceRequest } from '@/types';

interface ActorViewsProps {
  request: AmbulanceRequest | undefined;
  ambulances: AmbulanceType[];
  onAssign?: (requestId: string, ambulanceId: string) => void;
  onOperatorAccept?: (requestId: string) => void;
  onOperatorDecline?: (requestId: string, reason: string) => void;
  onAdvanceStage?: (requestId: string) => void;
  onSubmitFeedback?: (requestId: string, rating: number, feedback: string) => void;
}

export default function ActorViews({
  request,
  ambulances,
  onOperatorAccept,
  onOperatorDecline,
  onAdvanceStage,
  onSubmitFeedback,
}: ActorViewsProps) {
  const [activeTab, setActiveTab] = useState<'patient' | 'dispatch' | 'operator'>('patient');
  const [rating, setRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  const assignedAmbulance = ambulances.find((a) => a.id === request?.ambulanceId);

  const handleFeedbackSubmit = () => {
    if (request && onSubmitFeedback) {
      onSubmitFeedback(request.id, rating, feedbackText);
      setFeedbackSent(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Perspective Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
        <div>
          <h3 className="font-display text-2xl tracking-wide text-ink">
            Actor Experience Simulators
          </h3>
          <p className="text-xs text-ink/75">
            Switch between the 3 actors from the workflow diagram to preview their live interfaces.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('patient')}
            className={`border-2 border-ink px-3 py-1.5 font-display text-sm tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'patient'
                ? 'bg-blue-600 text-white shadow-panel-sm'
                : 'bg-white text-ink hover:bg-blue-50'
            }`}
          >
            <Smartphone className="h-4 w-4" /> 1. Patient App
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dispatch')}
            className={`border-2 border-ink px-3 py-1.5 font-display text-sm tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'dispatch'
                ? 'bg-amber-600 text-white shadow-panel-sm'
                : 'bg-white text-ink hover:bg-amber-50'
            }`}
          >
            <Zap className="h-4 w-4" /> 2. Central Dispatch
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('operator')}
            className={`border-2 border-ink px-3 py-1.5 font-display text-sm tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'operator'
                ? 'bg-emerald-600 text-white shadow-panel-sm'
                : 'bg-white text-ink hover:bg-emerald-50'
            }`}
          >
            <Ambulance className="h-4 w-4" /> 3. Ambulance App
          </button>
        </div>
      </div>

      {/* VIEW 1: PATIENT APP SIMULATOR */}
      {activeTab === 'patient' && (
        <div className="grid gap-6 md:grid-cols-[340px_1fr] items-start">
          {/* Mobile Frame Mockup */}
          <div className="mx-auto w-full max-w-[340px] rounded-[36px] border-[6px] border-ink bg-slate-900 p-3 shadow-panel">
            {/* Phone Screen */}
            <div className="relative min-h-[520px] rounded-[26px] bg-slate-50 p-4 text-ink flex flex-col justify-between overflow-hidden">
              {/* Status Bar */}
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 border-b pb-2">
                <span>10:44 PM</span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> 5G GPS LIVE
                </span>
              </div>

              {/* Patient App Header */}
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <h4 className="font-display text-xl tracking-wide text-ink">RapidRelay SOS</h4>
                  <p className="text-[10px] text-slate-500">Emergency Medical Response</p>
                </div>
                <span className="rounded-full bg-blue-100 p-2 text-blue-700">
                  <Shield className="h-4 w-4" />
                </span>
              </div>

              {/* Dynamic Screen based on Workflow Stage */}
              {!request ? (
                <div className="my-auto text-center p-4">
                  <p className="font-bold text-sm text-slate-600">No active request</p>
                  <p className="text-xs text-slate-400 mt-1">Submit a request to test the live patient tracking view.</p>
                </div>
              ) : request.status === 'pending' ? (
                <div className="my-auto space-y-3 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white animate-spin">
                    <Clock className="h-6 w-6" />
                  </span>
                  <p className="font-display text-lg text-amber-900">Matching Ambulance...</p>
                  <p className="text-xs text-amber-700">
                    Your request was transmitted to Central Dispatch. Searching for nearest suitable ambulance in{' '}
                    <strong>{request.pickupArea}</strong>.
                  </p>
                </div>
              ) : request.status === 'assigned' ? (
                <div className="my-auto space-y-3 rounded-xl border-2 border-blue-300 bg-blue-50 p-4 text-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white animate-pulse">
                    <Bell className="h-6 w-6" />
                  </span>
                  <p className="font-display text-lg text-blue-900">Alert Sent to Driver</p>
                  <p className="text-xs text-blue-700">
                    Assigned: <strong>{assignedAmbulance?.registration}</strong>. Awaiting operator confirmation.
                  </p>
                </div>
              ) : request.status === 'accepted' || request.status === 'en_route' ? (
                <div className="my-auto space-y-3">
                  {/* Live Tracking Card */}
                  <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
                        En Route
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        ETA: ~{request.etaMinutes ?? 4} mins
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Ambulance className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-display text-base text-ink">
                          {assignedAmbulance?.registration ?? 'KA-01-DEMO-101'}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {assignedAmbulance?.operator ?? 'Lifeline Care'} • {assignedAmbulance?.category ?? 'ALS'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-emerald-200 pt-2 text-[11px] text-slate-700 flex justify-between">
                      <span>Distance: <strong>{request.distanceKm ?? 1.8} km</strong></span>
                      <span>Speed: <strong>{assignedAmbulance?.speed ?? 40} km/h</strong></span>
                    </div>
                  </div>

                  {/* Destination Hospital Preview */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Hospital className="h-4 w-4 text-comic-red" />
                      <span>Destination Emergency Hospital:</span>
                    </div>
                    <p className="mt-1 font-bold text-xs text-ink">{request.hospital?.name}</p>
                    <p className="text-[10px] text-slate-500">{request.hospital?.traumaLevel}</p>
                  </div>

                  {/* Call Driver Button */}
                  <button
                    type="button"
                    onClick={() => alert(`Calling ambulance crew: ${assignedAmbulance?.operator}`)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-ink py-2.5 text-xs font-bold text-white shadow-sm"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call Ambulance Crew
                  </button>
                </div>
              ) : request.status === 'on_scene' ? (
                <div className="my-auto space-y-3 text-center">
                  <div className="rounded-xl border-2 border-emerald-500 bg-emerald-100 p-4">
                    <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                    <p className="mt-2 font-display text-lg text-emerald-900">Ambulance Arrived!</p>
                    <p className="text-xs text-emerald-700 mt-1">
                      Paramedics on scene. Patient triage in progress, preparing transit to{' '}
                      <strong>{request.hospital?.name}</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                /* Completed Stage: Feedback */
                <div className="my-auto space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                    <p className="font-display text-lg text-ink">Trip Completed</p>
                    <p className="text-xs text-slate-500">Patient safely delivered to emergency care.</p>
                  </div>

                  {!feedbackSent && !request.rating ? (
                    <div className="mt-2 space-y-2 border-t pt-3">
                      <p className="text-xs font-bold text-center text-ink">How was your response experience?</p>
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 text-comic-yellow hover:scale-125 transition-transform"
                          >
                            <Star
                              className={`h-6 w-6 ${star <= rating ? 'fill-comic-yellow text-amber-500' : 'text-slate-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Leave feedback notes (optional)..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className="w-full rounded border border-slate-300 p-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleFeedbackSubmit}
                        className="w-full rounded bg-blue-600 py-1.5 text-xs font-bold text-white"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  ) : (
                    <div className="rounded bg-emerald-50 p-2 text-center text-xs text-emerald-800 font-bold">
                      Thank you for your {request.rating ?? rating}★ review!
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Nav Mockup */}
              <div className="border-t pt-2 text-center text-[10px] text-slate-400">
                RapidRelay Emergency Patient App • Verified Encrypted Channel
              </div>
            </div>
          </div>

          {/* Explanation & Controls */}
          <div className="space-y-4">
            <div className="comic-panel p-5 bg-white">
              <h4 className="font-display text-xl text-ink">Patient / Family Lane Walkthrough</h4>
              <p className="mt-1 text-sm text-ink/75">
                In Swimlane 1, the patient taps SOS. The app automates location detection via GPS, submits the
                request, and immediately establishes an asynchronous tracking channel waiting for Central Dispatch's
                confirmation handshake.
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span><strong>Automated Location:</strong> Auto-populates coordinates, area and nearest landmark.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span><strong>Asynchronous Handshake:</strong> Receives confirmation signal from Central Dispatch.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span><strong>Live Telemetry:</strong> Live ETA and distance countdown dynamically calculated.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span><strong>End of Trip Feedback:</strong> Submits review rating closing the BPMN end event.</span>
                </div>
              </div>
            </div>

            {request && (
              <div className="comic-panel p-4 bg-amber-50 flex items-center justify-between">
                <div>
                  <p className="font-display text-base text-ink">Current Request Stage</p>
                  <p className="text-xs text-ink/70">
                    Status: <span className="font-bold uppercase text-amber-800">{request.status}</span>
                  </p>
                </div>
                {request.status !== 'completed' && onAdvanceStage && (
                  <button
                    type="button"
                    onClick={() => onAdvanceStage(request.id)}
                    className="comic-button-primary px-3 py-1.5 text-sm"
                  >
                    Advance To Next Stage
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: CENTRAL DISPATCH CONSOLE SIMULATOR */}
      {activeTab === 'dispatch' && (
        <div className="comic-panel p-5 bg-white space-y-4">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <div>
              <h4 className="font-display text-2xl text-amber-900">Central Dispatch System</h4>
              <p className="text-xs text-ink/70">
                Automated matching engine, availability evaluation, and dispatcher approval gateway.
              </p>
            </div>
            <span className="comic-tag bg-comic-yellow font-mono text-xs">
              Autonomous Dispatch Active
            </span>
          </div>

          {request ? (
            <div className="grid gap-4 md:grid-cols-2">
              {/* Request Evaluation Card */}
              <div className="border-4 border-ink bg-amber-50 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-display text-lg text-ink">{request.id}</span>
                  <span className="comic-tag bg-white font-bold">{request.status}</span>
                </div>
                <div className="text-xs space-y-1 text-ink/80">
                  <p><strong>Caller/Patient:</strong> {request.patientName} ({request.patientPhone})</p>
                  <p><strong>Pickup Area:</strong> {request.pickupArea} - {request.pickupNote}</p>
                  <p><strong>Category Required:</strong> <span className="comic-tag bg-comic-yellow">{request.category}</span></p>
                  <p><strong>Destination:</strong> {request.hospital?.name} ({request.hospital?.traumaLevel})</p>
                </div>
              </div>

              {/* Matching & Allocation Gateway */}
              <div className="border-4 border-ink bg-white p-4 space-y-3">
                <h5 className="font-display text-base tracking-wide text-ink">
                  Automated Fleet Proximity Evaluation
                </h5>
                <ul className="space-y-2 text-xs">
                  {ambulances.map((amb) => {
                    const isAssigned = request.ambulanceId === amb.id;
                    const ambCoords = amb.coords ?? { lat: 12.97, lng: 77.59 };
                    const reqCoords = request.pickupCoords ?? { lat: 12.97, lng: 77.59 };
                    const dist = calculateDistanceKm(ambCoords, reqCoords);

                    return (
                      <li
                        key={amb.id}
                        className={`flex items-center justify-between p-2 border-2 ${
                          isAssigned ? 'border-amber-600 bg-amber-100 font-bold' : 'border-ink/20 bg-slate-50'
                        }`}
                      >
                        <div>
                          <span>{amb.registration} ({amb.category})</span>
                          <span className="ml-2 text-slate-500">• {dist} km away</span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          amb.status === 'available' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {isAssigned ? 'Assigned' : amb.status}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-center p-6 font-display text-lg text-ink/60">No active request selected.</p>
          )}
        </div>
      )}

      {/* VIEW 3: AMBULANCE OPERATOR APP SIMULATOR */}
      {activeTab === 'operator' && (
        <div className="grid gap-6 md:grid-cols-[340px_1fr] items-start">
          {/* Driver Mobile Device Mockup */}
          <div className="mx-auto w-full max-w-[340px] rounded-[36px] border-[6px] border-ink bg-slate-900 p-3 shadow-panel">
            <div className="relative min-h-[520px] rounded-[26px] bg-emerald-950 p-4 text-white flex flex-col justify-between overflow-hidden">
              {/* Status Header */}
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300 border-b border-emerald-800/50 pb-2">
                <span>ON DUTY • SHIFT ACTIVE</span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> GPS ACTIVE
                </span>
              </div>

              {/* Driver Profile Tag */}
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <h4 className="font-display text-xl tracking-wide text-comic-yellow">
                    {assignedAmbulance?.registration ?? 'KA-01-DEMO-101'}
                  </h4>
                  <p className="text-[10px] text-emerald-300">
                    Driver: {assignedAmbulance?.operator ?? 'Lifeline Care'}
                  </p>
                </div>
                <span className="rounded bg-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                  {assignedAmbulance?.category ?? 'ALS'}
                </span>
              </div>

              {/* Operator Screen Content based on stage */}
              {!request || request.status === 'completed' ? (
                <div className="my-auto rounded-xl border border-emerald-700 bg-emerald-900/60 p-4 text-center">
                  <Ambulance className="mx-auto h-10 w-10 text-emerald-400" />
                  <p className="mt-2 font-display text-lg text-comic-yellow">Ready for Dispatch</p>
                  <p className="text-xs text-emerald-200 mt-1">Vehicle parked at base station. Standing by for emergency assignments.</p>
                </div>
              ) : request.status === 'assigned' ? (
                /* INCOMING DISPATCH POPUP WITH ACCEPT / DECLINE */
                <div className="my-auto space-y-3 rounded-2xl border-4 border-amber-400 bg-amber-950/90 p-4 text-center shadow-lg animate-wiggle">
                  <Bell className="mx-auto h-8 w-8 text-amber-400 animate-bounce" />
                  <p className="font-display text-xl text-comic-yellow">EMERGENCY ASSIGNMENT</p>
                  <div className="rounded bg-black/40 p-2 text-left text-xs space-y-1">
                    <p><strong>Pickup:</strong> {request.pickupArea} ({request.pickupNote})</p>
                    <p><strong>Situation:</strong> {request.description}</p>
                    <p><strong>Distance:</strong> {request.distanceKm ?? 1.8} km (Est: {request.etaMinutes ?? 4} min)</p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onOperatorAccept && onOperatorAccept(request.id)}
                      className="flex-1 rounded-lg bg-emerald-500 py-2.5 font-display text-base tracking-wider text-black shadow-md hover:bg-emerald-400"
                    >
                      ✓ ACCEPT
                    </button>
                    <button
                      type="button"
                      onClick={() => onOperatorDecline && onOperatorDecline(request.id, 'Traffic congestion / delayed')}
                      className="flex-1 rounded-lg bg-red-600 py-2.5 font-display text-base tracking-wider text-white shadow-md hover:bg-red-500"
                    >
                      ✕ DECLINE
                    </button>
                  </div>
                </div>
              ) : request.status === 'accepted' || request.status === 'en_route' ? (
                /* TURN-BY-TURN NAVIGATION TO PATIENT */
                <div className="my-auto space-y-3">
                  <div className="rounded-xl border border-emerald-600 bg-black/40 p-3">
                    <div className="flex items-center gap-2 text-comic-yellow text-xs font-bold">
                      <Navigation className="h-4 w-4" /> NAVIGATING TO PATIENT
                    </div>
                    <p className="mt-1 font-bold text-sm text-white">{request.pickupArea}</p>
                    <p className="text-[11px] text-emerald-200">{request.pickupNote}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="rounded bg-black/30 p-2">
                      <p className="text-emerald-300">Remaining</p>
                      <p className="font-display text-lg text-white">{request.distanceKm ?? 1.5} km</p>
                    </div>
                    <div className="rounded bg-black/30 p-2">
                      <p className="text-emerald-300">ETA</p>
                      <p className="font-display text-lg text-comic-yellow">{request.etaMinutes ?? 3} min</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAdvanceStage && onAdvanceStage(request.id)}
                    className="w-full rounded-xl bg-emerald-500 py-2.5 font-display text-base text-black shadow-md hover:bg-emerald-400"
                  >
                    MARK ARRIVED / PICKED UP
                  </button>
                </div>
              ) : (
                /* IN TRANSIT TO HOSPITAL */
                <div className="my-auto space-y-3">
                  <div className="rounded-xl border border-rose-500 bg-black/40 p-3">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                      <Hospital className="h-4 w-4" /> NAVIGATING TO EMERGENCY ROOM
                    </div>
                    <p className="mt-1 font-bold text-sm text-white">{request.hospital?.name}</p>
                    <p className="text-[11px] text-slate-300">{request.hospital?.traumaLevel}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAdvanceStage && onAdvanceStage(request.id)}
                    className="w-full rounded-xl bg-rose-600 py-2.5 font-display text-base text-white shadow-md hover:bg-rose-500"
                  >
                    COMPLETE TRIP / HANDOVER
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-emerald-800/50 pt-2 text-center text-[10px] text-emerald-400">
                Ambulance In-Cab Terminal • Lane 3 in Workflow
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="comic-panel p-5 bg-white space-y-4">
            <h4 className="font-display text-xl text-ink">Ambulance Operator Lane Walkthrough</h4>
            <p className="mt-1 text-sm text-ink/75">
              The driver's app receives assignments emitted from Central Dispatch. The driver can Accept or Decline.
              If Declined, the loopback signal returns to Central Dispatch for automated re-assignment. If Accepted,
              the driver progresses through Navigation to Patient, Patient Picked Up, Navigation to Hospital, and
              Trip Completed.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span><strong>Accept / Decline Decision Gateway:</strong> Demonstrates conditional BPMN flow.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span><strong>Arriving Signal:</strong> Updates Patient App status when ambulance reaches pickup.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span><strong>Trip Complete Signal:</strong> Frees vehicle back to available pool.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
