import DOMPurify from 'isomorphic-dompurify';

import config from './config';
import type { ImgData, ImgSize, ReadingTimeResult } from './types';

/**
 * ลดขนาดอาร์เรย์ของ ImgSize ให้เป็นอ็อบเจ็กต์ ImgData
 * @param {ImgSize[]} sizes - อาร์เรย์ของขนาดรูปภาพ
 * @returns {ImgData} ข้อมูลรูปภาพที่ลดขนาด
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

/**
 * คำนวณเวลาในการอ่านบทความโดยประมาณเป็นนาที
 * @param content เนื้อหาบทความ
 * @param wordsPerMinute จำนวนคำที่อ่านได้ต่อนาที (ค่าเริ่มต้น: 225 สำหรับภาษาไทย, 180 สำหรับภาษาอังกฤษ)
 * @param isThai บ่งชี้ว่าเป็นภาษาไทยหรือไม่ (ค่าเริ่มต้น: ตรวจสอบอัตโนมัติ)
 * @returns ข้อมูลเวลาที่ใช้ในการอ่าน
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute?: number,
  isThai?: boolean
): ReadingTimeResult {
  if (!content?.trim()) {
    return { minutes: 0, text: '0 min read' };
  }

  const DEFAULT_THAI_WPM = 225;
  const DEFAULT_ENGLISH_WPM = 180;
  const THAI_CHARS_PER_WORD = 2.5;
  const MIN_PROCESSING_TIME = 0.2;
  const PARAGRAPH_TIME_FACTOR = 0.1;
  const ROUNDING_THRESHOLD = 0.3;

  const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, '');
  const thaiChars = cleanContent.match(/[\u0E00-\u0E7F]/g) || [];
  const englishWords = cleanContent.match(/[a-zA-Z]+/g) || [];
  const paragraphs =
    cleanContent.split(/\n+/).filter(p => p.trim()).length || 1;

  // ตรวจสอบภาษาไทยอัตโนมัติถ้าไม่ได้ระบุ
  const isThaiContent = isThai ?? thaiChars.length > cleanContent.length * 0.5;

  const wpm =
    wordsPerMinute || (isThaiContent ? DEFAULT_THAI_WPM : DEFAULT_ENGLISH_WPM);
  const thaiWPM = isThaiContent ? wpm : DEFAULT_THAI_WPM;
  const englishWPM = isThaiContent
    ? wordsPerMinute
      ? wpm * 0.8
      : DEFAULT_ENGLISH_WPM
    : wpm;

  // คำนวณจำนวนคำและเวลาอ่าน
  const thaiWordCount = thaiChars.length / THAI_CHARS_PER_WORD;
  const englishWordCount = englishWords.length;
  const wordCount = isThaiContent
    ? thaiWordCount
    : cleanContent.split(/\s+/).filter(Boolean).length;

  const readingTime = isThaiContent
    ? thaiWordCount / thaiWPM + englishWordCount / englishWPM
    : wordCount / englishWPM;

  // คำนวณเวลาประมวลผลย่อหน้า
  const processingTime = Math.max(
    MIN_PROCESSING_TIME,
    paragraphs * PARAGRAPH_TIME_FACTOR
  );
  const totalMinutes = readingTime + processingTime;

  // ปัดตัวเลข
  const roundedMinutes = Math.max(
    1,
    Math.ceil(totalMinutes - ROUNDING_THRESHOLD)
  );

  return {
    minutes: roundedMinutes,
    text: `${roundedMinutes} min read`,
  };
}
