import DOMPurify from 'isomorphic-dompurify';

import config from '@/lib/config';

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
