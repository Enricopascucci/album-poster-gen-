export type PosterBg = 'white' | 'beige' | 'blur' | 'black';

interface PosterBgSwitchProps {
  value: PosterBg;
  onChange: (value: PosterBg) => void;
  disabled?: boolean;
  className?: string;
}

export function PosterBgSwitch({ value, onChange, disabled, className }: PosterBgSwitchProps) {
  const options: PosterBg[] = ['white', 'beige', 'blur', 'black'];
  return (
    <div role="group" aria-label="Poster background" className={className ?? ''}>
      <div className={`inline-flex items-center gap-1 rounded-xl border px-1 py-1 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} style={{ borderColor: 'rgba(0,0,0,0.12)', background: 'rgba(0,0,0,0.06)', backdropFilter: 'blur(4px)' }}>
        {options.map(opt => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              onClick={() => onChange(opt)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${selected ? 'bg-black text-white' : 'text-black/80 hover:bg-black/10'}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
