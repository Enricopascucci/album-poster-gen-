import type { FrameStyle, LayoutVariant, PaletteShape, TracklistColumns, TrackSpacing } from './PosterCanvas';
import { ChevronLeft, DownloadIcon } from './icons';
import { PosterBgPicker, type BgMode } from './PosterBgPicker';
import { FontPicker, type FontPickerValue } from './FontPicker';

interface PosterSidebarProps {
  accentGradient: string;

  // Background
  bgMode: BgMode; setBgMode: (m: BgMode) => void;
  customBg: string; setCustomBg: (hex: string) => void;
  blurIntensity: number; setBlurIntensity: (n: number) => void;
  textColor: 'auto' | 'light' | 'dark'; setTextColor: (c: 'auto' | 'light' | 'dark') => void;

  // Font picker
  fontValue: FontPickerValue;
  setFontValue: (v: FontPickerValue, cssStack: string) => void;

  // Altri controlli
  layout: LayoutVariant; setLayout: (v: LayoutVariant) => void;
  radius: number; setRadius: (n: number) => void;
  frame: FrameStyle; setFrame: (v: FrameStyle) => void;
  paletteShape: PaletteShape; setPaletteShape: (v: PaletteShape) => void;
  tracklistColumns: TracklistColumns; setTracklistColumns: (v: TracklistColumns) => void;
  trackSpacing: TrackSpacing; setTrackSpacing: (v: TrackSpacing) => void;
  tagline: string; setTagline: (s: string) => void;
  showDuration: boolean; setShowDuration: (b: boolean) => void;
  showCopyright: boolean; setShowCopyright: (b: boolean) => void;
  showWaveform: boolean; setShowWaveform: (b: boolean) => void;

  // Azioni
  onBack: () => void;
  onDownload: () => void;
  canDownload: boolean;
  loadingColors: boolean;
  downloading: boolean;
}

