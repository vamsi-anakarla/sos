import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { nextAutomatedAction } from '@/lib/automation';
import { nextSimulatedMessage, type NewRequestFields } from '@/lib/channels';
import { dispatchReducer, type DispatchState } from '@/lib/dispatch';
import {
  fetchDispatchSnapshot,
  saveAmbulanceStatus,
  saveEvent,
  saveRequest,
} from '@/lib/repository';
import { QUICK_LOCATION_PRESETS } from '@/data/locations';
import { MOST_USED_SERVICES } from '@/data/services';
import type { Ambulance, AmbulanceRequest, DispatchEvent, WorkflowStepId } from '@/types';

const AUTOMATION_TICK_MS = 1000;
const GPS_TICK_MS = 1200;
const FEED_INTERVAL_MS = 12000;
const MAX_SIMULATED_INTAKE = 12;

const INITIAL_STATE: DispatchState = {
  loaded: false,
  requests: [],
  ambulances: [],
  events: [],
  autoDispatch: true,
};

function buildRequest(fields: NewRequestFields): AmbulanceRequest {
  const now = Date.now();
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return {
    ...fields,
    id: `RR-${now.toString(36).toUpperCase()}${suffix}`,
    createdAt: now,
    stageAt: now,
    status: 'pending',
    ambulanceId: null,
    declinedAmbulanceIds: [],
    alerts: [],
    workflowStep: 'disp_check',
  };
}

