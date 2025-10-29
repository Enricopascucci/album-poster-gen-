import { useState, useMemo } from 'react';
import type { Track } from '../types/album';

interface WaveformResult {
  data: number[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to generate waveform data from album tracks
 * Creates a visual waveform based on track durations and positions
 */
export function useWaveform(
  tracks: Track[],
  targetBars: number = 120,
  enabled: boolean = true
): WaveformResult {
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Generate waveform data based on track metadata
  const data = useMemo(() => {
    if (!enabled || !tracks || tracks.length === 0) {
      return [];
    }

    setLoading(true);

    try {
      // Create a waveform representation based on track durations
      const waveformData: number[] = [];
      const totalDuration = tracks.reduce((sum, t) => sum + t.duration_ms, 0);

      // Calculate how many bars each track should occupy
      let currentBar = 0;

      tracks.forEach((track, trackIndex) => {
        // Calculate number of bars for this track based on its duration
        const trackProportion = track.duration_ms / totalDuration;
        const trackBars = Math.max(1, Math.round(trackProportion * targetBars));

        // Generate bars for this track with variation
        for (let i = 0; i < trackBars && currentBar < targetBars; i++) {
          const progress = i / trackBars;

          // Create a seed based on track characteristics for consistency
          const seed = track.duration_ms + trackIndex * 1234 + i * 567;

          // Base amplitude varies by track position (creates natural flow)
          const baseAmplitude = 0.4 + Math.sin(trackIndex * 0.8) * 0.2;

          // Add track-specific variation (intro, buildup, peak, outro pattern)
          let trackPattern = 0;
          if (progress < 0.15) {
            // Intro - gradual increase
            trackPattern = progress / 0.15 * 0.3;
          } else if (progress < 0.4) {
            // Build up
            trackPattern = 0.3 + (progress - 0.15) / 0.25 * 0.4;
          } else if (progress < 0.7) {
            // Peak/chorus
            trackPattern = 0.7 + Math.sin((progress - 0.4) * 10) * 0.3;
          } else {
            // Outro - gradual decrease
            trackPattern = 0.7 * (1 - (progress - 0.7) / 0.3);
          }

          // Add pseudo-random variation based on seed
          const variation = (Math.sin(seed * 0.001) * 0.15) + (Math.cos(seed * 0.0007) * 0.1);

          // Combine all components
          let amplitude = baseAmplitude + trackPattern + variation;

          // Add some high-frequency details for visual interest
          amplitude += Math.sin(currentBar * 0.5) * 0.05;

          // Clamp between 0.2 and 1.0 for nice visuals
          amplitude = Math.max(0.2, Math.min(1.0, amplitude));

          waveformData.push(amplitude);
          currentBar++;
        }
      });

      // Pad or trim to exact target length
      while (waveformData.length < targetBars) {
        // Fade out for padding
        const fadeValue = 0.3 * (1 - (waveformData.length - tracks.length) / 10);
        waveformData.push(Math.max(0.2, fadeValue));
      }

      return waveformData.slice(0, targetBars);

    } finally {
      setLoading(false);
    }
  }, [tracks, targetBars, enabled]);

  return { data, loading, error };
}
