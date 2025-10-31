// utils/loadFont.ts
const injected = new Set<string>();

// Font di sistema che non richiedono caricamento da Google Fonts
const SYSTEM_FONTS = ['Helvetica Neue', 'Helvetica', 'Arial', 'Times New Roman'];

export function loadGoogleFont(family: string, weights: number[] = [400], italic = false) {
  // Se è un font di sistema, non caricarlo da Google Fonts
  if (SYSTEM_FONTS.includes(family)) {
    return Promise.resolve();
  }

  const uniq = Array.from(new Set(weights)).sort((a,b)=>a-b);
  const parts = uniq.map(w => `0,${w}`);
  const italicParts = italic ? uniq.map(w => `1,${w}`) : [];
  const axis = `ital,wght@${[...parts, ...italicParts].join(';')}`;
  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${axis}&display=swap`;

  if (injected.has(href)) return Promise.resolve();
  injected.add(href);

  return new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = async () => {
      try { await (document as any).fonts?.ready; } catch {}
      resolve();
    };
    link.onerror = () => reject(new Error(`Failed to load font ${family}`));
    document.head.appendChild(link);
  });
}
