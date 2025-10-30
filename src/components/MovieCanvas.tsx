/**
 * 🎬 Movie Poster Canvas
 *
 * Canvas per la visualizzazione del poster di un film
 * Struttura simile a PosterCanvas ma adattata per contenuti cinematografici
 */

import React from 'react';
import type { Movie } from '../types/movie';
import { getDirector, getTopCast, formatMovieRuntime, getMovieYear, getTMDbImageUrl } from '../types/movie';

export type PosterBg = 'white' | 'beige' | 'blur' | 'black' | 'custom';
export type FrameStyle = 'none' | 'thin' | 'gallery';
export type LayoutVariant = '60-40' | '50-50';

interface MovieCanvasProps {
  movie: Movie;
  posterRef: React.RefObject<HTMLDivElement | null>;

  // personalizzazioni
  bg: PosterBg;
  frame: FrameStyle;
  layout: LayoutVariant;
  radius: number;
  tagline: string;
  showDuration: boolean;
  showRating: boolean;
  showCast: boolean;
  colorPalette: string[];

  // css vars già calcolate a monte
  themeVars: React.CSSProperties;
  fontVars: React.CSSProperties;
  frameVars: React.CSSProperties;
  rows: string;

  // allineamento orizzontale (margini coerenti top/bottom)
  insetXClass?: string;
}

export function MovieCanvas({
  movie,
  posterRef,
  bg,
  frame,
  radius,
  tagline,
  showDuration,
  showRating,
  showCast,
  colorPalette,
  themeVars,
  fontVars,
  frameVars,
  rows,
  insetXClass = 'px-6 md:px-8'
}: MovieCanvasProps) {
  // Dati derivati
  const posterUrl = getTMDbImageUrl(movie.poster_path, 'original');
  const year = getMovieYear(movie.release_date);
  const director = getDirector(movie.credits);
  const topCast = getTopCast(movie.credits, 8);
  const runtime = formatMovieRuntime(movie.runtime);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  // Classe per cast (simile a tracklist)
  const getCastListClass = (castCount: number): string => {
    if (castCount <= 6) return 'cast-few';       // 1-6: 1 colonna
    return 'cast-many';                          // 7+: 2 colonne piccole
  };

  return (
    <div className="flex justify-center">
      <div
        ref={posterRef}
        id="poster"
        className="relative w-full max-w-[760px] rounded-xl overflow-hidden poster"
        style={{
          ...themeVars,
          ...fontVars,
          ...frameVars,
          boxShadow: 'var(--frame-shadow)',
          fontFamily: 'var(--family)',
          fontWeight: 'var(--fw-body)',
        }}
      >
        {/* Sfondo */}
        {(bg === 'white' || bg === 'beige' || bg === 'black' || bg === 'custom') && (
          <div className="absolute inset-0" style={{ background: 'var(--poster-bg)' }} />
        )}
        {bg === 'blur' && posterUrl && (
          <>
            <div
              className="absolute inset-0 poster-blur-layer"
              style={{ backgroundImage: `url(${posterUrl})` }}
            />
            <div className="absolute inset-0" style={{ background: `rgba(0,0,0,var(--overlay))` }} />
          </>
        )}

        {/* Cornice */}
        {frame !== 'none' && (
          <div
            className="absolute inset-0 pointer-events-none border"
            style={{ borderColor: 'var(--ring)' }}
          />
        )}

        {/* Contenuto */}
        <div className="relative" style={{ padding: 'var(--frame-pad)' }}>
          <div className="aspect-[2/3] grid" style={{ gridTemplateRows: rows }}>
            {/* TOP: Poster Image */}
            <div className={`h-full ${insetXClass} pt-10`} data-artwork-container>
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={movie.title}
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
                  style={{
                    background: 'var(--chip)',
                    color: 'var(--text)',
                    borderColor: 'var(--ring)'
                  }}
                >
                  No Poster Available
                </div>
              )}
            </div>

            {/* BOTTOM: Info */}
            <div className={`overflow-hidden ${insetXClass} pb-6 pt-12 flex flex-col`}>
              <div className="grid grid-cols-2 gap-5 md:gap-8 flex-1">
                {/* LEFT: Cast */}
                <div className="flex flex-col">
                  {showCast && topCast.length > 0 && (
                    <div
                      className={`cast-list h-full overflow-hidden ${getCastListClass(topCast.length)}`}
                      style={{ color: 'var(--text)', fontWeight: 500 }}
                    >
                      {topCast.map((member, idx) => (
                        <div key={member.id} className="cast-item flex gap-[0.3rem] mb-1">
                          <span className="font-bold min-w-[1.2rem]">{idx + 1}</span>
                          <span className="flex-1 tracking-[0.15px] text-ellipsis overflow-hidden whitespace-nowrap">
                            {member.name.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {!showCast && (
                    <div className="h-full flex items-center justify-center text-sm" style={{ color: 'var(--muted)' }}>
                      Cast hidden
                    </div>
                  )}
                </div>

                {/* RIGHT: Palette + Info */}
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
                      {movie.title.toUpperCase()}
                    </h2>
                    {director && (
                      <p
                        className="m-0 tracking-[0.3px] text-[clamp(1rem,1.8vw,1.15rem)]"
                        style={{ color: 'var(--muted)' }}
                      >
                        DIRECTED BY {director.name.toUpperCase()}
                      </p>
                    )}
                    {tagline && (
                      <p
                        className="m-0 mt-1 text-[clamp(0.9rem,1.6vw,1rem)] tracking-[0.2px]"
                        style={{ color: 'var(--muted)' }}
                      >
                        {tagline}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto">
                    <div className="info-section flex flex-col gap-2 mb-3">
                      {movie.release_date && (
                        <span
                          className="font-bold tracking-[0.6px] leading-tight text-[clamp(1rem,2vw,1.25rem)]"
                          style={{ color: 'var(--text)' }}
                        >
                          RELEASED / {year}
                        </span>
                      )}
                      <div className="flex flex-col gap-1">
                        {showDuration && movie.runtime && (
                          <span
                            className="font-semibold tracking-[0.5px] text-[clamp(0.9rem,1.6vw,1.05rem)]"
                            style={{ color: 'var(--muted)' }}
                          >
                            RUNTIME: {runtime}
                          </span>
                        )}
                        {showRating && (
                          <span
                            className="font-semibold tracking-[0.5px] text-[clamp(0.9rem,1.6vw,1.05rem)]"
                            style={{ color: 'var(--muted)' }}
                          >
                            ⭐ {rating} / 10
                          </span>
                        )}
                      </div>
                    </div>

                    {movie.production_companies && movie.production_companies.length > 0 && (
                      <div
                        className="leading-tight text-left tracking-[0.2px] max-w-full break-words text-[0.5rem] md:text-[0.52rem]"
                        style={{ color: 'var(--subtle)' }}
                      >
                        {movie.production_companies.slice(0, 2).map(c => c.name).join(' • ').toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
