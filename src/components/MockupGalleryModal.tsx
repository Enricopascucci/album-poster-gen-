import { useEffect, useState } from "react";
import { XIcon, DownloadIcon, ChevronLeft, ChevronRight } from "./icons";

interface MockupGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDownload: () => void;
  posterRef: React.RefObject<HTMLDivElement | null>;
  albumName: string;
  tokenMode?: boolean;
}

const mockupScenes = [
  {
    id: "clean",
    name: "Clean View",
    bgImage: null,
    bg: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
    posterSize: "50%",
    posterTransform: "perspective(1000px) rotateY(0deg)",
    posterShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  {
    id: "minimal-dark",
    name: "Dark Wall",
    bgImage: null,
    bg: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)",
    posterSize: "45%",
    posterTransform: "perspective(1000px) rotateY(-2deg)",
    posterShadow: "0 30px 80px rgba(0,0,0,0.6)",
  },
  {
    id: "warm-tones",
    name: "Warm Tones",
    bgImage: null,
    bg: "linear-gradient(135deg, #f9f3e8 0%, #e8dcc8 100%)",
    posterSize: "45%",
    posterTransform: "perspective(1000px) rotateY(1deg)",
    posterShadow: "0 25px 70px rgba(139,97,58,0.2)",
  },
  {
    id: "modern-grey",
    name: "Modern Grey",
    bgImage: null,
    bg: "linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%)",
    posterSize: "47%",
    posterTransform: "perspective(1000px) rotateY(0deg) scale(0.98)",
    posterShadow: "0 35px 90px rgba(0,0,0,0.18)",
  },
];

export function MockupGalleryModal({
  isOpen,
  onClose,
  onConfirmDownload,
  posterRef,
  albumName,
  tokenMode = false,
}: MockupGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [posterImage, setPosterImage] = useState<string>("");

  // Cattura il poster come immagine quando la modale si apre
  useEffect(() => {
    if (isOpen && posterRef.current) {
      const posterElement = posterRef.current;

      // Usa html-to-image per catturare il poster
      import("html-to-image").then(({ toPng }) => {
        toPng(posterElement, {
          pixelRatio: 2,
          cacheBust: true,
          skipFonts: false,
        }).then((dataUrl) => {
          setPosterImage(dataUrl);
        }).catch((error) => {
          console.error("Error capturing poster:", error);
        });
      });
    }
  }, [isOpen, posterRef]);

  const nextMockup = () => {
    setCurrentIndex((prev) => (prev + 1) % mockupScenes.length);
  };

  const prevMockup = () => {
    setCurrentIndex((prev) => (prev - 1 + mockupScenes.length) % mockupScenes.length);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextMockup();
      if (e.key === "ArrowLeft") prevMockup();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentMockup = mockupScenes[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
        title="Close (Esc)"
      >
        <div className="scale-[1.33]">
          <XIcon />
        </div>
      </button>

      {/* Content */}
      <div className="w-full h-full max-w-7xl mx-auto px-6 py-6 flex flex-col">
        {/* Warning banner for token mode */}
        {tokenMode && (
          <div className="max-w-2xl mx-auto mb-3 bg-orange-500/20 border border-orange-500 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-white text-xs">
                <strong>One-time download.</strong> Make sure you're satisfied before proceeding.
              </p>
            </div>
          </div>
        )}

        {/* Download button */}
        <div className="flex justify-center mb-3">
          <button
            onClick={onConfirmDownload}
            disabled={!posterImage}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-105 disabled:hover:scale-100 shadow-lg text-sm"
          >
            <div className="scale-[1.2]">
              <DownloadIcon />
            </div>
            {tokenMode ? 'Download Poster (One-Time Only)' : 'Download High-Resolution Poster'}
          </button>
        </div>

        <p className="text-center text-white/50 text-xs mb-4">
          High-resolution PNG • Perfect for printing
        </p>

        {/* Mockup viewer */}
        <div className="h-[100vh] flex items-center justify-center relative">
          {/* Previous button */}
          <button
            onClick={prevMockup}
            className="absolute left-0 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white z-10 hover:scale-110"
            title="Previous (←)"
          >
            <div className="scale-[1.33]">
              <ChevronLeft />
            </div>
          </button>

          {/* Mockup scene */}
          <div
            className="relative w-full max-w-4xl h-full rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-500"
            style={{
              background: currentMockup.bg,
            }}
          >
            {posterImage ? (
              <div
                className="relative transition-all duration-500"
                style={{
                  width: currentMockup.posterSize,
                  aspectRatio: "2/3",
                  transform: currentMockup.posterTransform,
                  filter: `drop-shadow(${currentMockup.posterShadow})`,
                }}
              >
                <img
                  src={posterImage}
                  alt={`${albumName} poster`}
                  className="w-30 object-contain"
                />
              </div>
            ) : (
              <div className="text-white/50 text-lg">Loading preview...</div>
            )}
          </div>

          {/* Next button */}
          <button
            onClick={nextMockup}
            className="absolute right-0 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white z-10 hover:scale-110"
            title="Next (→)"
          >
            <div className="scale-[1.33]">
              <ChevronRight />
            </div>
          </button>
        </div>

        {/* Mockup indicators */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {mockupScenes.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => setCurrentIndex(idx)}
              className="group flex flex-col items-center gap-1"
            >
              <div
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-10 bg-white"
                    : "w-1.5 bg-white/30 group-hover:bg-white/50"
                }`}
              />
              <span
                className={`text-xs transition-colors ${
                  idx === currentIndex
                    ? "text-white font-medium"
                    : "text-white/50 group-hover:text-white/70"
                }`}
              >
                {scene.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
