import type { ImgData, ImgSize } from '@/types';

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
