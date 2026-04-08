import { NextRequest, NextResponse } from 'next/server';
import { storeOtp } from '@/lib/otp-store';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, companyName, website } = await request.json();

    if (!name || !email || !companyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const zeptoApiKey = process.env.ZEPTO_MAIL_API_KEY;
    const zeptoFromEmail = process.env.ZEPTO_MAIL_FROM_EMAIL;

    if (!zeptoApiKey || !zeptoFromEmail) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const otp = generateOtp();
    await storeOtp(email, otp, { name, companyName, website });

    const response = await fetch('https://api.zeptomail.in/v1.1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: zeptoApiKey,
      },
      body: JSON.stringify({
        from: { address: zeptoFromEmail, name: 'StickModel' },
        to: [{ email_address: { address: email, name } }],
        subject: 'Your StickModel Verification Code',
        htmlbody: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;">
            <h2 style="color:#ff5a1f;margin-bottom:8px;">Verify your email</h2>
            <p>Hi ${name},</p>
            <p>Use this code to confirm your invite request:</p>
            <div style="font-size:40px;font-weight:bold;letter-spacing:10px;text-align:center;padding:28px 16px;background:#fff7ed;border-radius:12px;color:#ff5a1f;margin:24px 0;">${otp}</div>
            <p>This code expires in <strong>10 minutes</strong>.</p>
            <p style="color:#888;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });

    const text = await response.text();
    if (!response.ok) {
      console.error('Zepto Mail send-otp error:', response.status, text);
      return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
