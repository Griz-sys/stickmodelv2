import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const PAYU_URL =
  process.env.PAYU_ENV === 'production'
    ? 'https://secure.payu.in/_payment'
    : 'https://test.payu.in/_payment';

function sha512(str: string): string {
  return crypto.createHash('sha512').update(str).digest('hex');
}

// POST /api/payu/initiate
// Body: { projectId, stepId? }
// Returns PayU form fields + action URL so the client can POST the browser to PayU
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;
    if (!key || !salt) {
      return NextResponse.json({ error: 'PayU credentials not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { projectId, stepId } = body as { projectId: string; stepId?: string };

    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    if (project.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let amount: number;
    let currency: string;
    let productinfo: string;

    if (!stepId) {
      if (project.isPaidInitial) {
        return NextResponse.json({ error: 'Already paid' }, { status: 400 });
      }
      if (!project.cost || project.cost <= 0) {
        return NextResponse.json({ error: 'No cost set for this project' }, { status: 400 });
      }
      if (!project.adminFileUrl) {
        return NextResponse.json({ error: 'Deliverable not yet available' }, { status: 400 });
      }
      amount = project.cost;
      currency = (project as Record<string, unknown>).currency as string || 'USD';
      productinfo = `${project.name} - Initial Submission`;
    } else {
      const step = await prisma.projectStep.findUnique({ where: { id: stepId } });
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
        return NextResponse.json({ error: 'Deliverable not yet available' }, { status: 400 });
      }
      amount = step.cost;
      currency = (step as Record<string, unknown>).currency as string || 'USD';
      productinfo = `${project.name} - ${step.userLabel}`;
    }

    // udf1 = projectId, udf2 = stepId (or "initial") for verification in success handler
    const udf1 = projectId;
    const udf2 = stepId || 'initial';
    const txnid = `${Date.now().toString(36)}${Math.random().toString(36).substring(2, 8)}`;
    const amountStr = amount.toFixed(2);
    const firstname = user.name.split(' ')[0];
    const email = user.email;

    // PayU hash: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
    // udf3-udf10 are all empty for us
    const hashParts = [key, txnid, amountStr, productinfo, firstname, email, udf1, udf2, '', '', '', '', '', '', '', '', salt];
    const hash = sha512(hashParts.join('|'));

    const origin = request.headers.get('origin') || request.nextUrl.origin;
    const appUrl = origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    return NextResponse.json({
      payuUrl: PAYU_URL,
      fields: {
        key,
        txnid,
        amount: amountStr,
        productinfo,
        firstname,
        email,
        udf1,
        udf2,
        currency,
        surl: `${appUrl}/api/payu/success`,
        furl: `${appUrl}/api/payu/failure`,
        hash,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('PayU initiate error:', message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
