import type { ImgData, ImgSize } from '@/types/img';

/**
 * Reduces an array of ImgSize to an ImgData object.
 * @param {ImgSize[]} sizes - The array of image sizes.
 * @returns {ImgData} The reduced image data.
 */
export function getImageSizes(sizes: ImgSize[]): ImgData {
  return sizes.reduce((acc: ImgData, size: ImgSize) => {
    acc[size.name as keyof ImgData] = size;
    return acc;
  }, {});
}

/**
 * Formats a date string as a Thai date.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString.replace(' ', 'T'));

  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
