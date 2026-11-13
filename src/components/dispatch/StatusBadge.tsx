import type { RequestStatus } from '@/types';
import { STATUS_LABEL } from '@/lib/dispatch';

const TONE: Record<RequestStatus, string> = {
  pending: 'bg-comic-red text-comic-cream',
  assigned: 'bg-comic-orange text-ink',
  accepted: 'bg-comic-yellow-deep text-ink',
  en_route: 'bg-comic-yellow-deep text-ink',
  on_scene: 'bg-comic-yellow-deep text-ink',
  completed: 'bg-ink text-comic-cream',
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return <span className={`comic-tag ${TONE[status]}`}>{STATUS_LABEL[status]}</span>;
}
