import type { DispatchEvent } from '@/types';

interface ActivityLogProps {
  events: DispatchEvent[];
}

const TIME_FORMAT = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export default function ActivityLog({ events }: ActivityLogProps) {
  return (
    <section className="comic-panel flex max-h-[520px] flex-col p-0">
      <div className="border-b-4 border-ink bg-comic-yellow p-4">
        <h2 className="text-3xl text-ink">Activity</h2>
        <p className="text-xs text-ink/75">Automated and dispatcher actions, newest first.</p>
      </div>
      {events.length === 0 ? (
        <p className="p-6 text-center text-sm text-ink/70">No activity yet. Events appear here as requests arrive.</p>
      ) : (
        <ol className="flex-1 space-y-0 overflow-y-auto">
          {events.map((entry) => (
            <li key={entry.id} className="border-b-2 border-ink/15 px-4 py-3 text-sm">
              <p className="font-bold text-ink">{entry.message}</p>
              <p className="mt-0.5 text-xs text-ink/60">
                {TIME_FORMAT.format(entry.createdAt)}
                {entry.requestId ? ` - ${entry.requestId}` : ''}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
