const STATS = [
  { value: '7', label: 'Sample ambulances', note: 'Fictional fleet data' },
  { value: '4', label: 'Request channels', note: 'Phone, WhatsApp, app, API' },
  { value: '6', label: 'Languages planned', note: 'Kannada to Malayalam' },
  { value: '0', label: 'Autonomous decisions', note: 'Humans assign every vehicle' },
];

export default function StatsBand() {
  return (
    <section className="border-b-4 border-ink halftone-yellow">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="mb-10 text-center text-4xl text-ink sm:text-5xl">
          Let <span className="text-comic-red">numbers</span> speak!
        </h2>
        <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="comic-panel p-5 text-center transition-transform duration-200 hover:-rotate-1 hover:scale-105"
            >
              <dt className="font-body text-sm font-bold uppercase tracking-wide text-ink/70">
                {stat.label}
              </dt>
              <dd className="mt-1 font-display text-6xl leading-none text-comic-red">{stat.value}</dd>
              <p className="mt-2 text-xs text-ink/70">{stat.note}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