export function PosterSidebar(p: PosterSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-4">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col max-h-[min(85vh,900px)]">
        {/* Header minimal */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={p.onBack}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronLeft />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={p.onDownload}
              disabled={!p.canDownload}
              className="inline-flex items-center gap-2 bg-black text-white font-medium px-5 py-2 rounded-lg hover:bg-gray-800 active:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black transition-colors text-sm"
              aria-live="polite"
              aria-busy={p.downloading || p.loadingColors}
            >
              <DownloadIcon />
              <span>
                {p.downloading ? 'Downloading...' : p.loadingColors ? 'Preparing...' : 'Download'}
              </span>
            </button>
          </div>
        </div>

        {/* Body scrollabile */}
        <div className="p-6 overflow-y-auto bg-gray-50">
          <div className="space-y-5">

            {/* Sezione Background */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Background</h3>
              <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
                <PosterBgPicker
                  mode={p.bgMode}
                  customColor={p.customBg}
                  onModeChange={p.setBgMode}
                  onCustomChange={p.setCustomBg}
                />

                {/* Blur Intensity Slider - mostra solo se bgMode === 'blur' */}
                {p.bgMode === 'blur' && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Blur Intensity
                      </label>
                      <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {p.blurIntensity}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={p.blurIntensity}
                      onChange={(e) => p.setBlurIntensity(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-400">
                      <span>More Visible</span>
                      <span>Less Visible</span>
                    </div>
                  </div>
                )}

                {/* Text Color Toggle */}
                <div className="pt-3 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => p.setTextColor('auto')}
                      className={`px-3 py-2 rounded-lg border font-medium text-xs transition-colors ${
                        p.textColor === 'auto'
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      Auto
                    </button>
                    <button
                      type="button"
                      onClick={() => p.setTextColor('dark')}
                      className={`px-3 py-2 rounded-lg border font-medium text-xs transition-colors ${
                        p.textColor === 'dark'
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      type="button"
                      onClick={() => p.setTextColor('light')}
                      className={`px-3 py-2 rounded-lg border font-medium text-xs transition-colors ${
                        p.textColor === 'light'
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      Light
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Sezione Tipografia */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Typography</h3>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <FontPicker value={p.fontValue} onChange={p.setFontValue} />
              </div>
            </section>

            {/* Sezione Layout */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Layout & Style</h3>
              <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-5">

                {/* Corner Radius */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Cover Corners
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 border border-gray-300 bg-gray-100"
                        style={{ borderRadius: `${p.radius}px` }}
                      />
                      <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {p.radius}px
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={1}
                    value={p.radius}
                    onChange={(e) => p.setRadius(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>Sharp</span>
                    <span>Rounded</span>
                  </div>
                </div>

                {/* Frame Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frame Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['none', 'thin', 'gallery'] as const).map((frameStyle) => (
                      <button
                        key={frameStyle}
                        type="button"
                        onClick={() => p.setFrame(frameStyle)}
                        className={`px-3 py-3 rounded-lg border font-medium text-xs capitalize transition-colors ${
                          p.frame === frameStyle
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-6 h-6 mx-auto mb-1.5 rounded border ${
                            p.frame === frameStyle ? 'border-white' : 'border-gray-300'
                          }`} style={{
                            padding: frameStyle === 'gallery' ? '3px' : frameStyle === 'thin' ? '1.5px' : '0'
                          }}>
                            <div className={`w-full h-full rounded ${
                              p.frame === frameStyle ? 'bg-white' : 'bg-gray-300'
                            }`} />
                          </div>
                          {frameStyle === 'none' ? 'None' : frameStyle}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Palette Shape */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Palette Shape
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['square', 'rounded', 'circle'] as const).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => p.setPaletteShape(shape)}
                        className={`px-3 py-3 rounded-lg border font-medium text-xs capitalize transition-colors ${
                          p.paletteShape === shape
                            ? 'border-black bg-black text-white'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-6 h-6 mx-auto mb-1.5 border ${
                            p.paletteShape === shape ? 'border-white bg-white' : 'border-gray-300 bg-gray-300'
                          }`} style={{
                            borderRadius:
                              shape === 'square' ? '0' :
                              shape === 'rounded' ? '4px' :
                              '50%'
                          }} />
                          {shape}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tracklist Columns */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracklist Columns
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['auto', '1-col', '2-col'] as const).map((cols) => {
                      const labels = {
                        'auto': 'Auto',
                        '1-col': '1 Column',
                        '2-col': '2 Columns'
                      };
                      return (
                        <button
                          key={cols}
                          type="button"
                          onClick={() => p.setTracklistColumns(cols)}
                          className={`px-3 py-3 rounded-lg border font-medium text-xs transition-colors ${
                            p.tracklistColumns === cols
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">{labels[cols]}</div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Auto: 1 column for ≤13 tracks, 2 columns for 14+ tracks
                  </p>
                </div>

                {/* Track Spacing */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Track Spacing
                    </label>
                    <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {p.trackSpacing}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={p.trackSpacing}
                    onChange={(e) => p.setTrackSpacing(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>Compact</span>
                    <span>Spacious</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Sezione Content */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Content</h3>
              <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-5">

                {/* Tagline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your personal message
                  </label>
                  <input
                    type="text"
                    placeholder="Add a custom message..."
                    value={p.tagline}
                    onChange={(e) => p.setTagline(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 transition-colors outline-none"
                  />
                </div>

                {/* Toggle switches */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">
                      Show Duration
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={p.showDuration}
                        onChange={(e) => p.setShowDuration(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium text-gray-700">
                      Show Waveform
                    </span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={p.showWaveform}
                        onChange={(e) => p.setShowWaveform(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            {/* Sezione Export */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Export</h3>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="space-y-4">
                  <div className="space-y-2 pb-4 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">
                      HD Poster
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Format: PNG</div>
                      <div>Ratio: 2:3</div>
                      <div>Quality: Ultra (4x)</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={p.onDownload}
                    disabled={!p.canDownload}
                    className="w-full inline-flex items-center justify-center gap-2 bg-black text-white font-medium px-4 py-2.5 rounded-lg hover:bg-gray-800 active:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-black transition-colors text-sm"
                  >
                    <DownloadIcon />
                    <span>
                      {p.downloading ? 'Downloading...' : p.loadingColors ? 'Preparing...' : 'Download Poster'}
                    </span>
                  </button>

                  {!p.canDownload && !p.downloading && (
                    <div className="text-xs text-gray-500 text-center">
                      Please wait for loading to complete...
                    </div>
                  )}
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </aside>
  );
}
