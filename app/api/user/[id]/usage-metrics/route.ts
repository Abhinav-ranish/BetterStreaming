// app/api/user/[id]/usage-metrics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // Example data structure for genre time spent
  const data = {
    Horror: 10, // 10 hours spent on Horror genre
    Comedy: 5,  // 5 hours spent on Comedy genre
    Action: 7,  // 7 hours spent on Action genre
    Drama: 4,   // 4 hours spent on Drama genre
    Thriller: 3, // 3 hours spent on Thriller genre
  };

  // Simulate fetching data from the database or external API
  // const userMetrics = await prisma.metrics.findMany({
  //   where: { userId: parseInt(params.id) },
  // });

  return NextResponse.json(data);
}
