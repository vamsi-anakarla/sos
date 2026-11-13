import { Ambulance } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t-4 border-ink bg-ink text-comic-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2 font-display text-xl tracking-wider text-comic-yellow">
          <Ambulance className="h-5 w-5" /> RapidRelay
        </div>
        <p className="max-w-xl text-comic-cream/75">
          Demonstration only. Uses simulated data and is not an official emergency service. For
          life-threatening emergencies in India, call 112 or 108.
        </p>
      </div>
    </footer>
  );
}
