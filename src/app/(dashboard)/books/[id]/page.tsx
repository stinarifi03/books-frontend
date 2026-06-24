import { getToken } from '@/lib/auth';
import { booksApi } from '@/lib/api';
import { redirect } from 'next/navigation';
import  BookDetail  from './BookDetail';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookPage({ params }: Props) {
  const token = await getToken();
  if (!token) redirect('/login');

  const { id } = await params;
  const book = await booksApi.getOne(Number(id), token);

  return <BookDetail book={book} token={token} />;
}