import type { Ambulance, AmbulanceRequest } from '@/types';

export function isSuitable(ambulance: Ambulance, request: AmbulanceRequest): boolean {
  if (ambulance.network !== 'private' || ambulance.status !== 'available') return false;
  if (request.declinedAmbulanceIds.includes(ambulance.id)) return false;
  if (ambulance.category === request.category) return true;
  return request.category === 'BLS' && ambulance.category === 'ALS';
}

export function rankCandidates(ambulances: Ambulance[], request: AmbulanceRequest): Ambulance[] {
  const score = (a: Ambulance) =>
    (a.area === request.pickupArea ? 2 : 0) + (a.category === request.category ? 1 : 0);
  return ambulances.filter((a) => isSuitable(a, request)).sort((a, b) => score(b) - score(a));
}