export function useDispatchDemo() {
  const [state, dispatch] = useReducer(dispatchReducer, INITIAL_STATE);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [feedEnabled, setFeedEnabled] = useState(true);
  const [feedFinished, setFeedFinished] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const stateRef = useRef(state);
  const savedRequests = useRef(new Map<string, AmbulanceRequest>());
  const savedAmbulances = useRef(new Map<string, Ambulance>());
  const savedEventIds = useRef(new Set<string>());
  const simulatedCount = useRef(0);
  const scenarioIndex = useRef(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    fetchDispatchSnapshot()
      .then((snapshot) => {
        if (cancelled) return;
        snapshot.requests.forEach((r) => savedRequests.current.set(r.id, r));
        snapshot.ambulances.forEach((a) => savedAmbulances.current.set(a.id, a));
        snapshot.events.forEach((e: DispatchEvent) => savedEventIds.current.add(e.id));
        dispatch({ type: 'hydrate', ...snapshot });
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Unexpected error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    if (!state.loaded) return;
    const requestWrites = state.requests.filter((r) => savedRequests.current.get(r.id) !== r);
    const ambulanceWrites = state.ambulances.filter((a) => savedAmbulances.current.get(a.id) !== a);
    const eventWrites = state.events.filter((e) => !savedEventIds.current.has(e.id));
    if (requestWrites.length === 0 && ambulanceWrites.length === 0 && eventWrites.length === 0) return;

    requestWrites.forEach((r) => savedRequests.current.set(r.id, r));
    ambulanceWrites.forEach((a) => savedAmbulances.current.set(a.id, a));
    eventWrites.forEach((e) => savedEventIds.current.add(e.id));

    (async () => {
      try {
        await Promise.all([
          ...requestWrites.map(saveRequest),
          ...ambulanceWrites.map((a) => saveAmbulanceStatus(a.id, a.status)),
        ]);
        for (const entry of eventWrites) {
          await saveEvent(entry);
        }
        setSaveError(null);
      } catch (err: unknown) {
        setSaveError(err instanceof Error ? err.message : 'Unexpected error');
      }
    })();
  }, [state.loaded, state.requests, state.ambulances, state.events]);

  // Automated dispatch loop
  useEffect(() => {
    const id = window.setInterval(() => {
      const action = nextAutomatedAction(stateRef.current, Date.now());
      if (action) dispatch(action);
    }, AUTOMATION_TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  // GPS motion & telemetry updates
  useEffect(() => {
    const id = window.setInterval(() => {
      if (stateRef.current.loaded) {
        dispatch({ type: 'gpsTick', at: Date.now() });
      }
    }, GPS_TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  // Simulated inbound feed loop
  useEffect(() => {
    if (!feedEnabled || !state.loaded || feedFinished) return;
    const id = window.setInterval(() => {
      if (simulatedCount.current >= MAX_SIMULATED_INTAKE) {
        setFeedFinished(true);
        return;
      }
      simulatedCount.current += 1;
      const { fields } = nextSimulatedMessage(scenarioIndex.current);
      scenarioIndex.current += 1;
      dispatch({ type: 'create', request: buildRequest(fields) });
    }, FEED_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [feedEnabled, feedFinished, state.loaded]);

  const createRequest = useCallback((fields: NewRequestFields) => {
    const request = buildRequest(fields);
    dispatch({ type: 'create', request });
    return request.id;
  }, []);

  const assign = useCallback((requestId: string, ambulanceId: string) => {
    dispatch({ type: 'assign', at: Date.now(), requestId, ambulanceId, automated: false });
  }, []);

  const decline = useCallback((requestId: string, reason: string) => {
    dispatch({ type: 'operatorDecline', at: Date.now(), requestId, reason });
  }, []);

  const operatorAccept = useCallback((requestId: string) => {
    dispatch({ type: 'operatorAccept', at: Date.now(), requestId });
  }, []);

  const advanceStage = useCallback((requestId: string) => {
    dispatch({ type: 'advance', at: Date.now(), requestId });
  }, []);

  const submitFeedback = useCallback((requestId: string, rating: number, feedback: string) => {
    dispatch({ type: 'submitFeedback', at: Date.now(), requestId, rating, feedback });
  }, []);

  const setWorkflowStep = useCallback((requestId: string, step: WorkflowStepId) => {
    dispatch({ type: 'setWorkflowStep', requestId, step });
  }, []);

  const setAutoDispatch = useCallback((enabled: boolean) => {
    dispatch({ type: 'setAutoDispatch', enabled });
  }, []);

  const retryLoad = useCallback(() => setReloadKey((k) => k + 1), []);

  const spawnPresetDemo = useCallback((presetIndex = 0) => {
    const preset = QUICK_LOCATION_PRESETS[presetIndex % QUICK_LOCATION_PRESETS.length];
    const { fields } = nextSimulatedMessage(presetIndex);
    return createRequest({
      ...fields,
      pickupArea: preset.area,
      pickupNote: preset.landmark,
      pickupCoords: preset.coords,
    });
  }, [createRequest]);

  const spawnServiceDemo = useCallback((serviceId: string) => {
    const service = MOST_USED_SERVICES.find((s) => s.id === serviceId) || MOST_USED_SERVICES[0];
    const preset = QUICK_LOCATION_PRESETS[Math.floor(Math.random() * QUICK_LOCATION_PRESETS.length)];
    return createRequest({
      channel: 'Mobile app',
      network: 'private',
      pickupArea: preset.area,
      pickupNote: preset.landmark,
      pickupCoords: preset.coords,
      patientName: service.id === 'child' ? 'Aarav (Child)' : service.id === 'accident' ? 'Collision Victim' : 'Emergency Patient',
      patientPhone: '+91 98450 11223',
      patientAge: service.defaultAge ? Number(service.defaultAge) : 34,
      description: service.descriptionTemplate,
      category: service.recommendedCategory,
      serviceType: service.title,
      aiCaptured: false,
      externalRef: null,
    });
  }, [createRequest]);

  return {
    loaded: state.loaded,
    loadError,
    saveError,
    requests: state.requests,
    ambulances: state.ambulances,
    events: state.events,
    autoDispatch: state.autoDispatch,
    feedEnabled,
    feedFinished,
    retryLoad,
    createRequest,
    assign,
    decline,
    operatorAccept,
    advanceStage,
    submitFeedback,
    setWorkflowStep,
    setAutoDispatch,
    setFeedEnabled,
    spawnPresetDemo,
    spawnServiceDemo,
  };
}
