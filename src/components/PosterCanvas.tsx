import React from 'react';
import type { Album, Track } from '../types/album';
import { formatReleaseDate } from '../utils/colorExtractor';
import { Waveform } from './Waveform';

export type PosterBg = 'white' | 'beige' | 'blur' | 'black' | 'custom';
export type FrameStyle = 'none' | 'thin' | 'gallery';
export type LayoutVariant = '60-40' | '50-50';

interface PosterCanvasProps {
  album: Album;
  posterRef: React.RefObject<HTMLDivElement | null>;

  artistNames: string;
  highResImage: string;
  tracks: Track[];
  totalDuration: string;

  colorPalette: string[];

  // personalizzazioni
  bg: PosterBg;
  frame: FrameStyle;
  layout: LayoutVariant;
  radius: number;
  tagline: string;
  showDuration: boolean;
  showCopyright: boolean;
  showWaveform: boolean;
  waveformData: number[];

  // css vars già calcolate a monte
  themeVars: React.CSSProperties;
  fontVars: React.CSSProperties;   // usa --family e --fw impostati da FontPicker
  frameVars: React.CSSProperties;
  rows: string;

  // allineamento orizzontale (margini coerenti top/bottom)
  insetXClass?: string;
}

export function PosterCanvas({
  album, posterRef,
  artistNames, highResImage, tracks, totalDuration,
  colorPalette, bg, frame, radius,
  tagline, showDuration, showWaveform, waveformData,
  themeVars, fontVars, frameVars, rows,
  insetXClass = 'px-6 md:px-8'
}: PosterCanvasProps) {

  const getTracklistClass = (trackCount: number): string => {
    if (trackCount <= 14) return 'tracks-few';       // 1-14: 1 colonna
    if (trackCount <= 24) return 'tracks-medium';    // 15-24: 2 colonne, font 0.9rem
    if (trackCount <= 36) return 'tracks-many';      // 25-36: 2 colonne, font 0.75rem
    return 'tracks-very-many';                       // 37+: 2 colonne, font 0.7rem
  };

  // Calcola dimensioni waveform (ridotte per stare nella colonna destra)
  const getWaveformSize = (trackCount: number): { width: number; height: number } => {
    if (trackCount <= 14) {
      return { width: 240, height: 32 };
    } else if (trackCount <= 20) {
      return { width: 230, height: 30 };
    } else if (trackCount <= 28) {
      return { width: 220, height: 28 };
    } else {
      return { width: 210, height: 26 };
    }
  };

  const waveformSize = getWaveformSize(tracks.length);

  return (
    <div className="flex justify-center">
<div
  ref={posterRef}
  id="poster"
  className="relative w-full max-w-[420px] md:max-w-[520px] lg:max-w-[680px] xl:max-w-[760px] rounded-xl overflow-hidden poster"
  style={{
    ...themeVars,
    ...fontVars,
    ...frameVars,
    boxShadow: 'var(--frame-shadow)',
    fontFamily: 'var(--family)',
    fontWeight: 'var(--fw-body)',
  }}
>
        {/* sfondo */}
        {(bg === 'white' || bg === 'beige' || bg === 'black' || bg === 'custom') && (
          <div className="absolute inset-0" style={{ background: 'var(--poster-bg)' }} />
        )}
        {bg === 'blur' && highResImage && (
          <>
            <div className="absolute inset-0 poster-blur-layer" style={{ backgroundImage: `url(${highResImage})` }} />
            <div className="absolute inset-0" style={{ background: `rgba(0,0,0,var(--overlay))` }} />
          </>
        )}

        {/* cornice */}
        {frame !== 'none' && (
          <div className="absolute inset-0 pointer-events-none border" style={{ borderColor: 'var(--ring)' }} />
        )}

        {/* contenuto */}
        <div className="relative" style={{ padding: 'var(--frame-pad)' }}>
          <div className="aspect-[2/3] grid" style={{ gridTemplateRows: rows }}>
            {/* TOP: artwork (margini coerenti) */}
            <div className={`h-full ${insetXClass} pt-10`} data-artwork-container>
              {highResImage ? (
                <img
                  src={highResImage}
                  alt={`${album?.name} — ${artistNames}`}
                  className="block border w-full h-full"
                  style={{
                    borderColor: 'var(--ring)',
                    borderRadius: radius ? `${radius}px` : undefined,
                    boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
                    objectFit: 'cover',
                  }}
                  crossOrigin="anonymous"
                  draggable={false}
                  data-artwork
                />
              ) : (
                <div
                  className="w-full h-full rounded-lg grid place-items-center border"
                  style={{ background: 'var(--chip)', color: 'var(--text)', borderColor: 'var(--ring)' }}
                >
                  Nessuna immagine disponibile
                </div>
              )}
            </div>

            {/* BOTTOM: info (stessi margini) */}
            <div className={`overflow-hidden ${insetXClass} pb-6 pt-12 flex flex-col`}>
              <div className="grid grid-cols-2 gap-5 md:gap-8 flex-1">
                {/* Tracce */}
                <div className="flex flex-col">
                  {tracks.length > 0 && (
                    <div
                      className={`tracklist-base h-full overflow-hidden ${getTracklistClass(tracks.length)}`}
                      style={{ color: 'var(--text)', fontWeight: 500 }}
                    >
                      {tracks.map((t: Track) => (
                        <div key={t.id ?? `${t.name}-${t.track_number}`} className="track-item flex gap-[0.3rem]">
                          <span className="font-bold min-w-[1.2rem]">{t.track_number}</span>
                          <span className="flex-1 tracking-[0.15px]">{t.name?.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Palette + Info */}
                <div className="flex flex-col">
                  {colorPalette.length > 0 && (
                    <div className="color-palette-container flex flex-row gap-[0.35rem] mb-5">
                      {colorPalette.map((c: string, i: number) => (
                        <div
                          key={`${c}-${i}`}
                          className="flex-1 rounded-[4px] min-w-0 h-[40px] md:h-[44px] border"
                          style={{ backgroundColor: c, borderColor: 'var(--ring)' }}
                          title={c}
                        />
                      ))}
                    </div>
                  )}

                  <div className="title-section mb-5 text-left">
                  <h2
  className="m-0 mb-[0.3rem] leading-tight tracking-[0.5px] text-[clamp(1.3rem,2.2vw,1.7rem)]"
  style={{ color: 'var(--text)', fontWeight: 'var(--fw-title)' as any }}
>
  {album?.name?.toUpperCase()}
</h2>
                    <p
                      className="m-0 tracking-[0.3px] text-[clamp(1rem,1.8vw,1.15rem)]"
                      style={{ color: 'var(--muted)' }}
                    >
                      {artistNames?.toUpperCase()}
                    </p>
                    {tagline && (
                      <p className="m-0 mt-1 text-[clamp(0.9rem,1.6vw,1rem)] tracking-[0.2px]" style={{ color: 'var(--muted)' }}>
                        {tagline}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto">
                    {/* Waveform sopra la data */}
                    {showWaveform && waveformData.length > 0 && (
                      <div className="mb-4">
                        <Waveform
                          data={waveformData}
                          width={waveformSize.width}
                          height={waveformSize.height}
                          color="var(--muted)"
                          barGap={1}
                          minBarHeight={2}
                          barRadius={1}
                        />
                      </div>
                    )}
                    <div className="info-section flex flex-col gap-2 mb-3">
                      {album?.release_date && (
                        <span
                          className="font-bold tracking-[0.6px] leading-tight text-[clamp(1rem,2vw,1.25rem)]"
                          style={{ color: 'var(--text)' }}
                        >
                          OUT NOW / {formatReleaseDate(album.release_date)}
                        </span>
                      )}
                      {showDuration && (
                        <span
                          className="font-semibold tracking-[0.5px] text-[clamp(0.9rem,1.6vw,1.05rem)]"
                          style={{ color: 'var(--muted)' }}
                        >
                          {album?.total_tracks} TRACKS{totalDuration ? `, ${totalDuration}` : ''}
                        </span>
                      )}
                    </div>

                    {(album?.copyrights?.[0]?.text || album?.label) && (
                      <div
                        className="leading-tight text-left tracking-[0.2px] max-w-full break-words text-[0.5rem] md:text-[0.52rem]"
                        style={{ color: 'var(--subtle)' }}
                      >
                        {(album?.copyrights?.[0]?.text || album?.label || '').toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* /bottom */}
          </div>
        </div>
        {/* /padding frame */}
      </div>
    </div>
  );
}
