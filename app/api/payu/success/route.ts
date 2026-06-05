import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

function sha512(str: string): string {
  return crypto.createHash('sha512').update(str).digest('hex');
}

// POST /api/payu/success
// PayU redirects the user's browser here (as a form POST) after successful payment.
// We verify the response hash, mark the project/step as paid, then redirect to the project page.
export async function POST(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let projectId = '';
  try {
    const salt = process.env.PAYU_MERCHANT_SALT;
    if (!salt) {
      console.error('PayU SALT not configured');
      return NextResponse.redirect(`${appUrl}/?payment=failed`, { status: 303 });
    }

    const formData = await request.formData();

    const status    = (formData.get('status')      as string) || '';
    const txnid     = (formData.get('txnid')       as string) || '';
    const amount    = (formData.get('amount')      as string) || '';
    const productinfo = (formData.get('productinfo') as string) || '';
    const firstname = (formData.get('firstname')   as string) || '';
    const email     = (formData.get('email')       as string) || '';
    const udf1      = (formData.get('udf1')        as string) || '';
    const udf2      = (formData.get('udf2')        as string) || '';
    const key       = (formData.get('key')         as string) || '';
    const receivedHash = (formData.get('hash')     as string) || '';

    projectId = udf1;
    const stepId = udf2 === 'initial' ? undefined : udf2;

    // Verify PayU response hash: sha512(SALT|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
    // udf3-udf10 are all empty in our implementation
    const hashParts = [salt, status, '', '', '', '', '', '', '', '', udf2, udf1, email, firstname, productinfo, amount, txnid, key];
    const expectedHash = sha512(hashParts.join('|'));

    if (expectedHash.toLowerCase() !== receivedHash.toLowerCase()) {
      console.error('PayU hash mismatch on success callback');
      return NextResponse.redirect(
        `${appUrl}/requests/${projectId}?payment=failed`,
        { status: 303 }
      );
    }

    if (status !== 'success') {
      return NextResponse.redirect(
        `${appUrl}/requests/${projectId}?payment=failed`,
        { status: 303 }
      );
    }

    // Verify the project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      console.error('PayU success: project not found', projectId);
      return NextResponse.redirect(`${appUrl}/?payment=failed`, { status: 303 });
    }

    if (!stepId) {
      // Mark initial submission as paid (idempotent)
      if (!project.isPaidInitial) {
        await prisma.project.update({
          where: { id: projectId },
          data: { isPaidInitial: true, datePayment: new Date() },
        });
      }
    } else {
      const step = await prisma.projectStep.findUnique({ where: { id: stepId } });
      if (!step || step.projectId !== projectId) {
        console.error('PayU success: step not found', stepId);
        return NextResponse.redirect(
          `${appUrl}/requests/${projectId}?payment=failed`,
          { status: 303 }
        );
      }
      if (!step.isPaid) {
        await prisma.projectStep.update({
          where: { id: stepId },
          data: { isPaid: true, datePayment: new Date() },
        });
      }
    }

    return NextResponse.redirect(
      `${appUrl}/requests/${projectId}?payment=success`,
      { status: 303 }
    );
  } catch (error) {
    console.error('PayU success handler error:', error);
    const dest = projectId ? `${appUrl}/requests/${projectId}?payment=failed` : `${appUrl}/?payment=failed`;
    return NextResponse.redirect(dest, { status: 303 });
  }
}
