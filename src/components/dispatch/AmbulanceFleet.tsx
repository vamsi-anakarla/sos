import { useState } from 'react';
import type { Ambulance, AmbulanceStatus } from '@/types';

interface AmbulanceFleetProps {
  ambulances: Ambulance[];
}

const AVAILABILITY_LABEL: Record<AmbulanceStatus, string> = {
  available: 'Available',
  busy: 'Busy',
  out_of_service: 'Out of service',
};

const AVAILABILITY_TONE: Record<AmbulanceStatus, string> = {
  available: 'bg-comic-yellow-deep text-ink',
  busy: 'bg-comic-orange text-ink',
  out_of_service: 'bg-comic-red text-comic-cream',
};

function formatAgo(timestamp: number): string {
  const minutes = Math.floor((Date.now() - timestamp) / 60000);
  return minutes <= 0 ? 'Just now' : `${minutes} min ago`;
}

export default function AmbulanceFleet({ ambulances }: AmbulanceFleetProps) {
  const [filter, setFilter] = useState<AmbulanceStatus | 'all'>('all');
  const visible = filter === 'all' ? ambulances : ambulances.filter((a) => a.status === filter);

  return (
    <section className="comic-panel p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-ink bg-comic-cream p-4">
        <h2 className="text-3xl text-ink">Fleet</h2>
        <label className="flex items-center gap-2 font-display text-base tracking-wide">
          Availability
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as AmbulanceStatus | 'all')}
            className="comic-input w-auto py-1.5 text-sm"
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="out_of_service">Out of service</option>
          </select>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-ink text-comic-cream">
            <tr className="font-display text-base tracking-wider">
              <th className="px-4 py-3">Registration</th>
              <th className="px-4 py-3">Operator</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Network</th>
              <th className="px-4 py-3">Last location</th>
              <th className="px-4 py-3">Last GPS</th>
              <th className="px-4 py-3">Availability</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((ambulance) => (
              <tr key={ambulance.id} className="border-t-2 border-ink/20 bg-white transition-colors hover:bg-comic-cream">
                <td className="px-4 py-3 font-display text-lg tracking-wide">{ambulance.registration}</td>
                <td className="px-4 py-3">{ambulance.operator}</td>
                <td className="px-4 py-3">{ambulance.category}</td>
                <td className="px-4 py-3 capitalize">{ambulance.network}</td>
                <td className="px-4 py-3">{ambulance.area}</td>
                <td className="px-4 py-3">
                  {formatAgo(ambulance.lastGpsAt)}
                </td>
                <td className="px-4 py-3">
                  <span className={`comic-tag ${AVAILABILITY_TONE[ambulance.status]}`}>
                    {AVAILABILITY_LABEL[ambulance.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <p className="p-6 text-center text-ink/70">No ambulances match this filter.</p>}
      </div>
    </section>
  );
}
