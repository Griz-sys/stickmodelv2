import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const PAYPAL_BASE =
  process.env.PAYPAL_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  if (!clientId || !secret) throw new Error('PayPal credentials not configured');

  const credentials = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal token error: ${res.status} ${err}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

// GET /api/paypal/return?token=ORDER_ID&projectId=...&stepId=...
// PayPal redirects users here after approving the payment.
// stepId can be omitted or "initial" for initial submission payment
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const orderId = searchParams.get('token'); // PayPal passes the order ID as "token"
  const projectId = searchParams.get('projectId');
  const stepId = searchParams.get('stepId');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const failUrl = `${appUrl}/requests/${projectId}?paypal=error`;
  const successUrl = `${appUrl}/requests/${projectId}?paypal=success`;

  if (!orderId || !projectId) {
    return NextResponse.redirect(failUrl);
  }

  // Verify the user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(`${appUrl}/login`);
  }

  try {
    // Fetch the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== user.id) {
      return NextResponse.redirect(failUrl);
    }

    const isInitialSubmission = !stepId || stepId === 'initial';

    if (isInitialSubmission) {
      // Payment for initial submission
      if (project.isPaidInitial) {
        return NextResponse.redirect(successUrl); // Already paid, idempotent
      }
    } else {
      // Payment for a step
      const step = await prisma.projectStep.findUnique({
        where: { id: stepId },
      });

      if (!step || step.projectId !== projectId) {
        return NextResponse.redirect(failUrl);
      }

      if (step.isPaid) {
        return NextResponse.redirect(successUrl); // Already paid, idempotent
      }
    }

    const accessToken = await getPayPalAccessToken();

    // Verify order matches before capturing
    const orderDetailsRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!orderDetailsRes.ok) {
      console.error('Could not fetch PayPal order details');
      return NextResponse.redirect(failUrl);
    }

    const orderDetails = await orderDetailsRes.json();
    const purchaseUnit = orderDetails.purchase_units?.[0];
    
    // Verify custom_id matches (initial or step)
    let expectedCustomId: string;
    if (isInitialSubmission) {
      expectedCustomId = `${projectId}:initial`;
    } else {
      expectedCustomId = `${projectId}:${stepId}`;
    }

    if (purchaseUnit?.custom_id !== expectedCustomId) {
      console.error('PayPal order custom_id mismatch', purchaseUnit?.custom_id, expectedCustomId);
      return NextResponse.redirect(failUrl);
    }

    // Capture the payment
    const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!captureRes.ok) {
      const err = await captureRes.json();
      console.error('PayPal capture error:', JSON.stringify(err));
      return NextResponse.redirect(failUrl);
    }

    const capture = await captureRes.json();
    const captureStatus =
      capture.status === 'COMPLETED' ||
      capture.purchase_units?.[0]?.payments?.captures?.[0]?.status === 'COMPLETED';

    if (!captureStatus) {
      console.error('PayPal capture not completed:', capture.status);
      return NextResponse.redirect(failUrl);
    }

    // Mark payment as paid
    if (isInitialSubmission) {
      await prisma.project.update({
        where: { id: projectId },
        data: { isPaidInitial: true, datePayment: new Date() },
      });
    } else {
      await prisma.projectStep.update({
        where: { id: stepId! },
        data: { isPaid: true, datePayment: new Date() },
      });
    }

    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('PayPal return handler error:', error);
    return NextResponse.redirect(failUrl);
  }
}
