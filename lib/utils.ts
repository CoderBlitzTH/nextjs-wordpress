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

/**
 * แปลงวันที่ให้อยู่ในรูปแบบที่กำหนด และรองรับภาษาไทยหรืออังกฤษ
 * รองรับรูปแบบที่กำหนดเอง เช่น 'D MMMM YYYY' หรือ 'D MMM YY'.
 *
 * @param {string} dateString - สตริงวันที่ที่ต้องการแปลง (เช่น '2025-02-26').
 * @param {string} [format='D MMMM YYYY'] - รูปแบบที่ต้องการให้แสดงผล
 *   รูปแบบที่รองรับ: 'D' (วัน), 'MMMM' (เดือนแบบเต็ม), 'MMM' (เดือนแบบย่อ),
 *   'YYYY' (ปีแบบเต็ม), 'YY' (ปีแบบย่อ).
 * @param {'th' | 'en'} [locale='th'] - ภาษาของผลลัพธ์ ('th' สำหรับไทย, 'en' สำหรับอังกฤษ).
 * @returns {string} วันที่ที่ถูกแปลงแล้ว
 * @throws {Error} หากสตริงวันที่ไม่ถูกต้อง
 *
 * @example
 * formatDate('2025-02-26', 'D MMMM YYYY', 'th'); // '26 กุมภาพันธ์ 2568'
 * formatDate('2025-02-26', 'D MMM YY', 'en');    // '26 Feb 25'
 */
export function formatDate(
  dateString: string,
  format: string = 'D MMMM YYYY',
  locale: 'th' | 'en' = 'th'
): string {
  const date = new Date(dateString.replace(' ', 'T'));
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }

  // prettier-ignore
  const months = {
    th: {
      full: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
      short: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
    },
    en: {
      full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  } as const;

  const day = date.getDate();
  const year = locale === 'th' ? date.getFullYear() + 543 : date.getFullYear();
  const monthIndex = date.getMonth();

  const dateParts: Record<string, string | number> = {
    D: day,
    MMMM: months[locale].full[monthIndex],
    MMM: months[locale].short[monthIndex],
    YYYY: year,
    YY: String(year).slice(-2),
  };

  return format.replace(/D|MMMM|MMM|YYYY|YY/g, match =>
    String(dateParts[match])
  );
}
