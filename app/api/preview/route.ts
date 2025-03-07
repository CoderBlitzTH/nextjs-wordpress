import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Force the route to be dynamic.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
 */
export const dynamic = 'force-dynamic';

const isDev = process.env.NODE_ENV === 'development';

const errorInvalidSecret = isDev
  ? 'กรุณาตรวจดูว่า `Secret` ถูกกำหนดไว้ในไฟล์ .env (ตัวแปรสภาพแวดล้อม) และไฟล์ `wp-config.php` เรียบร้อยแล้ว รวมถึงมีการส่ง `Secret` ผ่านพารามิเตอร์ใน URL ด้วย'
  : 'ไม่ได้รับอนุญาตให้เข้าถึงหน้านี้';

/**
 * Handle GET request to /api/preview.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type');
  const secret = searchParams.get('secret');

  const headers = {
    'Content-Type': 'application/json',
    'X-Robots-Tag': 'noindex',
  };

  // ตรวจสอบ secret token เพื่อความปลอดภัย
  if (!secret || secret !== process.env.NEXTJS_PREVIEW_SECRET) {
    return new Response(JSON.stringify({ message: errorInvalidSecret }), {
      status: 401,
      headers,
    });
  }

  // ตรวจสอบว่ามี id หรือไม่
  if (!id) {
    return new Response(JSON.stringify({ message: 'ไม่พบ ID' }), {
      status: 400,
      headers,
    });
  }

  // ตรวจสอบว่ามี type หรือไม่
  if (!type) {
    return new Response(JSON.stringify({ message: 'ไม่พบ Type' }), {
      status: 400,
      headers,
    });
  }

  // เปิด Draft Mode (ตั้งค่า cookies อัตโนมัติ)
  (await draftMode()).enable();

  // Redirect ไปยังหน้าที่ต้องการ preview
  redirect(`/${type}/preview/${id}`);
}
