import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log('Attempting register with:', email);
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    
    await authApi.register(email, password);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Register error:', err.message);
    return NextResponse.json(
      { message: err.message },
      { status: 400 }
    );
  }
}