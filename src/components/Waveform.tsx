interface WaveformProps {
  /** Array of normalized amplitude values (0-1) */
  data: number[];
  /** Width of the waveform container */
  width?: number;
  /** Height of the waveform container */
  height?: number;
  /** Color of the waveform bars */
  color?: string;
  /** Gap between bars */
  barGap?: number;
  /** Minimum bar height */
  minBarHeight?: number;
  /** Border radius of bars */
  barRadius?: number;
  /** CSS class for the container */
  className?: string;
}

export function Waveform({
  data,
  width = 300,
  height = 60,
  color = 'currentColor',
  barGap = 2,
  minBarHeight = 2,
  barRadius = 1,
  className = '',
}: WaveformProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Calculate bar width based on number of data points
  const barWidth = Math.max(1, (width - (data.length - 1) * barGap) / data.length);

  return (
    <div className={`waveform-container ${className}`} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {data.map((amplitude, index) => {
          // Normalize amplitude to bar height
          const barHeight = Math.max(minBarHeight, amplitude * height);
          const x = index * (barWidth + barGap);
          const y = (height - barHeight) / 2; // Center vertically

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              rx={barRadius}
              ry={barRadius}
            />
          );
        })}
      </svg>
    </div>
  );
}
