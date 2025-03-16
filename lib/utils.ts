import DOMPurify from 'isomorphic-dompurify';

import type { ImgData, ImgSize } from '@/types';
import config from './config';

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
 * ตรวจสอบว่า URL เป็น Internal link หรือไม่
 *
 * @param url - URL ที่ต้องการตรวจสอบ
 * @returns true ถ้าเป็น Internal link, false ถ้าเป็น External link หรือ URL ไม่ถูกต้อง
 */
export function isInternalLink(url: string): boolean {
  try {
    const parsedUrl = new URL(url, config.siteUrl);
    const isInternal = parsedUrl.origin === config.siteUrl;

    return isInternal;
  } catch (error) {
    // ถ้าไม่สามารถแปลง URL ได้ ให้ถือว่าเป็น External link
    console.error(`Cannot parse URL: ${url}`, error);
    return false;
  }
}

/**
 * ตรวจสอบว่า URL เป็น External link หรือไม่
 *
 * @param url - URL ที่ต้องการตรวจสอบ
 * @returns true ถ้าเป็น External link, false ถ้าเป็น Internal link หรือ URL ไม่ถูกต้อง
 */
export function isExternalLink(url: string): boolean {
  return !isInternalLink(url);
}

/**
 * รับ HTML string และทำความสะอาดเพื่อป้องกัน XSS attacks
 *
 * @param content - เนื้อหา HTML ที่ต้องการทำความสะอาด
 * @returns HTML string ที่ทำความสะอาดแล้ว
 */
export function cleanHTML(content: string): string {
  return DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'], // อนุญาต iframe tags สำหรับ embed content
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'], // อนุญาต attributes ที่จำเป็นสำหรับ iframe
  });
}
