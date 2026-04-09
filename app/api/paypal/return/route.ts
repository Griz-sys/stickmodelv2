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
// Returns an HTML page that posts a message to the opener (popup parent) and closes itself.
function popupResponse(status: 'success' | 'error' | 'cancelled', projectId: string) {
  const data = JSON.stringify({ paypal: status, projectId });
  const html = `<!DOCTYPE html><html><head><title>Payment ${status}</title>
<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#f8fafc;}
.box{text-align:center;padding:2rem;border-radius:1rem;background:#fff;box-shadow:0 4px 24px #0001;}
h2{margin:0 0 .5rem}p{color:#64748b;margin:0}</style></head>
<body><div class="box">
${status === 'success' ? '<h2>&#10003; Payment Complete!</h2><p>Closing window…</p>' : status === 'cancelled' ? '<h2>Payment Cancelled</h2><p>Closing window…</p>' : '<h2>Payment Failed</h2><p>Closing window…</p>'}
</div><script>
try{if(window.opener&&!window.opener.closed){window.opener.postMessage(${data},'*');}}
catch(e){}
setTimeout(function(){window.close();},1200);
</script></body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const orderId = searchParams.get('token'); // PayPal passes the order ID as "token"
  const projectId = searchParams.get('projectId');
  const stepId = searchParams.get('stepId');

  if (!orderId || !projectId) {
    return popupResponse('error', projectId || '');
  }

  // Verify the user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    return popupResponse('error', projectId);
  }

  try {
    // Fetch the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== user.id) {
      return popupResponse('error', projectId);
    }

    const isInitialSubmission = !stepId || stepId === 'initial';

    if (isInitialSubmission) {
      // Payment for initial submission
      if (project.isPaidInitial) {
        return popupResponse('success', projectId); // Already paid, idempotent
      }
    } else {
      // Payment for a step
      const step = await prisma.projectStep.findUnique({
        where: { id: stepId },
      });

      if (!step || step.projectId !== projectId) {
        return popupResponse('error', projectId);
      }

      if (step.isPaid) {
        return popupResponse('success', projectId); // Already paid, idempotent
      }
    }

    const accessToken = await getPayPalAccessToken();

    // Verify order matches before capturing
    const orderDetailsRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!orderDetailsRes.ok) {
      console.error('Could not fetch PayPal order details');
      return popupResponse('error', projectId);
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
      return popupResponse('error', projectId);
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
      return popupResponse('error', projectId);
    }

    const capture = await captureRes.json();
    const captureStatus =
      capture.status === 'COMPLETED' ||
      capture.purchase_units?.[0]?.payments?.captures?.[0]?.status === 'COMPLETED';

    if (!captureStatus) {
      console.error('PayPal capture not completed:', capture.status);
      return popupResponse('error', projectId);
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

    return popupResponse('success', projectId);
  } catch (error) {
    console.error('PayPal return handler error:', error);
    return popupResponse('error', projectId || '');
  }
}
