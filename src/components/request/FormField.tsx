import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export default function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block font-display text-xl tracking-wider text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink/70">{hint}</p>}
      {error && (
        <p role="alert" className="border-2 border-comic-red bg-comic-red/10 px-3 py-1.5 text-sm font-bold text-comic-red">
          {error}
        </p>
      )}
    </div>
  );
}
