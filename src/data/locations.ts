import type { GeoPoint, Hospital } from '@/types';

export interface AreaData {
  name: string;
  coords: GeoPoint;
  landmarks: string[];
  defaultLandmark: string;
}

export const BENGALURU_LOCATIONS: Record<string, AreaData> = {
  Jayanagar: {
    name: 'Jayanagar',
    coords: { lat: 12.9308, lng: 77.5838 },
    landmarks: ['Near 4th Block Shopping Complex', 'Opposite South End Circle', 'Near Madhavan Park Gate'],
    defaultLandmark: 'Opposite 4th Block Complex Gate',
  },
  'JP Nagar': {
    name: 'JP Nagar',
    coords: { lat: 12.9063, lng: 77.5857 },
    landmarks: ['Near Mini Forest, 3rd Phase', 'Opposite Bangalore Club junction', 'Near 15th Cross Ring Road'],
    defaultLandmark: 'Near Mini Forest, 3rd Phase',
  },
  'BTM Layout': {
    name: 'BTM Layout',
    coords: { lat: 12.9166, lng: 77.6101 },
    landmarks: ['Near Udupi Garden Signal', 'Mico Layout Main Road', 'Near BTM Lake Park Entrance'],
    defaultLandmark: 'Near Udupi Garden Signal, Outer Ring Rd',
  },
  Koramangala: {
    name: 'Koramangala',
    coords: { lat: 12.9352, lng: 77.6245 },
    landmarks: ['Near Forum Mall, Hosur Road', '5th Block 80ft Road Junction', 'Opposite Wipro Park, 1st Block'],
    defaultLandmark: 'Near Forum Mall, Hosur Road',
  },
  Indiranagar: {
    name: 'Indiranagar',
    coords: { lat: 12.9784, lng: 77.6408 },
    landmarks: ['100ft Road Metro Pillar 142', '12th Main Road Junction', 'Opposite Defense Colony Park'],
    defaultLandmark: '100ft Road, near Metro Pillar 142',
  },
  Whitefield: {
    name: 'Whitefield',
    coords: { lat: 12.9698, lng: 77.75 },
    landmarks: ['Opposite ITPL Main Gate', 'Hope Farm Junction', 'Near Phoenix Marketcity Entrance'],
    defaultLandmark: 'Opposite ITPL Main Gate',
  },
  Rajajinagar: {
    name: 'Rajajinagar',
    coords: { lat: 12.9982, lng: 77.553 },
    landmarks: ['Near Navrang Circle', 'Opposite Rajajinagar Metro Station', 'Near Orion Mall Entrance'],
    defaultLandmark: 'Near Navrang Circle, 2nd Block',
  },
  Yeshwanthpur: {
    name: 'Yeshwanthpur',
    coords: { lat: 13.0285, lng: 77.5459 },
    landmarks: ['Opposite Yeshwanthpur Metro Station', 'Near APMC Yard Gate', 'Near Railway Station Platform 1 Exit'],
    defaultLandmark: 'Opposite Yeshwanthpur Metro Station',
  },
  'Electronic City': {
    name: 'Electronic City',
    coords: { lat: 12.8452, lng: 77.6602 },
    landmarks: ['Near Infosys Gate 1, Phase 1', 'Wipro Electronic City Gate 4', 'Toll Plaza Elevated Expressway Exit'],
    defaultLandmark: 'Near Infosys Gate 1, Phase 1',
  },
  Hebbal: {
    name: 'Hebbal',
    coords: { lat: 13.0358, lng: 77.597 },
    landmarks: ['Near Hebbal Flyover Junction', 'Bellary Road Esteem Mall Gate', 'Near Hebbal Lake Promenade'],
    defaultLandmark: 'Near Hebbal Flyover Junction',
  },
};

