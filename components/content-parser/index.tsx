import type { DOMNode, HTMLReactParserOptions } from 'html-react-parser';
import parse, { Element, domToReact } from 'html-react-parser';
import Image from 'next/image';

import { cleanHTML } from '@/lib/utils';
import AutoLink from '../auto-link';
import NoImage from '../no-image';

// สร้าง options สำหรับ html-react-parser เพื่อแปลง HTML เป็น React components
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
            return <NoImage />;
          }

          return (
            <Image
              src={src}
              alt={alt || 'Image'}
              width={parseInt(width || '0', 10) || 736}
              height={parseInt(height || '0', 10) || 384}
              quality={80}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          );
        }

        // แปลง <a> เป็น Next.js AutoLink component พร้อมไอคอนสำหรับลิงก์ภายนอก
        case 'a': {
          const { href } = domNode.attribs;

          if (!href) return;

          return (
            <AutoLink href={href}>
              {domToReact(domNode.children as DOMNode[], getParserOptions())}
            </AutoLink>
          );
        }

        // แปลง <iframe> เป็น iframe ที่ปลอดภัย
        case 'iframe': {
          const { title, src, allow } = domNode.attribs;

          if (!src) return;

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

type ContentParserProps = {
  content: string;
};

/**
 * Component สำหรับแสดงเนื้อหา โดยแปลง HTML เป็น React components
 * ทำความสะอาด HTML, แปลง images เป็น Next.js Image components และจัดการ links
 */
export default function ContentParser({ content }: ContentParserProps) {
  const cleanContent = cleanHTML(content); // ล้าง HTML เพื่อความปลอดภัย
  const parserOptions = getParserOptions(); // สร้างตัวเลือกสำหรับ parser

  return parse(cleanContent, parserOptions);
}
