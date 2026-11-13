import {
  calculateDistanceKm,
  calculateEtaMinutes,
  findNearestHospital,
  getCoordinatesForArea,
  interpolateCoords,
} from '@/data/locations';
import type { Ambulance, AmbulanceRequest, DispatchEvent, RequestStatus, WorkflowStepId } from '@/types';

export interface DispatchState {
  loaded: boolean;
  requests: AmbulanceRequest[];
  ambulances: Ambulance[];
  events: DispatchEvent[];
  autoDispatch: boolean;
}

const MAX_EVENTS = 100;

export type DispatchAction =
  | { type: 'hydrate'; requests: AmbulanceRequest[]; ambulances: Ambulance[]; events: DispatchEvent[] }
  | { type: 'setAutoDispatch'; enabled: boolean }
  | { type: 'create'; request: AmbulanceRequest }
  | { type: 'assign'; at: number; requestId: string; ambulanceId: string; automated: boolean }
  | { type: 'escalate'; at: number; requestId: string }
  | { type: 'operatorAccept'; at: number; requestId: string }
  | { type: 'operatorDecline'; at: number; requestId: string; reason: string }
  | { type: 'advance'; at: number; requestId: string }
  | { type: 'submitFeedback'; at: number; requestId: string; rating: number; feedback: string }
  | { type: 'setWorkflowStep'; requestId: string; step: WorkflowStepId }
  | { type: 'gpsTick'; at: number };

export const STATUS_LABEL: Record<RequestStatus, string> = {
  pending: 'Awaiting dispatch',
  assigned: 'Awaiting operator',
  accepted: 'Accepted',
  en_route: 'En route to patient',
  on_scene: 'On scene / At hospital',
  completed: 'Trip completed',
};

export const DECLINE_REASONS = [
  'Vehicle unavailable',
  'Crew unavailable',
  'Vehicle not suitable',
  'Heavy traffic / inaccessible route',
  'Other',
] as const;

const NEXT_STATUS: Partial<Record<RequestStatus, RequestStatus>> = {
  accepted: 'en_route',
  en_route: 'on_scene',
  on_scene: 'completed',
};

const ESCALATION_ALERT = 'No suitable ambulance available. Escalated for manual review.';

function event(requestId: string | null, message: string, at: number): DispatchEvent {
  return { id: crypto.randomUUID(), requestId, message, createdAt: at };
}

function withEvent(state: DispatchState, entry: DispatchEvent): DispatchState {
  return { ...state, events: [entry, ...state.events].slice(0, MAX_EVENTS) };
}

function updateRequest(
  requests: AmbulanceRequest[],
  requestId: string,
  change: (r: AmbulanceRequest) => AmbulanceRequest,
): AmbulanceRequest[] {
  return requests.map((r) => (r.id === requestId ? change(r) : r));
}

function updateAmbulance(
  ambulances: Ambulance[],
  ambulanceId: string,
  update: Partial<Ambulance>,
): Ambulance[] {
  return ambulances.map((a) => (a.id === ambulanceId ? { ...a, ...update } : a));
}

export function mapStatusToWorkflowStep(status: RequestStatus): WorkflowStepId {
  switch (status) {
    case 'pending':
      return 'disp_check';
    case 'assigned':
      return 'amb_receive';
    case 'accepted':
      return 'amb_navigate_patient';
    case 'en_route':
      return 'pat_arrives';
    case 'on_scene':
      return 'amb_picked_up';
    case 'completed':
      return 'pat_complete';
  }
}

