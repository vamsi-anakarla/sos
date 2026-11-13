import type { Ambulance, AmbulanceRequest } from '@/types';

interface KpiCardsProps {
  requests: AmbulanceRequest[];
  ambulances: Ambulance[];
}

const ACTIVE = ['assigned', 'accepted', 'en_route', 'on_scene'] as const;

export default function KpiCards({ requests, ambulances }: KpiCardsProps) {
  const cards = [
    { label: 'Total requests', value: requests.length, tone: 'bg-comic-cream text-ink' },
    {
      label: 'Pending',
      value: requests.filter((r) => r.status === 'pending').length,
      tone: 'bg-comic-red text-comic-cream',
    },
    {
      label: 'Active assignments',
      value: requests.filter((r) => (ACTIVE as readonly string[]).includes(r.status)).length,
      tone: 'bg-comic-orange text-ink',
    },
    {
      label: 'Available ambulances',
      value: ambulances.filter((a) => a.status === 'available').length,
      tone: 'bg-comic-yellow-deep text-ink',
    },
    {
      label: 'Busy ambulances',
      value: ambulances.filter((a) => a.status === 'busy').length,
      tone: 'bg-comic-cream text-ink',
    },
    {
      label: 'Completed trips',
      value: requests.filter((r) => r.status === 'completed').length,
      tone: 'bg-ink text-comic-cream',
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`border-4 border-ink p-4 shadow-panel-sm transition-transform duration-200 hover:-translate-y-1 ${card.tone}`}
        >
          <dt className="font-body text-xs font-bold uppercase tracking-wide opacity-80">{card.label}</dt>
          <dd className="mt-1 font-display text-5xl leading-none">{card.value}</dd>
        </div>
      ))}
    </dl>
  );
}
