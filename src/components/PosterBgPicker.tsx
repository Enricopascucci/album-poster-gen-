import { PosterColorWheel } from './PosterColorWheel';

export type BgMode = 'white' | 'beige' | 'black' | 'blur' | 'blur-medium' | 'blur-intense' | 'custom';

interface PosterBgPickerProps {
  mode: BgMode;
  customColor: string;
  onModeChange: (m: BgMode) => void;
  onCustomChange: (hex: string) => void;
  disabled?: boolean;
}

const SUGGESTED: string[] = [
  '#ffffff', '#f5f0e8', '#0f0f10', '#151518',
  '#111111', '#1f2937', '#374151', '#9ca3af',
  '#e5e7eb', '#faf5e7', '#ffe8d6', '#fef3c7',
  '#d1fae5', '#e0f2fe', '#f5d0fe', '#fed7aa'
];

export function PosterBgPicker({
  mode, customColor, onModeChange, onCustomChange, disabled
}: PosterBgPickerProps) {

  const Button = ({ value, label }: { value: BgMode; label: string }) => {
    const selected = mode === value;
    return (
      <button
        type="button"
        disabled={disabled}
        aria-pressed={selected}
        onClick={() => onModeChange(value)}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition border
          ${selected ? 'bg-black text-white border-black' : 'text-gray-800 bg-white hover:bg-gray-100 border-gray-200'}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className={disabled ? 'opacity-60 cursor-not-allowed' : ''}>
      {/* Preset buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Button value="white" label="White" />
        <Button value="beige" label="Beige" />
        <Button value="black" label="Black" />
        <Button value="blur"  label="Blur Light" />
        <Button value="blur-medium"  label="Blur Medium" />
        <Button value="blur-intense"  label="Blur Intense" />
        <Button value="custom" label="Custom" />
      </div>

      {/* Preset swatches quando NON custom */}
      {mode !== 'custom' && (
        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
          {SUGGESTED.map(hex => (
            <button
              key={hex}
              type="button"
              onClick={() => {
                if (hex.toLowerCase() === '#ffffff') onModeChange('white');
                else if (hex.toLowerCase() === '#f5f0e8') onModeChange('beige');
                else if (hex.toLowerCase() === '#0f0f10') onModeChange('black');
                else onModeChange('custom'), onCustomChange(hex);
              }}
              className="h-7 rounded border"
              style={{ backgroundColor: hex, borderColor: 'rgba(0,0,0,0.12)' }}
              title={hex}
            />
          ))}
        </div>
      )}

      {/* CUSTOM: ruota full-width + controlli sotto (no colonne affiancate) */}
      {mode === 'custom' && (
        <div className="flex flex-col items-center gap-4">
          <PosterColorWheel value={customColor} onChange={onCustomChange} size={240} />

          <div className="flex items-center gap-3 w-full">
            <input
              type="color"
              value={customColor}
              onChange={(e) => onCustomChange(e.target.value)}
              className="w-10 h-10 p-0 border rounded cursor-pointer"
              aria-label="Scegli colore personalizzato"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => onCustomChange(normalizeHex(e.target.value))}
              className="flex-1 text-sm rounded-lg border px-2 py-1.5"
              placeholder="#rrggbb"
            />
          </div>

          <div className="w-full">
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
              {SUGGESTED.map(hex => (
                <button
                  key={hex}
                  type="button"
                  title={hex}
                  onClick={() => onCustomChange(hex)}
                  className="h-7 rounded border"
                  style={{ backgroundColor: hex, borderColor: 'rgba(0,0,0,0.12)' }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* util */
function normalizeHex(input: string): string {
  let v = input.trim();
  if (!v.startsWith('#')) v = '#' + v;
  if (/^#([0-9a-fA-F]{3})$/.test(v)) {
    const r = v[1], g = v[2], b = v[3];
    v = `#${r}${r}${g}${g}${b}${b}`;
  }
  if (/^#([0-9a-fA-F]{6})$/.test(v)) return v.toLowerCase();
  return input;
}
