import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Force the route to be dynamic.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
 */
export const dynamic = 'force-dynamic';

// ตัวแปรสำหรับ secret key ที่จะใช้ในการตรวจสอบความปลอดภัย
const REVALIDATE_SECRET = process.env.NEXTJS_REVALIDATION_SECRET;

/**
 * API Route สำหรับการ revalidate แคช
 * รับ POST request จาก WordPress hook และตรวจสอบ secret key
 */
export async function POST(request: NextRequest) {
  try {
    if (!REVALIDATE_SECRET) {
      throw new Error('Revalidation secret is not configured');
    }

    // ตรวจสอบ secret key
    const secret = request.headers.get('x-revalidate-token');
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret key', revalidated: false },
        { status: 401, headers: { 'X-Robots-Tag': 'noindex' } }
      );
    }

    // ตรวจสอบว่ามีข้อมูลเส้นทางสำหรับ revalidate หรือไม่
    const body = (await request.json()) as { paths: string[] };
    if (!body.paths || !Array.isArray(body.paths) || body.paths.length === 0) {
      return NextResponse.json(
        { message: 'No paths provided', revalidated: false },
        { status: 400, headers: { 'X-Robots-Tag': 'noindex' } }
      );
    }

    const validPaths = body.paths.filter(
      path => typeof path === 'string' && path.trim() !== ''
    );
    if (validPaths.length === 0) {
      return NextResponse.json(
        { message: 'No valid paths provided', revalidated: false },
        { status: 400, headers: { 'X-Robots-Tag': 'noindex' } }
      );
    }

    // ดำเนินการ revalidate ทุกเส้นทางที่ได้รับ
    await Promise.all(
      validPaths.map(async path => {
        revalidatePath(path);
        console.info(`Revalidated path: ${path}`);
      })
    );

    // ส่งข้อความตอบกลับว่าทำงานสำเร็จ
    return NextResponse.json(
      {
        message: 'Revalidation triggered successfully',
        revalidated: true,
        paths: validPaths,
      },
      { status: 200, headers: { 'X-Robots-Tag': 'noindex' } }
    );
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      {
        message: 'Revalidation failed',
        error: String(error),
        revalidated: false,
      },
      { status: 500, headers: { 'X-Robots-Tag': 'noindex' } }
    );
  }
}

// (Optional) GET endpoint สำหรับทดสอบว่า API ทำงานอยู่หรือไม่
export async function GET() {
  return NextResponse.json(
    { message: 'Revalidation API is ready' },
    { status: 200, headers: { 'X-Robots-Tag': 'noindex' } }
  );
}
