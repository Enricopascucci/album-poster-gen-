// utils/qr.ts
// ⚠️ Minimalissimo: per produzione usa una libreria seria o una tua implementazione robusta.
// Qui esportiamo solo la firma richiesta dal componente.
export function makeQrDataUrl(text: string, size = 128): string {
    // Place-holder: genera un "QR-like" (non criptico) usando una pattern grid deterministica
    // (non scansionabile da tutti i reader). Sostituisci appena puoi con un vero encoder QR.
    const cols = 25, rows = 25;
    const canvas = document.createElement('canvas');
    const scale = Math.floor(size / cols);
    canvas.width = cols * scale;
    canvas.height = rows * scale;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#000';
    // hash semplice
    let h = 2166136261;
    for (let i=0; i<text.length; i++) { h ^= text.charCodeAt(i); h += (h<<1) + (h<<4) + (h<<7) + (h<<8) + (h<<24); }
    // disegna pattern pseudo
    for (let y=0; y<rows; y++) {
      for (let x=0; x<cols; x++) {
        const bit = (h >> ((x + y*cols) % 31)) & 1;
        if (bit) ctx.fillRect(x*scale, y*scale, scale, scale);
        h = (h * 2654435761) >>> 0;
      }
    }
    // finder boxes per sembrare un QR
    const nb = 5;
    const drawFinder = (ox:number, oy:number) => {
      ctx.fillStyle = '#000'; ctx.fillRect(ox*scale, oy*scale, nb*scale, nb*scale);
      ctx.fillStyle = '#fff'; ctx.fillRect((ox+1)*scale, (oy+1)*scale, (nb-2)*scale, (nb-2)*scale);
      ctx.fillStyle = '#000'; ctx.fillRect((ox+2)*scale, (oy+2)*scale, (nb-4)*scale, (nb-4)*scale);
    };
    drawFinder(1,1); drawFinder(cols-nb-1,1); drawFinder(1,rows-nb-1);
    return canvas.toDataURL('image/png');
  }
  