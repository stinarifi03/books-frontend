import { NextRequest, NextResponse } from 'next/server';
import { booksApi } from '@/lib/api';
import { getToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);
    const author = searchParams.get('author') || undefined;
    const data = await booksApi.getAll({ page, limit, author }, token ?? undefined);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const data = await booksApi.create(body, token);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}