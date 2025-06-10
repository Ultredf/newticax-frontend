export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export function optimizeImageUrl(
  url: string,
  options: ImageOptimizationOptions = {}
): string {
  if (!url) return '';
  
  // If it's already an optimized URL, return as is
  if (url.includes('/_next/image')) {
    return url;
  }

  const { width, height, quality = 75, format } = options;
  const params = new URLSearchParams();

  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  if (quality) params.append('q', quality.toString());
  if (format) params.append('f', format);

  const encodedUrl = encodeURIComponent(url);
  const queryString = params.toString();

  return `/_next/image?url=${encodedUrl}${queryString ? `&${queryString}` : ''}`;
}

export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

export function generateImageSizes(baseWidth: number): string {
  const breakpoints = [640, 768, 1024, 1280, 1536];
  const sizes = breakpoints.map(bp => `(max-width: ${bp}px) ${Math.min(baseWidth, bp)}px`);
  sizes.push(`${baseWidth}px`);
  
  return sizes.join(', ');
}
