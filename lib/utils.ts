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

// สร้าง className สําหรับ input
export const getInputClassName = (isInvalid: boolean = false) => {
  const baseClasses = [
    'w-full',
    'rounded-lg',
    'border',
    'p-4',
    'focus:border-transparent',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus-visible:outline-none',
    'bg-white',
    'text-gray-900',
    'dark:bg-gray-800',
    'dark:text-gray-100',
    'disabled:opacity-50',
  ];
  const borderClasses = isInvalid
    ? ['border-red-500', 'dark:border-red-400']
    : ['border-gray-200', 'dark:border-gray-700'];
  return [...baseClasses, ...borderClasses].join(' ');
};

// สร้าง className สําหรับ button
export const getButtonClassName = (isDisabled: boolean) => {
  const baseClasses = [
    'self-end',
    'rounded-lg',
    'px-6',
    'py-2',
    'text-white',
    'transition-colors',
    'hover:cursor-pointer',
  ];
  const stateClasses = isDisabled
    ? ['bg-gray-400', 'cursor-not-allowed', 'dark:bg-gray-600']
    : [
        'bg-blue-600',
        'hover:bg-blue-700',
        'dark:bg-blue-500',
        'dark:hover:bg-blue-600',
      ];
  return [...baseClasses, ...stateClasses].join(' ');
};

/**
 * ตรวจสอบว่า URL เป็น external link หรือไม่
 *
 * @param url - URL ที่ต้องการตรวจสอบ
 * @returns true ถ้าเป็น external link, false ถ้าเป็น internal link หรือ URL ไม่ถูกต้อง
 */
export function isExternalLink(url: string): boolean {
  try {
    // เปรียบเทียบ hostname ของ link กับ hostname ของ site
    const linkUrl = new URL(url, config.siteUrl);
    return linkUrl.hostname !== new URL(config.siteUrl!).hostname;
  } catch (error) {
    // ถ้าไม่สามารถแปลง URL ได้ ให้ถือว่าเป็น internal link
    console.error(`Cannot parse URL: ${url}`, error);
    return false;
  }
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
