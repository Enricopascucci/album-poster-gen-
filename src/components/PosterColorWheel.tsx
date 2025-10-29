import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  value: string;                    // hex, es. "#ff6600"
  onChange: (hex: string) => void;  // callback con hex aggiornato
  size?: number;                    // diametro canvas (px)
};

export function PosterColorWheel({ value, onChange, size = 220 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(value) ?? { h: 20, s: 1, v: 0.92 });

  // ridisegna la ruota quando cambia size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size;
    canvas.height = size;
    drawWheel(canvas, hsv.v); // disegniamo HSV con V costante (slider separato)
  }, [size]);

  // se cambia dall’esterno il valore hex → aggiorna stato
  useEffect(() => {
    const parsed = hexToHsv(value);
    if (parsed) setHsv(prev => ({ ...prev, h: parsed.h, s: parsed.s, v: parsed.v }));
  }, [value]);

  // preview + marker position
  const { markerX, markerY } = useMemo(() => {
    const r = (size / 2) - 12; // raggio utile
    const rad = deg2rad(hsv.h);
    const rr = hsv.s * r;
    const cx = size / 2 + Math.cos(rad) * rr;
    const cy = size / 2 + Math.sin(rad) * rr;
    return { markerX: cx, markerY: cy };
  }, [hsv.h, hsv.s, size]);

  // pointer events
  function handlePointer(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = size / 2;
    const cy = size / 2;
    const dx = x - cx;
    const dy = y - cy;
    const rMax = (size / 2) - 12;

    const angle = Math.atan2(dy, dx);           // -PI..PI
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), rMax);

    const h = (rad2deg(angle) + 360) % 360;     // 0..360
    const s = Math.min(Math.max(dist / rMax, 0), 1);

    const next = { h, s, v: hsv.v };
    setHsv(next);
    onChange(hsvToHex(next));
  }

  function startDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointer(e);
  }
  function moveDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) handlePointer(e);
  }
  function endDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }

  // slider luminosità (V)
  function onValueChange(v: number) {
    const next = { ...hsv, v };
    setHsv(next);
    onChange(hsvToHex(next));
    // ridisegna wheel con V aggiornata (per percezione colori)
    const canvas = canvasRef.current;
    if (canvas) drawWheel(canvas, v);
  }

  const preview = hsvToHex(hsv);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative inline-block" style={{ width: size, height: size }}>
        <canvas
          ref={canvasRef}
          className="rounded-full border"
          style={{ borderColor: 'rgba(0,0,0,0.12)', touchAction: 'none', display: 'block' }}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
        {/* marker */}
        <div
          className="absolute w-4 h-4 rounded-full border bg-white"
          style={{
            left: markerX - 8,
            top: markerY - 8,
            borderColor: 'rgba(0,0,0,0.5)',
            boxShadow: '0 0 0 2px rgba(255,255,255,0.9), 0 1px 4px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Luminosità */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Luminosità</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={hsv.v}
          onChange={(e) => onValueChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Preview + HEX */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded border" style={{ background: preview, borderColor: 'rgba(0,0,0,0.12)' }} />
        <code className="text-xs text-gray-700">{preview}</code>
      </div>
    </div>
  );
}

/* ===== util ===== */

type HSV = { h: number; s: number; v: number };

function drawWheel(canvas: HTMLCanvasElement, value: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width } = canvas;
  const r = (width / 2) - 12;
  const cx = width / 2;
  const cy = width / 2;

  // pulisci
  ctx.clearRect(0, 0, width, width);

  // disegna ruota (hue+sat, v costante)
  const image = ctx.createImageData(width, width);
  for (let y = 0; y < width; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > r) continue;

      let h = (rad2deg(Math.atan2(dy, dx)) + 360) % 360;
      let s = Math.min(dist / r, 1);

      const rgb = hsvToRgb({ h, s, v: value });
      const idx = (y * width + x) * 4;
      image.data[idx] = rgb.r;
      image.data[idx + 1] = rgb.g;
      image.data[idx + 2] = rgb.b;
      image.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);

  // bordo
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function hsvToRgb({ h, s, v }: HSV) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHex(r:number,g:number,b:number) {
  return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');
}

function hsvToHex(hsv: HSV) {
  const { r, g, b } = hsvToRgb(hsv);
  return rgbToHex(r,g,b);
}

function hexToHsv(hex: string): HSV | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
  const rr = r/255, gg = g/255, bb = b/255;
  const max = Math.max(rr,gg,bb), min = Math.min(rr,gg,bb);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rr) h = 60 * (((gg - bb) / d) % 6);
    else if (max === gg) h = 60 * (((bb - rr) / d) + 2);
    else h = 60 * (((rr - gg) / d) + 4);
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h: (h + 360) % 360, s, v };
}
function deg2rad(d:number){ return d * Math.PI / 180; }
function rad2deg(r:number){ return r * 180 / Math.PI; }