export const BENGALURU_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Manipal Hospital (Old Airport Rd)',
    area: 'Indiranagar',
    coords: { lat: 12.9592, lng: 77.6476 },
    traumaLevel: 'Level 1 Trauma & Cardiac Emergency',
    phone: '+91 80 2502 4444',
  },
  {
    id: 'hosp-2',
    name: "St. John's Medical College Hospital",
    area: 'Koramangala',
    coords: { lat: 12.9315, lng: 77.6189 },
    traumaLevel: 'Level 1 Trauma & Multi-Specialty Centre',
    phone: '+91 80 2206 5000',
  },
  {
    id: 'hosp-3',
    name: 'Apollo Speciality Hospital Jayanagar',
    area: 'Jayanagar',
    coords: { lat: 12.9248, lng: 77.5891 },
    traumaLevel: 'Level 1 Emergency & Trauma Care',
    phone: '+91 80 4668 8888',
  },
  {
    id: 'hosp-4',
    name: 'Aster CMI Hospital Hebbal',
    area: 'Hebbal',
    coords: { lat: 13.056, lng: 77.5925 },
    traumaLevel: 'Level 1 Trauma & Critical Care Center',
    phone: '+91 80 4342 0100',
  },
  {
    id: 'hosp-5',
    name: 'Narayana Health City (Mazumdar Shaw)',
    area: 'Electronic City',
    coords: { lat: 12.836, lng: 77.683 },
    traumaLevel: 'Cardiac & Advanced Trauma Institute',
    phone: '+91 80 7122 2222',
  },
  {
    id: 'hosp-6',
    name: 'Fortis Hospital Rajajinagar',
    area: 'Rajajinagar',
    coords: { lat: 12.9912, lng: 77.551 },
    traumaLevel: 'Level 2 Emergency Trauma Care',
    phone: '+91 80 6621 4444',
  },
  {
    id: 'hosp-7',
    name: 'Manipal Hospital Whitefield',
    area: 'Whitefield',
    coords: { lat: 12.9856, lng: 77.7325 },
    traumaLevel: 'Level 1 Emergency & Trauma Center',
    phone: '+91 80 6165 6666',
  },
  {
    id: 'hosp-8',
    name: 'SPARSH Hospital Yeshwanthpur',
    area: 'Yeshwanthpur',
    coords: { lat: 13.024, lng: 77.552 },
    traumaLevel: 'Orthopedic & Polytrauma Emergency Care',
    phone: '+91 80 6122 2000',
  },
  {
    id: 'hosp-9',
    name: 'Sri Jayadeva Institute of Cardiology',
    area: 'BTM Layout',
    coords: { lat: 12.9175, lng: 77.596 },
    traumaLevel: 'Apex Emergency Cardiac Care Center',
    phone: '+91 80 2297 7400',
  },
];

export function calculateDistanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const val =
    sinDLat * sinDLat +
    Math.sin(lat1) * Math.sin(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(val), Math.sqrt(1 - val));
  return Math.round(R * c * 10) / 10;
}

export function calculateEtaMinutes(distanceKm: number, averageSpeedKmh = 35): number {
  if (distanceKm <= 0.1) return 1;
  const hours = distanceKm / averageSpeedKmh;
  return Math.max(1, Math.round(hours * 60));
}

export function getCoordinatesForArea(area: string): GeoPoint {
  const match = BENGALURU_LOCATIONS[area];
  if (match) {
    // Add tiny deterministic jitter so multiple vehicles/requests in same area don't overlap exactly
    const offsetLat = (Math.sin(area.length * 17) * 0.003);
    const offsetLng = (Math.cos(area.length * 13) * 0.003);
    return { lat: match.coords.lat + offsetLat, lng: match.coords.lng + offsetLng };
  }
  return { lat: 12.9716, lng: 77.5946 }; // Default Bengaluru center
}

export function findNearestArea(coords: GeoPoint): string {
  let best = 'Koramangala';
  let minDistance = Infinity;

  for (const [name, area] of Object.entries(BENGALURU_LOCATIONS)) {
    const dist = calculateDistanceKm(coords, area.coords);
    if (dist < minDistance) {
      minDistance = dist;
      best = name;
    }
  }
  return best;
}

export function findNearestHospital(coords: GeoPoint): Hospital {
  let best = BENGALURU_HOSPITALS[0];
  let minDistance = Infinity;

  for (const hosp of BENGALURU_HOSPITALS) {
    const dist = calculateDistanceKm(coords, hosp.coords);
    if (dist < minDistance) {
      minDistance = dist;
      best = hosp;
    }
  }
  return best;
}

export function interpolateCoords(start: GeoPoint, end: GeoPoint, fraction: number): GeoPoint {
  const f = Math.max(0, Math.min(1, fraction));
  return {
    lat: start.lat + (end.lat - start.lat) * f,
    lng: start.lng + (end.lng - start.lng) * f,
  };
}

export const QUICK_LOCATION_PRESETS: Array<{
  label: string;
  area: string;
  landmark: string;
  coords: GeoPoint;
}> = [
  {
    label: 'Koramangala 4th Block',
    area: 'Koramangala',
    landmark: '80ft Road, opposite Sony World Junction',
    coords: { lat: 12.9352, lng: 77.6245 },
  },
  {
    label: 'Indiranagar 100ft Rd',
    area: 'Indiranagar',
    landmark: 'Near Metro Pillar 142, 100ft Road',
    coords: { lat: 12.9784, lng: 77.6408 },
  },
  {
    label: 'Jayanagar 4th Block',
    area: 'Jayanagar',
    landmark: 'Opposite 4th Block Shopping Complex',
    coords: { lat: 12.9308, lng: 77.5838 },
  },
  {
    label: 'Whitefield ITPL',
    area: 'Whitefield',
    landmark: 'Opposite ITPL Main Tech Park Gate',
    coords: { lat: 12.9698, lng: 77.75 },
  },
  {
    label: 'Electronic City Ph 1',
    area: 'Electronic City',
    landmark: 'Near Infosys Gate 1, Phase 1',
    coords: { lat: 12.8452, lng: 77.6602 },
  },
  {
    label: 'Hebbal Flyover',
    area: 'Hebbal',
    landmark: 'Near Hebbal Ring Road Flyover Junction',
    coords: { lat: 13.0358, lng: 77.597 },
  },
];
