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
    const errBody = await res.text();
    console.error('PayPal token error:', res.status, errBody);
    throw new Error(`Failed to get PayPal access token: ${res.status} ${errBody}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

// POST /api/paypal/create-order
// Body: { projectId, stepId? }
// If stepId is omitted, payment is for the initial submission
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, stepId } = body as { projectId: string; stepId?: string };

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    // Fetch the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Only the project owner can pay
    if (project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let cost: number;
    let description: string;
    let customId: string;

    if (!stepId) {
      // Payment for initial submission
      if (project.isPaidInitial) {
        return NextResponse.json({ error: 'Already paid' }, { status: 400 });
      }

      if (!project.cost || project.cost <= 0) {
        return NextResponse.json({ error: 'No cost set for this project' }, { status: 400 });
      }

      if (!project.adminFileUrl) {
        return NextResponse.json(
          { error: 'Deliverable not yet available' },
          { status: 400 }
        );
      }

      cost = project.cost;
      description = `${project.name} – Initial Submission`;
      customId = `${projectId}:initial`;
    } else {
      // Payment for a step
      const step = await prisma.projectStep.findUnique({
        where: { id: stepId },
      });

      if (!step || step.projectId !== projectId) {
        return NextResponse.json({ error: 'Step not found' }, { status: 404 });
      }

      if (step.isPaid) {
        return NextResponse.json({ error: 'Already paid' }, { status: 400 });
      }

      if (!step.cost || step.cost <= 0) {
        return NextResponse.json({ error: 'No cost set for this step' }, { status: 400 });
      }

      if (!step.adminFileUrl) {
        return NextResponse.json(
          { error: 'Deliverable not yet available' },
          { status: 400 }
        );
      }

      cost = step.cost;
      description = `${project.name} – ${step.userLabel}`;
      customId = `${projectId}:${stepId}`;
    }

    const accessToken = await getPayPalAccessToken();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: stepId || 'initial',
            custom_id: customId,
            description: description,
            amount: {
              currency_code: 'USD',
              value: cost.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: 'StickModel',
          user_action: 'PAY_NOW',
          return_url: `${appUrl}/api/paypal/return?projectId=${projectId}&stepId=${stepId || 'initial'}`,
          cancel_url: `${appUrl}/requests/${projectId}?paypal=cancelled`,
        },
      }),
    });

    if (!orderRes.ok) {
      const err = await orderRes.json();
      console.error('PayPal create order error:', JSON.stringify(err));
      return NextResponse.json(
        { error: err?.message || err?.error_description || 'Failed to create PayPal order' },
        { status: 502 }
      );
    }

    const order = await orderRes.json();

    // Find the "payer-action" (approve) link for the redirect flow
    const approveLink = order.links?.find(
      (l: { rel: string; href: string }) => l.rel === 'payer-action' || l.rel === 'approve'
    );

    return NextResponse.json({ orderId: order.id, approveUrl: approveLink?.href ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Create PayPal order error:', message);
    return NextResponse.json(
      { error: message || 'Internal server error' },
      { status: 500 }
    );
  }
}
