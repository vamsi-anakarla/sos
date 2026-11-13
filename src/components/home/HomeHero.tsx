import { Ambulance, ArrowRight, LayoutDashboard, PhoneCall } from 'lucide-react';
import type { View } from '@/types';

interface HomeHeroProps {
  onNavigate: (view: View) => void;
}

export default function HomeHero({ onNavigate }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden border-b-4 border-ink halftone-dark text-comic-cream">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div className="animate-pop-in">
          <p className="mb-4 inline-block -rotate-2 border-4 border-ink bg-comic-yellow px-3 py-1 font-display text-lg tracking-wider text-ink shadow-panel-sm">
            Bengaluru demo - simulated data only
          </p>
          <h1 className="text-5xl leading-[1.05] text-comic-cream sm:text-6xl lg:text-7xl">
            One call. <span className="text-comic-yellow">Every</span> channel. A{' '}
            <span className="text-comic-red [text-shadow:3px_3px_0_#fff28a]">fast</span> ambulance.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-comic-cream/90 sm:text-lg">
            RapidRelay routes phone, WhatsApp, app and API requests into one dispatch queue, so a
            human coordinator can find a suitable ambulance and keep every trip visible.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={() => onNavigate('request')} className="comic-button-primary">
              <Ambulance className="h-5 w-5" /> Request ambulance
              <ArrowRight className="h-5 w-5" />
            </button>
            <button onClick={() => onNavigate('dispatch')} className="comic-button-yellow">
              <LayoutDashboard className="h-5 w-5" /> Dispatch console
            </button>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md animate-pop-in [animation-delay:120ms]">
          <div className="ray-burst absolute inset-0 animate-wiggle rounded-full border-4 border-ink opacity-90" />
          <div className="absolute inset-6 starburst bg-comic-red border-4 border-ink" />
          <div className="absolute left-1/2 top-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-4 border-ink bg-comic-cream shadow-panel">
            <Ambulance className="h-24 w-24 text-comic-red" strokeWidth={2.2} />
          </div>
          <div className="speech-bubble absolute -right-2 top-4 px-4 py-2 font-display text-2xl tracking-wider text-ink sm:-right-6">
            Help is coming!
          </div>
          <div className="absolute -bottom-2 left-0 flex items-center gap-2 border-4 border-ink bg-comic-yellow px-3 py-2 font-body text-sm font-bold text-ink shadow-panel-sm">
            <PhoneCall className="h-4 w-4" /> Human-led dispatch
          </div>
        </div>
      </div>
    </section>
  );
}
