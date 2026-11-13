const STEPS = [
  {
    title: 'Request comes in',
    body: 'A patient or caller submits a request from any channel. Details are captured once and stored against a request ID.',
  },
  {
    title: 'Dispatcher reviews',
    body: 'The dispatcher checks the pickup, confirms critical details with the caller and reviews suitable vehicles.',
  },
  {
    title: 'Operator responds',
    body: 'The assigned crew accepts or declines with a reason. A decline alerts the dispatcher straight away.',
  },
  {
    title: 'Trip is tracked',
    body: 'Status moves through pickup, hospital and handover. Nothing stays unassigned without an alert.',
  },
];

export default function HowItWorks() {
  return (
    <section className="border-b-4 border-ink bg-ink text-comic-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="text-5xl text-comic-orange [text-shadow:3px_3px_0_#0d0d0d]">How it works</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-comic-cream/85">
            Automation handles intake and tracking. People make every assignment decision.
          </p>
          <div className="mt-8 speech-bubble max-w-sm p-4 font-display text-2xl tracking-wide text-ink">
            "Human dispatchers always keep the final say."
          </div>
        </div>

        <ol className="space-y-6">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-ink bg-comic-orange font-display text-2xl text-ink shadow-panel-sm">
                {index + 1}
              </span>
              <div>
                <h3 className="text-2xl text-comic-yellow">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-comic-cream/85">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
