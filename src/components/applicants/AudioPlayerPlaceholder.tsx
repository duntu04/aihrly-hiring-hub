import { Mic, Play } from "lucide-react";

export function AudioPlayerPlaceholder({ fallbackText, base64Audio }: { fallbackText?: string, base64Audio?: string }) {
  if (base64Audio) {
    return (
      <div className="rounded-lg border border-border bg-surface-2/50 p-4">
        <audio controls src={base64Audio} className="w-full h-10" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface-2/50 p-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled
          aria-label="Play audio (disabled)"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-text-muted cursor-not-allowed"
        >
          <Play className="h-4 w-4" />
        </button>
        <div className="flex-1 flex items-center gap-[3px] h-8">
          {Array.from({ length: 28 }).map((_, i) => {
            const h = 30 + ((i * 37) % 60);
            return (
              <span
                key={i}
                className="block w-[3px] rounded-full bg-text-muted/40"
                style={{
                  height: `${h}%`,
                  animation: `pulse-bar ${1.2 + (i % 5) * 0.15}s ease-in-out infinite`,
                  animationDelay: `${i * 0.04}s`,
                }}
              />
            );
          })}
        </div>
        <span className="text-xs text-text-muted font-mono">--:--</span>
      </div>
      <p className="mt-3 flex items-start gap-2 text-xs text-text-secondary">
        <Mic className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        Audio responses are not available in this preview.
      </p>
      {fallbackText && (
        <div className="mt-3 rounded-md bg-card border border-border p-3 text-sm text-foreground whitespace-pre-wrap">
          {fallbackText}
        </div>
      )}
    </div>
  );
}
