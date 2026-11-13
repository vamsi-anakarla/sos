import { calculateDistanceKm, getCoordinatesForArea } from '@/data/locations';
import type { Ambulance, AmbulanceRequest } from '@/types';

export function isSuitable(ambulance: Ambulance, request: AmbulanceRequest): boolean {
  if (ambulance.network !== 'private' || ambulance.status !== 'available') return false;
  if (request.declinedAmbulanceIds.includes(ambulance.id)) return false;
  if (ambulance.category === request.category) return true;
  return request.category === 'BLS' && ambulance.category === 'ALS';
}

export function rankCandidates(ambulances: Ambulance[], request: AmbulanceRequest): Ambulance[] {
  const pickupPoint = request.pickupCoords || getCoordinatesForArea(request.pickupArea);

  const calculateScore = (a: Ambulance) => {
    const ambPoint = a.coords || getCoordinatesForArea(a.area);
    const distanceKm = calculateDistanceKm(ambPoint, pickupPoint);
    // Base score for category match
    const categoryBonus = a.category === request.category ? 15 : 5;
    // Same area bonus
    const areaBonus = a.area === request.pickupArea ? 10 : 0;
    // Distance penalty (closer is better, max range ~ 30km)
    const distanceScore = Math.max(0, 30 - distanceKm);

    return categoryBonus + areaBonus + distanceScore;
  };

  return ambulances
    .filter((a) => isSuitable(a, request))
    .sort((a, b) => calculateScore(b) - calculateScore(a));
}
