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

  if (!clientId || !secret) {
    throw new Error('PayPal credentials not configured');
  }

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
    throw new Error('Failed to get PayPal access token');
  }

  const data = await res.json();
  return data.access_token as string;
}

// POST /api/paypal/capture-order
// Body: { orderId, projectId, stepId }
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, projectId, stepId } = body as {
      orderId: string;
      projectId: string;
      stepId: string;
    };

    if (!orderId || !projectId || !stepId) {
      return NextResponse.json(
        { error: 'orderId, projectId and stepId are required' },
        { status: 400 }
      );
    }

    // Re-verify ownership before capturing
    const step = await prisma.projectStep.findUnique({
      where: { id: stepId },
      include: { project: true },
    });

    if (!step || step.projectId !== projectId) {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }

    if (step.project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Already paid – idempotent ok
    if (step.isPaid) {
      return NextResponse.json({ success: true, alreadyPaid: true });
    }

    const accessToken = await getPayPalAccessToken();

    // Verify the order belongs to this step before capturing
    const orderDetailsRes = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${orderId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!orderDetailsRes.ok) {
      return NextResponse.json(
        { error: 'Could not verify PayPal order' },
        { status: 502 }
      );
    }

    const orderDetails = await orderDetailsRes.json();

    // Validate order custom_id to prevent IDOR
    const purchaseUnit = orderDetails.purchase_units?.[0];
    const expectedCustomId = `${projectId}:${stepId}`;
    if (purchaseUnit?.custom_id !== expectedCustomId) {
      return NextResponse.json(
        { error: 'Order does not match this step' },
        { status: 400 }
      );
    }

    // Capture the order
    const captureRes = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!captureRes.ok) {
      const err = await captureRes.json();
      console.error('PayPal capture error:', err);
      return NextResponse.json(
        { error: 'Payment capture failed' },
        { status: 502 }
      );
    }

    const capture = await captureRes.json();

    // Verify capture completed
    if (
      capture.status !== 'COMPLETED' &&
      capture.purchase_units?.[0]?.payments?.captures?.[0]?.status !== 'COMPLETED'
    ) {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 402 }
      );
    }

    // Mark step as paid in database
    const updated = await prisma.projectStep.update({
      where: { id: stepId },
      data: {
        isPaid: true,
        datePayment: new Date(),
      },
    });

    return NextResponse.json({ success: true, step: updated });
  } catch (error) {
    console.error('Capture PayPal order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
