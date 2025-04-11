import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.otp !== otp) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
  }

  await prisma.user.update({
    where: { email },
    data: { verified: true, otp: null },
  });

  const token = createToken(user.id);
  return NextResponse.json({ token });
}
