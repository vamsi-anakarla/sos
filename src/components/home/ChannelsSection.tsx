import { ArrowRight, Globe, MessageCircle, Phone, Smartphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Channel {
  icon: LucideIcon;
  title: string;
  tagline: string;
  automated: string[];
}

const CHANNELS: Channel[] = [
  {
    icon: Phone,
    title: 'Phone call',
    tagline: 'Speak once. The request fills itself in.',
    automated: [
      'Caller speech translated (simulated)',
      'Pickup and contact details filled in automatically',
      'Flagged for the dispatcher to confirm with the caller'
    ],
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    tagline: 'A guided chat that gathers everything.',
    automated: [
      'Language and location collected in a guided chat',
      'Voice notes transcribed and translated (simulated)',
      'Flagged for the dispatcher to confirm'
    ],
  },
  {
    icon: Smartphone,
    title: 'Mobile app',
    tagline: 'Three taps from pickup to dispatch.',
    automated: [
      'Pickup and patient details submitted in one form',
      'Ambulance matched without manual lookup',
      'Trip status updates as the crew progresses'
    ],
  },
  {
    icon: Globe,
    title: 'External API',
    tagline: 'Hospitals and fleets connect directly.',
    automated: [
      'Idempotency key blocks duplicate submissions',
      'Every request tagged with its source channel',
      'Trip progress tracked without manual updates'
    ],
  },
];

const FLOW = ['Four channels', 'One queue', 'Best match', 'Human confirms'];

export default function ChannelsSection() {
  return (
    <section id="channels" className="border-b-4 border-ink bg-comic-red halftone-red py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="inline-block -rotate-1 border-4 border-ink bg-comic-yellow px-3 py-1 font-display text-lg tracking-wider text-ink shadow-panel-sm">
            The core idea
          </p>
          <h2 className="mt-5 text-4xl text-comic-cream [text-shadow:4px_4px_0_#0d0d0d] sm:text-6xl">
            Four channels. One dispatch queue.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-comic-cream/95">
            Every request, whatever its source, lands in the same queue. The system does the paperwork and
            matching, so the dispatcher spends time on decisions, not data entry.
          </p>
        </div>

        <ol className="mb-12 flex flex-wrap items-center justify-center gap-3" aria-label="How requests flow">
          {FLOW.map((step, index) => (
            <li key={step} className="flex items-center gap-3">
              <span className="border-4 border-ink bg-comic-cream px-4 py-2 font-display text-lg tracking-wide text-ink shadow-panel-sm">
                {step}
              </span>
              {index < FLOW.length - 1 && <ArrowRight className="h-6 w-6 text-comic-cream" strokeWidth={3} />}
            </li>
          ))}
        </ol>

        <div className="grid gap-6 sm:grid-cols-2">
          {CHANNELS.map(({ icon: Icon, title, tagline, automated }, index) => (
            <article
              key={title}
              className="comic-panel group relative transition-transform duration-200 hover:-translate-y-1 hover:-rotate-1"
            >
              <span className="absolute -right-3 -top-4 flex h-10 w-10 items-center justify-center rounded-full border-4 border-ink bg-comic-orange font-display text-xl text-ink shadow-panel-sm">
                {index + 1}
              </span>
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center border-4 border-ink bg-comic-yellow-deep shadow-panel-sm transition-transform group-hover:rotate-6">
                  <Icon className="h-8 w-8 text-ink" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-3xl text-ink">{title}</h3>
                  <p className="mt-1 text-sm font-bold text-ink/75">{tagline}</p>
                </div>
              </div>
              <ul className="mt-5 space-y-2 border-t-4 border-ink pt-4">
                {automated.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-snug text-ink/85">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rotate-45 border-2 border-ink bg-comic-red" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
