import { NextRequest, NextResponse } from 'next/server';
import { verifyAndConsumeOtp } from '@/lib/otp-store';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing email or verification code' }, { status: 400 });
    }

    // Verify the OTP
    const result = await verifyAndConsumeOtp(email, otp);
    if (!result.valid || !result.data) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
    }

    const { name, companyName, website } = result.data;

    const zeptoApiKey = process.env.ZEPTO_MAIL_API_KEY;
    const zeptoFromEmail = process.env.ZEPTO_MAIL_FROM_EMAIL;
    const zeptoToEmail = process.env.ZEPTO_MAIL_TO_EMAIL;

    if (!zeptoApiKey || !zeptoFromEmail || !zeptoToEmail) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    // Send notification email to all admins
    const toEmails = zeptoToEmail.split(',').map((e: string) => ({
      email_address: { address: e.trim(), name: 'StickModel Team' },
    }));

    const response = await fetch('https://api.zeptomail.in/v1.1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: zeptoApiKey,
      },
      body: JSON.stringify({
        from: { address: zeptoFromEmail, name: 'StickModel' },
        to: toEmails,
        reply_to: [{ address: email, name }],
        subject: `New Invite Request: ${companyName}`,
        htmlbody: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;">
            <h2 style="color:#ff5a1f;">New Invite Request</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#666;width:120px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#666;">Company</td><td style="padding:8px 0;font-weight:600;">${companyName}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Website</td><td style="padding:8px 0;">${website ? `<a href="${website}" target="_blank">${website}</a>` : '—'}</td></tr>
            </table>
            <p style="color:#888;font-size:12px;margin-top:16px;">✓ Email address verified via OTP</p>
          </div>
        `,
      }),
    });

    const text = await response.text();
    if (!response.ok) {
      console.error('Zepto Mail request-invite error:', response.status, text);
      return NextResponse.json({ error: 'Failed to send invite request' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Request invite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
