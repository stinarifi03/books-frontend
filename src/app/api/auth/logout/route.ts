import { NextResponse } from 'next/server';
import { deleteToken } from '@/lib/auth';

export async function POST() {
  await deleteToken();
  return NextResponse.json({ success: true });
}