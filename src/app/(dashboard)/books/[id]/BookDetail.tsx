'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/lib/api';

interface Props {
  book: Book;
  token: string;
}

export default function BookDetail({ book, token }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    description: book.description || '',
    published: book.published,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to update');
        return;
      }

      setEditing(false);
      router.refresh();
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this book? This cannot be undone.')) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/books/${book.id}`, { method: 'DELETE' });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to delete');
        return;
      }

      router.push('/books');
      router.refresh();
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (editing) {
    return (
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Book</h1>

        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              id="published"
              checked={form.published}
              onChange={handleChange}
              className="rounded"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">
              Published
            </label>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-6 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1 transition"
      >
        ← Back
      </button>

      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            book.published
              ? 'bg-green-50 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {book.published ? 'Published' : 'Draft'}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-2">by <strong>{book.author}</strong></p>

        {book.description && (
          <p className="text-gray-500 text-sm mt-4 leading-relaxed">{book.description}</p>
        )}

        <div className="border-t border-gray-100 mt-6 pt-4 flex items-center justify-between text-xs text-gray-400">
          <span>Added by {book.owner?.email}</span>
          <span>{new Date(book.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg mt-4">{error}</p>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setEditing(true)}
          className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-6 py-2 rounded-lg text-sm font-medium border border-red-300 text-red-500 hover:bg-red-50 transition disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}