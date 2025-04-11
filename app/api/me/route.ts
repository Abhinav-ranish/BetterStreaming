import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET = requireAuth(async (_req: NextRequest, user: any) => {
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true },
  });

  return NextResponse.json({ user: fullUser });
});
