import { useEffect, useState } from 'react';
import { extractColors, rgbToHex } from '../utils/colorExtractor';

export function usePalette(imageUrl?: string, count = 5) {
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!imageUrl) return;
      setLoading(true);
      setReady(false);
      try {
        const rgb = await extractColors(imageUrl, count);
        if (cancelled) return;
        setColors(rgb.map(rgbToHex));
      } catch {
        if (!cancelled) {
          setColors(['#8B7355','#A0826D','#B8957A','#D4A574','#E0C097']);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setReady(true);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [imageUrl, count]);

  return { colors, loading, ready };
}
