import { getToken } from '@/lib/auth';
import { booksApi, Book } from '@/lib/api';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function BooksPage() {
  const token = await getToken();

  // if not logged in, send to login
  if (!token) redirect('/login');

  let books: Book[] = [];
  let meta = { total: 0, page: 1, limit: 10, totalPages: 1 };

  try {
    const res = await booksApi.getAll({ page: 1, limit: 10 }, token);
    books = res.data;
    meta = res.meta;
  } catch {
    books = [];
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Books</h1>
          <p className="text-gray-500 text-sm mt-1">{meta.total} books total</p>
        </div>
        <Link
          href="/books/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          + New Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">📚</p>
          <p className="font-medium">No books yet</p>
          <p className="text-sm mt-1">Create your first one</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {books.map(book => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="block border border-gray-200 rounded-xl p-5 hover:border-gray-400 transition bg-white"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{book.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">by {book.author}</p>
                  {book.description && (
                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                      {book.description}
                    </p>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  book.published
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {book.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                <span>by {book.owner?.email}</span>
                <span>{new Date(book.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}