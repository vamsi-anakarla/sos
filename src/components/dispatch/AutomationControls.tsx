import { AlertTriangle, RefreshCw, Radio, Zap } from 'lucide-react';

interface AutomationControlsProps {
  autoDispatch: boolean;
  onAutoDispatchChange: (enabled: boolean) => void;
  feedEnabled: boolean;
  feedFinished: boolean;
  onFeedEnabledChange: (enabled: boolean) => void;
  loadError: string | null;
  saveError: string | null;
  onRetry: () => void;
}

function Toggle({
  label,
  description,
  icon: Icon,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  icon: typeof Zap;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 border-4 border-ink p-3 shadow-panel-sm transition-colors ${
        checked ? 'bg-comic-yellow-deep' : 'bg-white'
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <Icon className="h-6 w-6 shrink-0" strokeWidth={2.5} />
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg tracking-wide">{label}</span>
        <span className="block text-xs text-ink/75">{description}</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        aria-checked={checked}
        className="h-5 w-5 accent-comic-red"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export default function AutomationControls({
  autoDispatch,
  onAutoDispatchChange,
  feedEnabled,
  feedFinished,
  onFeedEnabledChange,
  loadError,
  saveError,
  onRetry,
}: AutomationControlsProps) {
  const error = loadError ?? saveError;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Toggle
          label="Auto-dispatch"
          description="Match and assign the best free ambulance automatically. You can override any assignment."
          icon={Zap}
          checked={autoDispatch}
          onChange={onAutoDispatchChange}
        />
        <Toggle
          label="Channel feed"
          description={
            feedFinished
              ? 'Sample feed complete. Submit a request to keep testing.'
              : 'Simulated calls, WhatsApp chats, app requests and partner API calls arrive automatically.'
          }
          icon={Radio}
          checked={feedEnabled && !feedFinished}
          disabled={feedFinished}
          onChange={onFeedEnabledChange}
        />
      </div>

      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 border-4 border-ink bg-comic-red p-4 text-comic-cream">
          <p className="flex items-start gap-2 text-sm font-bold">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {loadError ? `Dispatch data could not be loaded. ${loadError}` : `Some changes were not saved. ${saveError}`}
          </p>
          {loadError && (
            <button type="button" onClick={onRetry} className="comic-button-ghost px-4 py-2 text-base">
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
