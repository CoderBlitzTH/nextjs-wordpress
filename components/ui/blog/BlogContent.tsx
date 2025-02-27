import type { DOMNode, HTMLReactParserOptions } from 'html-react-parser';
import parse, { Element, domToReact } from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import config from '@/lib/config';

/**
 * รับ HTML string และทำความสะอาดเพื่อป้องกัน XSS attacks
 *
 * @param content - เนื้อหา HTML ที่ต้องการทำความสะอาด
 * @returns HTML string ที่ทำความสะอาดแล้ว
 */
function cleanHTML(content: string): string {
  return DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'], // อนุญาต iframe tags สำหรับ embed content
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'], // อนุญาต attributes ที่จำเป็นสำหรับ iframe
  });
}

/**
 * ตรวจสอบว่า URL เป็น external link หรือไม่
 *
 * @param url - URL ที่ต้องการตรวจสอบ
 * @returns true ถ้าเป็น external link, false ถ้าเป็น internal link หรือ URL ไม่ถูกต้อง
 */
function isExternalLink(url: string): boolean {
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
 * สร้าง options สำหรับ html-react-parser เพื่อแปลง HTML เป็น React components
 * @returns HTMLReactParserOptions
 */
function getParserOptions(): HTMLReactParserOptions {
  return {
    replace: (domNode: DOMNode) => {
      if (!(domNode instanceof Element)) return;

      switch (domNode.name) {
        // แปลง <img> เป็น Next.js Image component
        case 'img': {
          const { src, alt, width, height } = domNode.attribs;
          const isValidSrc =
            src && (src.startsWith('http') || src.startsWith('/'));

          if (!isValidSrc) {
            return (
              <span className="flex h-64 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                <span className="text-lg text-gray-600 uppercase dark:text-gray-400">
                  Image not available
                </span>
              </span>
            );
          }

          return (
            <Image
              src={src}
              alt={alt || 'Image'}
              width={parseInt(width || '0', 10) || 736}
              height={parseInt(height || '0', 10) || 384}
              priority={true}
              quality={80}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
            />
          );
        }

        // แปลง <a> เป็น Next.js Link component พร้อมไอคอนสำหรับลิงก์ภายนอก
        case 'a': {
          const { href } = domNode.attribs;
          const isExternal = isExternalLink(href);

          return (
            <Link
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={isExternal ? 'inline-flex items-center' : undefined}
            >
              {domToReact(domNode.children as DOMNode[], getParserOptions())}
              {isExternal && (
                <ExternalLink size={14} className="mt-px ml-1 inline-block" />
              )}
            </Link>
          );
        }

        // แปลง <iframe> เป็น iframe ที่ปลอดภัย
        case 'iframe': {
          const { title, src, allow } = domNode.attribs;
          return (
            <iframe
              src={src}
              title={title || 'Embedded content'}
              allow={
                allow ||
                'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              }
              allowFullScreen={true}
              className="inset-0 aspect-video w-full rounded border-0"
            />
          );
        }
      }
    },
  };
}

type BlogContentProps = {
  content: string;
};

/**
 * Component สำหรับแสดงเนื้อหาบทความ โดยแปลง HTML เป็น React components
 * ทำความสะอาด HTML, แปลง images เป็น Next.js Image components และจัดการ links
 */
export default function BlogContent({ content }: BlogContentProps) {
  const cleanContent = cleanHTML(content); // ล้าง HTML เพื่อความปลอดภัย
  const parserOptions = getParserOptions(); // สร้างตัวเลือกสำหรับ parser

  return (
    <div className="prose dark:prose-invert prose-img:rounded mb-8 max-w-none">
      {parse(cleanContent, parserOptions)}
    </div>
  );
}
