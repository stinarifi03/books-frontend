import { NextRequest, NextResponse } from 'next/server';
import { booksApi } from '@/lib/api';
import { getToken } from '@/lib/auth';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const token = await getToken();
    const { id } = await params;
    const data = await booksApi.getOne(Number(id), token ?? undefined);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const data = await booksApi.update(Number(id), body, token);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const token = await getToken();
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    await booksApi.delete(Number(id), token);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}