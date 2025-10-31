/**
 * 🎬 Movie Poster Generator
 *
 * Componente principale per la generazione di poster cinematografici
 * Gestisce personalizzazione e export
 */

import { useCallback, useMemo, useRef, useState } from "react";
import type { Movie } from "../types/movie";
import { getTMDbImageUrl } from "../types/movie";
import { exportAsPNG } from "../utils/exportPoster";
import { useArtworkPreload } from "../hooks/useArtworkPreload";
import { usePalette } from "../hooks/usePalette";
import { MovieCanvas } from "./MovieCanvas";
import type { PosterBg, FrameStyle, LayoutVariant, PaletteShape, TracklistColumns, TrackSpacing } from "./PosterCanvas";
import { PosterSidebar } from "./PosterSidebar";
import type { BgMode } from "./PosterBgPicker";
import type { FontPickerValue } from "./FontPicker";
import { LoadingOverlay } from "./Spinner";
import { MockupGalleryModal } from "./MockupGalleryModal";
import "./PosterStyles.css";

interface MoviePosterGeneratorProps {
  movie: Movie;
  onBack: () => void;
  tokenMode?: boolean;
  token?: string;
}

export function MoviePosterGenerator({
  movie,
  onBack,
  tokenMode = false,
  token
}: MoviePosterGeneratorProps) {
  const posterRef = useRef<HTMLDivElement | null>(null);

  // ====== Personalizzazioni ======
  const [bgMode, setBgMode] = useState<BgMode>("beige");
  const [customBg, setCustomBg] = useState<string>("#eaeaea");

  const [frame, setFrame] = useState<FrameStyle>("none");
  const [layout, setLayout] = useState<LayoutVariant>("60-40");
  const [radius, setRadius] = useState<number>(8);
  const [tagline, setTagline] = useState<string>("");
  const [showDuration, setShowDuration] = useState<boolean>(true);
  const [showRating, setShowRating] = useState<boolean>(true);
  const [showCast, setShowCast] = useState<boolean>(true);
  const [paletteShape, setPaletteShape] = useState<PaletteShape>("rounded");
  const [tracklistColumns, setTracklistColumns] = useState<TracklistColumns>("auto");
  const [trackSpacing, setTrackSpacing] = useState<TrackSpacing>(5);

  // ====== Font (FontPicker) ======
  const [fontValue, setFontValue] = useState<FontPickerValue>({
    familyId: "Inter",
    weight: 800,
  });
  const [fontStack, setFontStack] = useState<string>(
    `'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`
  );
  const handleFontChange = (v: FontPickerValue, cssStack: string) => {
    setFontValue(v);
    setFontStack(cssStack);
  };

  // ====== Dati film ======
  const posterUrl = getTMDbImageUrl(movie.poster_path, 'original');

  // ====== Caricamenti ======
  const imageReady = useArtworkPreload(posterUrl);
  const {
    colors: colorPalette,
    loading: loadingColors,
    ready: paletteReady,
  } = usePalette(posterUrl);

  // ====== Gradiente header sidebar ======
  const accentGradient = useMemo(() => {
    const [c1, c2, c3] = [
      colorPalette[0] || "#161616",
      colorPalette[1] || "#242424",
      colorPalette[2] || "#1f1f1f",
    ];
    return `linear-gradient(90deg, ${c1}, ${c2} 50%, ${c3})`;
  }, [colorPalette]);

  // ====== Tema (CSS vars) ======
  const themeVars = useMemo<React.CSSProperties>(() => {
    if (bgMode === "custom") return themeFromCustom(customBg);
    switch (bgMode) {
      case "white":
        return {
          "--poster-bg": "#ffffff",
          "--text": "#1a1a1a",
          "--muted": "#3e3e3e",
          "--subtle": "#5a5a5a",
          "--ring": "rgba(0,0,0,0.06)",
          "--shadow": "0 14px 50px rgba(0,0,0,0.25)",
          "--chip": "rgba(0,0,0,0.06)",
          "--overlay": "0",
        } as React.CSSProperties;
      case "beige":
        return {
          "--poster-bg": "#f5f0e8",
          "--text": "#1a1a1a",
          "--muted": "#4a4a4a",
          "--subtle": "#5a5a5a",
          "--ring": "rgba(0,0,0,0.05)",
          "--shadow": "0 14px 50px rgba(0,0,0,0.25)",
          "--chip": "rgba(0,0,0,0.06)",
          "--overlay": "0",
        } as React.CSSProperties;
      case "black":
        return {
          "--poster-bg": "#0f0f10",
          "--text": "#f5f5f5",
          "--muted": "rgba(255,255,255,0.86)",
          "--subtle": "rgba(255,255,255,0.72)",
          "--ring": "rgba(255,255,255,0.10)",
          "--shadow": "0 14px 50px rgba(0,0,0,0.6)",
          "--chip": "rgba(255,255,255,0.08)",
          "--overlay": "0",
        } as React.CSSProperties;
      case "blur":
        return {
          "--poster-bg": "#151518",
          "--text": "#f5f5f5",
          "--muted": "rgba(255,255,255,0.88)",
          "--subtle": "rgba(255,255,255,0.75)",
          "--ring": "rgba(255,255,255,0.10)",
          "--shadow": "0 14px 50px rgba(0,0,0,0.6)",
          "--chip": "rgba(0,0,0,0.25)",
          "--overlay": "0.35",
        } as React.CSSProperties;
      default:
        return {} as React.CSSProperties;
    }
  }, [bgMode, customBg]);

  // ====== Tipografia ======
  const fontVars = useMemo<React.CSSProperties>(() => {
    const w = fontValue.weight;
    const body = Math.max(300, Math.min(700, w - 200));
    const strong = Math.min(900, Math.max(600, w + 100));
    return {
      "--family": fontStack,
      "--fw-title": String(w),
      "--fw-body": String(body),
      "--fw-strong": String(strong),
    } as React.CSSProperties;
  }, [fontStack, fontValue.weight]);

  // ====== Frame ======
  const frameVars = useMemo<React.CSSProperties>(() => {
    switch (frame) {
      case "thin":
        return {
          "--frame-pad": "14px",
          "--frame-shadow": "0 10px 40px rgba(0,0,0,0.25)",
        } as React.CSSProperties;
      case "gallery":
        return {
          "--frame-pad": "28px",
          "--frame-shadow": "0 18px 60px rgba(0,0,0,0.35)",
        } as React.CSSProperties;
      default:
        return {
          "--frame-pad": "0px",
          "--frame-shadow": "var(--shadow)",
        } as React.CSSProperties;
    }
  }, [frame]);

  const rows = layout === "50-50" ? "50% 50%" : "60% 40%";

  // ====== Export ======
  const [downloading, setDownloading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [showMockupModal, setShowMockupModal] = useState(false);
  const canDownload =
    !downloading && !loadingColors && paletteReady && imageReady && !hasDownloaded;

  const handleDownload = useCallback(() => {
    if (!posterRef.current) return;

    if (tokenMode && !hasDownloaded) {
      const confirmed = window.confirm(
        '⚠️ WARNING: You can download the poster ONLY ONCE.\n\n' +
        'Are you sure you want to proceed?\n\n' +
        'Make sure you are satisfied with the customization!'
      );
      if (!confirmed) return;
    }

    setShowMockupModal(true);
  }, [tokenMode, hasDownloaded]);

  const handleConfirmDownload = useCallback(async () => {
    if (!posterRef.current) return;

    setShowMockupModal(false);
    setDownloading(true);

    try {
      const movieName = movie.title
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      const filename = `${movieName}_poster.png`;
      await exportAsPNG(posterRef.current, filename, {
        scale: 4,
        ratio: [2, 3],
        background: null,
      });

      // Se in tokenMode, marca come scaricato
      if (tokenMode && token) {
        const { markDownloaded } = await import('../services/tokenService');
        const success = await markDownloaded({
          token,
          posterData: {
            movieId: String(movie.id),
            movieName: movie.title,
            directorName: movie.credits?.crew.find(c => c.job === 'Director')?.name || 'N/A',
            customization: {
              bgMode,
              frame,
              layout,
              radius,
              tagline,
            },
          },
        });

        if (success) {
          setHasDownloaded(true);
          alert(
            '✅ Download completed!\n\n' +
            'Your poster has been successfully downloaded.\n' +
            'This link can no longer be used.'
          );
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      alert("Export failed. Check CORS or reduce quality.");
    } finally {
      setDownloading(false);
    }
  }, [movie, tokenMode, token, hasDownloaded, bgMode, frame, layout, radius, tagline]);

  const isInitialLoading = !imageReady || loadingColors;

  return (
    <div className="w-full max-w-[1500px] mx-auto p-4 md:p-6">
      {isInitialLoading && <LoadingOverlay text="Preparing poster..." />}

      <MockupGalleryModal
        isOpen={showMockupModal}
        onClose={() => setShowMockupModal(false)}
        onConfirmDownload={handleConfirmDownload}
        posterRef={posterRef}
        albumName={movie.title}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">
        <MovieCanvas
          movie={movie}
          posterRef={posterRef}
          bg={bgMode as PosterBg}
          frame={frame}
          layout={layout}
          radius={radius}
          tagline={tagline}
          showDuration={showDuration}
          showRating={showRating}
          showCast={showCast}
          colorPalette={colorPalette}
          themeVars={themeVars}
          fontVars={fontVars}
          frameVars={frameVars}
          rows={rows}
          insetXClass="px-6 md:px-8"
        />

        <PosterSidebar
          accentGradient={accentGradient}
          bgMode={bgMode}
          setBgMode={setBgMode}
          customBg={customBg}
          setCustomBg={setCustomBg}
          fontValue={fontValue}
          setFontValue={handleFontChange}
          layout={layout}
          setLayout={setLayout}
          radius={radius}
          setRadius={setRadius}
          frame={frame}
          setFrame={setFrame}
          paletteShape={paletteShape}
          setPaletteShape={setPaletteShape}
          tracklistColumns={tracklistColumns}
          setTracklistColumns={setTracklistColumns}
          trackSpacing={trackSpacing}
          setTrackSpacing={setTrackSpacing}
          tagline={tagline}
          setTagline={setTagline}
          showDuration={showDuration}
          setShowDuration={setShowDuration}
          showCopyright={showRating}
          setShowCopyright={setShowRating}
          showWaveform={showCast}
          setShowWaveform={setShowCast}
          onBack={onBack}
          onDownload={handleDownload}
          canDownload={canDownload}
          loadingColors={loadingColors}
          downloading={downloading}
        />
      </div>
    </div>
  );
}

/* ============================
   Utils per il tema custom
   ============================ */

function themeFromCustom(hex: string): React.CSSProperties {
  const rgb = hexToRgb(hex) ?? { r: 234, g: 234, b: 234 };
  const lum = relativeLuminance(rgb.r, rgb.g, rgb.b);

  const textIsDark = lum > 0.64;
  const text = textIsDark ? "#1a1a1a" : "#f5f5f5";
  const muted = textIsDark ? "#4a4a4a" : "rgba(255,255,255,0.88)";
  const subtle = textIsDark ? "#5a5a5a" : "rgba(255,255,255,0.75)";
  const ring = textIsDark ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.14)";
  const shadow = textIsDark
    ? "0 14px 50px rgba(0,0,0,0.25)"
    : "0 14px 50px rgba(0,0,0,0.6)";
  const chip = textIsDark ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.10)";

  return {
    "--poster-bg": hex,
    "--text": text,
    "--muted": muted,
    "--subtle": subtle,
    "--ring": ring,
    "--shadow": shadow,
    "--chip": chip,
    "--overlay": "0",
  } as React.CSSProperties;
}

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return null;
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

function relativeLuminance(r: number, g: number, b: number) {
  const srgb = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
