import type { Ambulance, AmbulanceRequest, DispatchEvent, RequestStatus } from '@/types';

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
  | { type: 'advance'; at: number; requestId: string };

export const STATUS_LABEL: Record<RequestStatus, string> = {
  pending: 'Awaiting dispatch',
  assigned: 'Awaiting operator',
  accepted: 'Accepted',
  en_route: 'En route',
  on_scene: 'On scene',
  completed: 'Completed',
};

export const DECLINE_REASONS = [
  'Vehicle unavailable',
  'Crew unavailable',
  'Vehicle not suitable',
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
  status: Ambulance['status'],
): Ambulance[] {
  return ambulances.map((a) => (a.id === ambulanceId ? { ...a, status } : a));
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

    case 'create': {
      const { request } = action;
      if (request.externalRef && state.requests.some((r) => r.externalRef === request.externalRef)) {
        return withEvent(
          state,
          event(null, `Duplicate ${request.channel} request ignored (key ${request.externalRef})`, request.createdAt),
        );
      }
      const channelNote = request.aiCaptured ? ' (details captured by AI, confirm with caller)' : '';
      return withEvent(
        { ...state, requests: [request, ...state.requests] },
        event(request.id, `New request via ${request.channel}${channelNote}`, request.createdAt),
      );
    }

    case 'assign': {
      const request = state.requests.find((r) => r.id === action.requestId);
      const ambulance = state.ambulances.find((a) => a.id === action.ambulanceId);
      if (!request || request.status !== 'pending' || !ambulance || ambulance.status !== 'available') {
        return state;
      }
      const message = action.automated
        ? `Auto-matched ${ambulance.registration} (${ambulance.category}, ${ambulance.area}) to ${request.id}`
        : `Dispatcher assigned ${ambulance.registration} to ${request.id}`;
      return withEvent(
        {
          ...state,
          requests: updateRequest(state.requests, request.id, (r) => ({
            ...r,
            status: 'assigned',
            ambulanceId: ambulance.id,
            stageAt: action.at,
          })),
          ambulances: updateAmbulance(state.ambulances, ambulance.id, 'busy'),
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
          })),
        },
        event(request.id, `${ambulance?.registration ?? 'Crew'} accepted ${request.id}`, action.at),
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
          })),
          ambulances: updateAmbulance(state.ambulances, freedId, 'available'),
        },
        event(
          request.id,
          `${ambulance?.registration ?? 'Crew'} declined ${request.id} (${action.reason}). Re-matching`,
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
      const message =
        next === 'en_route'
          ? `${reg} is en route to pickup`
          : next === 'on_scene'
            ? `${reg} arrived at pickup`
            : `Trip completed. ${reg} is available again`;
      const ambulances =
        next === 'completed' && request.ambulanceId
          ? updateAmbulance(state.ambulances, request.ambulanceId, 'available')
          : state.ambulances;
      return withEvent(
        {
          ...state,
          requests: updateRequest(state.requests, request.id, (r) => ({
            ...r,
            status: next,
            stageAt: action.at,
          })),
          ambulances,
        },
        event(request.id, message, action.at),
      );
    }
  }
}
