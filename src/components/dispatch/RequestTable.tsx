import type { Ambulance, AmbulanceRequest } from '@/types';
import StatusBadge from '@/components/dispatch/StatusBadge';

interface RequestTableProps {
  requests: AmbulanceRequest[];
  ambulances: Ambulance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const TIME_FORMAT = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' });

export default function RequestTable({ requests, ambulances, selectedId, onSelect }: RequestTableProps) {
  return (
    <div className="comic-panel overflow-x-auto p-0">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-ink text-comic-cream">
          <tr className="font-display text-base tracking-wider">
            <th className="px-3 py-3">Request</th>
            <th className="px-3 py-3">Channel</th>
            <th className="px-3 py-3">Created</th>
            <th className="px-3 py-3">Pickup</th>
            <th className="px-3 py-3">Type</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3">Ambulance</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const ambulance = ambulances.find((a) => a.id === request.ambulanceId);
            const selected = request.id === selectedId;
            return (
              <tr
                key={request.id}
                onClick={() => onSelect(request.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(request.id);
                  }
                }}
                tabIndex={0}
                aria-selected={selected}
                className={`cursor-pointer border-t-2 border-ink/20 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-comic-orange ${
                  selected ? 'bg-comic-yellow' : 'bg-white hover:bg-comic-cream'
                }`}
              >
                <td className="px-3 py-3 font-display text-lg tracking-wide">{request.id}</td>
                <td className="px-3 py-3">{request.channel}</td>
                <td className="px-3 py-3">{TIME_FORMAT.format(request.createdAt)}</td>
                <td className="px-3 py-3">{request.pickupArea}</td>
                <td className="px-3 py-3">{request.category}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-3 py-3">{ambulance ? ambulance.registration : 'Unassigned'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {requests.length === 0 && (
        <p className="p-6 text-center text-ink/70">No requests yet. New requests appear here.</p>
      )}
    </div>
  );
}
