import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Handle GET request to /api/exit-preview.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route
 */
export async function GET() {
  (await draftMode()).disable();

  redirect('/');
}
