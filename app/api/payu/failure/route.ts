import { NextRequest, NextResponse } from 'next/server';

// POST /api/payu/failure
// PayU redirects the user's browser here after a failed or cancelled payment.
export async function POST(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    const formData = await request.formData();
    const udf1 = (formData.get('udf1') as string) || '';
    const projectId = udf1;

    if (projectId) {
      return NextResponse.redirect(
        `${appUrl}/requests/${projectId}?payment=failed`,
        { status: 303 }
      );
    }
    return NextResponse.redirect(`${appUrl}/?payment=failed`, { status: 303 });
  } catch {
    return NextResponse.redirect(`${appUrl}/?payment=failed`, { status: 303 });
  }
}
