import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const [users, titles, accounts] = await Promise.all([
    prisma.user.count(),
    prisma.title.count(),
    prisma.streamingAccount.count(),
  ]);

  return NextResponse.json({ users, titles, accounts });
}
