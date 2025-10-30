import { useEffect, useRef, useState } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cattura il poster come immagine quando la modale si apre
  useEffect(() => {
    if (isOpen && posterRef.current && canvasRef.current) {
      const posterElement = posterRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Imposta dimensioni canvas (rapporto 2:3)
      const width = 800;
      const height = 1200;
      canvas.width = width;
      canvas.height = height;

      // Usa html2canvas per catturare il poster
      import("html2canvas").then(({ default: html2canvas }) => {
        html2canvas(posterElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
        }).then((posterCanvas) => {
          // Disegna sul canvas ridimensionando
          ctx.drawImage(posterCanvas, 0, 0, width, height);
          setPosterImage(canvas.toDataURL("image/png"));
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
      <canvas ref={canvasRef} className="hidden" />

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
      <div className="w-full h-full max-w-7xl mx-auto px-8 py-12 flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Your Poster Preview
          </h2>
          <p className="text-white/70">
            See how your poster looks in different settings
          </p>
        </div>

        {/* Mockup viewer */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Previous button */}
          <button
            onClick={prevMockup}
            className="absolute left-0 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white z-10 hover:scale-110"
            title="Previous (←)"
          >
            <div className="scale-[1.55]">
              <ChevronLeft />
            </div>
          </button>

          {/* Mockup scene */}
          <div
            className="relative w-full max-w-4xl h-[70vh] rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-500"
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
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="text-white/50 text-lg">Loading preview...</div>
            )}
          </div>

          {/* Next button */}
          <button
            onClick={nextMockup}
            className="absolute right-0 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white z-10 hover:scale-110"
            title="Next (→)"
          >
            <div className="scale-[1.55]">
              <ChevronRight />
            </div>
          </button>
        </div>

        {/* Mockup indicators */}
        <div className="flex items-center justify-center gap-3 mt-8 mb-6">
          {mockupScenes.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => setCurrentIndex(idx)}
              className="group flex flex-col items-center gap-2"
            >
              <div
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-12 bg-white"
                    : "w-2 bg-white/30 group-hover:bg-white/50"
                }`}
              />
              <span
                className={`text-sm transition-colors ${
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

        {/* Warning banner for token mode */}
        {tokenMode && (
          <div className="max-w-2xl mx-auto mb-6 bg-orange-500/20 border-2 border-orange-500 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">One-Time Download Only</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  You can download this poster <strong>only once</strong>. Make sure you're satisfied with your customization before proceeding. After download, this link will no longer work.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Download button */}
        <div className="flex justify-center">
          <button
            onClick={onConfirmDownload}
            disabled={!posterImage}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center gap-3 transition-all hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            <div className="scale-[1.33]">
              <DownloadIcon />
            </div>
            {tokenMode ? 'Download Poster (One-Time Only)' : 'Download High-Resolution Poster'}
          </button>
        </div>

        <p className="text-center text-white/50 text-sm mt-4">
          High-resolution PNG • Perfect for printing
        </p>
      </div>
    </div>
  );
}
