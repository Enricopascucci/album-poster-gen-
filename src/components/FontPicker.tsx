import  { useEffect, useMemo } from 'react';
import { loadGoogleFont } from '../utils/loadFont';

/** Tipi esportati (compatibili con l’uso esistente) */
export type FontPickerValue = {
  familyId: FontId;
  weight: number;
};

export type FontId =
  | 'Helvetica Neue' | 'Inter' | 'Roboto' | 'Open Sans' | 'Poppins' | 'Montserrat' | 'Source Sans 3' | 'Noto Sans' | 'Lato' | 'Raleway'
  | 'Playfair Display' | 'Merriweather' | 'Lora' | 'Noto Serif'
  | 'Bebas Neue' | 'Oswald' | 'Anton' | 'Bricolage Grotesque'
  | 'JetBrains Mono' | 'Fira Code';

type Category = 'sans' | 'serif' | 'display' | 'mono';

type FontChoice = {
  id: FontId;
  label: string;
  stack: string;       // css font-family stack
  weights: number[];   // pesi disponibili
  category: Category;
};

/** Lista curata dei font più usati (Google Fonts) */
const FONTS: FontChoice[] = [
  // Sans-serif popolari
  { id: 'Helvetica Neue', label: 'Helvetica Neue', stack: `'Helvetica Neue', Helvetica, Arial, ui-sans-serif, system-ui, -apple-system, sans-serif`, weights: [300,400,500,700], category: 'sans' },
  { id: 'Inter',          label: 'Inter',          stack: `'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`, weights: [300,400,500,600,700,800], category: 'sans' },
  { id: 'Roboto',         label: 'Roboto',         stack: `'Roboto', ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial, sans-serif`,        weights: [300,400,500,700,900], category: 'sans' },
  { id: 'Open Sans',      label: 'Open Sans',      stack: `'Open Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial, sans-serif`,     weights: [300,400,600,700,800], category: 'sans' },
  { id: 'Poppins',        label: 'Poppins',        stack: `'Poppins', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`, weights: [300,400,500,600,700,800], category: 'sans' },
  { id: 'Montserrat',     label: 'Montserrat',     stack: `'Montserrat', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`, weights: [300,400,500,600,700,800], category: 'sans' },
  { id: 'Source Sans 3',  label: 'Source Sans 3',  stack: `'Source Sans 3', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`, weights: [300,400,600,700,800], category: 'sans' },
  { id: 'Noto Sans',      label: 'Noto Sans',      stack: `'Noto Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`, weights: [300,400,500,600,700], category: 'sans' },
  { id: 'Lato',           label: 'Lato',           stack: `'Lato', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,  weights: [300,400,700,900], category: 'sans' },
  { id: 'Raleway',        label: 'Raleway',        stack: `'Raleway', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`, weights: [300,400,500,600,700,800], category: 'sans' },

  // Serif popolari
  { id: 'Playfair Display', label: 'Playfair Display', stack: `'Playfair Display', ui-serif, Georgia, 'Times New Roman', Times, serif`, weights: [400,500,600,700], category: 'serif' },
  { id: 'Merriweather',     label: 'Merriweather',     stack: `'Merriweather', ui-serif, Georgia, 'Times New Roman', Times, serif`,                weights: [300,400,700,900], category: 'serif' },
  { id: 'Lora',             label: 'Lora',             stack: `'Lora', ui-serif, Georgia, 'Times New Roman', Times, serif`,                        weights: [400,500,600,700], category: 'serif' },
  { id: 'Noto Serif',       label: 'Noto Serif',       stack: `'Noto Serif', ui-serif, Georgia, 'Times New Roman', Times, serif`,                  weights: [400,500,600,700], category: 'serif' },

  // Display per titoli
  { id: 'Bebas Neue',     label: 'Bebas Neue',     stack: `'Bebas Neue', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`, weights: [400], category: 'display' },
  { id: 'Oswald',         label: 'Oswald',         stack: `'Oswald', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,      weights: [300,400,500,600,700], category: 'display' },
  { id: 'Anton',          label: 'Anton',          stack: `'Anton', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,       weights: [400], category: 'display' },
  { id: 'Bricolage Grotesque',
    label: 'Bricolage Grotesque',
    stack: `'Bricolage Grotesque', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`,
    // Supporta più pesi (è un variable font); includi quelli che ti servono
    weights: [200,300,400,500,600,700,800],
    category: 'display'
  },

  // Monospace
  { id: 'JetBrains Mono', label: 'JetBrains Mono', stack: `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`, weights: [300,400,500,600,700,800], category: 'mono' },
  { id: 'Fira Code',      label: 'Fira Code',      stack: `'Fira Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace`,          weights: [300,400,500,600,700], category: 'mono' },
];

type Props = {
  value: FontPickerValue;
  onChange: (v: FontPickerValue, cssStack: string) => void;
};

export function FontPicker({ value, onChange }: Props) {
  const current = useMemo(
    () => FONTS.find(f => f.id === value.familyId) ?? FONTS[0],
    [value.familyId]
  );

  // Carica la famiglia selezionata (tutti i pesi disponibili di quella famiglia)
  useEffect(() => {
    loadGoogleFont(current.id, current.weights);
  }, [current.id]);

  const groups: Record<Category, FontChoice[]> = useMemo(() => ({
    sans:   FONTS.filter(f => f.category === 'sans'),
    serif:  FONTS.filter(f => f.category === 'serif'),
    display:FONTS.filter(f => f.category === 'display'),
    mono:   FONTS.filter(f => f.category === 'mono'),
  }), []);

  return (
    <div className="space-y-4">
      {/* Preview */}


      {/* Famiglie: griglie per categoria (no input libero) */}
      {(['sans','serif','display','mono'] as Category[]).map(cat => {
        const list = groups[cat];
        return (
          <div key={cat} className="space-y-2">
            <div className="text-[11px] uppercase tracking-wide text-gray-500">{cat}</div>
            <div className="grid grid-cols-2 gap-2">
              {list.map(f => {
                const selected = f.id === current.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      const nextWeight = f.weights.includes(value.weight) ? value.weight : f.weights[0];
                      onChange({ familyId: f.id, weight: nextWeight }, f.stack);
                    }}
                    className={`text-left rounded-lg border px-2 py-2 transition
                      ${selected ? 'border-black bg-black text-white' : 'border-gray-200 hover:bg-gray-50'}`}
                    style={{ fontFamily: f.stack }}
                    title={f.label}
                  >
                    <div className="text-sm" style={{ fontWeight: 600 }}>{f.label}</div>
                    <div className="text-[11px] opacity-70">Pesi: {f.weights.join(', ')}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Scelta peso per la famiglia corrente */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Peso</label>
        <div className="grid grid-cols-6 gap-1">
          {current.weights.map(w => {
            const selected = w === value.weight;
            return (
              <button
                key={w}
                type="button"
                onClick={() => onChange({ familyId: current.id, weight: w }, current.stack)}
                className={`rounded border px-2 py-1 text-sm
                  ${selected ? 'bg-black text-white border-black' : 'border-gray-200 hover:bg-gray-50'}`}
                style={{ fontFamily: current.stack, fontWeight: w }}
                title={`Peso ${w}`}
              >
                {w}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
