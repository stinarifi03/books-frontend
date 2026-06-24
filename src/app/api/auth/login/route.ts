import { NextRequest, NextResponse } from 'next/server';
import { authApi } from '@/lib/api';
import { setToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const data = await authApi.login(email, password);

    // set the httpOnly cookie — only the server can do this
    await setToken(data.access_token);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 401 }
    );
  }
}