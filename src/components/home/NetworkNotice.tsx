import { OctagonAlert } from 'lucide-react';

export default function NetworkNotice() {
  return (
    <section className="border-b-4 border-ink bg-comic-cream">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="comic-panel grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8">
          <div className="flex h-20 w-20 items-center justify-center border-4 border-ink bg-comic-yellow shadow-panel-sm">
            <OctagonAlert className="h-10 w-10 text-comic-red" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display text-lg tracking-wider text-comic-red">
              Simulation - not connected to the official 108 system
            </p>
            <h2 className="mt-1 text-3xl text-ink sm:text-4xl">Emergency? Call 112 or 108 now.</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              For life-threatening emergencies in India, call 112 or 108 directly. This demo is not an
              official government emergency service. It does not receive official 108 calls, dispatch
              government ambulances or access government databases.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
