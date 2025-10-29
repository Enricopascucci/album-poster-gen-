// utils/exportPoster.ts
// Export “a prova di stretch”: clona off-screen, dà width/height fissi al poster,
// e calcola le dimensioni dell’immagine artwork in base a contain/cover.

import html2canvas from 'html2canvas';

type ExportOpts = {
  scale?: number;             // moltiplicatore qualità (default 4)
  ratio?: [number, number];   // rapporto poster [w,h] (default [2,3])
  background?: string | null; // null = trasparente
  baseWidthPx?: number;       // opzionale: forza una larghezza base (es. 1000) invece di usare la larghezza attuale
};

function sizeForFit(
  fit: 'contain' | 'cover',
  natW: number, natH: number,
  boxW: number, boxH: number
) {
  if (!natW || !natH || !boxW || !boxH) return { w: boxW, h: boxH };
  if (fit === 'contain') {
    const s = Math.min(boxW / natW, boxH / natH);
    return { w: Math.round(natW * s), h: Math.round(natH * s) };
  } else {
    const s = Math.max(boxW / natW, boxH / natH);
    return { w: Math.round(natW * s), h: Math.round(natH * s) };
  }
}

export async function exportAsPNG(
  node: HTMLElement,
  filename = 'poster.png',
  opts: ExportOpts = {}
) {
  const scale = opts.scale ?? 4;
  const [rw, rh] = opts.ratio ?? [2, 3]; // 2:3
  const background = opts.background ?? null;

  // 1) dimensioni poster
  const rect = node.getBoundingClientRect();
  const width = Math.round(opts.baseWidthPx ?? rect.width);
  const height = Math.round(width * (rh / rw));

  // 2) clone off-screen
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'fixed',
    left: '-100000px',
    top: '0',
    zIndex: '-1',
    pointerEvents: 'none',
  } as CSSStyleDeclaration);

  const clone = node.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    width: `${width}px`,
    height: `${height}px`,
    aspectRatio: 'auto',
    transform: 'none',
    contain: 'paint',
  } as CSSStyleDeclaration);
  clone.classList.remove('aspect-[2/3]');

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    // 3) FIX cover stretch: rispetta contain/cover dentro al clone
    const container = clone.querySelector('[data-artwork-container]') as HTMLElement | null;
    const img = clone.querySelector('[data-artwork]') as HTMLImageElement | null;

    if (container && img) {
      const fitAttr = (img.getAttribute('data-fit') as 'contain' | 'cover') || 'contain';

      // Natural size (nel clone a volte è 0 → ricarichiamo in memoria)
      let natW = img.naturalWidth;
      let natH = img.naturalHeight;
      if (!natW || !natH) {
        const tmp = new Image();
        tmp.crossOrigin = 'anonymous';
        tmp.src = img.getAttribute('src') || '';
        await new Promise<void>((res) => {
          tmp.onload = () => { natW = tmp.naturalWidth; natH = tmp.naturalHeight; res(); };
          tmp.onerror = () => res();
        });
        if (!natW || !natH) { natW = 1000; natH = 1000; } // fallback
      }

      // Spazio disponibile nel box artwork (nel clone)
      const cRect = container.getBoundingClientRect();
      const boxW = Math.round(cRect.width);
      const boxH = Math.round(cRect.height);

      // Calcolo dimensioni corrette e centratura
      const { w, h } = sizeForFit(fitAttr, natW, natH, boxW, boxH);
      img.style.width = `${w}px`;
      img.style.height = `${h}px`;
      img.style.objectFit = 'fill';  // disattiva l'algoritmo del browser
      img.style.maxWidth = 'none';
      img.style.maxHeight = 'none';

      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
    }

    // 4) font ready (best-effort)
    try { await (document as any).fonts?.ready; } catch {}

    // 5) rasterizza clone
    const canvas = await html2canvas(clone, {
      backgroundColor: background,
      useCORS: true,
      allowTaint: false,
      scale: scale * (window.devicePixelRatio || 1),
      width, height,
      windowWidth: Math.max(document.documentElement.scrollWidth, window.innerWidth),
      windowHeight: Math.max(document.documentElement.scrollHeight, window.innerHeight),
    });

    // 6) download
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
    link.click();
  } finally {
    // 7) cleanup
    document.body.removeChild(wrapper);
  }
}
