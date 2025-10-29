import ColorThief from 'colorthief';

/**
 * Extract a color palette from an image URL
 * @param imageUrl - URL of the image
 * @param colorCount - Number of colors to extract
 * @returns Array of RGB color arrays
 */
export async function extractColors(
  imageUrl: string,
  colorCount: number = 5
): Promise<number[][]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, colorCount);
        resolve(palette);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

/**
 * Convert RGB array to hex color string
 */
export function rgbToHex(rgb: number[]): string {
  return '#' + rgb.map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Format duration from milliseconds to MM:SS
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate total duration of all tracks
 */
export function getTotalDuration(tracks: { duration_ms: number }[]): string {
  const totalMs = tracks.reduce((sum, track) => sum + track.duration_ms, 0);
  const totalMinutes = Math.floor(totalMs / 60000);
  const totalSeconds = Math.floor((totalMs % 60000) / 1000);

  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} HR ${minutes} MIN`;
  }

  return `${totalMinutes} MIN ${totalSeconds} SEC`;
}

/**
 * Format release date to readable format (e.g., "15 JANUARY 2024")
 */
export function formatReleaseDate(dateString: string): string {
  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
