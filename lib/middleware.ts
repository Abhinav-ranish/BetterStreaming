import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const verifyToken = (req: NextRequest) => {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
};

export const requireAuth = (handler: Function) => {
  return async (req: NextRequest) => {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(req, user);
  };
};
