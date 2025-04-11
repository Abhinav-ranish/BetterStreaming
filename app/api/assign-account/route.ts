import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/middleware';
import { StreamingAccount } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { serviceName } = await req.json();

  // Find service and available accounts
  const service = await prisma.streamingService.findUnique({
    where: { name: serviceName },
    include: {
      accounts: true,
    },
  });

  if (!service) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  const available = service.accounts.find(
    (acc: StreamingAccount) => acc.activeUsers < acc.maxUsers
  );

  if (!available) {
    return NextResponse.json({ error: 'All accounts are full' }, { status: 429 });
  }

  // Create session & increment activeUsers
  await prisma.streamingAccount.update({
    where: { id: available.id },
    data: { activeUsers: { increment: 1 } },
  });

  await prisma.userSession.create({
    data: {
      userId: user.id,
      accountId: available.id,
    },
  });

  return NextResponse.json({
    message: 'Account assigned',
    email: available.email,
    password: available.password,
  });
}
