import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    await authApi.register(email, password);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}