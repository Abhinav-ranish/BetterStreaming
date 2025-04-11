import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth';
import { sendOTP } from '@/lib/mail';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
      const { email, password } = await req.json();
  
      const userExists = await prisma.user.findUnique({ where: { email } });
  
      if (userExists) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }
  
      const hashedPassword = await hashPassword(password);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, otp },
      });
  
      await sendOTP(email, otp);
  
      return NextResponse.json({ message: 'OTP sent', userId: user.id });
    } catch (err) {
      return NextResponse.json({ error: 'Invalid request or body' }, { status: 400 });
    }
  }
  