export function dispatchReducer(state: DispatchState, action: DispatchAction): DispatchState {
  switch (action.type) {
    case 'hydrate':
      return {
        ...state,
        loaded: true,
        requests: action.requests,
        ambulances: action.ambulances,
        events: action.events,
      };

    case 'setAutoDispatch':
      return { ...state, autoDispatch: action.enabled };

    case 'setWorkflowStep': {
      return {
        ...state,
        requests: updateRequest(state.requests, action.requestId, (r) => ({
          ...r,
          workflowStep: action.step,
        })),
      };
    }

    case 'submitFeedback': {
      return withEvent(
        {
          ...state,
          requests: updateRequest(state.requests, action.requestId, (r) => ({
            ...r,
            rating: action.rating,
            feedback: action.feedback,
            workflowStep: 'pat_complete',
          })),
        },
        event(
          action.requestId,
          `Patient submitted ${action.rating}★ rating: "${action.feedback || 'Fast and professional care.'}"`,
          action.at,
        ),
      );
    }

    case 'create': {
      const { request } = action;
      if (request.externalRef && state.requests.some((r) => r.externalRef === request.externalRef)) {
        return withEvent(
          state,
          event(null, `Duplicate ${request.channel} request ignored (key ${request.externalRef})`, request.createdAt),
        );
      }
      const pickupCoords = request.pickupCoords || getCoordinatesForArea(request.pickupArea);
      const hospital = request.hospital || findNearestHospital(pickupCoords);
      const distanceKm = calculateDistanceKm(pickupCoords, hospital.coords);
      const etaMinutes = calculateEtaMinutes(distanceKm);

      const enrichedRequest: AmbulanceRequest = {
        ...request,
        pickupCoords,
        hospital,
        distanceKm,
        etaMinutes,
        workflowStep: 'disp_check',
      };

      const channelNote = request.aiCaptured ? ' (details captured by AI, confirm with caller)' : '';
      return withEvent(
        { ...state, requests: [enrichedRequest, ...state.requests] },
        event(request.id, `New request via ${request.channel}${channelNote} in ${request.pickupArea}`, request.createdAt),
      );
    }

    case 'assign': {
      const request = state.requests.find((r) => r.id === action.requestId);
      const ambulance = state.ambulances.find((a) => a.id === action.ambulanceId);
      if (!request || request.status !== 'pending' || !ambulance || ambulance.status !== 'available') {
        return state;
      }
      const ambCoords = ambulance.coords || getCoordinatesForArea(ambulance.area);
      const reqCoords = request.pickupCoords || getCoordinatesForArea(request.pickupArea);
      const dist = calculateDistanceKm(ambCoords, reqCoords);
      const eta = calculateEtaMinutes(dist);

      const message = action.automated
        ? `Auto-matched ${ambulance.registration} (${ambulance.category}, ${ambulance.area}) to ${request.id} - ${dist} km away (ETA ${eta}m)`
        : `Dispatcher assigned ${ambulance.registration} to ${request.id}`;

      return withEvent(
        {
          ...state,
          requests: updateRequest(state.requests, request.id, (r) => ({
            ...r,
            status: 'assigned',
            ambulanceId: ambulance.id,
            stageAt: action.at,
            distanceKm: dist,
            etaMinutes: eta,
            workflowStep: 'amb_receive',
          })),
          ambulances: updateAmbulance(state.ambulances, ambulance.id, {
            status: 'busy',
            speed: 36,
            lastGpsAt: action.at,
          }),
        },
        event(request.id, message, action.at),
      );
    }

    case 'escalate': {
      const request = state.requests.find((r) => r.id === action.requestId);
      if (!request || request.alerts.includes(ESCALATION_ALERT)) return state;
      return withEvent(
        {
          ...state,
          requests: updateRequest(state.requests, request.id, (r) => ({
            ...r,
            alerts: [...r.alerts, ESCALATION_ALERT],
            workflowStep: 'disp_select',
          })),
        },
        event(request.id, `${request.id} has no suitable ambulance. Escalated`, action.at),
      );
    }

    case 'operatorAccept': {
      const request = state.requests.find((r) => r.id === action.requestId);
      if (!request || request.status !== 'assigned' || !request.ambulanceId) return state;
      const ambulance = state.ambulances.find((a) => a.id === request.ambulanceId);
      return withEvent(
        {
          ...state,
          requests: updateRequest(state.requests, request.id, (r) => ({
            ...r,
            status: 'accepted',
            stageAt: action.at,
            workflowStep: 'amb_navigate_patient',
          })),
          ambulances: updateAmbulance(state.ambulances, request.ambulanceId, {
            speed: 42,
            lastGpsAt: action.at,
          }),
        },
        event(request.id, `${ambulance?.registration ?? 'Crew'} accepted assignment for ${request.id}`, action.at),
      );
    }

    case 'operatorDecline': {
      const request = state.requests.find((r) => r.id === action.requestId);
      if (!request || request.status !== 'assigned' || !request.ambulanceId) return state;
      const freedId = request.ambulanceId;
      const ambulance = state.ambulances.find((a) => a.id === freedId);
      return withEvent(
        {
          ...state,
          requests: updateRequest(state.requests, request.id, (r) => ({
            ...r,
            status: 'pending',
            ambulanceId: null,
            stageAt: action.at,
            declinedAmbulanceIds: [...r.declinedAmbulanceIds, freedId],
            alerts: [...r.alerts, `Declined by operator: ${action.reason}`],
            workflowStep: 'disp_check',
          })),
          ambulances: updateAmbulance(state.ambulances, freedId, {
            status: 'available',
            speed: 0,
            lastGpsAt: action.at,
          }),
        },
        event(
          request.id,
          `${ambulance?.registration ?? 'Crew'} declined ${request.id} (${action.reason}). Re-routing to Central Dispatch`,
          action.at,
        ),
      );
    }

    case 'advance': {
      const request = state.requests.find((r) => r.id === action.requestId);
      if (!request) return state;
      const next = NEXT_STATUS[request.status];
      if (!next) return state;
      const ambulance = state.ambulances.find((a) => a.id === request.ambulanceId);
      const reg = ambulance?.registration ?? 'Crew';

      let message = '';
      let nextStep: WorkflowStepId = 'amb_complete';

      if (next === 'en_route') {
        message = `${reg} is en route to patient in ${request.pickupArea} (ETA ${request.etaMinutes ?? 4}m)`;
        nextStep = 'pat_arrives';
      } else if (next === 'on_scene') {
        message = `${reg} arrived on scene! Patient picked up; navigating to ${request.hospital?.name ?? 'Hospital'}`;
        nextStep = 'amb_picked_up';
      } else {
        message = `Trip completed at ${request.hospital?.name ?? 'destination'}. ${reg} is available again`;
        nextStep = 'pat_feedback';
      }

      const ambulances =
        next === 'completed' && request.ambulanceId
          ? updateAmbulance(state.ambulances, request.ambulanceId, {
              status: 'available',
              speed: 0,
              coords: getCoordinatesForArea(ambulance?.area ?? request.pickupArea),
              lastGpsAt: action.at,
            })
          : state.ambulances;

      return withEvent(
        {
          ...state,
          requests: updateRequest(state.requests, request.id, (r) => ({
            ...r,
            status: next,
            stageAt: action.at,
            workflowStep: nextStep,
            distanceKm: next === 'on_scene' ? 0.3 : next === 'completed' ? 0 : r.distanceKm,
            etaMinutes: next === 'on_scene' ? 1 : next === 'completed' ? 0 : r.etaMinutes,
          })),
          ambulances,
        },
        event(request.id, message, action.at),
      );
    }

    case 'gpsTick': {
      // Smoothly update positions of active ambulances towards their target
      const updatedAmbulances = state.ambulances.map((amb) => {
        if (amb.status !== 'busy') return amb;
        const activeReq = state.requests.find((r) => r.ambulanceId === amb.id && r.status !== 'completed');
        if (!activeReq) return amb;

        const current = amb.coords || getCoordinatesForArea(amb.area);
        const pickup = activeReq.pickupCoords || getCoordinatesForArea(activeReq.pickupArea);
        const hospital = activeReq.hospital?.coords || getCoordinatesForArea(activeReq.pickupArea);

        // Target depends on stage
        const target = activeReq.status === 'on_scene' ? hospital : pickup;
        // Interpolate smoothly 8% closer per tick
        const nextCoords = interpolateCoords(current, target, 0.08);
        const remainingKm = calculateDistanceKm(nextCoords, target);
        const eta = calculateEtaMinutes(remainingKm);

        return {
          ...amb,
          coords: nextCoords,
          speed: Math.floor(35 + Math.sin(action.at / 2000) * 10),
          lastGpsAt: action.at,
          remainingKm,
          etaMinutes: eta,
        };
      });

      return {
        ...state,
        ambulances: updatedAmbulances,
      };
    }
  }
}
