import prisma from '@/lib/prisma';

export async function storeOtp(
  email: string,
  otp: string,
  data: { name: string; companyName: string; website?: string }
) {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Delete any existing OTP for this email
  await prisma.otpVerification.deleteMany({ where: { email: email.toLowerCase() } });

  // Create new OTP
  await prisma.otpVerification.create({
    data: {
      email: email.toLowerCase(),
      otp,
      name: data.name,
      companyName: data.companyName,
      website: data.website,
      expiresAt,
    },
  });

  console.log('[OTP] Stored OTP for:', email.toLowerCase(), 'OTP:', otp);
}

export async function verifyAndConsumeOtp(
  email: string,
  otp: string
): Promise<{ valid: boolean; data?: { name: string; companyName: string; website?: string } }> {
  const entry = await prisma.otpVerification.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!entry) {
    console.log('[OTP] No entry found for email:', email.toLowerCase());
    return { valid: false };
  }

  if (new Date() > entry.expiresAt) {
    console.log('[OTP] OTP expired for email:', email.toLowerCase());
    await prisma.otpVerification.delete({ where: { id: entry.id } });
    return { valid: false };
  }

  if (entry.otp !== otp) {
    console.log('[OTP] OTP mismatch for email:', email.toLowerCase(), '| Expected:', entry.otp, '| Got:', otp);
    return { valid: false };
  }

  // OTP is valid, consume it
  await prisma.otpVerification.delete({ where: { id: entry.id } });
  console.log('[OTP] OTP verified and consumed for:', email.toLowerCase());

  return {
    valid: true,
    data: {
      name: entry.name,
      companyName: entry.companyName,
      website: entry.website || undefined,
    },
  };
}
