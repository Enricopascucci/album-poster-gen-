import { useEffect, useState } from 'react';

export function useArtworkPreload(src?: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function preload() {
      setReady(false);
      if (!src) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const onLoad = () => { if (!cancelled) setReady(true); };
      const onError = () => { if (!cancelled) setReady(false); };
      img.addEventListener('load', onLoad, { once: true });
      img.addEventListener('error', onError, { once: true });
      img.src = src;
      try { await (img as HTMLImageElement & { decode?: () => Promise<void> }).decode?.(); } catch {}
    }
    preload();
    return () => { cancelled = true; };
  }, [src]);

  return ready;
}
