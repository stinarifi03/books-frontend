'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar(){
    const router = useRouter();

    async function handleLogout(){
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    }

    return (
    <nav className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/books" className="text-xl font-bold text-gray-900">
          Book List
        </Link>
        <div className="flex gap-4 items-center">
          <Link
            href="/books/new"
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            + New Book
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}