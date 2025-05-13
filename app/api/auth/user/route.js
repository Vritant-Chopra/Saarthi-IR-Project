import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the request body
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.userInfo.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        username: user.username,
        mode: user.mode,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export function OPTIONS() {
  return NextResponse.json({ message: 'OPTIONS request received' }, { status: 204 });
}

