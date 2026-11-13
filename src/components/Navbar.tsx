import { Ambulance, Zap } from 'lucide-react';
import type { View } from '@/types';

interface NavbarProps {
  view: View;
  onNavigate: (view: View) => void;
}

const LINKS: { view: View; label: string; badge?: string }[] = [
  { view: 'home', label: 'About' },
  { view: 'request', label: 'Request ambulance' },
  { view: 'dispatch', label: 'Dispatch console' },
  { view: 'simulation', label: 'Simulation Demos', badge: 'BPMN' },
];

export default function Navbar({ view, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-ink bg-ink text-comic-cream">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 transition-transform hover:-rotate-2"
          aria-label="RapidRelay home"
        >
          <span className="flex h-10 w-10 items-center justify-center border-4 border-ink bg-comic-red shadow-panel-sm">
            <Ambulance className="h-6 w-6 text-comic-cream" strokeWidth={2.5} />
          </span>
          <span className="font-display text-2xl tracking-wider text-comic-yellow">RapidRelay</span>
        </button>

        <nav className="flex flex-wrap items-center gap-2" aria-label="Main">
          {LINKS.map((link) => {
            const active = link.view === view;
            return (
              <button
                key={link.view}
                onClick={() => onNavigate(link.view)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-1.5 border-2 px-3 py-1.5 font-body text-sm font-bold uppercase tracking-wide transition-all ${
                  active
                    ? 'border-comic-yellow bg-comic-yellow text-ink shadow-panel-sm'
                    : 'border-transparent text-comic-cream hover:border-comic-yellow hover:text-comic-yellow'
                }`}
              >
                {link.view === 'simulation' && <Zap className="h-4 w-4 text-comic-red fill-comic-red" />}
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-1 rounded bg-comic-red px-1.5 py-0.2 text-[10px] font-extrabold text-white">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
